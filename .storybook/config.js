import {addDecorator, configure} from '@storybook/react';
import {withOptions} from '@storybook/addon-options';

addDecorator(
  withOptions({
    name: 'React Sortable HOC',
    url: 'https://github.com/clauderic/react-sortable-hoc',
    showAddonPanel: false,
  }),
);

function loadStories() {
  require('../src/.stories/index.js');
}

configure(loadStories, module);
