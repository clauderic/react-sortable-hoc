import {addParameters, configure} from '@storybook/react';
import theme from './theme';

addParameters({
  options: {
    showAddonPanel: false,
    theme,
  },
});

function loadStories() {
  require('../src/.stories/index.js');
}

configure(loadStories, module);
