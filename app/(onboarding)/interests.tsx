import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { MotiView } from 'moti'; 


export default function InterestsScreen() {
  const router = useRouter();
  const { name, gender, ethnicity, personalityTags } = useLocalSearchParams();

  const [interests, setInterests] = useState<string[]>([]);
  const [musicGenres, setMusicGenres] = useState<string[]>([]);
  const [movieGenres, setMovieGenres] = useState<string[]>([]);

  const interestOptions = ['🎮 Gaming', '📚 Books', '💻 Coding', '👗 Fashion', '🏋️ Fitness', '🍕 Food', '🧠 Psychology', '🌍 Travel', '🎨 Art', '🧘‍♂️ Spirituality', '🌀 Deep Talks'];
  const musicOptions = ['Hip hop', 'Indie', 'K-Pop', 'R&B', 'EDM', 'Classical', 'Jazz', 'Rock', 'Lo-fi'];
  const movieOptions = ['Sci-fi', 'Romance', 'Mystery', 'Horror', 'Animated', 'Drama', 'Action', 'Comedy'];

  //Bounce
  const [bounceLimit, setBounceLimit] = useState(false);


  const toggle = (
    list: string[],
    item: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else if (list.length < 4) {
      setter([...list, item]);
    } else {
      // ✨ trigger bounce animation
      setBounceLimit(true);
      setTimeout(() => setBounceLimit(false), 300); 
    }
  };

  const handleNext = () => {
    if (interests.length === 0 || musicGenres.length === 0 || movieGenres.length === 0) {
      // you could show a nice modal later instead of silent return
      return;
    }
  
    router.push({
      pathname: '/(onboarding)/appearance',
      params: {
        name,
        gender,
        ethnicity,
        personalityTags,
        interests: JSON.stringify(interests),
        musicGenres: JSON.stringify(musicGenres),
        movieGenres: JSON.stringify(movieGenres),
      },
    });
  };

  const renderChips = (
    title: string,
    options: string[],
    selected: string[],
    setter: any
  ) => (
    <View style={{ marginBottom: 32 }}>
  <MotiView
    animate={{
      scale: bounceLimit ? 1.05 : 1,
    }}
    transition={{
      type: 'spring',
      stiffness: 300,
      damping: 10,
    }}
  >
    <View style={styles.sectionHeader}>
      <Text style={styles.section}>{title}</Text>
      <Text style={styles.sectionHelper}>{selected.length} / 4</Text>
    </View>

    <View style={styles.chipsContainer}>
      {options.map((item, index) => (
        <MotiView
          key={item}
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: 'timing',
            duration: 300,
            delay: index * 30,
          }}
        >
          <TouchableOpacity onPress={() => toggle(selected, item, setter)}>
            <MotiView
              style={[styles.chip, selected.includes(item) && styles.chipSelected]}
              animate={{
                scale: selected.includes(item) ? 1.05 : 1,
                backgroundColor: selected.includes(item) ? '#6C63FF' : '#f1f1f5',
                borderColor: selected.includes(item) ? '#6C63FF' : '#ddd',
              }}
              transition={{
                type: 'timing',
                duration: 200,
              }}
            >
              <Text
                style={[
                  styles.chipText,
                  selected.includes(item) && styles.chipTextSelected,
                ]}
              >
                {item}
              </Text>
            </MotiView>
          </TouchableOpacity>
        </MotiView>
      ))}
    </View>
  </MotiView>
</View>
  );
  

  return (
    <View style={{ flex: 1, backgroundColor: '#fff9f5' }}>
      {/* Persistent Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Feather name="chevron-left" size={26} color="#333" />
      </TouchableOpacity>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Let’s get to know what you enjoy ✨</Text>
        <Text style={styles.helperText}>Pick at least 1 from each category.</Text>

        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 100 }}
        >
           {renderChips('🧩 Interests & Hobbies', interestOptions, interests, setInterests)}
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 300 }}
        >
          {renderChips('🎵 Favorite Music Genres', musicOptions, musicGenres, setMusicGenres)}
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 500 }}
        >
          {renderChips('🎬 Favorite Movie Genres', movieOptions, movieGenres, setMovieGenres)}
        </MotiView>

        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next ➔</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  container: {
    paddingTop: 120, 
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#333',
    textAlign: 'left',
    fontFamily: 'Poppins-Bold',
    marginBottom: 12,
  },
  helperText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#888',
    marginBottom: 24,
    textAlign: 'left',
  },
  section: {
    fontSize: 25,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#444',
    marginTop: 28,
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    justifyContent: 'center',
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#f1f1f5',
    margin: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  chipSelected: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  chipText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    fontFamily: 'Poppins-Regular',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  nextButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 48,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionHelper: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },
});
