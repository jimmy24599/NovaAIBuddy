import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import LottieView from 'lottie-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Online image URL


export default function EntryScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <LottieView
        source={require('@/assets/lottie/digital.json')} // ⬅️ You can change the lottie file here
        autoPlay
        loop
        style={styles.topImage}
      />
      <View style={styles.content}>
        <Text style={styles.title}>
        Design. <Text style={styles.highlight}>Connect.</Text> Grow Together.
        </Text>
        <Text style={styles.subtitle}>
          Chat, connect, and grow together with your new AI bestie.
        </Text>

        <Link href="/sign-up" asChild>
          <TouchableOpacity style={styles.getStartedButton}>
            <Text style={styles.getStartedButtonText}>Get started</Text>
          </TouchableOpacity>
        </Link>

        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <Link href="/sign-in" asChild>
            <TouchableOpacity>
              <Text style={styles.signInLink}>Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  topImage: {
    top:120,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.5, // Half the screen height, just like your screenshot
    resizeMode: 'cover',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  content: {
    paddingTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily:'poppins',
    color: '#000',
    marginBottom: 15,
  },
  highlight: {
    color: '#FF6F61', // soft coral pink like in the screenshot
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  getStartedButton: {
    backgroundColor: '#000', // black button
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: SCREEN_WIDTH - 80,
    alignItems: 'center',
    marginBottom: 20,
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  signInText: {
    color: '#555',
    fontSize: 14,
  },
  signInLink: {
    color: '#FF6F61',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
