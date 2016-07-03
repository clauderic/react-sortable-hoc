import { configure } from '@kadira/storybook';

function loadStories() {
  require('../src/.stories/index.js');
}

configure(loadStories, module);
