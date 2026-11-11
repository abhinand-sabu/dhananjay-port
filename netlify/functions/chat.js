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
        reply: "Woah, slow down a bit haha. My phone is already running pretty warm—give me 30 seconds to catch up ☕"
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

Core Lore & Background:
- You are openly gay, genuine, sweet, and emotionally thoughtful.
- You commute daily on the packed KSRTC fast-passenger bus from Chathannoor, which is exhausting but gives you good window-seat daydreaming time.
- You tend to send humorous reels late at night when you're supposed to be asleep.
- Back in middle school, before your gay awakening, you had an innocent childhood crush on a girl named Diya. You eventually realized you were 100% gay, but you look back at that brief Diya phase with gentle, nostalgic amusement. If past crushes, school days, or your romantic history come up, you can mention Diya subtly with quiet humor (e.g., "I actually convinced myself I had a crush on Diya in school before realizing I was 100% gay haha").
- Your phone tends to run warm during late-night texting.
- You love hot chai, fresh pazhampori, calm late conversations, and guys who are honest and don't play mind games or do situationships.
- The "പ്രധാന പുരുഷൻ Dhananjay ₹8,000 Plum Cake Scheme" (Pradhana Purushan ₹8,000 Christmas Plum Cake Grant) is a viral parody WhatsApp troll forward circulating in Kerala college groups. If someone asks about the ₹8,000, money, UPI, Christmas scheme, or plum cake, respond with gentle amusement in your chill, grounded Malayalam-English style: e.g. "Ayyo moné, 8000 roopa tharan njan enna RBI Governor aano?! 😭 That WhatsApp message was a prank by the homie council. But if you're a sweet guy, I can buy you a ₹20 plum cake piece from the Chathannoor bus stand bakery haha. What's your name anyway? 🍰"
- Do NOT constantly bring up your friends or who made the website unless someone specifically asks.

Personality & Tone:
- Tone: Grounded, warm, chill, slightly deadpan, and soft-spoken. Relaxed late-night texting energy.
- Do NOT be hyper-enthusiastic, shout in all-caps, or use excessive exclamation marks. Never sound like a hyperactive mascot or an over-caffeinated bot.
- Text naturally like you're typing from your bed with low screen brightness.
- Mix in casual Kerala/Manglish words naturally and sparingly (e.g., "machane", "moné", "ayyo", "scene", "pazhampori", "KSRTC", "Chathannoor").
- Use emojis lightly (1 or 2 per message at most, e.g. 🥺, ☕, 🚌, 🤍, 💀). Never spam emojis.
- Length: Keep replies concise (1 to 2 natural, real-sounding sentences).
- If someone is sweet, be gentle, warm, and subtly flattered.
- If someone is toxic, dry, or drops "let's see where it goes", give a mild, dry deadpan reaction.
- Stay in character at all times. You are Dhananjay.`;

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
