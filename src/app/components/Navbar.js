"use client";

import Link from "next/link";
import { auth, db } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.profileImageUrl) {
            setProfileImageUrl(data.profileImageUrl);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/landing");
  };

  return (
    <nav className="bg-gray-800 shadow-lg py-4 px-6 flex justify-between items-center text-white">
  <Link href="/landing" className="text-xl font-bold text-blue-400 hover:underline">
    Timeless Journal
  </Link>

  {user && (
    <div className="flex items-center gap-6">
      <Link
        href="/dashboard"
        className="ml-4 px-4 py-2 bg-gray-700 hover:bg-gray-500 text-white rounded-lg text-sm font-semibold transition duration-300 shadow-md"
      >
        Dashboard
      </Link>

      <Link href="/profile">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-white cursor-pointer"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer">
            👤
          </div>
        )}
      </Link>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition duration-300 shadow-md"
      >
        Logout
      </button>
    </div>
  )}
</nav>

  );
}

export function ProjectCard({ name, type, wordCount, firstImage, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer transition transform hover:scale-105 hover:bg-gray-700 text-white w-72 text-center"
    >
      {/* Show image preview if available */}
      {firstImage && (
        <img 
          src={firstImage} 
          alt="Project Preview" 
          className="w-full h-40 object-cover rounded-md mb-4"
        />
      )}
      
      <h2 className="text-lg font-bold text-blue-300">{name}</h2>
      <p className="text-sm text-gray-400">{type} | {wordCount} words</p>
    </div>
  );
}


export function Dashboard() {
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProjects = async (userId) => {
      try {
        const projectsRef = collection(db, `users/${userId}/projects`);
        const querySnapshot = await getDocs(projectsRef);
    
        const fetchedProjects = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
          const projectData = docSnap.data();
          const imagesRef = collection(db, `users/${userId}/projects/${docSnap.id}/images`);
          const imagesSnapshot = await getDocs(imagesRef);
          
          // Get the first image if available
          const firstImage = imagesSnapshot.docs.length > 0 
            ? imagesSnapshot.docs[0].data().url 
            : null;
    
          return {
            id: docSnap.id,
            ...projectData,
            firstImage, // Add first image URL
          };
        }));
    
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    

    fetchUserProjects();
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-8">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          name={project.name}
          type={project.type}
          wordCount={project.wordCount}
          imageUrl={project.imageUrl}
          onClick={() => router.push(`/project/${project.id}`)}
        />
      ))}
    </div>
  );
}