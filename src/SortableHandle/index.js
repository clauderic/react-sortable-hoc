import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import invariant from 'invariant';

// Export Higher Order Sortable Element Component
export default function SortableHandle (WrappedComponent, config = {withRef: false}) {
    return class extends Component {
        static displayName = (WrappedComponent.displayName) ? `SortableHandle(${WrappedComponent.displayName})` : 'SortableHandle';
        static WrappedComponent = WrappedComponent;
        componentDidMount() {
            let node = findDOMNode(this);
            node.sortableHandle = true;
        }
        getWrappedInstance() {
            invariant(config.withRef, 'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableHandle() call');
            return this.refs.wrappedInstance;
        }
        render() {
            const ref = (config.withRef) ? 'wrappedInstance' : null;
            return (
                <WrappedComponent ref={ref} {...this.props} />
            );
        }
    }
}
