import Types from './types';

export function setAppOpen(isAppOpen = false) {
  return {
    type: Types.SET_APP_OPEN,
    isAppOpen,
  };
}
export function showLoading(
  loading = true,
  isNative = false
) {
  return {
    type: Types.SHOW_LOADING,
    data: { loading, isNative },
  };
}
export function setLoading(loading = true) {
  return {
    type: Types.SET_LOADING,
    loading,
  };
}
