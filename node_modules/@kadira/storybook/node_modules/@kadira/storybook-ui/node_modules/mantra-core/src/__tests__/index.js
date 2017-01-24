import {expect} from 'chai';
import {createApp} from '../';
import * as indexExports from '../';
import * as simpleSimpleDiExports from 'react-simple-di';
import * as reactKomposerExports from 'react-komposer';
const {describe, it} = global;

describe('Module', () => {
  describe('createApp', async () => {
    it('should create app with provided args', () => {
      const context = {aa: 10};
      const app = createApp(context);
      expect(app.context).to.deep.equal(context);
    });
  });

  it('should have useDeps from react-simple-di', () => {
    expect(indexExports.useDeps).to.be.equal(simpleSimpleDiExports.useDeps);
  });

  it('should have all functions from react-komposer', () => {
    const fnNames = [
      'compose', 'composeWithPromise', 'composeWithTracker',
      'composeWithObservable', 'composeAll', 'disable'
    ];

    fnNames.forEach(fnName => {
      const reactKomposerFn = reactKomposerExports[fnName];
      const indexFN = indexExports[fnName];
      expect(reactKomposerFn).to.be.equal(indexFN);
    });
  });
});
