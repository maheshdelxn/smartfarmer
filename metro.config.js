const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add env files to asset extensions so Metro can handle them
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'env', // Add env files to asset extensions
];

module.exports = withNativeWind(config, { input: './global.css' });