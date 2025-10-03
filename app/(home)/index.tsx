import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';


const BACKEND_URL = 'http://localhost:3000/home';

export default function HomeScreen() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  //Fetch memories
  const [memories, setMemories] = useState<string[]>([]);

  //Fetch buddies
  const [buddies, setBuddies] = useState<any[]>([]);

  //Fetch Memories
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      const token = await getToken();
      try {
        const buddyRes = await axios.get(`${BACKEND_URL}/buddy-info`, { headers: { Authorization: `Bearer ${token}` } });
        const memoryRes = await axios.get(`${BACKEND_URL}/user-memory`, { headers: { Authorization: `Bearer ${token}` } });
  
        const buddiesList = buddyRes.data.buddies;
        const facts = memoryRes.data.facts;
  
        setBuddies(buddiesList || []);
        setMemories(facts || []);
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };
    fetchData();
  }, [user]);
  

  

  const handleBuddyPress = (item: any) => {
    router.push({
      pathname: '/chat',
      params: {
        buddyId: item.id,
        buddyName: item.name,
        buddyAvatar: item.avatar_url,
      },
    });
  };

  const handleCreateBuddy = () => {
    console.log('Create new buddy');
    router.push('/(onboarding)/CreateBuddyFlow');
  };
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const renderBuddyCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.buddyCard} onPress={() => handleBuddyPress(item)}>
      <Image source={{ uri: item.avatar_url }} style={styles.buddyImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.darkOverlay}
        />
      <View style={styles.buddyInfo}>
        <Text style={styles.buddyName}>{item.name}</Text>
        
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
        {/* Left side: Greeting */}
        <View>
            <Text style={styles.greetingText}>{getGreeting()} 👋</Text>
            <Text style={styles.greetingSubText}>{user?.firstName || 'Friend'}</Text>
        </View>

        {/* Right side: Buttons */}
        <View style={styles.headerButtons}>
            {/* Notifications button */}
            <TouchableOpacity style={styles.iconButton}>
            <Image
                source={{ uri: '' }} 
                style={styles.iconImage}
            />
            </TouchableOpacity>

            {/* Profile button */}
            <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')}>
            <Image
                source={{ uri:'' }}
                style={styles.profileImage}
            />
            </TouchableOpacity>
        </View>
        </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.title}>Your Space to Connect, Chat, and Grow 🌟</Text>
        <Text style={styles.subtitle}>Start a conversation, build memories, and vibe with your personal AI buddy.</Text>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>Your Buddies</Text>

        {/* Buddy Cards */}
        <View style={styles.buddySection}>
          <FlatList
            horizontal
            data={
              buddies.length < 3
                ? [...buddies, { id: 'new', isNew: true }]
                : buddies
            }
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
                item.isNew ? (
                  <TouchableOpacity style={styles.newBuddyCard} onPress={handleCreateBuddy}>
                    <Image
                      source={{ uri: '' }} //
                      style={styles.plusImage}
                    />
                    <Text style={styles.createBuddyText}>Create Buddy</Text>
                  </TouchableOpacity>
                ) : (
                  renderBuddyCard({ item })
                )
              }
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
          />
        </View>

        {/* Recent Memories Section */}
        {memories.length > 0 && (
        <View style={styles.memoriesSection}>
            <Text style={styles.sectionTitle}>Recent Memories 🧠</Text>
            <View style={styles.memoriesCard}>
            {memories.slice(0, 5).map((memory, index) => (
                <Text key={index} style={styles.memoryItem}>• {memory}</Text>
            ))}
            </View>
        </View>
        )}

         {/* Mood Check-In Section */}
    <View style={styles.moodSection}>
        <Text style={styles.sectionTitle}>How are you feeling today?</Text>
        <View style={styles.moodRow}>
            {['😃', '😐', '😔', '😡', '😴'].map((emoji, index) => (
            <TouchableOpacity key={index} style={styles.moodButton}>
                <Text style={styles.moodEmoji}>{emoji}</Text>
            </TouchableOpacity>
            ))}
        </View>
    </View>
    {/* Today's Tip Section */}
    <View style={styles.tipSection}>
        <Text style={styles.sectionTitle}>Today's Tip ✨</Text>
        <View style={styles.tipCard}>
            <Text style={styles.tipText}>
            Remember to take small breaks and vibe with yourself today! 🌟
            </Text>
        </View>
    </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { padding: 20 },
  title: { fontSize: 30, fontWeight: 'bold', color: '#222', marginBottom: 10, fontFamily:'poppins' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24, fontFamily:'poppins'  },
  sectionTitle: { fontSize: 24, fontWeight: '600', color: '#222', marginBottom: 16, fontFamily:'poppins' },
  buddySection: { marginTop: 0 },
  buddyCard: {
    width: 200,  
    height: 240,
    backgroundColor: '#FFF',
    borderRadius: 28, 
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  buddyImage: {
    ...StyleSheet.absoluteFillObject, // 👈 Full size inside card
    resizeMode: 'cover',
  },
  
  buddyInfo: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  buddyName: {
    fontFamily:'poppins',
    fontSize: 24,
    fontWeight: 'bold',
    bottom: 2,
    color: '#FFF', // 🔥 White text
  },
  buddyMessage: {
    fontSize: 14,
    fontFamily:'poppins',
    color: '#EEE', // 🔥 Light grey text
    marginTop: 4,
  },
  newBuddyCard: {
    width: 200,
    height: 240,
    backgroundColor: '#fff',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2, // << ADD stronger border
    borderColor: '#E0E0E0', // << Light but visible border
    shadowColor: '#000',
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 }, // << Push shadow more down
    elevation: 6, // << stronger elevation for Android
  },
  plusImage: {
    width: 70,
    height: 70,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  
  createBuddyText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'poppins',
  },
  plusSign: {
    fontSize: 45,
    fontFamily:'poppins',
    color: '#ccc', // 👈 grey plus sign too
    fontWeight: 'bold',
  },
  darkOverlay: {
    position: 'absolute',
    bottom: 0,
    height: '30%', // More natural fade
    width: '100%',
  },
  //Header
  header: {
    padding:20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#ddd', // fallback in case image fails
  },
  
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  headerIconButtonText: {
    fontSize: 18,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
  
  greetingSubText: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
  },
  
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
    marginLeft: 12,
  },
  
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  moodSection: {
    marginTop: 32,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  moodButton: {
    backgroundColor: '#F7F7F7',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  moodEmoji: {
    fontSize: 28,
  },
  tipSection: {
    marginTop: 32,
  },
  tipCard: {
    backgroundColor: '#FFF8E7',
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  tipText: {
    fontSize: 16,
    fontFamily: 'Poppins',
    color: '#333',
  },
  memoriesSection: {
    marginTop: 32,
  },
  memoriesCard: {
    backgroundColor: '#F0F8FF',
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  memoryItem: {
    fontSize: 16,
    fontFamily: 'Poppins',
    color: '#333',
    marginBottom: 8,
  },
  
  
});
