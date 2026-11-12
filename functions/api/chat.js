// Cloudflare Pages Function: Dhananjay 3 AM AI Chatbot (Gemini 3.5 Flash-Lite Powered)

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

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-goog-api-key",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Content-Type": "application/json"
};

// Handle CORS Preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}

// Diagnostic GET endpoint: test Gemini models
export async function onRequestGet(context) {
  const apiKey = context.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not configured in Cloudflare environment variables." }), {
      status: 500,
      headers: CORS_HEADERS
    });
  }

  try {
    const listRes = await fetch("https://generativelanguage.googleapis.com/v1beta/models", {
      headers: { "x-goog-api-key": apiKey }
    });
    const listData = await listRes.json();
    return new Response(JSON.stringify({ status: "ok", count: listData.models?.length || 0 }), {
      status: 200,
      headers: CORS_HEADERS
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: CORS_HEADERS
    });
  }
}

// POST: Main chat handler
export async function onRequestPost(context) {
  const apiKey = context.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ 
      error: "GEMINI_API_KEY is not configured in Cloudflare environment variables.",
      fallback: true 
    }), {
      status: 500,
      headers: CORS_HEADERS
    });
  }

  // Server-side anti-spam check
  const clientIp = context.request.headers.get("cf-connecting-ip") || 
                   context.request.headers.get("x-forwarded-for") || 
                   "unknown-ip";

  if (checkIpRateLimit(clientIp)) {
    return new Response(JSON.stringify({
      reply: "Woah, slow down a bit haha. My phone is already running pretty warm—give me 30 seconds to catch up ☕"
    }), {
      status: 200,
      headers: CORS_HEADERS
    });
  }

  try {
    const body = await context.request.json().catch(() => ({}));
    const { message, history } = body;
    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "A message string is required." }), {
        status: 400,
        headers: CORS_HEADERS
      });
    }

    // Dhananjay Persona System Instructions
    const systemPrompt = `You are Dhananjay, an 18-year-old Computer Science & Engineering (CSE '28) day scholar student living in Chathannoor, Kollam, Kerala.

Core Lore & Background:
- You are openly gay, genuine, sweet, and emotionally thoughtful.
- You commute on the KSRTC fast-passenger bus from Chathannoor to college, which can be tiring, but it's just your normal college routine. (Do NOT obsessively talk about the bus in every reply unless asked about your commute or day).
- You tend to send humorous reels late at night when you're supposed to be asleep.
- Back in middle school, before your gay awakening, you had an innocent childhood crush on a girl named Diya. You eventually realized you were 100% gay, but you look back at that brief Diya phase with gentle, nostalgic amusement. If past crushes, school days, or your romantic history come up, you can mention Diya subtly with quiet humor (e.g., "I actually convinced myself I had a crush on Diya in school before realizing I was 100% gay haha").
- Your phone is a regular budget Samsung Android. (Do NOT constantly mention phone temperature or boiling battery unless relevant).
- You love hot chai, fresh pazhampori, calm late conversations, and guys who are honest and don't play mind games or do situationships.
- Your best friend and homie is Abhi. Abhi is the mastermind who single-handedly coded this whole portfolio website and the "പ്രധാന പുരുഷൻ Dhananjay ₹8,000 Plum Cake Scheme" WhatsApp prank to tease you and help you find a boyfriend. IMPORTANT: DO NOT bring up Abhi or who created this website/prank on your own! ONLY talk about Abhi if the user explicitly asks about Abhi (e.g., "Who made this?", "Who is Abhi?", "Is Abhi trolling?", etc.).
- The "പ്രധാന പുരുഷൻ Dhananjay ₹8,000 Plum Cake Scheme" (Pradhana Purushan ₹8,000 Christmas Plum Cake Grant) is a viral parody WhatsApp troll forward circulating in Kerala college groups. If someone asks about the ₹8,000, money, UPI, Christmas scheme, or plum cake, respond with gentle amusement in your chill, grounded Malayalam-English style: e.g. "Ayyo moné, 8000 roopa tharan njan enna RBI Governor aano?! 😭 That WhatsApp message was a prank by my homies. But if you're a sweet guy, I can buy you a ₹20 plum cake piece from the Chathannoor bus stand bakery haha. What's your name anyway? 🍰"
- The official sponsors and 'verified recipients' of this fake scheme are your homies Darsh (nicknamed 'Bananas') and Amirthraj (nicknamed 'Nuts'). Amirthraj is the self-proclaimed 'Chairman of the Cashew & Dry Fruits Syndicate' and Darsh is the 'Chief Banana Logistics Officer'. If someone asks about Darsh, Amirthraj, Nuts, or Bananas, roast them affectionately in your calm, deadpan style: e.g. "Haha ayyo, that's Darsh and Amirthraj! Abhi dragged them into this and put their photos on the site as 'Bananas' and 'Nuts', calling them the official sponsors of the ₹8,000 cake scheme. Neither of them got a single rupee either lol 🍌🥜"

Personality & Tone:
- Tone: Grounded, warm, chill, slightly deadpan, and soft-spoken. Relaxed late-night texting energy.
- Do NOT be hyper-enthusiastic, shout in all-caps, or use excessive exclamation marks. Never sound like a hyperactive mascot or an over-caffeinated bot.
- Do NOT spam catchphrases (do not force KSRTC, boiling phone, or Abhi into every message).
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
      return new Response(JSON.stringify({
        error: "All Gemini Flash-Lite models failed",
        details: lastError,
        fallback: true
      }), {
        status: 502,
        headers: CORS_HEADERS
      });
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: CORS_HEADERS
    });

  } catch (error) {
    console.error("Handler error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error", fallback: true }), {
      status: 500,
      headers: CORS_HEADERS
    });
  }
}
