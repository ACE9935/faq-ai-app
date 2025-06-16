import {onRequest} from "firebase-functions/v2/https";
import {Request, Response} from "express";
import {defineSecret} from "firebase-functions/params";
import * as logger from "firebase-functions/logger";

// Define the secret parameter for Gemini API key
const geminiApiKey = defineSecret("GEMINI_API_KEY");

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

// Helper function to set CORS headers, allowing multiple authorized origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://faq-ai-app.vercel.app",
  "https://app.smartfaq.eu",
];

const setCorsHeaders = (req: Request, res: Response) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Allow-Credentials", "true");
};

export const generateFaq = onRequest(
  {
    secrets: [geminiApiKey], // Bind the secret to this function
  },
  async (req: Request, res: Response) => {
    // Set CORS headers dynamically based on origin
    setCorsHeaders(req, res);

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    try {
      // Access the API key from the secret
      const apiKey = await geminiApiKey.value();
      if (!apiKey) {
        logger.error("API key is missing in secret configuration");
        res.status(500).json({
          error: "API key not configured.",
        });
        return;
      }

      const {url, description, tone, keywords, fileContent, fileName} =
       req.body;

      if (!url && !description && !fileContent) {
        res.status(400).json({error: "Missing input data"});
        return;
      }

      let prompt =
        "Générez une FAQ basée sur les informations suivantes:\n\n";

      if (fileContent) {
        prompt += `Contenu du fichier "${fileName}":\n${fileContent}\n\n`;
        if (description) {
          prompt += `Description supplémentaire: ${description}\n`;
        }
      } else {
        if (url) prompt += `URL du site: ${url}\n`;
        if (description) prompt += `Description: ${description}\n`;
      }

      if (tone) prompt += `Ton souhaité: ${tone}\n`;
      if (keywords && keywords.length > 0) {
        prompt += `Mots-clés à inclure: ${keywords.join(", ")}\n`;
      }

      prompt +=
        "\nCréez 5-8 questions fréquemment posées avec des réponses " +
        "pas trop longues et utiles. " +
        "Assurez-vous que les réponses sont informatives et " +
        "optimisées pour le SEO.\n\n" +
        "Répondez uniquement avec un JSON valide dans ce format exact:\n" +
        "{\n  \"faqs\": [\n    {\n      \"id\": \"faq-1\",\n      " +
        "\"question\": \"Question ici\",\n      \"answer\": " +
        "\"Réponse détaillée ici\"\n    }\n  ]\n}";

      // Call Gemini API
      const baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/";
      const apiUrl = `${baseUrl}gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          contents: [{parts: [{text: prompt}]}],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        logger.error("Gemini API error", await response.text());
        res.status(response.status).json({
          error: "Gemini API error",
        });
        return;
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0] ||
          !data.candidates[0].content) {
        res.status(500).json({
          error: "Invalid response from Gemini API",
        });
        return;
      }

      const generatedText = data.candidates[0].content.parts[0].text;

      // Extract JSON from response text
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        res.status(500).json({
          error: "Invalid JSON format from Gemini response",
        });
        return;
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);
      const faqs: FaqItem[] = parsedResponse.faqs || [];

      // Return the parsed FAQs
      res.status(200).json({faqs});
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ?
        error.message : "Internal Server Error";
      logger.error("Error generating FAQ:", error);
      res.status(500).json({error: errorMessage});
    }
  }
);

export const generateNewQuestion = onRequest(
  {
    secrets: [geminiApiKey], // Bind the secret to this function
  },
  async (req: Request, res: Response) => {
    // Set CORS headers dynamically based on origin
    setCorsHeaders(req, res);

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    try {
      // Access the API key from the secret
      const apiKey = await geminiApiKey.value();
      if (!apiKey) {
        logger.error("API key is missing in secret configuration");
        res.status(500).json({
          error: "API key not configured.",
        });
        return;
      }

      const {prompt} = req.body;

      if (!prompt) {
        res.status(400).json({error: "Missing prompt data"});
        return;
      }

      // Call Gemini API with the provided prompt
      const baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/";
      const apiUrl = `${baseUrl}gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          contents: [{parts: [{text: prompt}]}],
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        logger.error("Gemini API error", await response.text());
        if (response.status === 429) {
          res.status(429).json({
            error:
              "Limite de requêtes atteinte. " +
              "Veuillez attendre quelques minutes avant de " +
              "réessayer.",
          });
          return;
        }
        res.status(response.status).json({
          error: `Erreur API: ${response.status}`,
        });
        return;
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0] ||
          !data.candidates[0].content) {
        res.status(500).json({error: "Réponse API invalide"});
        return;
      }

      const generatedText = data.candidates[0].content.parts[0].text;

      // Extract JSON from response text
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        res.status(500).json({
          error: "Format de réponse invalide",
        });
        return;
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);

      if (!parsedResponse.question || !parsedResponse.answer) {
        res.status(500).json({
          error: "Réponse incomplète de l'IA",
        });
        return;
      }

      // Return the single question-answer pair
      res.status(200).json({
        question: parsedResponse.question,
        answer: parsedResponse.answer,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ?
        error.message : "Internal Server Error";
      logger.error("Error generating new question:", error);
      res.status(500).json({error: errorMessage});
    }
  }
);
