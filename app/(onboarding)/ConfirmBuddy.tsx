import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import axios from 'axios';
import LottieView from 'lottie-react-native';

const BACKEND_URL = 'http://localhost:3000/create-buddy'; 

export default function ConfirmBuddyScreen() {
  const router = useRouter();
  const { getToken } = useAuth();

  const {
    name,
    gender,
    ethnicity,
    personalityTags,
    interests,
    musicGenres,
    movieGenres,
    hair,
    style,
    background,
    eyeColor,
    skinTone,
    features,
  } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [introMessage, setIntroMessage] = useState('');

  useEffect(() => {
    const createBuddy = async () => {
      try {
        const token = await getToken();

        const response = await axios.post(
            BACKEND_URL,
            {
              name,
              gender,
              ethnicity,
              hair,
              style,
              background,
              eyeColor,
              skinTone,
              features,
              personality_tags: JSON.parse(personalityTags as string),
              interests: JSON.parse(interests as string),
              music_genres: JSON.parse(musicGenres as string),
              movie_genres: JSON.parse(movieGenres as string),
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        if (response.data.success) {
          setAvatarUrl(response.data.avatar_url);
          setIntroMessage(response.data.intro_message);
        } else {
          alert('Failed to create buddy.');
          router.replace('/(auth)'); // fallback
        }
      } catch (err: any) {
        console.error('Buddy creation error:', err.response?.data || err.message);
        alert('Something went wrong.');
        router.replace('/(auth)');
      } finally {
        setLoading(false);
      }
    };

    createBuddy();
  }, []);

  const handleStartChat = () => {
    router.replace('/(home)/chat');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.lottieWrapper}>
          <LottieView
            source={require('@/assets/lottie/loading.json')} 
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
        <Text style={styles.loadingText}>Creating your buddy...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Meet your AI buddy 🎉</Text>

      {avatarUrl && (
        <Image
          source={{ uri: avatarUrl }}
          style={{ width: 250, height: 250, borderRadius: 125, marginBottom: 24 }}
        />
      )}

      {introMessage && (
        <Text style={styles.intro}>
          {introMessage}
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleStartChat}>
        <Text style={styles.buttonText}>Start Chatting ➔</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#f5f7fa', flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, color: '#333', textAlign: 'center' },
  intro: { fontSize: 18, fontStyle: 'italic', textAlign: 'center', marginBottom: 32, color: '#666' },
  button: { backgroundColor: '#4a90e2', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  lottieWrapper: {
    width: '100%',
    height: 300,
    marginBottom: 24,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    fontWeight: '500',
  },
});
