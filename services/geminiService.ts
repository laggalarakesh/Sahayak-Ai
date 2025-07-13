

import { GoogleGenAI, GenerateImagesResponse, Part } from "@google/genai";

// The API key is securely sourced from the environment variable.
// This is a standard practice to prevent exposing sensitive keys in the codebase.
const API_KEY = process.env.API_KEY;

// Warn the developer if the API key is not set in the environment.
if (!API_KEY) {
  console.warn(
    "Gemini API key is not configured. The application developer must set the `API_KEY` environment variable to enable AI features."
  );
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function* generateContentStream(
  prompt: string,
  image: { type: string; data: string; } | null | undefined,
  audio: { type: string; data: string; } | null | undefined,
  lowLatency?: boolean
): AsyncGenerator<string> {
  // Handle missing API key gracefully by yielding a helpful message to the UI.
  if (!API_KEY) {
    yield "### Configuration Error\n\nThe **Gemini API key** has not been configured. \n\nThe application developer must ensure the `API_KEY` environment variable is set to enable this feature.";
    return;
  }

  try {
    const parts: Part[] = [];

    // If an image is provided, add it to the parts array.
    if (image) {
      parts.push({
        inlineData: {
          mimeType: image.type,
          data: image.data,
        },
      });
    }

    // If audio is provided, add it to the parts array.
    if (audio) {
      parts.push({
        inlineData: {
          mimeType: audio.type,
          data: audio.data,
        },
      });
    }

    // Always add the text prompt.
    parts.push({ text: prompt });


    const stream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: { parts: parts },
      config: lowLatency ? { thinkingConfig: { thinkingBudget: 0 } } : undefined,
    });
    
    for await (const chunk of stream) {
        // The response object has a `text` accessor for the generated text.
        yield chunk.text;
    }
  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    if (error instanceof Error) {
        // Re-throw the original error to be handled by the UI component
        throw new Error(`An error occurred while communicating with the AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
}

export async function generateImage(prompt: string): Promise<string> {
  // For image generation, we still throw an error because the UI is designed to catch it.
  if (!API_KEY) {
    throw new Error("Gemini API key has not been configured. The application developer must set the `API_KEY` environment variable to enable this feature.");
  }

  let lastError: Error = new Error("An unknown error occurred while generating the image.");

  // Retry once on failure
  for (let i = 0; i < 2; i++) {
    try {
      const response: GenerateImagesResponse = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
      });

      if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image.imageBytes) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
      } else {
        // This case handles successful API calls that return no image (e.g., safety filters)
        const reason = "The API returned no image. This might be due to a safety filter on the prompt.";
        console.warn(`Image generation attempt ${i + 1} failed: ${reason}`);
        lastError = new Error(reason);
      }
    } catch (error) {
      console.error(`Error generating image on attempt ${i + 1}:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  // If we've exhausted retries, throw the last known error.
  throw new Error(`Failed to generate image after multiple attempts: ${lastError.message}`);
}