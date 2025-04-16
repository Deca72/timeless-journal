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
  try {
    const body = await req.json();
    const { uid } = body;
    console.log("📥 Received UID from client:", uid);

    const userDoc = await db.collection('users').doc(uid).get();
    console.log("📄 Firestore document exists?", userDoc.exists);

    if (!userDoc.exists) {
      console.warn("⚠️ No user found for UID:", uid);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = userDoc.data();
    const stripeCustomerId = data?.stripeCustomerId;
    console.log("💳 Stripe Customer ID:", stripeCustomerId);

    if (!stripeCustomerId) {
      console.warn("⚠️ User document found but missing 'stripeCustomerId'");
      return NextResponse.json({ error: 'No Stripe customer ID found' }, { status: 400 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: 'http://localhost:3000/profile',
    });

    console.log("✅ Billing portal session created:", session.url);
    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error("❌ Error creating portal session:", error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

