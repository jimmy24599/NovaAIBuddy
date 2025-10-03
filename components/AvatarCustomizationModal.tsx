import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, SafeAreaView } from 'react-native';

const steps = [
  { key: 'gender', title: 'Choose a Gender', options: ['Male', 'Female'] },
  { key: 'ethnicity', title: 'Choose an Ethnicity', options: ['Arab', 'Asian', 'African', 'White', 'Latin', 'Mixed'] },
  { key: 'hair', title: 'Choose a Hair Style', options: ['Short', 'Long', 'Curly', 'Straight', 'Bald'] },
  { key: 'style', title: 'Choose a Style', options: ['Casual', 'Formal', 'Minimalist', 'Futuristic', 'Streetwear'] },
];

const AvatarCustomizationModal = ({ visible, onClose, onComplete }: any) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState<any>({});

  const current = steps[stepIndex];

  const handleSelect = (option: string) => {
    setSelections({ ...selections, [current.key]: option });
  };

  const next = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onComplete(selections);
      onClose();
    }
  };

  const back = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    } else {
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>{current.title}</Text>
        <FlatList
          data={current.options}
          numColumns={2}
          keyExtractor={(item) => item}
          contentContainerStyle={{ gap: 12 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              style={[
                styles.option,
                selections[current.key] === item && styles.optionSelected,
              ]}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          )}
        />

        <View style={styles.footer}>
          <TouchableOpacity onPress={back}>
            <Text style={styles.navBtn}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={next}>
            <Text style={styles.navBtn}>{stepIndex === steps.length - 1 ? 'Finish' : 'Next'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AvatarCustomizationModal;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  option: {
    backgroundColor: '#eee',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    margin: 4,
  },
  optionSelected: {
    backgroundColor: '#f2709c',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  navBtn: {
    fontSize: 16,
    color: '#f2709c',
    fontWeight: 'bold',
  },
});
