/**
 * @format
 */
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {AppRegistry, Text, TextInput} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import Animated from 'react-native-reanimated';
import App from './src';
import {name as appName} from './app.json';

enableScreens();

if (__DEV__) {
  // import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}

Animated.addWhitelistedNativeProps({text: true});

if (Text.defaultProps == null) {
  Text.defaultProps = {};
}
Text.defaultProps.allowFontScaling = false;
if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
}
TextInput.defaultProps.allowFontScaling = false;

messaging().setBackgroundMessageHandler(async remoteMessage => {
  const title = remoteMessage?.notification?.title || remoteMessage?.data?.title;
  const body = remoteMessage?.notification?.body || remoteMessage?.data?.body;

  if (title || body) {
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'default',
      },
    });
  }

  notifee.incrementBadgeCount(1);
});

// Background Event Listener
notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;

  if (type === EventType.ACTION_PRESS) {
    await notifee.cancelNotification(notification.id);

    notifee.decrementBadgeCount(1);
  }
});

AppRegistry.registerComponent(appName, () => App);

