import React from 'react'
import * as WebBrowser from 'expo-web-browser'
import { Text, View, Button, TouchableOpacity, StyleSheet } from 'react-native'
import { Link } from 'expo-router'
import { useOAuth } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { AntDesign } from '@expo/vector-icons'

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

const SignInWithOAuth = () => {
  useWarmUpBrowser()

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/dashboard', { scheme: 'myapp' }),
      })

      if (createdSessionId) {
        setActive!({ session: createdSessionId })
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', err)
    }
  }, [])

  return (
    
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <AntDesign name="google" size={24} color="black" />
      <Text style={styles.buttonText}> Continue with Google</Text>
    </TouchableOpacity>
  )
}
export default SignInWithOAuth

const styles = StyleSheet.create({
button: {
  backgroundColor: '#FFF',
  paddingVertical: 15,
  paddingHorizontal: 30,
  borderRadius: 25,
  marginBottom: 10,
  width: '100%',
  alignItems: 'center',
  
  flexDirection: 'row', // Add this to make the button content row-based
  justifyContent: 'center', // Center the icon and text together
},
buttonText: {
  color: '#000',
  fontSize: 16,
  fontWeight: 'bold',
  marginLeft: 10, // Add margin to create space between icon and text
},
})