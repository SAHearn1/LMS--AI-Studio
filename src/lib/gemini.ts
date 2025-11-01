import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    "Missing VITE_GEMINI_API_KEY (set it in Vercel → Project → Settings → Environment Variables)."
  );
}

export const geminiApiKey = apiKey;
export const genAI = new GoogleGenerativeAI({ apiKey });
