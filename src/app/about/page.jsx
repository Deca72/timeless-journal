import LegalHeader from "../components/LegalHeader";

export default function AboutPage() {
  return (
    <>
      <LegalHeader /> {/* ✅ This makes the top nav show up */}
      
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <div className="max-w-2xl bg-gray-800 p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">👋 About Me</h1>
          
          <p className="mb-4 text-lg leading-relaxed">
            Hi, my name is <strong>Deca</strong>. I'm 53 years old, and I've always been endlessly curious.
          </p>
          
          <p className="mb-4 text-lg leading-relaxed">
            A few months ago, I started learning how to code — not in a class, not at school, but with the help of ChatGPT. I've always loved exploring new ideas and imagining ways to create something helpful for others. I tried many things, but nothing really clicked... until I asked myself:
          </p>

          <p className="mb-4 italic text-lg leading-relaxed">
            “What would be useful for <em>me</em>?”
          </p>

          <p className="mb-4 text-lg leading-relaxed">
            People have often told me that I should write a book about my life. I’ve been lucky to live an incredible journey. But the truth is… I’ve never been great with writing. Hiring a ghostwriter? Too expensive. So I thought — what if I could use photos from my past to tell my story?
          </p>

          <p className="mb-4 text-lg leading-relaxed">
            That’s how the idea for <strong>Timeless Journal</strong> was born.
          </p>

          <p className="mb-4 text-lg leading-relaxed">
            But I had no idea how to build an app. I had never written a single line of code. Still, my curiosity pushed me forward. I asked ChatGPT for help... and step by step, I started learning.
          </p>

          <p className="mb-4 text-lg leading-relaxed">
            After months of studying, experimenting, and building, I created this simple app — not just for myself, but for anyone who has thoughts they want to capture but struggles to find the words.
          </p>

          <p className="mb-4 text-lg leading-relaxed">
            I hope <strong>Timeless Journal</strong> helps you bring your memories to life, one photo at a time.
          </p>

          <p className="text-center mt-8 text-sm text-gray-400">
            With heart, <br /> <strong>Deca</strong>
          </p>
        </div>
      </div>
    </>
  );
}
