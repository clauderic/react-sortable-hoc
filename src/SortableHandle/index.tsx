import * as React from 'react';
import { findDOMNode } from 'react-dom';
import * as invariant from 'invariant';

import { provideDisplayName } from '../utils';

export interface SortableHandleNode extends HTMLElement {
  sortableHandle: true
}

// Export Higher Order Sortable Element Component
// TODO: fix WrappedComponent typings
export default function sortableHandle<T>(WrappedComponent: (props: T) => any, config = { withRef: false }) {
  return class extends React.Component {
    static displayName = provideDisplayName('sortableHandle', WrappedComponent as any);

    componentDidMount() {
      const node = findDOMNode(this);
      (node as SortableHandleNode).sortableHandle = true;
    }

    getWrappedInstance() {
      invariant(
        config.withRef,
        'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableHandle() call'
      );
      return this.refs.wrappedInstance;
    }

    render() {
      const ref = config.withRef ? 'wrappedInstance' : undefined;

      return <WrappedComponent ref={ref} {...this.props} />;
    }
  };
}
