"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, collection, getDocs, getDoc } from "firebase/firestore";
import Link from "next/link";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard"; // ✅ Import the new component


export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("diary"); // Default type
  const [wordCount, setWordCount] = useState("100");
  const [writingStyle, setWritingStyle] = useState("");
  const [genre, setGenre] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [userPreferences, setUserPreferences] = useState({});
  const fetchUserPreferences = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setUserPreferences(docSnap.data());
      }
    } catch (error) {
      console.error("Error fetching user preferences:", error);
    }
  };
  

  const writingStyles = [
    [
      "William Shakespeare", "Jane Austen", "Leo Tolstoy", "Haruki Murakami", "Stephen King",
      "Paul Auster", "J.R.R. Tolkien", "Agatha Christie", "Raymond Chandler", "Arthur Conan Doyle",
      "Isaac Asimov", "Philip K. Dick", "Ursula K. Le Guin", "Emily Dickinson", "Gabriel García Márquez",
      "Virginia Woolf", "Ernest Hemingway", "Charles Bukowski", "Clarice Lispector", "Franz Kafka",
      "Zadie Smith", "Kurt Vonnegut", "Octavia E. Butler", "James Baldwin", "Margaret Atwood",
      "Roberto Bolaño", "Truman Capote", "Rainer Maria Rilke", "Jack Kerouac", "Jhumpa Lahiri"
    ]
    
  ];
  const genres = ["Romance", "Mystery", "Noir", "Fantasy", "Science Fiction", "Poetry", "Drama", "Adventure"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        fetchUserProjects(currentUser.uid); // ✅ Now correctly passing userId
        fetchUserPreferences(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, [router]);
  

  const fetchUserProjects = async (userId) => {
    try {
      const projectsRef = collection(db, `users/${userId}/projects`);
      const querySnapshot = await getDocs(projectsRef);
  
      const fetchedProjects = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const projectData = docSnap.data();
          const imagesRef = collection(db, `users/${userId}/projects/${docSnap.id}/images`);
          const imagesSnapshot = await getDocs(imagesRef);
          
          // ✅ Get the first image URL if available
          const firstImage = imagesSnapshot.docs.length > 0 
            ? imagesSnapshot.docs[0].data().url 
            : null;
  
          return {
            id: docSnap.id,
            ...projectData,
            firstImage, // ✅ Add first image to the project object
          };
        })
      );
  
      setProjects(fetchedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  

  const createNewProject = async () => {
    if (!projectName.trim()) {
      alert("Please enter a project name.");
      return;
    }
  
    // ✅ Clean project ID from the name
    const safeProjectId = projectName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 50);
  
    try {
      // ✅ Save under nested path: /users/{userId}/projects/{projectId}
      const projectRef = doc(db, `users/${user.uid}/projects`, safeProjectId);
      await setDoc(projectRef, {
        name: projectName,
        type: projectType,
        createdAt: new Date(),
        preferences: {
          writingStyle: writingStyle || "Not Set",
          wordCount: wordCount || "100",
          genre: genre || "Not Set",
        },
      });
  
      const newProject = {
        id: safeProjectId,
        name: projectName,
        type: projectType,
        preferences: {
          writingStyle: writingStyle || "Not Set",
          wordCount: wordCount || "100",
          genre: genre || "Not Set",
        },
      };
  
      setProjects((prev) => [...prev, newProject]);
      setSelectedProject(newProject.id);
      setShowProjectModal(false);
      setProjectName("");
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Something went wrong while creating the project.");
    }
  };
  
  
  

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center p-6">

      <Navbar />
      <h1 className="text-5xl font-extrabold text-center mt-10 mb-6 text-blue-300">Timeless Journal</h1>
      <p className="text-lg text-gray-400 text-center max-w-2xl mb-8">
        Capture your thoughts, emotions, and experiences in a beautifully designed AI-assisted journal.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
  {projects.map((project) => (
    <ProjectCard
      key={project.id}
      name={project.name}
      type={project.type}
      wordCount={project.preferences.wordCount}
      firstImage={project.firstImage} // ✅ This should now display the first image!
      onClick={() => router.push(`/project/${project.id}`)}
    />
  ))}
        <button 
          onClick={() => setShowProjectModal(true)}
          className="p-6 rounded-lg shadow-md bg-blue-500 text-white text-center font-semibold hover:bg-blue-600 transition"
        >
          + New Project
        </button>
      </div>

      {showProjectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project Name"
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
            />
            <div className="flex justify-between">
              <button onClick={createNewProject} className="px-4 py-2 bg-green-500 hover:bg-green-600 transition rounded-lg shadow-md">
                Create
              </button>
              <button onClick={() => setShowProjectModal(false)} className="px-4 py-2 bg-gray-500 hover:bg-gray-600 transition rounded-lg shadow-md">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
