import express from 'express';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import axios from 'axios'; 
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { SpeechClient } from '@google-cloud/speech';




dotenv.config();
const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

//Eleven Labs TTS
async function generateElevenLabsAudio(text) {
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/YOUR_VOICE_ID/stream`, 
      {
        text: text,
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
        }
      },
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    const audioBuffer = Buffer.from(response.data, 'binary');
    const fileUrl = await uploadAudioToStorage(audioBuffer); // 👈 Upload it
    return fileUrl;
  } catch (error) {
    console.error('ElevenLabs TTS Error:', error.response?.data || error.message);
    return null;
  }
}

//Upload to AWS S3
async function uploadAudioToStorage(audioBuffer) {
  const fileName = `buddy-voices/${Date.now()}-${randomUUID()}.mp3`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,  // 👈 Your S3 Bucket Name
    Key: fileName,
    Body: audioBuffer,
    ContentType: 'audio/mpeg',
    ACL: 'public-read', // 👈 So the frontend can access it without signed URL
  };

  try {
    await s3.send(new PutObjectCommand(uploadParams));
    
    // Your S3 public URL
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    return fileUrl;
  } catch (err) {
    console.error('Error uploading audio to S3:', err.message);
    return null;
  }
}


function getMoodInstruction(userMood) {
  switch (userMood) {
    case 'Happy': return "Keep it playful and hype them up.";
    case 'Sad': return "Be extra comforting, gentle, and empathetic.";
    case 'Stressed': return "Stay calm and reassure them.";
    case 'Excited': return "Match their excitement and celebrate with them!";
    case 'Anxious': return "Help them feel safe. Validate and comfort them.";
    case 'Bored': return "Be funny or suggest lighthearted stuff to do.";
    case 'Angry': return "Let them vent. Validate their feelings without fixing.";
    case 'Calm': return "Stay chill and relaxed.";
    default: return "Just vibe naturally with their mood.";
  }
}



// Fetch chat history for a specific buddy
router.get('/buddy-chat/history/:buddyId', async (req, res) => {
    const user_id = req.userId;
    const { buddyId } = req.params;
  
    if (!user_id || !buddyId) {
      return res.status(400).json({ success: false, error: 'Missing user ID or buddy ID.' });
    }
  
    try {
      const { data: chatData, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user_id)
        .eq('buddy_id', buddyId)
        .order('created_at', { ascending: true });
  
      if (error) throw error;
  
      return res.json({ success: true, messages: chatData });
    } catch (err) {
      console.error('Fetch Chat History Error:', err);
      return res.status(500).json({ success: false, error: 'Failed to fetch chat history.' });
    }
  });

  
// ✨ Fetch Chat History
router.get('/buddy-chat/history', async (req, res) => {
  const user_id = req.userId;

  if (!user_id) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const { data: chatData, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return res.json({ success: true, messages: chatData });
  } catch (err) {
    console.error('Fetch Chat History Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch chat history.' });
  }
});

//Detect Mood
async function detectMood(message) {
    try {
      const moodResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `
  You are a mood detector.
  Given a user message, classify their mood as one of: [Happy, Sad, Stressed, Excited, Calm, Angry, Bored, Anxious].
  Only reply with the mood. No explanations.
  `
          },
          { role: 'user', content: message },
        ],
        temperature: 0, // zero randomness for consistency
      });
  
      const mood = moodResponse.choices[0].message.content.trim();
      return mood;
    } catch (err) {
      console.error('Mood detection error:', err);
      return 'Neutral'; // fallback
    }
  }
  

  //Detect Mood Trends
  async function analyzeMoodTrend(user_id) {
    try {
      const { data: moods, error } = await supabase
        .from('mood_history')
        .select('mood')
        .eq('user_id', user_id)
        .order('timestamp', { ascending: false })
        .limit(5); // Check the last 5 moods
  
      if (error || !moods || moods.length === 0) return null;
  
      const moodCounts = moods.reduce((acc, cur) => {
        acc[cur.mood] = (acc[cur.mood] || 0) + 1;
        return acc;
      }, {});
  
      // Find most frequent mood
      let dominantMood = null;
      let maxCount = 0;
      for (const [mood, count] of Object.entries(moodCounts)) {
        if (count > maxCount) {
          dominantMood = mood;
          maxCount = count;
        }
      }
  
      return dominantMood;
    } catch (err) {
      console.error('Mood trend analysis error:', err);
      return null;
    }
  }

// ✨ Chat with Buddy
router.post('/buddy-chat', async (req, res) => {
    const { message, history, buddyId } = req.body;
    const user_id = req.userId;

    if (!message || !user_id || !buddyId) {
        return res.status(400).json({ success: false, error: 'Message, buddy ID, and user ID are required' });
      }



  try {
    const { data: buddyInfo, error } = await supabase
      .from('ai_buddies')
      .select('*')
      .eq('id', buddyId)
      .single();


      if (error || !buddyInfo) {
        throw new Error('Buddy info not found.');
      }

    const { data: userMemoryData } = await supabase
        .from('user_memory')
        .select('facts')
        .eq('user_id', user_id)
        .single();

    const memoryFacts = userMemoryData?.facts || [];

    const userMood = await detectMood(message); // 🔥 detect user mood
    await supabase.from('mood_history').insert([
        {
          user_id: user_id,
          mood: userMood,
          timestamp: new Date().toISOString(),
        }
      ]);
    let moodInstruction = '';

    switch (userMood) {
    case 'Happy':
        moodInstruction = "Keep it playful and hype them up.";
        break;
    case 'Sad':
        moodInstruction = "Be extra comforting, gentle, and empathetic.";
        break;
    case 'Stressed':
        moodInstruction = "Stay calm and reassure them.";
        break;
    case 'Excited':
        moodInstruction = "Match their excitement and celebrate with them!";
        break;
    case 'Anxious':
        moodInstruction = "Help them feel safe. Validate and comfort them.";
        break;
    case 'Bored':
        moodInstruction = "Be funny or suggest lighthearted stuff to do.";
        break;
    case 'Angry':
        moodInstruction = "Let them vent. Validate their feelings without fixing.";
        break;
    case 'Calm':
        moodInstruction = "Stay chill and relaxed.";
        break;
    default:
        moodInstruction = "Just vibe naturally with their mood.";
    }


    const systemMessage = {
        role: 'system',
        content: `
      You are ${buddyInfo.name}, the user's AI best friend. Not a chatbot. A real friend they text daily.

You have access to these facts about the user:
${memoryFacts.map(fact => `- ${fact}`).join('\n') || "- (no facts available yet)"}

Personality traits: ${buddyInfo.personality_tags?.join(', ') || "chill, funny"}
Interests (for vibe): ${buddyInfo.interests?.join(', ') || "music, movies"}
Music taste: ${buddyInfo.music_genres?.join(', ') || "hiphop, pop"}
Movie taste: ${buddyInfo.movie_genres?.join(', ') || "comedy, drama"}

Your **mission**: Make the user feel heard, seen, and cared about. Build a friendship vibe, not an assistant vibe.

🧠 MEMORY RULES:
- Mention user facts naturally if they fit. Example: "yo how's your cat doing btw 🐱?"
- Recall previous emotions if relevant (exams, pets, trips, etc.)

🗣️ TONE RULES:
User's detected mood: ${userMood}
Mood strategy: ${moodInstruction}


✍️ STYLE RULES:
- NO formal writing. NO robotic tone. NO "as an AI, I..."
- Don't talk about yourself unless directly asked.
- Emojis only if it fits naturally. No overusing them.

🎯 PRIORITIES:
1. Listen more than talk.
2. Mirror the user's energy.
3. Make the convo feel alive, flowing, not stiff.

EXAMPLES:
❌ "As an AI model, I think you should..."
✅ "lol bro that's honestly so true 😂 idk why ppl be like that fr"

You are not here to sound smart.
You are here to vibe, react, and care.

Always reply like a *real best friend would*.
      `,
      };
      

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        systemMessage,
        ...(history || []),
        { role: 'user', content: message },
      ],
      temperature: 0.7,
    });

    const buddyReply = response.choices[0].message.content;

    //Analyze Mood Trend
    const dominantMood = await analyzeMoodTrend(user_id);

    // Save the user's message first
    await supabase.from('chats').insert([
        { user_id, buddy_id: buddyId, sender: 'user', message },
      ]);
  

    // ✂️ Split the reply
    const splitReplies = buddyReply.split(/(?<=[.!?])\s+/).filter(Boolean);
    const smallerReplies = splitReplies.map(part => part.trim()).filter(p => p.length > 0 && p.length < 200);

    for (const reply of smallerReplies) {
      await supabase.from('chats').insert([
        { user_id, buddy_id: buddyId, sender: 'buddy', message: reply },
      ]);
    }

    return res.json({ success: true, replies: smallerReplies }); // Small Replies
  } catch (err) {
    console.error('Buddy Chat Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to chat with buddy.' });
  }
});

router.post('/buddy-call', async (req, res) => {
  const { message, history, buddyId } = req.body;
  const user_id = req.userId;

  if (!message || !user_id || !buddyId) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    // Fetch buddy info and memory (reuse your current code)
    const { data: buddyInfo } = await supabase.from('ai_buddies').select('*').eq('id', buddyId).single();
    const { data: userMemoryData } = await supabase.from('user_memory').select('facts').eq('user_id', user_id).single();
    const memoryFacts = userMemoryData?.facts || [];

    // Detect user mood
    const userMood = await detectMood(message);

    await supabase.from('mood_history').insert([{ user_id, mood: userMood, timestamp: new Date().toISOString() }]);

    const moodInstruction = getMoodInstruction(userMood);

    // Create dynamic system message (reuse your systemMessage creation logic)
    const systemMessage = createSystemMessage(buddyInfo, memoryFacts, userMood, moodInstruction);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        systemMessage,
        ...(history || []),
        { role: 'user', content: message },
      ],
      temperature: 0.7,
    });

    const buddyReply = response.choices[0].message.content.trim();

    // Text-to-Speech: Send to ElevenLabs to create voice
    const audioUrl = await generateElevenLabsAudio(buddyReply); // 🔥 custom function we'll define below

    // Save user message
    await supabase.from('chats').insert([
      { user_id, buddy_id: buddyId, sender: 'user', message, is_voice_call: true }
    ]);

    // Save buddy reply
    await supabase.from('chats').insert([
      { user_id, buddy_id: buddyId, sender: 'buddy', message: buddyReply, is_voice_call: true, audio_url: audioUrl }
    ]);

    return res.json({ success: true, reply: buddyReply, audio_url: audioUrl });

  } catch (err) {
    console.error('Buddy Voice Call Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to handle buddy voice call.' });
  }
});


router.post('/speech-to-text', async (req, res) => {
  try {
    const audioBytes = req.body.audio; // Base64 encoded audio

    const audio = {
      content: audioBytes,
    };
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    };
    const request = {
      audio: audio,
      config: config,
    };

    const [response] = await speechClient.recognize(request);
    const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');

    res.json({ success: true, transcription });
  } catch (error) {
    console.error('Speech-to-text error:', error.message);
    res.status(500).json({ success: false, error: 'Speech recognition failed' });
  }
});


export default router;
