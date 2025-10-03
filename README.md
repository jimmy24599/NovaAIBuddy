# 🌟 Nova AI Buddy

<div align="center">
  
  **Your Personalized AI Companion - Always There, Always Listening, Always Understanding**
  
  [![React Native](https://img.shields.io/badge/React%20Native-0.76.9-blue.svg)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-52.0.46-black.svg)](https://expo.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-LTS-green.svg)](https://nodejs.org/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Running the App](#-running-the-app)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Key Features Deep Dive](#-key-features-deep-dive)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌈 Overview

**Nova AI Buddy** is a next-generation AI companion app that creates deeply personalized, emotionally intelligent virtual friends. Unlike traditional chatbots, Nova's AI buddies remember your conversations, adapt to your mood, and proactively check in on you - just like a real friend would.

### Why Nova?

- 🎨 **Fully Customizable**: Design your buddy's appearance, personality, and interests
- 🧠 **Memory System**: Your buddy remembers facts about you and references them naturally
- 💭 **Mood Detection**: AI detects your emotional state and adapts its responses
- 🔔 **Proactive Check-ins**: Scheduled messages based on your activity and mood patterns
- 🎙️ **Voice Capabilities**: Text-to-speech integration for voice conversations
- 🎭 **Personality-Driven**: Each buddy has unique traits, interests, and communication style

---

## ✨ Features

### Core Features

- **🎨 AI Buddy Creation**
  - Custom avatar generation using OpenAI's DALL-E
  - Personalized appearance: gender, ethnicity, hairstyle, eye color, skin tone
  - Personality traits selection (funny, empathetic, adventurous, etc.)
  - Interest customization (music genres, movie genres, hobbies)

- **💬 Intelligent Conversations**
  - Context-aware responses powered by GPT-4o
  - Real-time mood detection (Happy, Sad, Stressed, Excited, Anxious, Bored, Angry, Calm)
  - Adaptive tone based on detected emotions
  - Natural, Gen Z-style communication

- **🧠 Memory & Learning**
  - Automatic fact extraction from conversations
  - Long-term memory storage
  - Contextual recall in future conversations
  - Smart summarization every 3 messages

- **🔔 Proactive Engagement**
  - Scheduled check-ins every 12 hours for inactive users
  - Daily mood-based reminders and encouragement
  - Personalized messages based on user facts
  - Context-aware follow-ups

- **🎙️ Voice Features** (In Development)
  - Text-to-speech with ElevenLabs integration
  - Speech-to-text with Google Cloud Speech API
  - Voice call mode with audio responses

- **🔐 Secure Authentication**
  - Clerk authentication integration
  - JWT token verification
  - Secure session management
  - OAuth support (Google, Apple, etc.)

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React Native** | 0.76.9 | Mobile app framework |
| **Expo** | ~52.0.46 | Development platform |
| **TypeScript** | 5.3.3 | Type safety |
| **Expo Router** | ~4.0.20 | File-based routing |
| **Clerk** | 2.9.14 | Authentication |
| **Axios** | 1.9.0 | HTTP requests |
| **React Navigation** | 7.0.14 | Navigation |
| **Lottie** | 7.2.2 | Animations |
| **Expo Speech Recognition** | 1.1.1 | Voice input |
| **Moti** | 0.30.0 | Animations |
| **Victory Native** | 41.17.1 | Data visualization |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | LTS | Runtime environment |
| **Express** | 5.1.0 | Web framework |
| **OpenAI API** | 4.96.0 | AI/ML capabilities |
| **Supabase** | 2.49.4 | Database & real-time |
| **AWS S3** | 3.796.0 | File storage |
| **ElevenLabs** | - | Text-to-speech |
| **Google Cloud Speech** | 7.0.1 | Speech-to-text |
| **node-cron** | 3.0.3 | Scheduled tasks |
| **Clerk Backend** | 1.30.0 | Auth verification |

### Services & APIs

- **OpenAI GPT-4o**: Conversational AI, mood detection, memory summarization
- **OpenAI DALL-E**: Avatar image generation
- **Supabase**: PostgreSQL database, real-time subscriptions
- **AWS S3**: Avatar and audio file storage
- **Clerk**: User authentication and management
- **ElevenLabs**: Text-to-speech voice generation
- **Google Cloud Speech**: Speech-to-text transcription

---

## 🏗 Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     MOBILE APP (React Native)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Screens │  │ Onboarding   │  │ Home/Chat    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                           │
                           ├─ Clerk Auth ─┐
                           │              │
                           ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│                     EXPRESS BACKEND                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Middleware: JWT Verification (Clerk)                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
│  ┌────────────┬──────────┼────────────┬─────────────────┐  │
│  │ Buddy      │ Chat     │ Avatar     │ Memory         │  │
│  │ Creation   │ Routes   │ Generation │ Summarization  │  │
│  └────────────┴──────────┴────────────┴─────────────────┘  │
│                           │                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Cron Jobs: Proactive Check-ins & Mood Reminders     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
           │               │               │
           ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ OpenAI   │    │ Supabase │    │  AWS S3  │
    │ GPT-4o   │    │ Database │    │ Storage  │
    │ DALL-E   │    │          │    │          │
    └──────────┘    └──────────┘    └──────────┘
```

### Data Flow

1. **User Authentication**: Clerk handles OAuth and JWT token generation
2. **Buddy Creation**: 
   - User customizes buddy → Backend generates DALL-E prompt → Image saved to S3
   - OpenAI creates intro message → Buddy data saved to Supabase
3. **Chat Flow**:
   - User message → Mood detection → Fetch user memory → GPT-4o response
   - Save messages → Trigger summarization after 3 messages
4. **Scheduled Tasks**:
   - Every 12 hours: Check inactive users → Generate personalized check-in
   - Daily: Analyze mood trends → Send mood-based encouragement

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (LTS version): [Download](https://nodejs.org/)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Git**: [Download](https://git-scm.com/)
- **iOS Simulator** (Mac only) or **Android Studio**

### Required API Keys

You'll need accounts and API keys from:

1. **Clerk** - [clerk.com](https://clerk.com) - Authentication
2. **OpenAI** - [platform.openai.com](https://platform.openai.com) - AI capabilities
3. **Supabase** - [supabase.com](https://supabase.com) - Database
4. **AWS S3** - [aws.amazon.com/s3](https://aws.amazon.com/s3/) - File storage
5. **ElevenLabs** (Optional) - [elevenlabs.io](https://elevenlabs.io) - Text-to-speech
6. **Google Cloud Speech** (Optional) - [cloud.google.com/speech](https://cloud.google.com/speech-to-text) - Speech-to-text

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/jimmy24599/NovaAIBuddy.git
cd NovaAIBuddy
```

### 2. Install Frontend Dependencies

   ```bash
   npm install
   ```

### 3. Install Backend Dependencies

   ```bash
cd backend
npm install
cd ..
```

---

## ⚙️ Environment Setup

### Frontend Environment Variables

Create a `.env` file in the root directory:

```env
# Clerk Authentication
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# Backend API URL (update for production)
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key_here

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AWS S3
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket_name
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# ElevenLabs (Optional - for voice features)
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Google Cloud (Optional - for speech-to-text)
GOOGLE_APPLICATION_CREDENTIALS=path_to_service_account_json
```

### Supabase Database Setup

Run these SQL commands in your Supabase SQL editor:

```sql
-- AI Buddies Table
CREATE TABLE ai_buddies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  gender TEXT,
  ethnicity TEXT,
  hair TEXT,
  style TEXT,
  eye_color TEXT,
  skin_tone TEXT,
  features TEXT,
  personality_tags TEXT[],
  music_genres TEXT[],
  movie_genres TEXT[],
  interests TEXT[],
  avatar_url TEXT,
  intro_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chats Table
CREATE TABLE chats (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  buddy_id UUID REFERENCES ai_buddies(id),
  sender TEXT NOT NULL,
  message TEXT NOT NULL,
  is_voice_call BOOLEAN DEFAULT FALSE,
  audio_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Memory Table
CREATE TABLE user_memory (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  facts TEXT[],
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Mood History Table
CREATE TABLE mood_history (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  mood TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_chats_buddy_id ON chats(buddy_id);
CREATE INDEX idx_mood_history_user_id ON mood_history(user_id);
CREATE INDEX idx_ai_buddies_user_id ON ai_buddies(user_id);
```

---

## 🏃 Running the App

### Start the Backend Server

```bash
cd backend
npm start
# For development with auto-reload:
# npm run dev
```

The backend will run on `http://localhost:3000`

### Start the Expo App

In a new terminal:

```bash
# From the root directory
npm start
```

### Run on Device/Simulator

- **iOS**: Press `i` in the terminal or scan QR code with Camera app
- **Android**: Press `a` in the terminal or scan QR code with Expo Go app
- **Web**: Press `w` in the terminal

---

## 📁 Project Structure

```
nova/
├── app/                          # Main app screens (Expo Router)
│   ├── (auth)/                   # Authentication flow
│   │   ├── index.tsx            # Auth landing page
│   │   ├── sign-in.tsx          # Sign in screen
│   │   └── sign-up.tsx          # Sign up screen
│   ├── (home)/                   # Main app screens
│   │   ├── index.tsx            # Home screen
│   │   ├── chat.tsx             # Chat interface
│   │   └── profile.tsx          # User profile
│   ├── (onboarding)/            # Buddy creation flow
│   │   ├── CreateBuddyFlow.tsx  # Name selection
│   │   ├── GenderEthnicity.tsx  # Appearance setup
│   │   ├── appearance.tsx       # Detailed appearance
│   │   ├── personality.tsx      # Personality traits
│   │   ├── interests.tsx        # Interests selection
│   │   └── ConfirmBuddy.tsx     # Final confirmation
│   ├── _layout.tsx              # Root layout
│   └── +not-found.tsx           # 404 screen
│
├── backend/                      # Express server
│   ├── routes/
│   │   ├── buddyChatRoute.js    # Chat endpoints
│   │   ├── createBuddy.js       # Buddy creation
│   │   ├── generateAvatar.js    # Avatar generation
│   │   ├── homeRoute.js         # Home data
│   │   └── summarizeMemory.js   # Memory processing
│   ├── server.js                # Main server file
│   └── package.json
│
├── components/                   # Reusable components
│   ├── AvatarCustomizationModal.tsx
│   ├── SignInWithOAuth.tsx
│   ├── ThemedText.tsx
│   ├── ThemedView.tsx
│   └── ui/                      # UI components
│
├── lib/                         # Utility libraries
│   └── supabase.ts             # Supabase client
│
├── utils/                       # Utility functions
│   └── tokenCache.ts           # Clerk token caching
│
├── assets/                      # Static assets
│   ├── images/
│   ├── fonts/
│   └── lottie/                 # Animation files
│
├── constants/                   # App constants
│   └── Colors.ts
│
├── hooks/                       # Custom React hooks
│   ├── useColorScheme.ts
│   └── useThemeColor.ts
│
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
└── README.md                   # This file
```

---

## 🔌 API Endpoints

### Authentication
All endpoints require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

### Buddy Management

#### `POST /create-buddy`
Create a new AI buddy

**Request Body:**
```json
{
  "name": "Luna",
  "gender": "Female",
  "ethnicity": "Asian",
  "hair": "Long black",
  "style": "Casual",
  "background": "Soft blue",
  "eyeColor": "Brown",
  "skinTone": "Medium",
  "features": "Glasses",
  "personality_tags": ["Funny", "Empathetic", "Adventurous"],
  "music_genres": ["Pop", "Hip-Hop"],
  "movie_genres": ["Comedy", "Drama"],
  "interests": ["Photography", "Reading", "Travel"]
}
```

**Response:**
```json
{
  "success": true,
  "avatar_url": "https://bucket.s3.region.amazonaws.com/avatars/...",
  "intro_message": "Hey! I'm Luna, nice to meet you! 👋"
}
```

### Chat

#### `GET /buddy-chat/history`
Fetch all chat messages for the authenticated user

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": 1,
      "user_id": "user_123",
      "buddy_id": "buddy_uuid",
      "sender": "user",
      "message": "Hey, how are you?",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ]
}
```

#### `GET /buddy-chat/history/:buddyId`
Fetch chat messages for a specific buddy

#### `POST /buddy-chat`
Send a message to your AI buddy

**Request Body:**
```json
{
  "message": "I'm feeling stressed about my exams",
  "buddyId": "buddy_uuid",
  "history": [
    { "role": "user", "content": "previous message" },
    { "role": "assistant", "content": "previous response" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "replies": [
    "hey I feel u, exams can be rough fr 😓",
    "wanna talk about it? I'm here for u"
  ]
}
```

#### `POST /buddy-call`
Voice call with AI buddy (returns audio URL)

### Memory

#### `POST /summarize-memory`
Trigger memory summarization from recent conversations

**Request Body:**
```json
{
  "buddyId": "buddy_uuid"
}
```

### Home

#### `GET /home`
Fetch user's buddies and recent activity

---

## 💾 Database Schema

### ai_buddies
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | TEXT | Clerk user ID |
| name | TEXT | Buddy name |
| gender | TEXT | Gender presentation |
| ethnicity | TEXT | Ethnicity |
| hair | TEXT | Hair style/color |
| style | TEXT | Clothing style |
| eye_color | TEXT | Eye color |
| skin_tone | TEXT | Skin tone |
| features | TEXT | Additional features |
| personality_tags | TEXT[] | Personality traits |
| music_genres | TEXT[] | Music preferences |
| movie_genres | TEXT[] | Movie preferences |
| interests | TEXT[] | Hobbies/interests |
| avatar_url | TEXT | S3 avatar URL |
| intro_message | TEXT | First message |
| created_at | TIMESTAMP | Creation timestamp |

### chats
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| user_id | TEXT | User ID |
| buddy_id | UUID | Foreign key to ai_buddies |
| sender | TEXT | 'user' or 'buddy' |
| message | TEXT | Message content |
| is_voice_call | BOOLEAN | Voice message flag |
| audio_url | TEXT | S3 audio URL |
| created_at | TIMESTAMP | Message timestamp |

### user_memory
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| user_id | TEXT | User ID |
| facts | TEXT[] | Extracted facts |
| updated_at | TIMESTAMP | Last update |

### mood_history
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| user_id | TEXT | User ID |
| mood | TEXT | Detected mood |
| timestamp | TIMESTAMP | Detection time |

---

## 🔍 Key Features Deep Dive

### 1. AI Avatar Generation

The app uses a two-step prompt engineering process:
1. **Prompt Generation**: GPT-4o creates a detailed DALL-E prompt based on user selections
2. **Image Generation**: DALL-E generates a hyper-realistic portrait
3. **Storage**: Image saved to AWS S3 with public URL

### 2. Mood-Adaptive Conversations

Each message is analyzed for emotional content:
- **Detection**: GPT-4o classifies mood into 8 categories
- **Adaptation**: Response tone adjusts to match/support the mood
- **History**: Moods tracked in database for trend analysis

### 3. Memory System

The app implements a smart memory system:
- **Extraction**: Every 3 messages, GPT-4o extracts key facts
- **Storage**: Facts stored as array in `user_memory` table
- **Recall**: Facts injected into system prompt for context-aware responses

### 4. Scheduled Proactive Check-ins

Two cron jobs maintain engagement:

**12-Hour Check-ins:**
- Targets users with no recent activity
- Generates personalized messages using stored facts
- Fallback to generic check-in if no facts available

**Daily Mood Reminders:**
- Analyzes last 5 mood entries
- Identifies dominant mood
- Sends supportive message matching mood trend

### 5. Voice Features (Beta)

The app supports voice interactions:
- **Input**: Google Cloud Speech-to-Text
- **Output**: ElevenLabs text-to-speech
- **Storage**: Audio files stored on S3
- **Playback**: Native audio player in React Native

---

## 📸 Screenshots

> **Note**: Add screenshots of your app here once available

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Test on both iOS and Android before submitting
- Update documentation for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

**Project Maintainer**: [Jimmy](https://github.com/jimmy24599)

**Repository**: [https://github.com/jimmy24599/NovaAIBuddy](https://github.com/jimmy24599/NovaAIBuddy)

**Issues**: [https://github.com/jimmy24599/NovaAIBuddy/issues](https://github.com/jimmy24599/NovaAIBuddy/issues)

---

## 🙏 Acknowledgments

- **OpenAI** for GPT-4o and DALL-E APIs
- **Supabase** for backend infrastructure
- **Clerk** for authentication services
- **Expo** team for the amazing development platform
- **React Native** community for continuous support

---

## 🗺️ Roadmap

### Upcoming Features

- [ ] Multi-buddy support (switch between different AI companions)
- [ ] Group chats with multiple buddies
- [ ] Advanced mood analytics dashboard
- [ ] Custom voice selection for each buddy
- [ ] Image sharing in chats
- [ ] Buddy personality evolution based on interactions
- [ ] Push notifications for proactive messages
- [ ] Dark mode optimization
- [ ] Offline mode with message queuing
- [ ] Export conversation history

### Known Issues

- Voice features require additional API setup
- ElevenLabs integration needs voice ID configuration
- Backend URL hardcoded in some files (needs environment variable)

---

<div align="center">

**Made with ❤️ using React Native, OpenAI, and a lot of coffee ☕**

⭐ Star this repo if you find it helpful!

</div>
