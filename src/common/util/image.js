import {Images} from 'app-assets';

export const getImageSource = value => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return {uri: value};
  }

  return Images.thumbDefault;
};