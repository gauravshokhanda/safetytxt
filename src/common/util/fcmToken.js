import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Client from '../../api/client';
import { setFCMToken } from '../../actions/user';
import { store } from '../../index';

export async function registerFCMToken() {
  const { user } = store.getState();

  try {
    // Check if user is logged in
    if (!user?.token) return;

    // Register device for remote messages
    await messaging().registerDeviceForRemoteMessages();

    // Get the current FCM token
    const token = await messaging().getToken();

    // 🔥 Log token to console
    console.log('🔑 FCM Token:', token);

    // Check if the stored token matches the current token
    if (user?.fcmToken === token) return;

    // Update redux store
    store.dispatch(setFCMToken(token));

    // Prepare payload for backend
    const payload = {
      device_token: token,
      device_type: Platform.OS === 'ios' ? 'ios' : 'android',
    };

    console.log('📦 register-device payload:', payload);

    // Send token to backend
    const response = await Client.registerFCMToken(payload);
    console.log('✅ register-device response:', response);
  } catch (error) {
    console.log('❌ registerFCMTokenError:', error);
  }
}

export async function deleteFCMToken() {
  const { user } = store.getState();

  try {
    if (!user?.token) throw new Error('User is null');
    if (!user?.fcmToken) throw new Error('FCMToken is null');

    // Unregister from FCM
    await messaging().unregisterDeviceForRemoteMessages();

    // Send delete request to backend
    await Client.deleteFCMToken({ device_token: user?.fcmToken });

    // Clear token from store
    store.dispatch(setFCMToken(null));

    console.log('🗑️ FCM token deleted successfully');
  } catch (error) {
    console.log('❌ deleteFCMTokenError:', error);
  }
}
