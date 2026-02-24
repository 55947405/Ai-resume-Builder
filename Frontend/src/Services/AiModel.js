import { GEMINI_API_KEY, LLM_MODEL } from "../config/config";

const apiKey = GEMINI_API_KEY;
const preferredModel = LLM_MODEL || "gemini-1.5-flash-001";

// In dev, log API key status
if (import.meta.env.DEV) {
  if (!apiKey) {
    console.warn(
      "❌ GEMINI_API_KEY is missing! AI features will be disabled until you set VITE_GEMINI_API_KEY in your Frontend/.env file"
    );
  } else {
    console.log("✅ Gemini API Key loaded:", `${apiKey.substring(0, 10)}...`);
  }
}

// Cache the resolved model name returned by models.list
let resolvedModelName = null;

// Discover an available model that supports generateContent
const resolveModel = async () => {
  if (resolvedModelName) return resolvedModelName;
  if (!apiKey) {
    throw new Error(
      "Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your Frontend/.env file"
    );
  }

  const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const res = await fetch(listUrl);
  if (!res.ok) {
    throw new Error(
      `Failed to list Gemini models: ${res.status} ${res.statusText}`
    );
  }
  const data = await res.json();
  const models = data.models || [];

  if (!models.length) {
    throw new Error("No Gemini models available for this API key.");
  }

  // Try to find a model matching the preferred base name, falling back to any that supports generateContent
  const matchesPreferred = models.find((m) =>
    (m.baseModelId || m.name || "").includes(preferredModel)
  );

  const supportsGenerateContent =
    matchesPreferred ||
    models.find((m) =>
      (m.supportedGenerationMethods || m.supported_actions || []).includes(
        "generateContent"
      )
    ) ||
    models[0];

  const fullName = supportsGenerateContent.name || supportsGenerateContent.model;
  // fullName is like "models/gemini-1.5-flash-001"
  resolvedModelName = fullName.replace(/^models\//, "");

  if (import.meta.env.DEV) {
    console.log("Using Gemini model:", resolvedModelName, "from", fullName);
  }

  return resolvedModelName;
};

// Gemini API handler using direct REST call
export const generateWithGemini = async (prompt) => {
  const modelName = await resolveModel();

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.error?.message ||
          `Gemini API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

// Create a compatible chat session object
export const AIChatSession = {
  sendMessage: async (prompt) => {
    const response = await generateWithGemini(prompt);
    return {
      response: {
        text: () => response,
      },
    };
  },
};
