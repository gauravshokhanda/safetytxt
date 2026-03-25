import Types from './types';

export const saveCourse = (data) => ({
  type: Types.SAVE_COURSE,
  data,
});
