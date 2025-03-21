const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable CSS support
config.transformer.babelTransformerPath = require.resolve('react-native-css-transformer');

// Add support for path aliases
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json'];
config.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bin', 'ttf', 'otf'];

module.exports = config;
