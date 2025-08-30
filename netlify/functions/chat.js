// Netlify serverless function: receives a user message and replies using a Hugging Face model.
// Uses global fetch (Node 18+ on Netlify). No extra dependencies needed.

const DEFAULT_MODEL = "HuggingFaceH4/zephyr-7b-beta"; // change via HF_MODEL env var if you like

// Minimal crisis detection: if triggered, we return a grounding/safety message instead of AI output.
function isCrisis(text = "") {
  const t = text.toLowerCase();
  const keywords = [
    "suicide", "kill myself", "end my life", "hurt myself",
    "self harm", "self-harm", "overdose", "i want to die",
    "take my life", "cut myself", "no reason to live"
  ];
  return keywords.some(k => t.includes(k));
}

const CRISIS_REPLY =
  "I’m really sorry you’re feeling this. You deserve immediate support.\n\n" +
  "• If you’re in danger or at risk of harming yourself or someone else, please contact your local emergency number right now.\n" +
  "• If you can, consider reaching out to a trusted person near you.\n" +
  "• You might also contact a crisis hotline in your country for immediate help.\n\n" +
  "I’m here to listen, but I’m not a medical service.";

export async function handler(event) {
  try {
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      };
    }

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Method not allowed" })
      };
    }

    const { message = "" } = JSON.parse(event.body || "{}");
    const trimmed = String(message).slice(0, 2000); // simple guard

    // Crisis handling
    if (isCrisis(trimmed)) {
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ reply: CRISIS_REPLY })
      };
    }

    const HF_API_KEY = process.env.HF_API_KEY;
    if (!HF_API_KEY) {
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ reply: "Server is missing HF_API_KEY." })
      };
    }

    const model = process.env.HF_MODEL || DEFAULT_MODEL;

    // System prompt for supportive, non-clinical guidance
    const system =
      "You are Silococene Blessing, a gentle, non-judgmental chatbot. " +
      "Your purpose is to help people talk through anxiety about technology and the future. " +
      "You are not a doctor and do not provide diagnoses. " +
      "Use warm, plain language. Validate feelings, ask small open questions, and suggest practical, low-effort steps. " +
      "Avoid medical claims. Keep responses under ~180 words.";

    // Compose the prompt
    const user = trimmed;

    const response = await fetch(`https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `<s>[SYSTEM]: ${system}\n[USER]: ${user}\n[ASSISTANT]:`,
        parameters: {
          max_new_tokens: 220,
          temperature: 0.7,
          top_p: 0.9,
          return_full_text: false
        }
      })
    });

    // Handle non-200s gracefully
    if (!response.ok) {
      const txt = await response.text();
      return {
        statusCode: 502,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ reply: "I’m having trouble reaching the model right now. Please try again.", detail: txt })
      };
    }

    const data = await response.json();

    // HF Inference can return arrays with generated_text or a string depending on model
    let reply = "I’m here. Could you say a little more about how this is affecting your day-to-day?";
    if (Array.isArray(data)) {
      // Common JSON shape: [{ generated_text: "..." }]
      const text = data[0]?.generated_text || data[0]?.summary_text || "";
      if (text) reply = String(text).trim();
    } else if (typeof data === "object" && data.generated_text) {
      reply = String(data.generated_text).trim();
    }

    // Final safety polish
    reply = reply.replace(/^(assistant|bot):\s*/i, "").trim();

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ reply })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ reply: "Something went wrong on the server. Please try again later." })
    };
  }
}
