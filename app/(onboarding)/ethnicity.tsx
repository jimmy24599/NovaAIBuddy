import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function EthnicityScreen() {
  const router = useRouter();
  const { name, gender } = useLocalSearchParams();
  const [ethnicity, setEthnicity] = useState('');

  const ethnicities = ['Arab', 'White', 'Black', 'Asian', 'Hispanic', 'Mixed'];

  const handleNext = () => {
    if (!ethnicity) return;

    router.push({
      pathname: '/(onboarding)/personality',
      params: { name, gender, ethnicity },
    });
  };

  const renderCards = (items: string[], selected: string, setter: any) => (
    <View style={styles.cardsGrid}>
      {items.map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => setter(item)}
          style={[
            styles.card,
            selected === item && styles.cardSelected,
          ]}
        >
          <Text
            style={[
              styles.cardText,
              selected === item && styles.cardTextSelected,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Feather name="chevron-left" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🌍 Choose Ethnicity</Text>

        {renderCards(ethnicities, ethnicity, setEthnicity)}

        <TouchableOpacity onPress={handleNext} style={styles.button}>
          <Text style={styles.buttonText}>Next ➔</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_WIDTH = (width - 72) / 2;

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
    alignSelf: 'flex-start',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    bottom: 35,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 32,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardSelected: {
    borderColor: '#D8C8F0',
    backgroundColor: '#F3EFFF',
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  cardTextSelected: {
    color: '#8A6FCB',
    fontWeight: '700',
  },
  button: {
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
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
