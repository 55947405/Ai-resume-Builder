const AUTH_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;

// Gemini (Google Generative AI) configuration
// Prefer VITE_GEMINI_API_KEY, but fall back to the old VITE_OPENROUTER_API_KEY
const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_OPENROUTER_API_KEY;

// Default Gemini model if not overridden
// Use a widely available model ID that supports generateContent in v1beta
// You can override this with VITE_LLM_MODEL in .env
const LLM_MODEL = import.meta.env.VITE_LLM_MODEL || "gemini-1.5-flash-001";

const VITE_APP_URL = import.meta.env.VITE_APP_URL;

export { AUTH_KEY, API_KEY, GEMINI_API_KEY, LLM_MODEL, VITE_APP_URL };
