"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "src/app/lib/firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import Navbar from "src/app/components/Navbar";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadCountThisMonth, setUploadCountThisMonth] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        await loadProfileData(currentUser.uid);
        await fetchUploadCount(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const loadProfileData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfileData(data);
        if (data.profileImageUrl) {
          setProfileImage(data.profileImageUrl);
        }
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  };

  const fetchUploadCount = async (uid) => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7); // e.g., "2025-04"
      let count = 0;

      const projectsRef = collection(db, `users/${uid}/projects`);
      const projectsSnap = await getDocs(projectsRef);

      for (const projectDoc of projectsSnap.docs) {
        const projectId = projectDoc.id;
        const imagesRef = collection(db, `users/${uid}/projects/${projectId}/images`);
        const imagesSnap = await getDocs(imagesRef);

        imagesSnap.forEach((imgDoc) => {
          const data = imgDoc.data();
          if (data.date && data.date.startsWith(currentMonth)) {
            count++;
          }
        });
      }

      setUploadCountThisMonth(count);
    } catch (error) {
      console.error("Failed to count uploads:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/landing");
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { profileImageUrl: url }, { merge: true });

      setProfileImage(url);
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setUploading(false);
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      alert("Password reset email sent.");
    } catch (error) {
      console.error("Error sending reset email:", error.message);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user?.uid }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to open billing portal.");
        console.error(data.error);
      }
    } catch (err) {
      console.error("Error opening billing portal:", err.message);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold mb-6">👤 My Profile</h1>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
          {/* 📛 Email & UID */}
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>User ID:</strong> {user?.uid}</p>

          {/* 📝 Account Creation */}
          <p><strong>Created On:</strong> {user?.metadata?.creationTime}</p>

          {/* 📸 Profile Picture */}
          <div className="space-y-2">
            <p><strong>Profile Picture:</strong></p>
            {profileImage && (
              <img
                src={profileImage}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full border"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageUpload}
              className="text-sm"
            />
            {uploading && <p className="text-blue-400">Uploading...</p>}
          </div>

          {/* 💳 Subscription Details */}
          <p><strong>Subscription Plan:</strong> {profileData?.isSubscribed ? "Pro (Subscribed)" : "Free (first 5 photos only)"}</p>
          {profileData?.isSubscribed && (
            <>
              <p><strong>Subscription Status:</strong> {profileData?.subscriptionStatus || "Unknown"}</p>
              <p><strong>Subscription ID:</strong> {profileData?.subscriptionId || "N/A"}</p>
              <button
                onClick={handleManageSubscription}
                className="text-blue-400 underline text-sm hover:text-blue-300"
              >
                Cancel or Manage Subscription
              </button>
            </>
          )}

          {/* 📊 Upload Count */}
          <p>
            <strong>Monthly Uploads:</strong>{" "}
            {profileData?.isSubscribed
              ? `📸 ${uploadCountThisMonth}/200 used this month`
              : `📸 ${uploadCountThisMonth}/5 used this month`}
          </p>
        </div>

        {/* 🔘 Buttons */}
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            onClick={handlePasswordReset}
            className="px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-600 transition"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}
