// Mock for @expo/vector-icons to prevent Rolldown JSX parsing failure
const React = require('react');

function createMockIcon(name) {
  return function Icon(props) {
    return React.createElement('Icon', { name, ...props });
  };
}

module.exports = {
  Ionicons: createMockIcon('Ionicons'),
  MaterialIcons: createMockIcon('MaterialIcons'),
  MaterialCommunityIcons: createMockIcon('MaterialCommunityIcons'),
  FontAwesome: createMockIcon('FontAwesome'),
  Feather: createMockIcon('Feather'),
  createIconSet: function() {
    return createMockIcon('CustomIcon');
  },
  createIconSetFromFontello: function() {
    return createMockIcon('FontelloIcon');
  },
  createIconSetFromIcoMoon: function() {
    return createMockIcon('IcoMoonIcon');
  },
};
