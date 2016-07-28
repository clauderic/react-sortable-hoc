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
        componentDidMount() {

            let {collection, disabled, index} = this.props;

            if (!disabled) {
                this.setDraggable(collection, index);
            }
        }
        componentWillReceiveProps(nextProps) {
            const {index} = this.props;
            if (index !== nextProps.index && this.node) {
                this.node.sortableInfo.index = nextProps.index;
            }
            if (this.props.disabled !== nextProps.disabled)
            {
                let {collection, disabled, index} = nextProps;
                if (disabled) {
                    this.removeDraggable(collection);
                }
                else {
                    this.setDraggable(collection, index);
                }
            }
        }
        componentWillUnmount() {
            let {collection, disabled} = this.props;

            if (!disabled) this.removeDraggable(collection);
        }
        setDraggable(collection, index){
            let node = this.node = findDOMNode(this);

            node.sortableInfo = {index, collection};

            this.ref = {node};
            this.context.manager.add(collection, this.ref);
        }
        removeDraggable(collection) {
            this.context.manager.remove(collection, this.ref);
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
