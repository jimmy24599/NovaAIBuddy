import express from 'express';
import { OpenAI } from 'openai';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { PutObjectCommand } from "@aws-sdk/client-s3";



dotenv.config();

const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// S3 setup
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    key: (req, file, cb) => {
      const filename = `avatars/${Date.now()}-${file.originalname}`;
      cb(null, filename);
    },
  }),
});

// POST /generate-avatar
router.post('/generate-avatar', async (req, res) => {
    const { gender, ethnicity, hair, style } = req.body;
    const user_id = req.userId;
    
  if (!gender || !ethnicity || !hair || !style || !user_id) {
    return res.status(400).json({ success: false, message: 'Missing parameters.' });
  }

  try {
    // Step 1: Generate prompt using GPT
    const promptResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a prompt engineer creating hyper-realistic portrait prompts for an AI friend.',
        },
        {
          role: 'user',
          content: `Create a detailed prompt for generating an ultra-realistic professional portrait of an AI friend. 
        The person should have ${hair.toLowerCase()} hair, be of ${ethnicity.toLowerCase()} ethnicity, and present as ${gender.toLowerCase()}.
        Style should reflect a ${style.toLowerCase()} fashion look. 
        The background must be a clean plain pastel tone like baby blue, baby pink, or soft cream. 
        The face should be centered vertically and horizontally, the lighting should be soft natural or studio-like. Avoid cartoonish, 3D, or fantasy styles. 
        It should look like a real human photo taken with a DSLR camera.` 

        },
      ],
    });
    console.log(`🧠 Generating avatar for ${user_id}`);


    const imagePrompt = promptResponse.choices[0].message.content;

    // Step 2: Generate image with DALL·E 3
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    });

    const imageUrl = imageResponse.data[0].url;

    // Step 3: Download and upload to S3
    const imageRes = await fetch(imageUrl);
    const buffer = await imageRes.arrayBuffer();

    const filename = `avatars/${user_id}-${Date.now()}.png`;
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename,
      Body: Buffer.from(buffer),
      ContentType: 'image/png',
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const publicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;

    // Step 4: Save to Supabase
    await supabase.from('ai_buddies').insert([
      {
        user_id,
        image_url: publicUrl,
        config: { gender, ethnicity, hair, style },
      },
    ]);
    
    res.json({ success: true, image_url: publicUrl });
  } catch (err) {
    console.error('Avatar generation error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate avatar.' });
  }
});

export default router;
