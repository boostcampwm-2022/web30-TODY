const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@pages': path.resolve(__dirname, 'src/pages'),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^\\@components/(.*)$': '<rootDir>/src/components/$1',
        '^\\@styles/(.*)$': '<rootDir>/src/styles/$1',
        '^\\@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^\\@assets/(.*)$': '<rootDir>/src/assets/$1',
        '^\\@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^\\@pages/(.*)$': '<rootDir>/src/pages/$1',
        '^axios$': 'axios/dist/node/axios.cjs',
      },
    },
  },
};
