import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Gemini Client server-side with required headers
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. AI Image Edit / Transformation endpoint
app.post('/api/ai/edit-image', async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({ error: 'Gemini API key is not configured.' });
    }
    const { prompt, imageBase64, mimeType } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const parts: any[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType || 'image/jpeg',
        },
      });
    }
    parts.push({
      text: `You are an expert AI photo and image editor. Analyze the image and user's instruction: "${prompt}". Provide concrete visual adjustments and an aesthetic review. Return a JSON object with:
1. "suggestedAdjustments": { "brightness": number (-50 to 50), "contrast": number (-50 to 50), "saturation": number (-50 to 50), "blur": number (0 to 10), "sepia": number (0 to 100), "hueRotate": number (0 to 360) }
2. "filterName": catchy name for this AI look (e.g. "Cyberpunk Glow", "Sunset Golden Hour", "Vintage Kodachrome", "Studio Portrait", "B&W Film Noir")
3. "aiSummary": 1-2 sentence description of what the AI adjusted and why.
4. "artisticDescription": A vivid description of the reimagined visual scene.
5. "colorPalette": array of 4 representative hex colors [#hex, #hex, #hex, #hex].`,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const result = JSON.parse(response.text || '{}');
    return res.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Error editing image with AI:', error);
    return res.status(500).json({ error: error.message || 'Failed to process AI image edit' });
  }
});

// 2. AI Video Director & Color Grading Analysis
app.post('/api/ai/analyze-video', async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({ error: 'Gemini API key is not configured.' });
    }
    const { videoTitle, prompt, duration } = req.body;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are a professional AI Video Editor and Colorist. The user has a video titled "${videoTitle || 'Clip'}" (duration: ~${duration || 15}s) and gave this edit instruction: "${prompt || 'Enhance video aesthetics, add cinematic grade and subtitles'}".
Return a JSON object with:
1. "videoTitle": catchy improved title
2. "colorGrade": style name (e.g., "Cinematic Teal & Orange", "Cyberpunk Neon", "Golden Hour Glow", "Film Noir B&W", "Vintage 90s Camcorder VHS")
3. "filterSettings": { "brightness": number (80 to 140), "contrast": number (80 to 140), "saturate": number (60 to 160), "sepia": number (0 to 60), "hueRotate": number (0 to 360) }
4. "captions": array of 3-4 timed subtitle objects [{ "time": 0, "text": "..." }, { "time": 4, "text": "..." }, { "time": 8, "text": "..." }]
5. "scriptHook": 1-sentence viral hook or caption header
6. "aiDirectorAdvice": 2 sentences of professional advice on pacing, cut points, and sound design.`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const result = JSON.parse(response.text || '{}');
    return res.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Error analyzing video with AI:', error);
    return res.status(500).json({ error: error.message || 'Failed to process video with AI' });
  }
});

// 3. AI Video Clip / Storyboard Generator
app.post('/api/ai/generate-video-prompt', async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({ error: 'Gemini API key is not configured.' });
    }
    const { userPrompt, style, aspectRatio } = req.body;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Create a cinematic, highly detailed video generation storyboard and scene description based on: "${userPrompt}". Style: ${style || 'Cinematic Film'}. Aspect ratio: ${aspectRatio || '16:9'}.
Return JSON with:
1. "enhancedPrompt": rich visual prompt
2. "sceneOverview": 2-sentence summary of the scene
3. "cameraMovement": e.g., "Slow forward tracking shot with shallow depth of field"
4. "lighting": e.g., "Soft volumetric dusk rays"
5. "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4"]`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const result = JSON.parse(response.text || '{}');
    return res.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Error generating video prompt:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate video prompt' });
  }
});

// Mount Vite middleware for dev mode
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
