import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { MotiView } from 'moti';

export default function AppearanceScreen() {
  const router = useRouter();
  const {
    name,
    gender,
    ethnicity,
    personalityTags,
    interests,
    musicGenres,
    movieGenres,
  } = useLocalSearchParams();

  const [hair, setHair] = useState('');
  const [style, setStyle] = useState('');
  const [background, setBackground] = useState('');
  const [eyeColor, setEyeColor] = useState('');
  const [skinTone, setSkinTone] = useState('');
  const [features, setFeatures] = useState('');

  const getHairOptions = (gender: string) => {
    if (gender === 'Male') {
      return ['Short', 'Curly', 'Straight', 'Buzzcut', 'Wavy', 'Bald'];
    } else if (gender === 'Female') {
      return ['Long', 'Curly', 'Straight', 'Wavy', 'Braided', 'Ponytail'];
    } else {
      return ['Short', 'Long', 'Curly', 'Straight', 'Wavy']; // fallback if gender missing
    }
  };


  const styleOptions = [
    'Casual', 'Minimalist', 'Futuristic', 'Streetwear',
    'Sporty', 'Elegant', 'Vintage', 'Preppy', 'Bohemian'
  ];
  
  const bgColors = ['Baby Blue', 'Pastel Pink', 'Soft Cream', 'Mint Green', 'Lavender'];
  const eyeColorOptions = ['Brown', 'Blue', 'Hazel', 'Green', 'Gray', 'Amber', 'Violet', 'Black'];
  const skinTones = ['Fair', 'Light', 'Medium', 'Olive', 'Tan', 'Brown', 'Dark', 'Ebony'];

  const handleNext = () => {
    if (!hair || !style || !background || !eyeColor || !skinTone) {
      alert('Please complete all appearance fields.');
      return;
    }

    router.push({
      pathname: '/(onboarding)/ConfirmBuddy',
      params: {
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
      },
    });
  };

  const renderChips = (title: string, options: string[], selected: string, setter: any) => (
    <View style={{ marginBottom: 32 }}>
      <View style={styles.sectionHeader}>
        <Text style={styles.section}>{title}</Text>
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
            <TouchableOpacity onPress={() => setter(item)}>
              <MotiView
                style={[styles.chip, selected === item && styles.chipSelected]}
                animate={{
                  scale: selected === item ? 1.05 : 1,
                  backgroundColor: selected === item ? '#6C63FF' : '#f1f1f5',
                  borderColor: selected === item ? '#6C63FF' : '#ddd',
                }}
                transition={{
                  type: 'timing',
                  duration: 200,
                }}
              >
                <Text
                  style={[
                    styles.chipText,
                    selected === item && styles.chipTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </MotiView>
            </TouchableOpacity>
          </MotiView>
        ))}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff9f5' }}>
      {/* Persistent Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Feather name="chevron-left" size={26} color="#333" />
      </TouchableOpacity>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Final touches for your buddy’s look ✨</Text>

        {renderChips('💇 Hair Type', getHairOptions(gender as string), hair, setHair)}
        {renderChips('👕 Style', styleOptions, style, setStyle)}
        {renderChips('👁️ Eye Color', eyeColorOptions, eyeColor, setEyeColor)}
        {renderChips('🧴 Skin Tone', skinTones, skinTone, setSkinTone)}
        {renderChips('🎨 Background Color', bgColors, background, setBackground)}

        <Text style={styles.section}>✨ Optional Details</Text>
        <TextInput
          placeholder="Facial features (e.g. freckles, soft jawline)"
          value={features}
          onChangeText={setFeatures}
          style={styles.input}
          placeholderTextColor="#aaa"
        />

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
    fontFamily: 'Poppins-Bold',
    color: '#333',
    textAlign: 'left',
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  section: {
    fontSize: 22,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#444',
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
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
    fontFamily: 'Poppins-Regular',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 16,
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 40,
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
});
