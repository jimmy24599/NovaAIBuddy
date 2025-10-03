import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function CreateBuddyFlow() {
  const [name, setName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    if (name.trim().length < 2) {
      setModalVisible(true); // show modal instead of alert
      return;
    }
    router.push({ pathname: '/(onboarding)/GenderEthnicity', params: { name } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
  {/* Header - stays on top always */}
  <View style={styles.header}>
    <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
      <Feather name="chevron-left" size={28} color="#333" />
    </TouchableOpacity>
  </View>

  {/* Content - inside KeyboardAvoidingView */}
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    style={styles.flexContainer}
  >
    <ScrollView contentContainerStyle={styles.inner}>
      {/* Title and input */}
      <Text style={styles.title}>First things first...</Text>
      <Text style={styles.subtitle}>What do you want to name your AI buddy?</Text>

      <TextInput
        placeholder="e.g., Luna, Alex, Jamie"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#aaa"
        style={styles.input}
      />

      <TouchableOpacity onPress={handleNext} style={styles.button}>
        <Text style={styles.buttonText}>Next ➔</Text>
      </TouchableOpacity>
    </ScrollView>
  </KeyboardAvoidingView>

  {/* Modal for errors */}
  <Modal
    transparent={true}
    visible={modalVisible}
    animationType="fade"
    onRequestClose={() => setModalVisible(false)}
  >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Oops 😬</Text>
            <Text style={styles.modalText}>Please enter a valid name (at least 2 characters).</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9f5',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  flexContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff9f5',
  },
  inner: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    bottom:30,
  },
    lottie: {
    width: width * 0.85,
    height: 240,
    marginBottom: -12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    color: '#666',
    textAlign: 'center',
    marginBottom: 28,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 24,
  },
  button: {
    width: '100%',
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
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

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBox: {
    width: 300,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 12,
    color: '#333',
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  modalButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    top:10,
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
  

});
