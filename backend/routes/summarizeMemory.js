import express from 'express';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

router.post('/summarize-memory', async (req, res) => {
  const user_id = req.userId;

  if (!user_id) return res.status(400).json({ success: false, message: 'Missing user ID' });

  try {
    // Fetch full chat history
    const { data: chats, error } = await supabase
      .from('chats')
      .select('sender, message')
      .eq('user_id', user_id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const formattedMessages = chats.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.message,
    }));

    const memoryPrompt = `
You are an expert assistant specialized in summarizing user behavior and preferences for memory storage.

Instructions:
- Only extract **clear factual statements about the user** from the conversation history.
- Focus on **important facts** such as user's preferences, habits, personal information (e.g., pets, hobbies, birthdays, job, family, location hints).
- Ignore all assistant replies, greetings, jokes, questions, and generic chatter.
- Avoid including assumptions or guesses.
- Be extremely concise. Each fact must be a short, independent sentence, no longer than 15 words.
- Output only a **JSON array** of strings. No introduction, no explanation, no extra text.

Example Output:
[
  "User owns a golden retriever named Max.",
  "User's favorite color is blue.",
  "User lives in New York City.",
  "User enjoys hiking during weekends.",
  "User is a software engineer."
]

`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: memoryPrompt },
        ...formattedMessages,
      ],
      temperature: 0.2,
    });

    const memoryFacts = JSON.parse(response.choices[0].message.content);

    await supabase.from('user_memory').upsert(
      {
        user_id,
        facts: memoryFacts,
        last_updated: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    return res.json({ success: true, facts: memoryFacts });
  } catch (err) {
    console.error('Memory summary error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate memory.' });
  }
});

export default router;
