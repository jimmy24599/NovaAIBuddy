import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router({ mergeParams: true });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);



// ✨ Buddy Info
// ✨ Buddy Info
router.get('/buddy-info', async (req, res) => {
  const user_id = req.userId;
  if (!user_id) return res.status(401).json({ success: false, error: 'Unauthorized' });

  const { data, error } = await supabase
    .from('ai_buddies')
    .select('*')
    .eq('user_id', user_id); // ✨ no .single() here

  if (error) {
    console.error('Supabase error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch buddy info' });
  }

  res.json({ success: true, buddies: data || [] }); // ✨ rename key to "buddies" (plural)
});

// ✨ Mood History
router.get('/mood-history', async (req, res) => {
  const user_id = req.userId;
  if (!user_id) return res.status(401).json({ success: false, error: 'Unauthorized' });

  const { data, error } = await supabase
    .from('mood_history')
    .select('mood, created_at')
    .eq('user_id', user_id)
    .order('created_at', { ascending: true });

  if (error && error.code !== 'PGRST116') {
    return res.status(500).json({ success: false, error: 'Failed to fetch mood history' });
  }

  if (!data || data.length === 0) {
    return res.json({ success: true, moods: [] });
  }

  const moods = data.map(item => ({
    date: new Date(item.created_at).toLocaleDateString(),
    mood: item.mood,
  }));

  res.json({ success: true, moods });
});


// ✨ User Memory (Final Corrected)
router.get('/user-memory', async (req, res) => {
  const user_id = req.userId;
  if (!user_id) return res.status(401).json({ success: false, error: 'Unauthorized' });

  const { data, error } = await supabase
    .from('user_memory')
    .select('facts')
    .eq('user_id', user_id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('❌ Supabase error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch user memory' });
  }

  res.json({ success: true, facts: data?.facts || [] });
});

// ✨ Last Buddy Message
router.get('/buddy-last-message', async (req, res) => {
  const user_id = req.userId;
  if (!user_id) return res.status(401).json({ success: false, error: 'Unauthorized' });

  const { data, error } = await supabase
    .from('chats')
    .select('message')
    .eq('user_id', user_id)
    .eq('sender', 'buddy')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch last message' });
  }

  if (!data) {
    return res.json({ success: true, message: '' });
  }

  res.json({ success: true, message: data.message || '' });
});

export default router;
