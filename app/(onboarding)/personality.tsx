import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function PersonalityScreen() {
  const router = useRouter();
  const { name, gender, ethnicity } = useLocalSearchParams();
  const [personalityTags, setPersonalityTags] = useState<string[]>([]);

  const vibes = [
    '😌 Chill',
    '⚡ Energetic',
    '💖 Empathetic',
    '🤓 Nerdy',
    '😜 Goofy',
    '💪 Motivational',
    '🧘 Quiet Thinker',
    '🗣️ Talkative',
    '🎨 Creative',
    '🧠 Deep Thinker',
    '😂 Funny',
    '📚 Intellectual',
    '🌈 Optimistic',
    '🎧 Music Lover',
    '🧩 Mysterious',
    '🎮 Gamer',
  ];

  const toggleVibe = (vibe: string) => {
    if (personalityTags.includes(vibe)) {
      setPersonalityTags(personalityTags.filter((tag) => tag !== vibe));
    } else if (personalityTags.length < 5) {  // ⚡ Allow 5 selections max
      setPersonalityTags([...personalityTags, vibe]);
    }
  };

  const handleNext = () => {
    if (personalityTags.length < 1) return;

    router.push({
      pathname: '/(onboarding)/interests',
      params: {
        name,
        gender,
        ethnicity,
        personalityTags: JSON.stringify(personalityTags),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
  {/* Header */}
  <View style={styles.header}>
    <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
      <Feather name="chevron-left" size={28} color="#333" />
    </TouchableOpacity>
  </View>

  {/* Scrollable content */}
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Choose 5 Vibes ✨</Text>
    <Text style={styles.helperText}>Choose up to 5 personality vibes for your buddy</Text>

    {/* Selected tags */}
    <View style={styles.selectedTagsContainer}>
      {personalityTags.map((tag) => (
        <View key={tag} style={styles.selectedTag}>
          <Text style={styles.selectedTagText}>{tag.split(' ')[1]}</Text>
        </View>
      ))}
    </View>

    {/* Choices grid */}
    <View style={styles.vibesGrid}>
      {vibes.map((vibe) => {
        const emoji = vibe.split(' ')[0];
        const label = vibe.split(' ').slice(1).join(' ');
        const isSelected = personalityTags.includes(vibe);

        return (
          <TouchableOpacity
            key={vibe}
            style={[styles.vibeCircle, isSelected && styles.vibeCircleSelected]}
            onPress={() => toggleVibe(vibe)}
          >
            <Text style={styles.vibeEmoji}>{emoji}</Text>
            <Text style={styles.vibeLabel}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </ScrollView>

  {/* Persistent bottom button */}
  <View style={styles.bottomButtonContainer}>
    <TouchableOpacity
      onPress={handleNext}
      style={[
        styles.nextButton,
        personalityTags.length < 1 && styles.nextButtonDisabled,
      ]}
      disabled={personalityTags.length < 1}
    >
      <Text style={styles.nextButtonText}>Next ➔</Text>
    </TouchableOpacity>
  </View>
</SafeAreaView>
  );
}

const CARD_SIZE = (width - 96) / 3; // 3 circles per row, with margin

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff9f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    top: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff9f5',
    zIndex: 10,
  },
  backIcon: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
  },
  selectedTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 24,
  },
  selectedTag: {
    backgroundColor: '#F3EFFF', // soft baby blue chip
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8C8F0',     // matching border
  },
  selectedTagText: {
    color: '#8A6FCB',          // text color matches border
    fontWeight: '600',
  },
  vibesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  vibeCircle: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: '#fff',
    borderRadius: CARD_SIZE / 2,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  vibeCircleSelected: {
    borderColor: '#D8C8F0',    // light blue border
    backgroundColor: '#F3EFFF', // baby blue background
  },
  vibeEmoji: {
    fontSize: 32,
    marginBottom: 6,
  },
  vibeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  bottomButtonContainer: {
    padding: 16,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
nextButton: {
  backgroundColor: '#6C63FF',
  paddingVertical: 16,
  borderRadius: 30,
  alignItems: 'center',
  shadowColor: '#6C63FF',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 3,
},
nextButtonDisabled: {
  backgroundColor: '#ccc', // Greyed out when disabled
},
nextButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},

});
