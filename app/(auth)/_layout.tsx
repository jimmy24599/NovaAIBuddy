import { Stack, useRouter } from "expo-router";
import { SignedIn, useAuth, useUser } from '@clerk/clerk-expo';
import { useEffect } from "react";




export default function AuthLayout() {


  const router = useRouter();


const { isSignedIn, isLoaded: authLoaded } = useAuth();
const { user, isLoaded: userLoaded } = useUser();

const clerkLoaded = authLoaded && userLoaded;

useEffect(() => {
  if (clerkLoaded && isSignedIn) {
    router.replace("/(home)");
  }
}, [clerkLoaded, isSignedIn]);



  return (
    <Stack>
    <Stack.Screen
      name="index"
      options={{
        title: 'Welcome!',
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="sign-in"
      options={{
        title: 'Sign-In',
        headerBackTitle: 'Return',
        headerTintColor: 'black',
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="sign-up"
      options={{
        title: 'Sign Up',
        headerBackTitle: 'Return',
        headerTintColor: 'black',
        headerShown: false,
      }}
    />
  </Stack>
  )
}