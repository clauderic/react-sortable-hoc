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
    'https://user-images.githubusercontent.com/1416436/54170652-dfd59d80-444d-11e9-9c51-658638c0454b.png',
});
