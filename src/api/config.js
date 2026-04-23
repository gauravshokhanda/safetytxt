import {tronLog} from 'app-common';
import {Alert} from 'react-native';
import {SITE_URL} from 'app-config';
import {navigate} from '../navigations/navigations';
import {store} from '../index';
import {saveUserToken, setUser, setOverview} from '../actions/user';

let HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const callRequestWithTimeOut = async request => {
  const promise2 = new Promise(resolve => {
    setTimeout(resolve, 15000, null);
  });

  const resultRace = await new Promise.race([request, promise2]);

  return resultRace;
};

const onResponse = async (request, result) => {
  try {
    const body = await result.text();
    let newBody = null;
    try {
      newBody = JSON.parse(body);
    } catch (e) {
      tronLog('onResponseParseError', request?.url, body);
      if (request?.url?.includes('/wp-json/learnpress/v1/users/reset-password')) {
        console.log('reset-password status:', result?.status);
        console.log('reset-password non-JSON response:', body);
      }
      return {
        code: 'error',
        message: 'Invalid server response. Please try again.',
        status: result?.status,
      };
    }

    if (request?.url?.includes('/wp-json/learnpress/v1/users/reset-password')) {
      console.log('reset-password status:', result?.status);
      if (body === '' || body === null || body === undefined) {
        return {
          code: 'error',
          message: 'Empty response from server. Please try again.',
          status: result?.status,
        };
      }
    }

    // Targeted debug: log response for courses2 requests alongside existing URL debug
    if (request?.url?.includes('/wp-json/learnpress/v1/courses2')) {
      console.debug('Response (courses2):', newBody);
    }
    if (request?.url?.includes('/wp-json/learnpress/v1/courses/finish')) {
      console.log('finishCourse status:', result?.status);
      console.log('finishCourse response:', newBody);
    }
    if (request?.url?.includes('/wp-json/learnpress/v1/lessons/finish')) {
      console.log('completeLesson status:', result?.status);
      console.log('completeLesson response:', newBody);
    }
    if (request?.url?.includes('/wp-json/learnpress/v1/quiz/start')) {
      console.log('quizStart status:', result?.status);
      console.log('quizStart response:', newBody);
    }
    if (request?.url?.includes('/wp-json/learnpress/v1/quiz/finish')) {
      console.log('quizFinish status:', result?.status);
      console.log('quizFinish response:', newBody);
    }

    if (result.status === 401) {
      store.dispatch(saveUserToken(null));
      store.dispatch(setUser(null));
      store.dispatch(setOverview(null));

      Alert.alert('Not logged in', 'Please login to continue.', [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Login',
          onPress: () => navigate('LoginScreen'),
        },
      ]);

      return null;
    }

    // SUCCESS: Return valid response
    return newBody;
  } catch (e) {
    tronLog('onResponseError', result);

    return null;
  }
};

const config = {
  get: async (endpoint, params = {}, randomVersion = true) => {
    const shouldLogCourses2 = endpoint?.includes('/wp-json/learnpress/v1/courses2');
    if (shouldLogCourses2) {
      console.log('GET courses2 params (input):', params, 'randomVersion:', randomVersion);
    }
    const queryParam = {...params};

    if (randomVersion) {
      queryParam.v = Math.floor(Math.random() * 999999999);
    }

    let url = `${SITE_URL}${endpoint}`;

    if (Object.keys(queryParam).length > 0) {
      const keys = Object.keys(queryParam).filter(
        key => queryParam[key] !== undefined && queryParam[key] !== null,
      );
      if (keys.length > 0) {
        url += `?${keys.map(key => `${key}=${queryParam[key]}`).join('&')}`;
      }
    }

    console.debug(url);
    if (shouldLogCourses2) {
      console.log('GET courses2 params (final):', queryParam);
      console.log('GET courses2 url:', url);
    }

    const options = {
      method: 'GET',
      headers: HEADERS,
    };

    const request = {url, options};

    if (
      endpoint?.includes('/wp-json/learnpress/v1/courses/') ||
      endpoint?.includes('/wp-json/learnpress/v1/lessons/') ||
      endpoint?.includes('/wp-json/learnpress/v1/quiz/')
    ) {
      const {user} = store.getState();
      const safeHeaders = {
        ...options.headers,
        ...(options.headers?.Authorization ? {Authorization: 'Bearer ***'} : {}),
      };
      console.log('GET learnpress url:', url);
      console.log('GET learnpress params:', params);
      console.log('GET learnpress auth:', {
        hasToken: !!user?.token,
        userId: user?.info?.id ?? user?.info?.user_id ?? null,
      });
      console.log('GET learnpress request:', {method: options.method, headers: safeHeaders});
    }

    return callRequestWithTimeOut(
      fetch(url, options).then(result => onResponse(request, result)),
    );
  },

  post: async (endpoint, params = {}) => {
    const url = SITE_URL + endpoint;

    const options = {
      method: 'POST',
      body: JSON.stringify(params),
      headers: HEADERS,
    };

    const request = {
      url,
      options,
    };

    console.debug(url);
    if (endpoint?.includes('/wp-json/learnpress/v1/users/reset-password')) {
      console.log('POST reset-password url:', url);
      console.log('POST reset-password payload:', params);
    }
    if (endpoint?.includes('/wp-json/learnpress/v1/courses/finish')) {
      const safeHeaders = {
        ...options.headers,
        ...(options.headers?.Authorization ? {Authorization: 'Bearer ***'} : {}),
      };
      const {user} = store.getState();
      console.log('POST finishCourse url:', url);
      console.log('POST finishCourse payload:', params);
      console.log('POST finishCourse auth:', {
        hasToken: !!user?.token,
        userId: user?.info?.id ?? user?.info?.user_id ?? null,
      });
      console.log('POST finishCourse request:', {method: options.method, headers: safeHeaders});
    }
    if (
      endpoint?.includes('/wp-json/learnpress/v1/lessons/finish') ||
      endpoint?.includes('/wp-json/learnpress/v1/quiz/start') ||
      endpoint?.includes('/wp-json/learnpress/v1/quiz/finish') ||
      endpoint?.includes('/wp-json/learnpress/v1/courses/retake') ||
      endpoint?.includes('/wp-json/learnpress/v1/courses/enroll')
    ) {
      const safeHeaders = {
        ...options.headers,
        ...(options.headers?.Authorization ? {Authorization: 'Bearer ***'} : {}),
      };
      const {user} = store.getState();
      console.log('POST learnpress url:', url);
      console.log('POST learnpress payload:', params);
      console.log('POST learnpress auth:', {
        hasToken: !!user?.token,
        userId: user?.info?.id ?? user?.info?.user_id ?? null,
      });
      console.log('POST learnpress request:', {method: options.method, headers: safeHeaders});
    }

    return callRequestWithTimeOut(
      fetch(url, options).then(result => onResponse(request, result)),
    );
  },

  put: async (endpoint, params = {}) => {
    const url = SITE_URL + endpoint;

    const options = {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(params),
    };

    const request = {
      url,
      options,
    };

    console.debug(url);

    return callRequestWithTimeOut(
      fetch(url, options).then(result => onResponse(request, result)),
    );
  },

  delete: async (endpoint, params = {}) => {
    let url = `${SITE_URL}${endpoint}`;

    if (Object.keys(params).length > 0) {
      const keys = Object.keys(params).filter(
        key => params[key] !== undefined && params[key] !== null,
      );
      if (keys.length > 0) {
        url += `?${keys.map(key => `${key}=${params[key]}`).join('&')}`;
      }
    }

    const options = {
      method: 'DELETE',
      headers: HEADERS,
    };

    const request = {
      url,
      options,
    };

    console.debug(url);

    return callRequestWithTimeOut(
      fetch(url, options).then(result => onResponse(request, result)),
    );
  },

  multipartPost: async (endpoint, params = {}) => {
    const url = SITE_URL + endpoint;

    const options = {
      method: 'POST',
      body: params,
      headers: {...HEADERS, 'Content-Type': 'multipart/form-data'},
    };

    const request = {
      url,
      options,
    };

    console.debug(url);

    return fetch(url, options).then(result => onResponse(request, result));
  },
};

const getApiUrl = () => SITE_URL;

const setToken = _token => {
  HEADERS = {
    ...HEADERS,
    Authorization: `Bearer ${_token}`,
  };
};

const setClientLocale = (locale = 'en') => {
  HEADERS = {
    ...HEADERS,
    'x-client-locale': locale,
  };
};

export {config, getApiUrl, setToken, setClientLocale};
