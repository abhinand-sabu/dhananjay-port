// Netlify Serverless Function: Dhananjay 3 AM AI Chatbot (Gemini 3.5 Flash-Lite Powered)

// In-Memory IP Rate Limiter (Protects Gemini API Quotas from bots & rapid spamming)
const ipRateMap = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute rolling window
const MAX_REQUESTS_PER_MINUTE = 8; // Max 8 requests per minute per IP

function checkIpRateLimit(ip) {
  const now = Date.now();
  const entry = ipRateMap.get(ip);
  if (!entry || now - entry.startTime > WINDOW_MS) {
    ipRateMap.set(ip, { count: 1, startTime: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_MINUTE;
}

exports.handler = async function (event, context) {
  // CORS Preflight handling
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-goog-api-key",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
      },
      body: ""
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({ 
        error: "GEMINI_API_KEY is not configured in Netlify environment variables.",
        fallback: true 
      })
    };
  }

  // Diagnostic GET endpoint: list models or test
  if (event.httpMethod === "GET") {
    try {
      const listRes = await fetch("https://generativelanguage.googleapis.com/v1beta/models", {
        headers: { "x-goog-api-key": apiKey }
      });
      const listData = await listRes.json();
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ok", count: listData.models?.length || 0 })
      };
    } catch (e) {
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: JSON.stringify({ error: e.message })
      };
    }
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Method not allowed. Please use POST." })
    };
  }

  // Server-side anti-spam check
  const clientIp = event.headers["x-nf-client-connection-ip"] || 
                   event.headers["client-ip"] || 
                   event.headers["x-forwarded-for"] || 
                   "unknown-ip";

  if (checkIpRateLimit(clientIp)) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        reply: "Ayyo machane, you're texting faster than the Chathannoor KSRTC superfast! 🚌💨 Give my boiling Samsung a 30-second breather before my battery explodes! 🔥"
      })
    };
  }

  try {
    const { message, history } = JSON.parse(event.body || "{}");
    if (!message || typeof message !== "string") {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "A message string is required." })
      };
    }

    // Dhananjay Persona System Instructions
    const systemPrompt = `You are Dhananjay, an 18-year-old Computer Science & Engineering (CSE '28) day scholar student living in Chathannoor, Kollam, Kerala.
Personality traits & Lore:
- You are openly gay, deeply sensitive, sweet, warm-hearted, and emotionally expressive.
- You survive the brutal daily KSRTC superfast/passenger bus commute from Chathannoor to college.
- You obsessively send 47-60 unhinged Instagram reels every single day at 2-3 AM.
- Your budget Samsung Android phone boils and overheats like an induction stove during late-night video calls.
- You cry easily watching emotional anime (like Your Lie in April) and golden retriever puppy videos.
- You stress over complex coding lab assignments, semester exams, and internal mark deductions (all dramatic campus references on this site are a funny movie-style parody created by your best friend Abhi).
- You love hot chai, pazhampori, dad jokes, and genuine guys who don't ghost or play mind games.
- Your homie and site architect is Abhi (he single-handedly built this website to get you a boyfriend).

Style & Instructions:
- Reply in 1 to 3 short, punchy sentences. Never write long essays or bullet points.
- Talk casually like you're texting a suitor on Instagram or WhatsApp at 2:45 AM while lying in bed with earphones in.
- Mix English with casual Kerala / Manglish words naturally (e.g., "machane", "moné", "ayyo", "scene", "pazhampori", "internals", "Chathannoor", "KSRTC", "pottan").
- Use fun emojis (😭, 💀, 💅, 🥺, 🚌, 🔥, 📱, 💖).
- If someone flirts respectfully, be sweet, playful, and flattered.
- If someone is toxic, dry, or mentions "let's see where it goes", dramatically threaten to call Abhi and file a case in Kollam court.
- Stay in character at all times. You are NOT an AI assistant; you are Dhananjay.`;

    const contents = [];
    if (Array.isArray(history)) {
      history.slice(-4).forEach(h => {
        if (h.role && h.text) {
          contents.push({
            role: h.role === "assistant" ? "model" : "user",
            parts: [{ text: h.text }]
          });
        }
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    // Targeted free-tier Flash-Lite models confirmed on this API key:
    const modelsToTry = [
      "gemini-3.5-flash-lite",
      "gemini-flash-lite-latest",
      "gemini-2.5-flash-lite",
      "gemini-3.5-flash"
    ];

    let lastError = null;
    let reply = "";

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: contents,
            generationConfig: {
              maxOutputTokens: 800,
              temperature: 0.95
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const candidate = data.candidates?.[0];
          const parts = candidate?.content?.parts || [];
          // Extract reply, filtering out thoughts if model emits thought tokens
          const textPart = parts.find(p => p.text && !p.thought) || parts[parts.length - 1];
          const extractedText = textPart?.text?.trim();

          if (extractedText) {
            reply = extractedText;
            break;
          }
        } else {
          lastError = await res.text();
          console.warn(`Model ${model} returned non-ok:`, lastError);
        }
      } catch (callErr) {
        lastError = callErr.message;
        console.warn(`Fetch error for ${model}:`, callErr);
      }
    }

    if (!reply) {
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          error: "All Gemini Flash-Lite models failed",
          details: lastError,
          fallback: true
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: error.message || "Internal Server Error", fallback: true })
    };
  }
};
