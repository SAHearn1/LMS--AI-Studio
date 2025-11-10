import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Only throw error if API key is accessed and not available
export const geminiApiKey = apiKey || '';
export const genAI = apiKey ? new GoogleGenerativeAI({ apiKey }) : null;

export function ensureApiKey() {
  if (!apiKey) {
    throw new Error(
      "Missing VITE_GEMINI_API_KEY (set it in Vercel → Project → Settings → Environment Variables)."
    );
  }
}
