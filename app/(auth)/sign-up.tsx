import * as React from 'react';
import {
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter, Link } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Something went wrong.');
      setModalVisible(true);
    }
  };

  
  const onPressVerify = async () => {
    if (!isLoaded) return;
  
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
  
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/(home)/chat');
      } else {
        // Just in case: handle incomplete flow (usually won't happen in Expo)
        setErrorMessage("Couldn't complete sign-up. Please try again.");
        setModalVisible(true);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Invalid code. Try again.');
      setModalVisible(true);
    }
  };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={['#f6d365', '#fda085']}
        style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center' }}
      >
        {/* Error Modal */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <View
              style={{
                width: 300,
                backgroundColor: '#fff',
                padding: 24,
                borderRadius: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>Oops 😬</Text>
              <Text style={{ textAlign: 'center', marginBottom: 20 }}>{errorMessage}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  backgroundColor: '#ff6f61',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: '#fff' }}>Try Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {!pendingVerification ? (
          <>
            {/* Nova Branding */}
            <Text
              style={{
                fontSize: 40,
                fontWeight: '900',
                textAlign: 'center',
                color: '#fff',
              }}
            >
              👋 Meet <Text style={{ color: '#fff' }}>Nova</Text>
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '500',
                textAlign: 'center',
                color: '#fff',
                marginBottom: 30,
                marginTop: 10,
              }}
            >
              Let’s get to know each other. Sign up to meet Nova.
            </Text>

            {/* Email Input */}
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 16,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                marginBottom: 16,
              }}
            >
              <Ionicons name="mail-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#fff"
                autoCapitalize="none"
                keyboardType="email-address"
                value={emailAddress}
                onChangeText={(text) => setEmailAddress(text.trim())}
                style={{ flex: 1, paddingVertical: 14, color: '#fff' }}
              />
            </View>

            {/* Password Input */}
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 16,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
              }}
            >
              <Ionicons name="lock-closed-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Create a password"
                placeholderTextColor="#fff"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{ flex: 1, paddingVertical: 14, color: '#fff' }}
              />
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={onSignUpPress}
              style={{
                backgroundColor: '#fff',
                marginTop: 24,
                paddingVertical: 14,
                borderRadius: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#f2709c' }}>Sign Up</Text>
            </TouchableOpacity>

            <View style={{ marginTop: 24, alignItems: 'center' }}>
              <Text style={{ color: '#fff' }}>Already have an account?</Text>
              <Link href="/sign-in">
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    textDecorationLine: 'underline',
                  }}
                >
                  Sign in here
                </Text>
              </Link>
            </View>
          </>
        ) : (
          <>
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                textAlign: 'center',
                fontWeight: '600',
                marginBottom: 20,
              }}
            >
              Nova just sent you a code. Enter it below to continue.
            </Text>

            <TextInput
              style={{
                padding: 20,
                backgroundColor: '#ffffff20',
                borderRadius: 14,
                borderColor: '#fff',
                borderWidth: 0.8,
                color: '#fff',
              }}
              placeholder="Enter the code"
              placeholderTextColor="#fff"
              value={code}
              onChangeText={setCode}
            />

            <TouchableOpacity
              onPress={onPressVerify}
              style={{
                backgroundColor: '#fff',
                paddingVertical: 14,
                borderRadius: 16,
                marginTop: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#f2709c', fontSize: 16, fontWeight: 'bold' }}>
                Verify & Continue
              </Text>
            </TouchableOpacity>
          </>
        )}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
