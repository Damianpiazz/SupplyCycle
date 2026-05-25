// Intercept require('react-native') at the Node.js module resolution level
// to prevent the Flow syntax error in react-native/index.js
const Module = require('module');
const path = require('path');

const mockPath = path.resolve(__dirname, '..', '__mocks__', 'react-native.cjs');

const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  if (request === 'react-native') {
    return mockPath;
  }
  return originalResolve.call(this, request, parent, isMain, options);
};
