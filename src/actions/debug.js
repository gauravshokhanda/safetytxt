import Types from './types';

export const testRedux = () => ({
  type: Types.TEST,
});

export const saveDebug = (status) => ({
  type: Types.SAVEDEBUG,
  data: status,
});
