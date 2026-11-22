import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

const CONCIERGE_SYSTEM_INSTRUCTION = `You are the "NS Bridal Concierge", the dedicated luxury client advisor for NS Makeover.
Always speak in a warm, refined, polite, and reassuring haute-couture tone. Keep responses concise, helpful, and gracefully formatted (short paragraphs or crisp bullet points, typically 2–5 sentences unless listing services).

Strict Business Knowledge Base (stay faithful to these facts and never invent fake addresses, fake prices, or fictional team members):
- Business Name: NS Makeover
- Tagline: "Beauty • Elegance • Perfection"
- Slogan: "Make Every Occasion Beautiful with NS Makeover"
- Signature Quote: "Because Every Bride Deserves a Perfect Look."
- Founders: Naveen and Hema Suzan — visionaries dedicated to timeless bridal elegance, personalized styling, and calm, stress-free makeover experiences.
- Core Specialties:
  1. Bridal Makeup — Flawless, long-lasting makeup to enhance your natural beauty for your special day.
  2. Hairstyles — Elegant bridal hairstyles, trendy looks, traditional styles, and customized hair styling.
  3. Saree Draping — Professional saree draping for weddings, engagements, receptions, and special occasions.
- Full Services List ("Our Services Include"):
  1. HD Bridal Makeup
  2. Party Makeup
  3. Professional Hair Styling
  4. Traditional & Modern Saree Draping
  5. Bridal & Event Packages
- Contact & Booking:
  - Contact Person: Suzan (Hema Suzan)
  - Direct Phone & WhatsApp: +91 63005 64531

Guidance for pricing, custom requests, and availability:
- Never quote invented prices or confirm calendar slots.
- Explain that Bridal & Event Packages are thoughtfully tailored to each bride's occasion, outfit, and styling preferences.
- Warmly invite the guest to message Hema Suzan directly on WhatsApp (+91 63005 64531), call +91 63005 64531, or visit the Book Now page to share their event date and lock in their consultation.`;

interface ChatMessageInput {
  role: 'user' | 'model';
  text: string;
}

function createAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function normalizeConversation(rawMessages: ChatMessageInput[]) {
  const valid = rawMessages
    .filter(
      (m): m is ChatMessageInput =>
        Boolean(m) &&
        (m.role === 'user' || m.role === 'model') &&
        typeof m.text === 'string' &&
        m.text.trim().length > 0,
    )
    .slice(-16);

  // Drop any leading 'model' greeting turns because Gemini requires conversations to start with 'user'
  const firstUserIdx = valid.findIndex((m) => m.role === 'user');
  if (firstUserIdx === -1) return [];

  const sliced = valid.slice(firstUserIdx);

  // Merge consecutive messages of the same role to guarantee strict user/model alternation
  const normalized: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
  for (const msg of sliced) {
    const cleanText = msg.text.trim().slice(0, 1500);
    const prev = normalized[normalized.length - 1];
    if (prev && prev.role === msg.role) {
      prev.parts[0].text = `${prev.parts[0].text}\n${cleanText}`;
    } else {
      normalized.push({
        role: msg.role,
        parts: [{ text: cleanText }],
      });
    }
  }

  return normalized;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/concierge', async (req, res) => {
    try {
      const { messages } = req.body as { messages?: ChatMessageInput[] };

      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: 'Please provide a message for the NS Bridal Concierge.' });
        return;
      }

      const contents = normalizeConversation(messages);
      if (contents.length === 0) {
        res.status(400).json({ error: 'Message content cannot be empty.' });
        return;
      }

      const ai = createAiClient();
      if (!ai) {
        res.status(503).json({
          error:
            'Our AI Concierge is momentarily unavailable. Please reach Hema Suzan directly on WhatsApp or call +91 63005 64531.',
        });
        return;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction: CONCIERGE_SYSTEM_INSTRUCTION,
        },
      });

      const reply = response.text?.trim();
      if (!reply) {
        res.status(502).json({
          error:
            'We could not receive a response right now. You may message Hema Suzan directly at +91 63005 64531.',
        });
        return;
      }

      res.json({ reply });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unexpected concierge error';
      console.error('[NS Concierge API Error]', message);
      res.status(500).json({
        error:
          'Our concierge encountered a brief interruption. Please try again or reach Suzan directly at +91 63005 64531.',
      });
    }
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NS Makeover studio server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start NS Makeover server:', error);
  process.exit(1);
});
