import {create} from '@storybook/theming';

export default create({
  base: 'light',

  colorSecondary: '#9276ff',

  // UI
  appBg: 'white',
  appContentBg: '#f9f9f9',
  appBorderColor: 'grey',
  appBorderRadius: 4,

  // Typography
  fontBase: '"Roboto", Helvetica Neue, Helvetica, Arial, sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: '#364149',
  textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  barTextColor: '#FFF',
  barSelectedColor: '#FFF',
  barBg: '#9276ff',

  // Form colors
  inputBg: 'white',
  inputBorder: '#efefef',
  inputTextColor: '#364149',
  inputBorderRadius: 0,

  brandTitle: 'React Sortable HOC',
  brandUrl: 'https://github.com/clauderic/react-sortable-hoc',
  brandImage:
    'https://d12c9k59mfk1gc.cloudfront.net/items/1T3k3f1s0v3K283t2W1s/react-sortable-hoc.svg',
});
