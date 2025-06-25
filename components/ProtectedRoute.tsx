import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { userAuth } from '../Context/authContext';

export default function ProtectedLayout({children}) {
  const { userDetails, isLoggedIn } = userAuth();

  useEffect(() => {
    console.log("this is : ", userDetails);
    if (!isLoggedIn && !userDetails) {
      router.replace('/Login/Login'); // redirect to login
    }
  }, [isLoggedIn, userDetails]);

  if (!isLoggedIn && !userDetails) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
}
