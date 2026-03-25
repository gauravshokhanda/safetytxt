import Types from './types';

export const saveStatusNetwork = (connection: boolean = true) => ({
  type: Types.NETWORK_STATUS,
  connection,
});
