"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { auth, storage, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import Navbar from "../../components/Navbar";
import { downloadImageWithCaption } from "../downloadImageWithCaption";
import { Timestamp } from "firebase/firestore";



export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId;

  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageData, setImageData] = useState([]);
  const [userPreferences, setUserPreferences] = useState({});
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");  // ✅ Track selected date
const [selectedLocation, setSelectedLocation] = useState("");  // ✅ Track selected location
const [regeneratingImageName, setRegeneratingImageName] = useState(null);
const [editingCaptionName, setEditingCaptionName] = useState(null);
const [editedCaption, setEditedCaption] = useState("");
const [searchDate, setSearchDate] = useState("");
const [searchLocation, setSearchLocation] = useState("");
const [showExportModal, setShowExportModal] = useState(false);
const [selectedExportType, setSelectedExportType] = useState(""); // postcards, calendar, book
const [selectedForExport, setSelectedForExport] = useState({});
const [selectedLang, setSelectedLang] = useState("");









  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        fetchProjectData(currentUser.uid, projectId);
        fetchUserImages(currentUser.uid, projectId);
      }
    });
    return () => unsubscribe();
  }, [router, projectId]);

  const fetchProjectData = async (userId, projectId) => {
  try {
    const projectRef = doc(db, `users/${userId}/projects`, projectId);
    const docSnap = await getDoc(projectRef);
    if (docSnap.exists()) {
      const projectData = docSnap.data();
      const userRef = doc(db, `users/${userId}`);
      const userSnap = await getDoc(userRef);

      let updatedPreferences = projectData.preferences || {};
      
      // If user has Simple Mode enabled, override preferences
      if (userSnap.exists() && userSnap.data().simpleMode) {
        updatedPreferences = { writingStyle: "Simple", genre: "None", wordCount: "50" };
      }

      setProject(projectData);
      setUserPreferences(updatedPreferences);
    } else {
      router.push("/dashboard");
    }
  } catch (error) {
    console.error("Error fetching project data:", error);
  }
};

  

  const fetchUserImages = async (userId, projectId) => {
    try {
      const imagesRef = collection(db, `users/${userId}/projects/${projectId}/images`);
      const querySnapshot = await getDocs(imagesRef);
      const fetchedImages = querySnapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        return {
          url: data.url,
          name: docSnapshot.id,
          caption: data.caption || "Generating caption...",
          backgroundStyle: data.backgroundStyle || "",
          date: data.date || "",
          location: data.location || "",
        };
      });
      
      setImageData(fetchedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !projectId || !user) {
      alert("Please select a file.");
      return;
    }
    const userRef = doc(db, `users/${user.uid}`);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.exists() ? userSnap.data() : {};

  // Get the current calendar month in YYYY-MM format
const currentMonth = new Date().toISOString().slice(0, 7); // e.g., "2025-04"

let uploadCountThisMonth = 0;

// Fetch all user images from all projects
const allProjectsRef = collection(db, `users/${user.uid}/projects`);
const allProjectsSnap = await getDocs(allProjectsRef);

for (const projectDoc of allProjectsSnap.docs) {
  const projectId = projectDoc.id;
  const imagesRef = collection(db, `users/${user.uid}/projects/${projectId}/images`);
  const imageSnaps = await getDocs(imagesRef);

  imageSnaps.forEach((docSnap) => {
    const imgData = docSnap.data();
    if (imgData.date && imgData.date.startsWith(currentMonth)) {
      uploadCountThisMonth++;
    }
  });
}

// 🧠 FINAL LIMIT CHECK (Free users: 5 uploads across all projects this month)
if (!userData.isSubscribed) {
  if (uploadCountThisMonth >= 5) {
    alert("You’ve reached your 5 free photo uploads this month. Please subscribe to continue.");
    router.push("/subscribe");
    return;
  }

  if (uploadCountThisMonth === 0) {
    console.warn("📦 No dated photos found this month. If you're testing, make sure 'date' is saved correctly.");
  }
}


if (userData.isSubscribed && uploadCountThisMonth >= 200) {
  alert("You’ve reached your 200 photo uploads for this month.");
  return;
}

    setUploading(true);
    const storageRef = ref(storage, `images/${user.uid}/${projectId}/${selectedFile.name}`);
  
    try {
      await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(storageRef);
      const imageRef = doc(db, `users/${user.uid}/projects/${projectId}/images`, selectedFile.name);
  
      // Fetch latest project preferences from Firestore
      const projectRef = doc(db, `users/${user.uid}/projects`, projectId);
      const projectSnap = await getDoc(projectRef);
      let latestPreferences = {};
      if (projectSnap.exists()) {
        latestPreferences = projectSnap.data().preferences || {};
      }
  
      // Store image with date & location
      await setDoc(imageRef, {
        url: downloadURL,
        caption: "Generating caption...",
        date: selectedDate,
        location: selectedLocation,
        backgroundStyle: userPreferences.backgroundStyle || "",
      }, { merge: true });
  
      setImageData((prev) => [
        { url: downloadURL, name: selectedFile.name, caption: "Generating caption...", date: selectedDate, location: selectedLocation },
        ...prev,
      ]);
  
      alert("Upload Successful!");
      setSelectedFile(null);
      setSelectedFileName("");
  
      // ✅ Trigger initial caption generation
generateCaption(
  downloadURL,
  selectedFile.name,
  selectedDate,
  selectedLocation,
  user.uid,
  projectId,
  latestPreferences,
  false // 👈 tells it this is the first time (not a regeneration)
);

    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };
  
  

  const generateCaption = async (
    imageUrl,
    imageName,
    date,
    location,
    userId,
    projectId,
    latestPreferences,
    isRegeneration = true
  ) => {
    try {
      console.log(`🚀 ${isRegeneration ? "Regenerating" : "Generating"} caption for:`, imageName);
  
      // Show proper loading label
      setRegeneratingImageName(imageName);
  
      setImageData((prev) =>
        prev.map((img) =>
          img.name === imageName
            ? { ...img, caption: isRegeneration ? "Regenerating caption..." : "Generating caption..." }
            : img
        )
      );
  
      const response = await fetch("/api/generateCaption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          writingStyle: latestPreferences.writingStyle || "Creative",
          wordCount:
            latestPreferences.wordCount && latestPreferences.wordCount >= 10
              ? latestPreferences.wordCount
              : 100,
          genre: latestPreferences.genre || "Descriptive",
          date,
          location,
          userId,
          projectId,
        }),
      });
  
      if (!response.ok) throw new Error("Failed to generate caption.");
  
      const data = await response.json();
      const newCaption = data.caption || "Caption could not be generated.";
  
      const captionRef = doc(db, `users/${user.uid}/projects/${projectId}/images`, imageName);
      await setDoc(captionRef, { url: imageUrl, caption: newCaption }, { merge: true });
  
      setImageData((prev) =>
        prev.map((img) => (img.name === imageName ? { ...img, caption: newCaption } : img))
      );
    } catch (error) {
      console.error("❌ Error generating caption:", error);
      alert("Failed to generate caption. Please try again.");
    } finally {
      setRegeneratingImageName(null);
    }
  };
  
  

  const deleteProject = async () => {
    if (!user || !projectId) return;

    try {
      const imagesRef = ref(storage, `images/${user.uid}/${projectId}`);
      const imagesList = await listAll(imagesRef);
      await Promise.all(imagesList.items.map((item) => deleteObject(item)));

      const imagesCollectionRef = collection(db, `users/${user.uid}/projects/${projectId}/images`);
      const imagesDocs = await getDocs(imagesCollectionRef);
      await Promise.all(imagesDocs.docs.map((docSnap) => deleteDoc(docSnap.ref)));

      const projectRef = doc(db, `users/${user.uid}/projects`, projectId);
      await deleteDoc(projectRef);

      alert("Project deleted successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project.");
    }
  };

  const handleDelete = async (imageName, imageUrl) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    // Ensure user is authenticated
    if (!auth.currentUser) {
        alert("❌ User is not authenticated.");
        return;
    }

    try {
        const userId = auth.currentUser.uid; 

        console.log("🔥 Deleting image:", { projectId, imageName, imageUrl, userId });

        // Ensure projectId is correctly formatted (handle arrays)
        const projectIdString = Array.isArray(projectId) ? projectId[0] : projectId;

        // **Delete Image from Firebase Storage**
        const storageRef = ref(storage, `images/${userId}/${projectIdString}/${imageName}`);
        await deleteObject(storageRef);

        // **Delete Image Reference from Firestore**
        const imageRef = doc(db, `users/${userId}/projects/${projectIdString}/images`, imageName);
        await deleteDoc(imageRef);

        // **Remove Image from UI State**
        setImageData((prev) => prev.filter((img) => img.name !== imageName));

        alert("✅ Photo deleted successfully!");

    } catch (error) {
        console.error("❌ Error deleting photo:", error);
        alert("Failed to delete photo.");
    }
};
const saveEditedCaption = async (imageName, newCaption) => {
  try {
    const imageRef = doc(db, `users/${user.uid}/projects/${projectId}/images`, imageName);
    await setDoc(imageRef, { caption: newCaption }, { merge: true });

    setImageData((prev) =>
      prev.map((img) =>
        img.name === imageName ? { ...img, caption: newCaption } : img
      )
    );

    setEditingCaptionName(null);
    alert("✅ Caption updated!");
  } catch (error) {
    console.error("❌ Error updating caption:", error);
    alert("Failed to save the caption.");
  }
};
const filteredImages = imageData.filter((img) => {
  
  const matchDate = searchDate === "" || img.date?.includes(searchDate);
  const matchLocation = searchLocation === "" || img.location?.toLowerCase().includes(searchLocation.toLowerCase());
  return matchDate && matchLocation;
});


const handleTranslate = async (selectedLang) => {
  if (!caption) return;

  try {
    const prompt = `Translate this caption to ${selectedLang}:\n"${caption}"`;

    const response = await fetch("/api/generateCaption", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (data && data.text) {
      const updatedImages = imageData.map((img) =>
        img.name === name ? { ...img, caption: data.text } : img
      );
      setImageData(updatedImages);
    }
  } catch (error) {
    console.error("❌ Translation failed:", error);
    alert("Translation failed. Please try again.");
  }
};


  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center p-6">

      <Navbar />
      <div className="flex flex-col items-center min-h-screen p-6 w-full overflow-x-auto">

        {/* Top Bar: Everything in a single horizontal row */}
<div className="w-full bg-gray-900 text-white p-4 shadow-md overflow-x-auto">
<div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-4 max-w-7xl mx-auto p-2">


    {/* Project Title */}
    <h1 className="text-xl font-bold">{project ? project.name : "Loading Project..."}</h1>

    {/* Select Photo */}
    <label htmlFor="fileInput" className="px-4 py-2 bg-green-500 rounded-md text-sm hover:bg-green-400 transition">
      Select Photo
    </label>
    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="fileInput" />

    {/* Edit Settings */}
    <button 
      onClick={() => setShowSettingsModal(true)} 
      className="px-4 py-2 bg-yellow-400 rounded-md text-sm hover:bg-yellow-600 transition"
    >
      Edit Settings
    </button>

    {/* Settings Display */}
    <div className="bg-gray-800 px-4 py-2 rounded-lg text-xs flex space-x-3">
      <p><strong>Style:</strong> {userPreferences.writingStyle || "Not Set"}</p>
      <p><strong>Word Count:</strong> {userPreferences.wordCount || "100"}</p>
      <p><strong>Genre:</strong> {userPreferences.genre || "Not Set"}</p>
    </div>

    <div className="flex items-center gap-2">
  <span className="text-sm text-white">📅 Date:</span>
  <input
    type="date"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
    className="p-2 border border-gray-400 rounded w-40 bg-white text-black dark:bg-white dark:text-black appearance-none"
  />
</div>




    {/* Location Input */}
    <input
      type="text"
      value={selectedLocation}
      onChange={(e) => setSelectedLocation(e.target.value)}
      placeholder="Enter Location"
      className="p-2 border border-gray-500 rounded w-60 bg-gray-800 text-white"
    />

    {/* Upload Photo */}
    <button 
      onClick={handleUpload} 
      className="px-4 py-2 bg-green-500 rounded-md text-sm hover:bg-green-400 transition"
    >
      Upload Photo
    </button>
    

    {/* Delete Project */}
    <button 
      onClick={deleteProject} 
      className="px-4 py-2 bg-red-500 rounded-md text-sm hover:bg-red-600 transition"
    >
      Delete Project
    </button>

  </div>
</div>

       {/* File Input & Select Button */}
       <input 
  type="file" 
  accept="image/*" 
  onChange={handleFileChange} 
  className="hidden" 
  id="fileInput" 
/>

{/* Show Selected File Name Before Uploading */}
{selectedFileName && (
  <p className="mt-2 text-sm text-gray-300">Selected File: {selectedFileName}</p>
)}

{/* Upload Button */}
<hr className="w-1/2 border-t border-white opacity-50 mt-10 mb-4 mx-auto" />

 


{/* 🔍 Search Filters */}
{imageData.length > 0 && (
  <div className="mt-6 w-full max-w-4xl p-4 bg-pink-800 rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <h2 className="text-lg font-semibold text-white">
      🔍 Search Your Memories
    </h2>

    <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
      <input
        type="date"
        value={searchDate}
        onChange={(e) => setSearchDate(e.target.value)}
        className="w-40 p-2 rounded bg-gray-800 border border-gray-600 text-white text-sm"
      />
      <input
        type="text"
        placeholder="Search by location"
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
        className="w-64 p-2 rounded bg-gray-800 border border-gray-600 text-white text-sm"
      />
      <button
        onClick={() => {
          setSearchDate("");
          setSearchLocation("");
        }}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
      >
        Clear
      </button>
    </div>
  </div>
)}









{/* Display Uploaded Images in a Diary Format */}
<div className="mt-8 flex flex-col items-center w-full max-w-4xl">
{filteredImages.map(({ url, name, caption, backgroundStyle, date, location }) => (


    <div
    key={name}
    className={`mt-6 rounded-lg shadow-lg w-full max-w-3xl ${
      backgroundStyle === "parchment"
        ? "bg-yellow-100 text-gray-900"
        : backgroundStyle === "retro"
        ? "bg-orange-100 text-gray-800"
        : backgroundStyle === "modern"
        ? "bg-gray-800 text-white"
        : backgroundStyle === "photojournal"
        ? "bg-white border border-gray-300 text-gray-900"
        : backgroundStyle === "pastel"
        ? "bg-purple-100 text-gray-800"
        : backgroundStyle === "sepia"
        ? "bg-yellow-200 text-gray-900"
        : backgroundStyle === "notebook"
        ? "bg-white text-gray-900 border border-dashed border-gray-400"
        : backgroundStyle === "midnight"
        ? "bg-gray-900 text-blue-100"
        : backgroundStyle === "cream"
        ? "bg-amber-50 text-gray-800"
        : backgroundStyle === "forest"
        ? "bg-green-900 text-green-100"
        : backgroundStyle === "corkboard"
        ? "bg-yellow-300 text-gray-900"
        : backgroundStyle === "canvas"
        ? "bg-neutral-100 text-gray-800"
        : backgroundStyle === "foggy"
        ? "bg-gray-100 text-gray-700"
        : backgroundStyle === "sunset"
        ? "bg-gradient-to-br from-orange-200 to-purple-200 text-gray-900"
        : "bg-gray-200 text-gray-900"
    }`}
    
  >

  
      {/* 💻 Desktop Layout */}
<div className="hidden md:flex flex-row items-center justify-center border-b border-gray-400">
  {/* Left Page: Image */}
  <div className="w-1/2 p-6 flex justify-center items-center border-r border-gray-400">
    <img
      src={url}
      alt="Uploaded"
      className="rounded-lg w-full h-auto object-cover"
    />
  </div>

  {/* Right Page: Caption */}
  <div
    className="w-1/2 p-6 bg-white text-gray-800 flex flex-col items-center"
    style={{ fontFamily: userPreferences.fontStyle || "'Dancing Script', cursive", fontSize: "1.2rem" }}
  >
    {editingCaptionName === name ? (
      <>
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-2 text-sm"
          rows={3}
          value={editedCaption}
          onChange={(e) => setEditedCaption(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => saveEditedCaption(name, editedCaption)}
          >
            ✅ Save
          </button>
          <button
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={() => setEditingCaptionName(null)}
          >
            ❌ Cancel
          </button>
        </div>
      </>
    ) : (
      <p className="leading-relaxed text-center">{caption}</p>
    )}
  </div>
</div>

{/* 📱 Mobile Layout */}
<div className="flex md:hidden flex-col items-center justify-center border-b border-gray-400">
  {/* Image on Top */}
  <div className="w-full p-4 flex justify-center">
    <img
      src={url}
      alt="Uploaded"
      className="rounded-lg w-full h-auto object-cover"
    />
  </div>

  {/* Caption below image */}
  <div
    className="w-full p-4 bg-white text-gray-800 flex flex-col items-center"
    style={{ fontFamily: userPreferences.fontStyle || "'Dancing Script', cursive", fontSize: "1.1rem" }}
  >
    {editingCaptionName === name ? (
      <>
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-2 text-sm"
          rows={3}
          value={editedCaption}
          onChange={(e) => setEditedCaption(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => saveEditedCaption(name, editedCaption)}
          >
            ✅ Save
          </button>
          <button
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={() => setEditingCaptionName(null)}
          >
            ❌ Cancel
          </button>
        </div>
      </>
    ) : (
      <p className="leading-relaxed text-center">{caption}</p>
    )}
  </div>
</div>


      {/* 🔘 Button Row (Below the frame) */}
      <div className="flex justify-center items-center flex-wrap gap-4 p-4">
  {/* Background Style Dropdown */}
  <div className="relative">
    <select
      value={backgroundStyle}
      onChange={(e) => {
        const newStyle = e.target.value;
        const updatedImages = imageData.map((img) =>
          img.name === name ? { ...img, backgroundStyle: newStyle } : img
        );
        setImageData(updatedImages);

        const imageRef = doc(
          db,
          `users/${user.uid}/projects/${projectId}/images`,
          name
        );
        setDoc(imageRef, { backgroundStyle: newStyle }, { merge: true });
      }}
      className="appearance-none px-4 py-2 bg-black text-white rounded hover:bg-yellow-600 transition cursor-pointer font-semibold text-sm"
    >
      <option value="">Background</option>
      <option value="parchment">Parchment</option>
      <option value="retro">Retro</option>
      <option value="modern">Modern</option>
      <option value="photojournal">Photo Journal</option>
      <option value="pastel">Pastel</option>
      <option value="sepia">Sepia</option>
      <option value="notebook">Notebook</option>
      <option value="midnight">Midnight</option>
      <option value="cream">Cream</option>
      <option value="forest">Forest</option>
      <option value="corkboard">Corkboard</option>
      <option value="canvas">Canvas</option>
      <option value="foggy">Foggy</option>
      <option value="sunset">Sunset</option>
    </select>
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-white">▾</div>
  </div>

  {/* Edit Button */}
  <button
    className="px-4 py-2 bg-black text-white rounded hover:bg-yellow-600 transition"
    onClick={() => {
      setEditingCaptionName(name);
      setEditedCaption(caption);
    }}
  >
    ✏️ Edit
  </button>

  {/* Regenerate Button */}
<button
  onClick={() =>
    generateCaption(
      url,
      name,
      date,          // 👈 from the image itself
      location,      // 👈 from the image itself
      user.uid,
      projectId,
      userPreferences
    )
  }
  className="px-4 py-2 bg-black text-white rounded hover:bg-blue-600 transition"
>
  🔄 Regenerate
</button>


  {/* Translate + Language Group */}
<div className="flex gap-2 items-center">
<button
  className="px-4 py-2 bg-black text-white rounded hover:bg-green-600 transition"
  onClick={async () => {
    if (!selectedLang || !caption) {
      alert("Please select a language first.");
      return;
    }

    try {
      const response = await fetch("/api/translateCaption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption, targetLanguage: selectedLang }),
      });

      const data = await response.json();

      if (data?.translated) {
        const updatedImages = imageData.map((img) =>
          img.name === name ? { ...img, caption: data.translated } : img
        );
        setImageData(updatedImages);

        // Optional: reset the dropdown
        setSelectedLang("");
      }
    } catch (error) {
      console.error("❌ Translation failed:", error);
      alert("Translation failed. Please try again.");
    }
  }}
>
  🌐 Translate
</button>


  <select
  value={selectedLang}
  onChange={(e) => setSelectedLang(e.target.value)}
  className="px-2 py-2 bg-white text-black rounded border"
>
  <option value="">Select Language</option>
  <option value="Spanish">Spanish</option>
  <option value="Italian">Italian</option>
  <option value="French">French</option>
  <option value="German">German</option>
</select>


</div>


  {/* Download Button */}
  <button
    onClick={() => downloadImageWithCaption(url, caption, name)}
    className="px-4 py-2 bg-black text-white rounded hover:bg-green-600 transition"
  >
    ⬇️ Download
  </button>

  {/* Delete Button */}
  <button
    className="px-4 py-2 bg-black text-white rounded hover:bg-red-600 transition"
    onClick={() => handleDelete(name, url)}
  >
    🗑️ Delete
  </button>
</div>


    </div>
  ))}
</div>





{showSettingsModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-white">
      <h2 className="text-xl font-bold mb-4">Edit Project Settings</h2>

      {/* Writing Style */}
<label className="block font-semibold text-white">Writing Style:</label>
<select
  value={userPreferences.writingStyle || ""}
  onChange={(e) =>
    setUserPreferences((prev) => ({ ...prev, writingStyle: e.target.value }))
  }
  className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
>
<option value="">Select a Writing Style</option>
<option value="NORMAL">NORMAL</option>
<option value="William Shakespeare">William Shakespeare</option>
<option value="Jane Austen">Jane Austen</option>
<option value="Leo Tolstoy">Leo Tolstoy</option>
<option value="Haruki Murakami">Haruki Murakami</option>
<option value="Stephen King">Stephen King</option>
<option value="Paul Auster">Paul Auster</option>
<option value="J.R.R. Tolkien">J.R.R. Tolkien</option>
<option value="Agatha Christie">Agatha Christie</option>
<option value="Raymond Chandler">Raymond Chandler</option>
<option value="Arthur Conan Doyle">Arthur Conan Doyle</option>
<option value="Isaac Asimov">Isaac Asimov</option>
<option value="Philip K. Dick">Philip K. Dick</option>
<option value="Ursula K. Le Guin">Ursula K. Le Guin</option>
<option value="Emily Dickinson">Emily Dickinson</option>
<option value="Gabriel García Márquez">Gabriel García Márquez</option>
<option value="Virginia Woolf">Virginia Woolf</option>
<option value="Ernest Hemingway">Ernest Hemingway</option>
<option value="Charles Bukowski">Charles Bukowski</option>
<option value="Clarice Lispector">Clarice Lispector</option>
<option value="Franz Kafka">Franz Kafka</option>
<option value="Zadie Smith">Zadie Smith</option>
<option value="Kurt Vonnegut">Kurt Vonnegut</option>
<option value="Octavia E. Butler">Octavia E. Butler</option>
<option value="James Baldwin">James Baldwin</option>
<option value="Margaret Atwood">Margaret Atwood</option>
<option value="Roberto Bolaño">Roberto Bolaño</option>
<option value="Truman Capote">Truman Capote</option>
<option value="Rainer Maria Rilke">Rainer Maria Rilke</option>
<option value="Jack Kerouac">Jack Kerouac</option>
<option value="Jhumpa Lahiri">Jhumpa Lahiri</option>

</select>


      {/* Word Count */}
      {/* Word Count Input */}
<label className="block mt-4">Max Word Count:</label>
<input
  type="number"
  value={userPreferences.wordCount || ""}
  onChange={(e) => {
    const inputValue = e.target.value;
    if (inputValue >= 10) { // Ensure minimum value is 10 words
      setUserPreferences((prev) => ({ ...prev, wordCount: inputValue }));
    }
  }}
  className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
  placeholder="Enter word count (min 10)"
/>


      {/* Genre */}
<label className="block font-semibold text-white mt-4">Genre:</label>
<select
  value={userPreferences.genre || ""}
  onChange={(e) =>
    setUserPreferences((prev) => ({ ...prev, genre: e.target.value }))
  }
  className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
>
  <option value="">Select a Genre</option>
  <option value="NONE">NONE</option>  // ✅ No specific genre
  <option value="Romance">Romance</option>
  <option value="Mystery">Mystery</option>
  <option value="Noir">Noir</option>
  <option value="Fantasy">Fantasy</option>
  <option value="Science Fiction">Science Fiction</option>
  <option value="Poetry">Poetry</option>
  <option value="Drama">Drama</option>
  <option value="Adventure">Adventure</option>
</select>

{/* Background Style Dropdown */}
<label className="block font-semibold text-white mt-4">Background Style:</label>
<select
  value={userPreferences.backgroundStyle || ""}
  onChange={(e) =>
    setUserPreferences((prev) => ({ ...prev, backgroundStyle: e.target.value }))
  }
  className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
>
<option value="">Default</option>
<option value="parchment">Parchment</option>
<option value="retro">Retro</option>
<option value="modern">Modern</option>
<option value="photojournal">Photo Journal</option>
<option value="pastel">Pastel</option>
<option value="sepia">Sepia</option>
<option value="notebook">Notebook</option>
<option value="midnight">Midnight</option>
<option value="cream">Cream</option>
<option value="forest">Forest</option>
<option value="corkboard">Corkboard</option>
<option value="canvas">Canvas</option>
<option value="foggy">Foggy</option>
<option value="sunset">Sunset</option>

</select>
{/* Font Style Dropdown */}
<label className="block font-semibold text-white mt-4">Font Style:</label>
<select
  value={userPreferences.fontStyle || ""}
  onChange={(e) =>
    setUserPreferences((prev) => ({ ...prev, fontStyle: e.target.value }))
  }
  className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
>
<option value="">Default (Dancing Script)</option>
<option value="serif">Serif</option>
<option value="sans-serif">Sans-serif</option>
<option value="cursive">Cursive</option>
<option value="monospace">Monospace</option>
<option value="dancing">Dancing Script</option>
<option value="typewriter">Typewriter</option>
<option value="fancy">Fancy Script</option>
<option value="playfair">Playfair Display</option>
<option value="merriweather">Merriweather</option>
<option value="raleway">Raleway</option>
<option value="lobster">Lobster</option>
<option value="abril">Abril Fatface</option>
<option value="poppins">Poppins</option>
<option value="roboto">Roboto</option>
<option value="inconsolata">Inconsolata</option>
<option value="zeyada">Zeyada</option>
<option value="archivo">Archivo</option>
<option value="noto-serif">Noto Serif</option>
<option value="noto-sans">Noto Sans</option>
<option value="source-serif">Source Serif Pro</option>
<option value="rubik">Rubik</option>
<option value="space-mono">Space Mono</option>
<option value="amatic">Amatic SC</option>
<option value="fjalla">Fjalla One</option>
<option value="crimson">Crimson Text</option>

</select>





      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setShowSettingsModal(false)}
          className="px-4 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition"
        >
          Close
        </button>

        <button
  onClick={async () => {
    if (!user) return;
    const userRef = doc(db, `users/${user.uid}/projects`, projectId);
    await setDoc(userRef, {
      preferences: {
        ...userPreferences,
        fontStyle: userPreferences.fontStyle || "" // ✅ Add this line
      }
    }, { merge: true });
    alert("Preferences saved!");
    setShowSettingsModal(false);
  }}
  className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition"
>
  Save
</button>



      </div>
    </div>
  </div>
)}



        <button onClick={deleteProject} className="mt-6 px-6 py-3 bg-red-500 rounded-lg text-white hover:bg-red-600 transition">
          Delete Project
        </button>
      </div>
    </div>
  );
}

