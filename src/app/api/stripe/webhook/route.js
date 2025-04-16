import Stripe from 'stripe';
import admin from 'firebase-admin';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Firebase Admin SDK init
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}
const db = admin.firestore();

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed!", err.message);
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerId = session.customer;
    const customerEmail = session.customer_details?.email?.toLowerCase().trim();

    console.log("📦 Stripe session received for:", customerEmail);
    console.log("🧾 Full session:", JSON.stringify(session, null, 2));

    try {
      const usersRef = db.collection('users');
      let userDoc = null;

      // ✅ First try matching by email
      const emailSnapshot = await usersRef.where('email', '==', customerEmail).get();
      if (!emailSnapshot.empty) {
        userDoc = emailSnapshot.docs[0];
      } else {
        // ❗ If no match by email, fallback to customerId (existing user)
        const idSnapshot = await usersRef.where('stripeCustomerId', '==', customerId).get();
        if (!idSnapshot.empty) {
          userDoc = idSnapshot.docs[0];
        }
      }

      if (userDoc) {
        await userDoc.ref.update({
          isSubscribed: true,
          stripeCustomerId: customerId,
          subscriptionId: session.subscription || null,
          subscriptionStatus: session.payment_status || 'unknown',
        });
        console.log("✅ User subscription updated in Firestore");
      } else {
        console.warn("❌ No matching user found by email or customerId");
      }
    } catch (err) {
      console.error("🔥 Firestore update failed:", err.message);
      return NextResponse.json({ error: 'Firestore update failed' }, { status: 500 });
    }
  }

  else if (
    event.type === 'customer.subscription.deleted' ||
    event.type === 'invoice.payment_failed'
  ) {
    const data = event.data.object;
    const customerId = data.customer;

    try {
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('stripeCustomerId', '==', customerId).get();

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        await userDoc.ref.update({
          isSubscribed: false,
          subscriptionStatus:
            event.type === 'invoice.payment_failed' ? 'payment_failed' : 'canceled',
        });

        console.log(`🔴 Subscription ${event.type} handled for customer ${customerId}`);
      } else {
        console.warn("⚠️ No user found with Stripe customer ID:", customerId);
      }
    } catch (err) {
      console.error("🔥 Error updating user after cancellation/failure:", err.message);
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
