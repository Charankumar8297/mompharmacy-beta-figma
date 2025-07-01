import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { userAuth } from '@/Context/authContext';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import GetStarted from './Login/getstart';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Index() {
  const { userDetails, isLoggedIn, isRegistrationComplete, ExtractParseToken, loading } = userAuth();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(null);

  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  useEffect(() => {
    const init = async () => {
      const token = await ExtractParseToken();

      if (isLoggedIn && token) {
        if (!userDetails?.isRegistered) {
          router.replace("/Login/signup");
        } else {
          router.replace("/BottomNavbar/home");
        }
      } else {
        router.replace("/Login/Login");
      }

      const pushToken = await registerForPushNotificationsAsync();
      if (pushToken) {
        setExpoPushToken(pushToken);
      }

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
        Alert.alert(
          notification.request.content.title || 'Notification',
          notification.request.content.body || ''
        );
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        setNotification(response.notification);
      });
    };

    init();

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <GetStarted />

      {notification && (
        <View style={{ marginTop: 20, backgroundColor: '#eee', padding: 10, borderRadius: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>
            {notification.request?.content?.title || 'Notification'}
          </Text>
          <Text>{notification.request?.content?.body}</Text>
        </View>
      )}
    </View>
  );
}

async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    alert('Must use physical device for Push Notifications');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  return tokenData.data;
}
