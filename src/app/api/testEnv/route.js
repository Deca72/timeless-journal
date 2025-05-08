export async function GET() {
    return new Response(
      JSON.stringify({
        replicateKey: process.env.REPLICATE_API_KEY,
        huggingfaceKey: process.env.HUGGINGFACE_API_KEY,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  