import React from 'react';
import Preview from './preview';
import keycode from 'keycode';
import { EventEmitter } from 'events';
import parseKeyEvent from '../../src/libs/key_events';
import { Provider } from '../../src';

let id = 0;

export default class ReactProvider extends Provider {
  constructor() {
    super();
    this.globalState = new EventEmitter();
  }

  // You must implement this public API.
  renderPreview(selectedKind, selectedStory) {
    // We need to do this here to avoid memory leaks in the globalState.
    // That's because renderPreview can be called multiple times.
    this._handlePreviewEvents();

    // create preview React component.
    const preview = new Preview(this.globalState);
    this.globalState.emit('change', selectedKind, selectedStory);
    return preview;
  }

  // You must implement this public API.
  handleAPI(api) {
    this.api = api;
    this.api.setOptions({
      name : 'REACT-STORYBOOK',
    });

    // set stories
    this.api.setStories([
      {
        kind: 'Component 1',
        stories: ['State 1', 'State 2']
      },

      {
        kind: 'Component 2',
        stories: ['State a', 'State b']
      }
    ]);

    // listen to the story change and update the preview.
    this.api.onStory((kind, story) => {
      this.globalState.emit('change', kind, story);
    });
  }

  _handlePreviewEvents() {
    this.globalState.removeAllListeners();

    // firing an action.
    this.globalState.on('action', (message) => {
      this.api.addAction({
        data: { message, name: 'the-action' },
        id: ++id,
      });
    });

    // jumping to an story.
    this.globalState.on('jump', (kind, story) => {
      this.api.selectStory(kind, story);
    });

    // calling a shortcut functionality.
    this.globalState.on('toggleFullscreen', () => {
      const event = {
        ctrlKey: true,
        shiftKey: true,
        keyCode: keycode('F'),
        preventDefault() {},
      };
      const parsedEvent = parseKeyEvent(event);
      console.log(parsedEvent);
      this.api.handleShortcut(parsedEvent);
    });
  }
}
