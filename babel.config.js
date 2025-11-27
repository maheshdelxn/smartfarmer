module.exports = function (api) {
  api.cache(true);
  let plugins = [];

  plugins.push('react-native-worklets/plugin');

  // Add react-native-dotenv plugin
  plugins.push([
    'module:react-native-dotenv',
    {
      moduleName: '@env',
      path: '.env',
      blacklist: null,
      whitelist: null,
      safe: false,
      allowUndefined: true,
    },
  ]);

  return {
    presets: [
      ['babel-preset-expo', { 
        jsxImportSource: 'nativewind',
        // Add env configuration for different environments
        env: {
          production: {
            plugins: ['react-native-dotenv']
          },
          development: {
            plugins: ['react-native-dotenv']
          }
        }
      }], 
      'nativewind/babel'
    ],

    plugins,
  };
};