import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SignInWithOAuth from '../../components/SignInWithOAuth';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/(home)');
      } else {
        console.log(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      setErrorMessage(
        "Hmm... Something didn't feel right. Can you double-check your email and password?"
      );
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
        style={{
          flex: 1,
          paddingHorizontal: 24,
          justifyContent: 'center',
        }}
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
          Your AI buddy is excited to see you again.
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
            placeholder="Password"
            placeholderTextColor="#fff"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={{ flex: 1, paddingVertical: 14, color: '#fff' }}
          />
          <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          onPress={onSignInPress}
          style={{
            backgroundColor: '#fff',
            marginTop: 24,
            paddingVertical: 14,
            borderRadius: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#f2709c' }}>Sign In</Text>
        </TouchableOpacity>

        <Text style={{ textAlign: 'center', color: '#fff', marginVertical: 12 }}>or</Text>

        <SignInWithOAuth />

        <View style={{ marginTop: 24, alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>First time here?</Text>
          <Link href="/sign-up">
            <Text style={{ color: '#fff', fontWeight: 'bold', textDecorationLine: 'underline' }}>
              Create an account
            </Text>
          </Link>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
