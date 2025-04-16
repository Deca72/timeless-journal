"use client";

export default function ProjectCard({ name, type, wordCount, firstImage, onClick }) {
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
      
      <h2 className="text-xl font-bold text-blue-300">{name}</h2>
      <p className="text-sm text-gray-400">{type} | {wordCount} words</p>
    </div>
  );
}
