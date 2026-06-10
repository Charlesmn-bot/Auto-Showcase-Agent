import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables from .env if present
dotenv.config();

const app = express();
const PORT = 3000;

// Set up JSON parsing with a high limit to support uploading base64 images
app.use(express.json({ limit: "20mb" }));

// Lazy initializer for GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please configure it in your Secrets/Environment panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint to analyze a car image using Gemini
app.post("/api/analyze-car", async (req, res) => {
  try {
    const { imageBase64, mimeType, presetName } = req.body;

    if (!imageBase64 && !presetName) {
      return res.status(400).json({ error: "Missing imageBase64 or presetName in request." });
    }

    const ai = getAiClient();

    // System instruction to guide Gemini to return strict JSON matching our schema
    const systemInstruction = 
      "You are the Core Vision and Marketing engine of the Auto Showcase Agent. " +
      "Your job is to analyze the provided car photo, identify details with high precision, " +
      "and generate high-converting, professional marketing content for social media channels. " +
      "You must validate that the image represents a real car. If it does not, indicate that in the response. " +
      "Return your analysis strictly in raw JSON matching the requested schema.";

    // Content instruction
    let contents: any;
    if (imageBase64 && mimeType) {
      // Strips any data:image/png;base64, prefixes if present
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      contents = {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: `Analyze this image. Identify the car's make, model, year (approximate), main exterior color, and body style. Write a highly engaging marketing caption (approx 100 words), general call-to-action (CTA), and a set of 5 trending hashtags. Verify image visibility / clarity score from 1 to 100. Provide confidence. If it doesn't look like a real car, set confidence to 0 and indicate why in a special notice field.`,
          },
        ],
      };
    } else {
      // Demo presets case - write text prompts to generate beautiful structured JSON
      contents = `Create a realistic car analysis for the preset "${presetName}". Generate realistic info for: make, model, year, a beautiful color appropriate for it, style, high-engaging marketing description (approx 100 words), cta, hashtags, and a 95+ clarity/confidence scan.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "detectedMake",
            "detectedModel",
            "detectedYear",
            "detectedColor",
            "detectedStyle",
            "confidenceScore",
            "clarityScore",
            "marketingPitch",
            "cta",
            "hashtags",
            "safetyCheckPassed"
          ],
          properties: {
            detectedMake: { type: Type.STRING, description: "Car Manufacturer (e.g. Tesla, Porsche)" },
            detectedModel: { type: Type.STRING, description: "Car Model (e.g. Model 3, 911)" },
            detectedYear: { type: Type.STRING, description: "Approximate or exact model year (e.g. 2023)" },
            detectedColor: { type: Type.STRING, description: "Identified color name (e.g. Pearl White, Slate Silver)" },
            detectedStyle: { type: Type.STRING, description: "Body Style (e.g. Sedan, SUV, Coupe)" },
            confidenceScore: { type: Type.NUMBER, description: "Confidence decimal from 0.0 to 1.0" },
            clarityScore: { type: Type.INTEGER, description: "Clarity score from 1 to 100" },
            marketingPitch: { type: Type.STRING, description: "Engaging 100-word promotional caption for listing" },
            cta: { type: Type.STRING, description: "Action CTA like 'DM for pricing' or 'Click today'" },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 5 hashtag terms without # symbol"
            },
            safetyCheckPassed: { type: Type.BOOLEAN, description: "True if image contains a clear vehicle" },
            rejectionReason: { type: Type.STRING, description: "Detailed string if safe check fails" }
          }
        }
      }
    });

    const resultText = response.text || "{}";
    res.json(JSON.parse(resultText.trim()));

  } catch (error: any) {
    console.error("Error standardizing car photo:", error);
    res.status(500).json({
      error: error.message || "An error occurred during Gemini vision analysis.",
    });
  }
});

// Mock posting endpoint to simulate action logs and schedule changes
app.post("/api/schedule-post", (req, res) => {
  const { channel, postTime, caption, imageModel } = req.body;
  res.json({
    status: "success",
    message: `Scheduled post for ${channel} successfully at ${postTime}`,
    auditEntry: {
      timestamp: new Date().toISOString(),
      action: "SCHEDULE_POST",
      details: `Scheduled visual layout collage of ${imageModel} for publication to ${channel} at ${postTime}`,
      operator: "CarPhoto_Agent_v1.0"
    }
  });
});

// Configure Vite or Static files depending on Environment
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite dev middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production files from dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Auto Showcase Agent server starting on http://localhost:${PORT}`);
  });
}

setupServer();
