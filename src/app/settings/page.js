"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "src/app/lib/firebase"; // Adjusted import path
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Navbar from "src/app/components/Navbar"; // Adjusted import path

export default function Settings() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState({
    writingStyle: "",
    wordCount: "100",
    genre: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        loadUserPreferences(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const loadUserPreferences = async (userId) => {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setPreferences({
        writingStyle: data.preferences?.writingStyle || "",  // ✅ Load exactly what they chose
        wordCount: data.preferences?.wordCount || "100",
        genre: data.preferences?.genre || ""  // ✅ Load exactly what they chose
      });
    }
  };
  

  const handleSavePreferences = async () => {
    if (!user) return;
  
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { 
      preferences: { 
        wordCount: preferences.wordCount || "100",
        writingStyle: preferences.writingStyle,  // ✅ Save exactly what the user selects
        genre: preferences.genre,  // ✅ Save exactly what the user selects
        backgroundStyle: preferences.backgroundStyle || "",
        fontStyle: preferences.fontStyle || ""
      } 
    }, { merge: true });
  
    alert("Preferences saved!");
  };
  

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/landing");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="bg-gray-800 shadow-lg rounded-2xl p-8 max-w-lg w-full text-center">
          <h2 className="text-3xl font-bold mb-4">User Preferences</h2>

          {/* Writing Style Dropdown */}
          <label className="block text-left">Writing Style:</label>
          <select
            value={preferences.writingStyle}
            onChange={(e) => setPreferences({ ...preferences, writingStyle: e.target.value })}
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

          {/* Word Count Input (Allow any number) */}
          <label className="block text-left mt-4">Max Word Count:</label>
          <input
            type="number"
            min="1"
            step="1"
            value={preferences.wordCount}
            onChange={(e) => setPreferences({ ...preferences, wordCount: e.target.value })}
            className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
          />

          {/* Genre Dropdown */}
          <label className="block text-left mt-4">Genre:</label>
          <select
            value={preferences.genre}
            onChange={(e) => setPreferences({ ...preferences, genre: e.target.value })}
            className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
          >
            <option value="">Select a Genre</option>
            <option value="NONE">NONE</option> {/* ✅ New Option */}
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
<label className="block text-left mt-4">Background Style:</label>
<select
  value={preferences.backgroundStyle || ""}
  onChange={(e) => setPreferences({ ...preferences, backgroundStyle: e.target.value })}
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
<label className="block text-left mt-4">Font Style:</label>
<select
  value={preferences.fontStyle || ""}
  onChange={(e) => setPreferences({ ...preferences, fontStyle: e.target.value })}
  className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
>
  <option value="">Default (Dancing Script)</option>
  <option value="serif">Serif (Georgia, Times)</option>
  <option value="sans-serif">Sans-Serif (Arial, Helvetica)</option>
  <option value="typewriter">Typewriter (Courier New)</option>
  <option value="fancy">Fancy (Great Vibes)</option>
</select>



          {/* Save Button */}
          <button
            onClick={handleSavePreferences}
            className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-lg font-semibold"
          >
            Save Preferences
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-4 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white text-lg font-semibold"
          >
            Logout
          </button>

          <Link href="/dashboard" className="block mt-4 text-blue-400 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
