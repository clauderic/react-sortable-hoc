import { getForceUpdate, createProxy } from 'react-proxy';
import window from 'global/window';

let componentProxies;
if (window.__reactComponentProxies) {
  componentProxies = window.__reactComponentProxies;
} else {
  componentProxies = {};
  Object.defineProperty(window, '__reactComponentProxies', {
    configurable: true,
    enumerable: false,
    writable: false,
    value: componentProxies
  });
}

export default function proxyReactComponents({ filename, components, imports, locals }) {
  const [React] = imports;
  const [{ hot }] = locals;

  if (!React.Component) {
    throw new Error(
      'imports[0] for react-transform-hmr does not look like React.'
    );
  }

  if (!hot || typeof hot.accept !== 'function') {
    throw new Error(
      'locals[0] does not appear to be a `module` object with Hot Module ' +
      'replacement API enabled. You should disable react-transform-hmr in ' +
      'production by using `env` section in Babel configuration. See the ' +
      'example in README: https://github.com/gaearon/react-transform-hmr'
    );
  }

  if (Object.keys(components).some(key => !components[key].isInFunction)) {
    hot.accept(err => {
      if (err) {
        console.warn(`[React Transform HMR] There was an error updating ${filename}:`);
        console.error(err);
      }
    });
  }

  const forceUpdate = getForceUpdate(React);

  return function wrapWithProxy(ReactClass, uniqueId) {
    const {
      isInFunction = false,
      displayName = uniqueId
    } = components[uniqueId];

    if (isInFunction) {
      return ReactClass;
    }

    const globalUniqueId = filename + '$' + uniqueId;
    if (componentProxies[globalUniqueId]) {
      console.info('[React Transform HMR] Patching ' + displayName);
      const instances = componentProxies[globalUniqueId].update(ReactClass);
      setTimeout(() => instances.forEach(forceUpdate));
    } else {
      componentProxies[globalUniqueId] = createProxy(ReactClass);
    }

    return componentProxies[globalUniqueId].get();
  };
}
