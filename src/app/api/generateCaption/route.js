import { OpenAI } from "openai";
import fetch from "node-fetch";
import { adminDb } from "../../lib/firebase-admin";
import { collection, getDocs } from "firebase/firestore";
import Replicate from "replicate";

export const runtime = "nodejs";
export const maxDuration = 25; // Allow up to 25 seconds

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in .env.local
});

// ✅ Function to get detected objects from the image
async function getImageObjects(imageUrl) {
  const HF_API_URL = "https://api-inference.huggingface.co/models/facebook/detr-resnet-50";
  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: imageUrl }),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("❌ Hugging Face returned non-JSON:", text);
      return [];
    }

    const data = await response.json();

    if (!data || !Array.isArray(data)) {
      console.error("❌ Invalid Object Detection Response:", data);
      return [];
    }

    const objects = data.map((obj) => obj.label).slice(0, 5);
    console.log("📝 Detected Objects:", objects);
    return objects;
  } catch (error) {
    console.error("❌ Error fetching detected objects:", error);
    return [];
  }
}



async function getImageDescription(imageUrl) {
  console.log("🔐 Replicate key loaded:", process.env.REPLICATE_API_KEY ? "✅ present" : "❌ missing");
  console.log("DEBUG: Raw REPLICATE key:", process.env.REPLICATE_API_KEY);

  const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY });

  try {
    const output = await replicate.run(
      "salesforce/blip:2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
      {
        input: {
          task: "image_captioning",
          image: imageUrl,
        },
      }
    );
    
    
    console.log(output);("✅ Image Description:", output);
    return output;
  } catch (err) {
    console.error("❌ Error using Replicate API:", err);
    return "No description available.";
  }
}





// ✅ Fetch historical events from Wikipedia API
async function fetchHistoricalEvents(date) {
  try {
    console.log("📅 Fetching historical events for:", date);

    const [year, month, day] = date.split("-");
    const WIKI_API_URL = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;

    console.log("🔗 Fetching from:", WIKI_API_URL);
    const response = await fetch(WIKI_API_URL);

    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

    const data = await response.json();
    if (!data.events || data.events.length === 0) {
      console.log("❌ No major historical events found.");
      return ["No major historical events recorded for this date."];
    }

    const events = data.events.slice(0, 3).map((event) => `${event.year}: ${event.text}`);
    console.log("✅ Wikipedia Historical Events:", events);
    return events;
  } catch (error) {
    console.error("❌ Error fetching Wikipedia events:", error);
    return ["Error retrieving historical events."];
  }
}

// ✅ Fetch past captions to maintain diary continuity
async function getPastCaptions(userId, projectId) {
  try {
    const captionsRef = adminDb.collection("users")
      .doc(userId)
      .collection("projects")
      .doc(projectId)
      .collection("images");

    const snapshot = await captionsRef.get();
    return snapshot.docs.map(doc => doc.data().caption).join("\n\n");
  } catch (error) {
    console.error("❌ Error fetching past captions:", error);
    return "";
  }
}


// ✅ Helper: Trim or validate word count and finish cleanly
function enforceWordCount(text, min, max) {
  const words = text.trim().split(/\s+/);
  if (words.length < min) return { valid: false, reason: "too short" };

  if (words.length > max) {
    const sentences = text.match(/[^.!?]+[.!?]/g);
    let finalCaption = "";
    let totalWords = 0;

    for (let sentence of sentences || []) {
      const sentenceWords = sentence.trim().split(/\s+/).length;
      if (totalWords + sentenceWords <= max) {
        finalCaption += sentence.trim() + " ";
        totalWords += sentenceWords;
      } else {
        break;
      }
    }

    return {
      valid: true,
      caption: finalCaption.trim(),
    };
  }

  return { valid: true, caption: text.trim() };
}

// ✅ Generate AI-Powered Captions with Object Validation
export async function POST(req) {
  console.log("🔥 Loaded HF Key:", process.env.HUGGINGFACE_API_KEY ? "✅ present" : "❌ missing");
  try {
    const { imageUrl, writingStyle, wordCount, genre, date, location, userId, projectId } = await req.json();
    console.log("📩 Incoming Request:", { imageUrl, writingStyle, wordCount, genre, date, location, userId, projectId });

    if (!imageUrl || !date || !location || !userId || !projectId) {
      console.error("❌ Missing required fields:", { imageUrl, date, location, userId, projectId });
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const detectedObjects = await getImageObjects(imageUrl);
    const imageDescription = await getImageDescription(imageUrl);
    const pastCaptions = await getPastCaptions(userId, projectId);
    const historicalEvents = await fetchHistoricalEvents(date);

    const styleAndGenreGuide = `
    ✍️ Writing Style & Genre Guide

    Writing Styles:
    - William Shakespeare → poetic, archaic, metaphoric
    - Jane Austen → witty, elegant, socially observant
    - Leo Tolstoy → descriptive, philosophical, long-form
    - Haruki Murakami → surreal, introspective, minimal
    - Stephen King → vivid, suspenseful, emotionally raw
    - Paul Auster → cerebral, metafictional, existential
    - J.R.R. Tolkien → epic, mythic, world-building
    - Agatha Christie → observational, clue-based, mysterious
    - Raymond Chandler → noir, sharp-tongued, atmospheric
    - Arthur Conan Doyle → investigative, deductive, clear
    - Isaac Asimov → analytical, sci-fi rational
    - Philip K. Dick → psychological, sci-fi existential
    - Ursula K. Le Guin → mythic, sociological, lyrical
    - Emily Dickinson → poetic, internal, nature-focused
    - Gabriel García Márquez → magical realism, lush, poetic
    - Virginia Woolf → stream of consciousness, deep interiority
    - Ernest Hemingway → minimalist, blunt, emotional underneath
    - Charles Bukowski → gritty, raw, informal
    - Clarice Lispector → introspective, abstract, poetic
    - Franz Kafka → surreal, anxious, bureaucratic
    - Zadie Smith → modern, witty, cultural commentary
    - Kurt Vonnegut → satirical, absurd, punchy
    - Octavia E. Butler → character-driven, speculative, grounded
    - James Baldwin → emotional, socially critical, passionate
    - Margaret Atwood → dystopian, poetic, sharp
    - Roberto Bolaño → nonlinear, dark, literary
    - Truman Capote → observational, literary nonfiction, emotive
    - Rainer Maria Rilke → lyrical, poetic, metaphysical
    - Jack Kerouac → spontaneous, jazz-like rhythm, spiritual
    - Jhumpa Lahiri → sparse, emotional, immigrant identity

    Genres:
    - Romance → emotional connection, longing or affection
    - Mystery → curiosity, unanswered questions, subtle tension
    - Noir → dark atmosphere, cynical narrator, shadows of crime
    - Fantasy → magical tone, imaginative landscape, wonder
    - Science Fiction → speculative, futuristic or technological framing
    - Poetry → line breaks, metaphorical language, rhythm
    - Drama → personal or social tension, internal conflict
    - Adventure → dynamic, external movement, action-oriented
    `;

    const prompt = `
You are an AI that writes journal-style captions based ONLY on what's visible in the photo.

DO NOT GUESS or ADD emotional content unless it’s directly tied to visible detail.

🧠 Target Word Count: Around ${wordCount} words.
Please keep the caption between ${wordCount - 5} and ${wordCount + 5} words as set by the user.
${styleAndGenreGuide}

🎨 The user selected:
- Writing Style: ${writingStyle}
- Genre: ${genre}
Match this tone and voice in your writing. Do not just mention it — emulate it.

---

🖼️ Visual Summary:
Detected objects: ${detectedObjects.join(", ")}
Image description: "${imageDescription}"

📍 Location: ${location}  
🗓️ Date: ${date}  

📚 Historical Reference (optional):
${historicalEvents.join("\n")}

📖 Past Entries (context only, not required):
${pastCaptions.slice(-500)}

---

✍️ Caption Instructions (STRICT):

- Focus ONLY on what is clearly visible in the image (especially listed objects).
- You are NOT allowed to add emotional reflections, poetry, or interpretation unless you FIRST describe the visible elements.
- Your job is to help the user remember what they saw in the photo.
- You MUST mention at least 2 of the following detected objects: ${detectedObjects.join(", ")}.
- If you can't confidently describe what's in the image, respond with: "No caption could be generated based on the photo."

🎯 Output: Just the journal-style caption. No explanation or fluff.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: Math.min(wordCount * 5, 200),
    });

    let caption = response.choices?.[0]?.message?.content?.trim() || "No caption generated.";
    let { valid, caption: adjustedCaption, reason } = enforceWordCount(caption, wordCount - 5, wordCount + 5);

    if (!valid) {
      console.warn(`⚠️ Caption length issue (${reason}). Retrying...`);

      const retryPrompt = `${prompt}

‼️ The last attempt was ${reason}. Please regenerate a new caption between ${wordCount - 5} and ${wordCount + 5} words.`;

      const retryResponse = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: retryPrompt }],
        max_tokens: Math.min(wordCount * 5, 200),
      });

      let retryCaption = retryResponse.choices?.[0]?.message?.content?.trim() || caption;
      const retryCheck = enforceWordCount(retryCaption, wordCount - 5, wordCount + 5);
      caption = retryCheck.caption;
    } else {
      caption = adjustedCaption;
    }

    console.log(`✅ Final Caption (${caption.split(/\s+/).length} words):`, caption);
    return new Response(JSON.stringify({ caption }), { status: 200 });

  } catch (error) {
    console.error("❌ API Error:", error.message);
    return new Response(JSON.stringify({ error: "Failed to generate caption" }), { status: 500 });
  }
}
