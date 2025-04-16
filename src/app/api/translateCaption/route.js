import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { caption, targetLanguage } = await req.json();

    if (!caption || !targetLanguage) {
      return new Response(JSON.stringify({ error: "Missing caption or language" }), { status: 400 });
    }

    const prompt = `Translate the following caption to ${targetLanguage}:\n"${caption}"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const translated = completion.choices[0].message.content;

    return new Response(JSON.stringify({ translated }), { status: 200 });
  } catch (err) {
    console.error("❌ Translation error:", err);
    return new Response(JSON.stringify({ error: "Translation failed." }), { status: 500 });
  }
}
