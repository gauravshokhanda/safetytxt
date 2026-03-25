const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      'app-config': path.resolve(__dirname, 'src/config'),
      'app-api': path.resolve(__dirname, 'src/api'),
      'app-assets': path.resolve(__dirname, 'src/assets'),
      'app-component': path.resolve(__dirname, 'src/component'),
      'app-common': path.resolve(__dirname, 'src/common'),
    },
  },
  watchFolders: [path.resolve(__dirname, 'src')],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
