import { Redirect, Stack } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo'


export default function HomeLayout() {
  const { isSignedIn } = useAuth();

  const { user: clerkUser } = useUser();



  if (!isSignedIn || !clerkUser) {    
    return <Redirect href="/(auth)"/>;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
