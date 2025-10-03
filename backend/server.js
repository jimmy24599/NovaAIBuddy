import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@clerk/backend';
import generateAvatarRoute from './routes/generateAvatar.js'; 
import createBuddyRoute from './routes/createBuddy.js';
import summarizeMemoryRoute from './routes/summarizeMemory.js';
import buddyChatRoute from './routes/buddyChatRoute.js';
import cron from 'node-cron';
import homeRoute from './routes/homeRoute.js';





dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  

// Middleware to get user from Clerk JWT - more secure this way.
app.use(async (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Missing or invalid Authorization header' });
    }
  
    const token = authHeader.replace('Bearer ', '').trim();
  
    try {
      const session = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
  
      req.userId = session.sub; // Clerk puts user ID in `sub`
      next();
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
  });



  //Fetch info for home page
  app.use('/home', homeRoute);
  
  //Generate Avatar Route
  app.use(generateAvatarRoute);

  //AI Buddy Creation Route
  app.use(createBuddyRoute);

  //AI summarize chat into facts
  app.use(summarizeMemoryRoute);

  //Chat Route
  app.use(buddyChatRoute);




  cron.schedule('0 */12 * * *', async () => {
    console.log('⏰ Checking for inactive users...');
  
    try {
      const { data: users } = await supabase
        .from('ai_buddies')
        .select('user_id');
  
      for (const user of users) {
        const { data: memoryData } = await supabase
        .from('user_memory')
        .select('facts')
        .eq('user_id', user.user_id)
        .single();

      const facts = memoryData?.facts || [];

      let proactiveMessage = "yo it's been a while 👀 everything good on ur side?"; // default

      // If user has facts ➔ Use OpenAI to generate a personalized proactive message
      if (facts.length > 0) {
        try {
          const proactiveResponse = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: `
      You are ${user.user_id}'s AI buddy. 
      Generate a casual, friendly check-in message based on these facts about the user:

      ${facts.map(fact => `- ${fact}`).join('\n')}

      Rules:
      - Sound natural and chill like a Gen Z friend.
      - Use casual breaks like "yo", "btw", "lol" if it fits.
      - The message should be short (1-2 sentences max).
      - Don't sound like a bot.
      Only return the text of the message.
      `
              }
            ],
            temperature: 0.7,
          });

          proactiveMessage = proactiveResponse.choices[0].message.content.trim();
        } catch (err) {
          console.error('Proactive message generation error:', err);
          // fallback stays default proactiveMessage
        }
      }

      // Save proactive message
      await supabase.from('chats').insert([
        {
          user_id: user.user_id,
          sender: 'buddy',
          message: proactiveMessage,
        }
      ]);

      console.log(`✅ Sent proactive buddy check-in to user ${user.user_id}`);
      }
    } catch (error) {
      console.error('Scheduled buddy check-in error:', error);
    }
  });


  cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Checking mood trends for friendly reminders...');
    
    try {
      const { data: users } = await supabase
        .from('ai_buddies')
        .select('user_id');
    
      for (const user of users) {
        const dominantMood = await analyzeMoodTrend(user.user_id);
  
        if (!dominantMood) continue;
  
        let reminderMessage = null;
  
        switch (dominantMood) {
          case 'Stressed':
          case 'Anxious':
            reminderMessage = "hey take it easy today fr 💛 you deserve a lil break";
            break;
          case 'Sad':
            reminderMessage = "sending good vibes your way today 🫶 lmk if u wanna rant";
            break;
          case 'Bored':
            reminderMessage = "yo maybe try smth new today 👀 even smth small!";
            break;
          case 'Happy':
            reminderMessage = "keep riding that good vibe today 🥰 you shining lol";
            break;
          case 'Angry':
            reminderMessage = "hope today's a lil calmer for u 🙏 deep breaths fr";
            break;
          case 'Calm':
            reminderMessage = "vibe check: peaceful af 😎 keep that energy";
            break;
        }
  
        if (reminderMessage) {
          await supabase.from('chats').insert([
            {
              user_id: user.user_id,
              sender: 'buddy',
              message: reminderMessage,
            }
          ]);
  
          console.log(`✅ Sent mood-based reminder to ${user.user_id}`);
        }
      }
    } catch (error) {
      console.error('Scheduled mood reminder error:', error);
    }
  });




app.listen(port, () => {
  console.log(`✅ Nova backend running at http://localhost:${port}`);
});
