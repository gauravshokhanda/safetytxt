import {debug} from './debug';
import user from './user';
import common from './common';
import network from './network';
import course from './course';
import wishlist from './wishlist';
import productIAP from './product-iap';
import notifications from './notifications';
import language from './language';

const rootReducer = {
  user,
  debug,
  common,
  network,
  course,
  wishlist,
  productIAP,
  notifications,
  language,
};

export default rootReducer;
