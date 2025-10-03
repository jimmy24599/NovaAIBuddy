import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Dialog from "react-native-dialog";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Row */}
      <View style={styles.header}>
        
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#222" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.headerTitle}>Profile</Text>

        {/* Logout Button */}
        <TouchableOpacity onPress={() => setDialogOpen(true)} style={styles.logoutButton}>
          <Image
            source={{ uri: 'https://novabuddy.s3.eu-north-1.amazonaws.com/log-out.png' }} 
            style={styles.logoutImage}
          />
        </TouchableOpacity>

      </View>

      {/* Confirm Dialog */}
      <Dialog.Container visible={dialogOpen}>
        <Dialog.Title>Sign out</Dialog.Title>
        <Dialog.Description>Are you sure you want to sign out?</Dialog.Description>
        <Dialog.Button label="Cancel" onPress={() => setDialogOpen(false)} />
        <Dialog.Button
          label="Sign out"
          onPress={async () => {
            await signOut();
            setDialogOpen(false);
          }}
        />
      </Dialog.Container>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    color: '#222',
  },
  logoutButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutImage: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
});

