/* eslint-disable no-param-reassign */
import Types from '../actions/types';

const normalizeUserInfo = userInfo => {
  if (!userInfo || typeof userInfo !== 'object') {
    return userInfo;
  }

  const normalized = {...userInfo};
  const userId = userInfo.id ?? userInfo.user_id;

  if (userId !== undefined && userId !== null) {
    normalized.id = userId;
    normalized.user_id = userId;
  }

  const firstName = userInfo.first_name ?? userInfo.firstName;
  const lastName = userInfo.last_name ?? userInfo.lastName;
  const fullNameFromParts = [firstName, lastName].filter(Boolean).join(' ') || undefined;

  const name =
    fullNameFromParts ||
    userInfo.name ||
    userInfo.user_display_name ||
    userInfo.display_name ||
    userInfo.nickname ||
    userInfo.user_login;

  if (name !== undefined && name !== null && name !== '') {
    normalized.name = name;
  }

  const email = userInfo.email || userInfo.user_email;
  if (email !== undefined && email !== null && email !== '') {
    normalized.email = email;
  }

  return normalized;
};

const INITIAL_STATE = {
  token: null,
  info: null,
  recentSearch: [],
  overview: null,
  fcmToken: null,
};

const user = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Types.SAVE_USER_TOKEN:
      delete action.type;
      return {
        ...state,
        token: action.token,
        action,
      };

    case Types.SAVE_USER:
      delete action.type;
      const normalizedUserInfo = normalizeUserInfo(action.user);
      return {
        ...state,
        info: normalizedUserInfo
          ? {...(state.info || {}), ...normalizedUserInfo}
          : normalizedUserInfo,
      };
    case Types.RECENT_SEARCH:
      delete action.type;
      return {
        ...state,
        recentSearch: action.recentSearch,
      };
    case Types.SET_OVERVIEW:
      delete action.type;
      return {
        ...state,
        overview: action.overview,
      };
    case Types.SET_FCM_TOKEN:
      delete action.type;
      return {
        ...state,
        fcmToken: action.fcmToken,
      };

    default:
      return state;
  }
};

export default user;
