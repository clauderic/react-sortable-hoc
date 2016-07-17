import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import invariant from 'invariant';

// Export Higher Order Sortable Element Component
export default function SortableElement (WrappedComponent, config = {withRef: false}) {
    return class extends Component {
        static displayName = (WrappedComponent.displayName) ? `SortableElement(${WrappedComponent.displayName})` : 'SortableElement';
        static WrappedComponent = WrappedComponent;
        static contextTypes = {
            manager: PropTypes.object.isRequired
        };
        static propTypes = {
            index: PropTypes.number.isRequired,
            collection: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            disabled: PropTypes.bool
        };
        static defaultProps = {
            collection: 0
        };
        addOrRemoveRef(shouldAdd) {
            let node = this.node = findDOMNode(this);
            let {collection, index} = this.props;
            let {manager} = this.context;
            node.sortableInfo = {index, collection};
            this.ref = {node};
            let addOrRemove = (shouldAdd) ? manager.add : manager.remove;
            addOrRemove(collection, this.ref)
        }
        componentDidMount() {
            this.addOrRemoveRef(!this.props.disabled)
        }
        componentWillReceiveProps(nextProps) {
            const {index} = this.props;
            if (index !== nextProps.index && this.node) {
                this.node.sortableInfo.index = nextProps.index;
            }

            if (this.props.disabled !== nextProps.disabled) {
                this.addOrRemoveRef(!nextProps.disabled)
            }
        }
        componentWillUnmount() {
            let {collection, disabled} = this.props;

            if (!disabled) this.context.manager.remove(collection, this.ref);
        }
        getWrappedInstance() {
            invariant(config.withRef, 'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableElement() call');
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
