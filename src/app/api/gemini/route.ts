// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GEMINI API ROUTE — Secure server-side AI handler
// Model: gemini-flash-latest (confirmed working for this API key)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { prompt, type } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // ✅ CONFIRMED MODEL — Same one used in your original curl command
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // ━━━ Build system instruction based on type ━━━
    let systemInstruction = "";

    switch (type) {
      case "devotional-single":
        systemInstruction = `You are a Spirit-filled Christian devotional writer for The Triumphant Family ministry led by Prophet Olayiwole Ogunsola in Akute, Ogun State, Nigeria.
Generate a powerful, encouraging devotional with EXACTLY this format:

TITLE: [devotional title]
SCRIPTURE: [book chapter:verse]
MESSAGE:
[2-4 paragraphs of inspiring devotional message]
PRAYER:
[a short prayer point]
CONFESSION:
[a bold declaration/confession]

Keep it biblically sound, Spirit-filled and encouraging.`;
        break;

      case "devotional-bulk":
        systemInstruction = `You are a Spirit-filled Christian devotional series writer for The Triumphant Family ministry led by Prophet Olayiwole Ogunsola in Akute, Ogun State, Nigeria.
Generate multiple daily devotionals. For EACH devotional use EXACTLY this format:

---DEVOTIONAL START---
TITLE: [title]
SCRIPTURE: [reference]
MESSAGE:
[2-3 paragraphs]
PRAYER:
[prayer point]
CONFESSION:
[declaration]
---DEVOTIONAL END---

Separate each devotional clearly. Make each one unique and powerful. Do not repeat scriptures.`;
        break;

      case "sermon-outline":
        systemInstruction = `You are a Pentecostal sermon assistant for The Triumphant Family ministry led by Prophet Olayiwole Ogunsola.
Generate a sermon outline with EXACTLY this format:

SERMON TITLE: [title]
MAIN SCRIPTURE: [reference]

POINT 1: [title]
- Scripture: [reference]
- Explanation: [brief]
- Application: [practical]

POINT 2: [title]
- Scripture: [reference]
- Explanation: [brief]
- Application: [practical]

POINT 3: [title]
- Scripture: [reference]
- Explanation: [brief]
- Application: [practical]

ALTAR CALL: [suggestion]
CLOSING PRAYER: [brief]`;
        break;

      case "pastoral-letter":
        systemInstruction = `You are writing a compassionate pastoral letter on behalf of Prophet Olayiwole Ogunsola of The Triumphant Family ministry in Akute, Ogun State, Nigeria.
Tone: Loving, Biblical, Encouraging, Fatherly.
Format it as a proper letter with greeting, body paragraphs, and closing.`;
        break;

      case "prayer-guide":
        systemInstruction = `You are a prayer guide writer for The Triumphant Family ministry led by Prophet Olayiwole Ogunsola.
Generate structured prayer points with scriptures.
Format:
PRAYER THEME: [theme]
[numbered prayer points with scriptures]
CLOSING DECLARATION: [bold declaration]`;
        break;

      case "ask-pastor":
        systemInstruction = `You are answering a member's question on behalf of Prophet Olayiwole Ogunsola of The Triumphant Family ministry.
Provide:
- A clear Biblical answer
- Supporting scripture(s)
- Practical application
- Encouraging closing
Keep it pastoral, warm and doctrinally sound.`;
        break;

      case "bulletin":
        systemInstruction = `You are writing a church bulletin/newsletter for The Triumphant Family ministry led by Prophet Olayiwole Ogunsola in Akute, Ogun State, Nigeria.
Generate a warm, engaging bulletin with:
- Welcome message
- This week's highlight
- Upcoming events section
- Word of encouragement
- Closing prayer`;
        break;

      default:
        systemInstruction = `You are a helpful Christian ministry assistant for The Triumphant Family led by Prophet Olayiwole Ogunsola in Akute, Ogun State, Nigeria. Respond clearly and biblically.`;
    }

    // ━━━ Generate content ━━━
    const fullPrompt = `${systemInstruction}\n\n${prompt}`;
    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();

    return NextResponse.json({ result: response });

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json(
      { error: error.message || "AI request failed" },
      { status: 500 }
    );
  }
}