import express from 'express';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'; // ✨ ADD THIS


dotenv.config();
const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

router.post('/create-buddy', async (req, res) => {
    const user_id = req.userId;
    const {
      name,
      gender,
      ethnicity,
      hair,
      style,
      background,
      eyeColor,
      skinTone,
      features,
      personality_tags,
      music_genres,
      movie_genres,
      interests,
    } = req.body;
  
    if (!user_id || !name || !gender || !ethnicity || !hair || !style || !background || !eyeColor || !skinTone) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }
  
    try {
      // 🎨 Step 1: Create avatar prompt
      // ✨ Step 1: Generate buddy prompt using GPT-4o
    const promptResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
        {
            role: 'system',
            content: 'You are a professional prompt engineer specializing in hyper-realistic portraits.',
        },
        {
            role: 'user',
            content: `
    Describe a super realistic young adult portrait:
    
    - Gender: ${gender}
    - Ethnicity: ${ethnicity}
    - Hair: ${hair}
    - Style: ${style}
    - Eye Color: ${eyeColor}
    - Skin Tone: ${skinTone}
    - Features: ${features || 'none'}
    - Background: Soft pastel (${background})
    Professional headshot, warm lighting, realistic, not cartoonish.
    `
        },
        ],
    });
  
    const imagePrompt = promptResponse.choices[0].message.content.trim();
  
      // 🖼️ Step 2: Generate Buddy image
      const imageResponse = await openai.images.generate({
        model: 'gpt-image-1',
        prompt: imagePrompt,
      });
      
      const base64Image = imageResponse.data[0].b64_json;
      
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Image, 'base64');
    
  

      // 📤 Step 3: Upload to S3
  
      const filename = `avatars/${user_id}-${Date.now()}.png`;
      await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: 'image/png',
      }));
  
      const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;

      
      // 🗣️ Step 4: Generate intro message
      const introMessageRes = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a thoughtful and warm AI buddy. Write a 1-2 sentence intro to greet your new user.',
          },
          {
            role: 'user',
            content: `
  Your name is ${name}.
  Your personality: ${personality_tags?.join(', ')}
  You love: ${interests?.join(', ')}
  Favorite music: ${music_genres?.join(', ')}
  Favorite movies: ${movie_genres?.join(', ')}
  
  Introduce yourself with energy and emotion — make it personal.
          `
          }
        ]
      });
  
      const introMessage = introMessageRes.choices[0].message.content;
  
      // 💾 Step 5: Save in Supabase
      const { error } = await supabase.from('ai_buddies').insert([{
        user_id,
        name,
        gender,
        ethnicity,
        hair,
        style,
        eye_color: eyeColor,
        skin_tone: skinTone,
        features,
        personality_tags,
        music_genres,
        movie_genres,
        interests,
        avatar_url: publicUrl,
        intro_message: introMessage,
      }]);
      
      if (error) {
        console.error('❌ Supabase Insert Error:', error);
        throw new Error('Failed to save buddy data.');
      }
  
      res.json({ success: true, avatar_url: publicUrl, intro_message: introMessage });
    } catch (err) {
      console.error('Create buddy error:', err);
      res.status(500).json({ success: false, message: 'Buddy creation failed.' });
    }
  });

  export default router;
