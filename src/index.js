import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {Animated, DeviceEventEmitter, StatusBar, StyleSheet, Text, View} from 'react-native';
import {PersistGate} from 'redux-persist/integration/react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import RNBootSplash from 'react-native-bootsplash';
import NetInfo from '@react-native-community/netinfo';
import codePush from '@revopush/react-native-code-push';
import notifee, {EventType, AuthorizationStatus} from '@notifee/react-native';
import '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import './config/translations';
import RootScreen from './screens/root';
import configStore from './store/index';
import {setToken} from './api/config';
import {Client} from './api';
import {saveStatusNetwork} from './actions/network';
import {saveNotifications} from './actions/notifications';
import DEEP_LINKING from './navigations/deeplinking';
import {CODE_PUSH} from './config';
import {registerFCMToken} from './common/util/fcmToken';
import {navigationRef, navigate} from './navigations/navigations';
import NotificationModal from './component/common/notification-modal';

const {store, persistor} = configStore();

export {store};

const MyApp = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [showSplashOverlay, setShowSplashOverlay] = React.useState(true);
  const splashOpacity = React.useRef(new Animated.Value(1)).current;
  const splashScale = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    (async function () {
      try {
        // await codePush.sync({
        //   deploymentKey:
        //     Platform.OS === 'ios' ? CODE_PUSH.ios : CODE_PUSH.android,
        //   installMode: codePush.InstallMode.IMMEDIATE,
        // });
        setTimeout(() => {
          RNBootSplash.hide({fade: true});
        }, 300);

        Animated.parallel([
          Animated.timing(splashScale, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(450),
            Animated.timing(splashOpacity, {
              toValue: 0,
              duration: 450,
              useNativeDriver: true,
            }),
          ]),
        ]).start(({finished}) => {
          if (finished) {
            setShowSplashOverlay(false);
          }
        });
      } catch (e) {
        console.log(e);
      }

      await onNotification();
    })();
  }, []);

  async function onNotification() {
    // Request permissions (required for iOS)
    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus < AuthorizationStatus.AUTHORIZED) {
      setIsVisible(true);
    }

    await registerFCMToken();

    messaging().onMessage(remoteMessage => {
      notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        android: {
          channelId: 'default',
        },
      });

      DeviceEventEmitter.emit('notificationReceived');
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      navigate('NotificationsScreen');
    });

    notifee.onForegroundEvent(({type}) => {
      switch (type) {
        case EventType.PRESS:
          navigate('NotificationsScreen');
          break;
      }
    });

    if (!isVisible) {
      fetchNotifications();

      DeviceEventEmitter.addListener('notificationReceived', async () => {
        await fetchNotifications();
      });
    }
  }

  async function fetchNotifications() {
    const {user} = store.getState();

    if (user?.token) {
      setToken(user?.token);

      try {
        const response = await Client.getNotifications({
          per_page: 20,
          page: 1,
        });

        if (response?.success) {
          await store.dispatch(
            saveNotifications(response?.data?.notifications || []),
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  const onBeforeLift = async () => {
    NetInfo.addEventListener(async state => {
      try {
        await store.dispatch(saveStatusNetwork(state.isConnected));
      } catch (e) {
        console.log(e);
      }
    });

    const {user} = store.getState();

    if (user?.token) {
      setToken(user?.token);
    }
  };

  return (
    <Provider store={store}>
      <PersistGate
        onBeforeLift={onBeforeLift}
        loading={null}
        persistor={persistor}>
        <NavigationContainer ref={navigationRef} linking={DEEP_LINKING}>
          <StatusBar
            translucent
            backgroundColor="rgba(255,255,255,0.1)"
            barStyle="dark-content"
          />
          <RootScreen />
          <NotificationModal isVisible={isVisible} />
          {showSplashOverlay && (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.splashOverlay,
                {opacity: splashOpacity, transform: [{scale: splashScale}]},
              ]}>
              <View style={styles.splashContent}>
                <Text style={styles.splashTitle}>SafetyTxt</Text>
              </View>
            </Animated.View>
          )}
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default codePush(MyApp);

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#000',
  },
});
