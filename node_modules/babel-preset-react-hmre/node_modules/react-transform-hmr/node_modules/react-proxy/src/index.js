import supportsProtoAssignment from './supportsProtoAssignment';

if (!supportsProtoAssignment()) {
  console.warn(
    'This JavaScript environment does not support __proto__. ' +
    'This means that react-proxy is unable to proxy React components. ' +
    'Features that rely on react-proxy, such as react-transform-hmr, ' +
    'will not function as expected.'
  );
}

import createProxy from './createClassProxy';
import getForceUpdate from 'react-deep-force-update';
export { createProxy, getForceUpdate };
