import React from 'react';
import ReactDOM from 'react-dom';
import renderStorybookUI from '../../src/index.js';
import Provider from './provider';

const rootEl = document.getElementById('root');
renderStorybookUI(rootEl, new Provider());

if (module.hot) {
  module.hot.accept(() => {
    window.location.reload();
  });
}
