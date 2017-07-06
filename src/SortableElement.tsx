import * as React from 'react';
import * as PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import * as invariant from 'invariant';
import {SortableNode, Ref} from './Manager';

import { provideDisplayName, omit } from './utils';

interface SortableElementProps {
  collection?: string,
  disabled?: boolean,
  index: number
}

// Export Higher Order Sortable Element Component
export default function sortableElement<T>(WrappedComponent: (props: T) => any, config = { withRef: false }) {
  return class extends React.Component<SortableElementProps & T, undefined> {

    node: SortableNode | undefined;
    ref: Ref;

    static displayName = provideDisplayName('sortableElement', WrappedComponent as any);

    static contextTypes = {
      manager: PropTypes.object.isRequired,
    };

    static propTypes = {
      index: PropTypes.number.isRequired,
      collection: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      disabled: PropTypes.bool,
    };

    static defaultProps = {
      collection: 0,
    };

    componentDidMount() {
      const { collection, disabled, index } = this.props;

      if (!disabled) {
        this.setDraggable(collection, index);
      }
    }

    componentWillReceiveProps(nextProps: Readonly<SortableElementProps & T>) {
      if (this.props.index !== nextProps.index && this.node) {
        this.node.sortableInfo.index = nextProps.index;
      }
      if (this.props.disabled !== nextProps.disabled) {
        const { collection, disabled, index } = nextProps;
        if (disabled) {
          this.removeDraggable(collection);
        } else {
          this.setDraggable(collection, index);
        }
      } else if (this.props.collection !== nextProps.collection) {
        this.removeDraggable(this.props.collection);
        this.setDraggable(nextProps.collection, nextProps.index);
      }
    }

    componentWillUnmount() {
      const { collection, disabled } = this.props;

      if (!disabled) this.removeDraggable(collection);
    }

    setDraggable(collection?: string | undefined, index?: number) {
      const node = (this.node = findDOMNode(this as any) as SortableNode);

      if (!node) {
        return;
      }

      node.sortableInfo = {
        index,
        collection,
        manager: this.context.manager,
      };

      this.ref = { node };
      this.context.manager.add(collection, this.ref);
    }

    removeDraggable(collection?: string) {
      this.context.manager.remove(collection, this.ref);
    }

    getWrappedInstance() {
      invariant(
        config.withRef,
        'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableElement() call'
      );
      return this.refs.wrappedInstance;
    }

    render() {
      const ref = config.withRef ? 'wrappedInstance' : undefined;

      return (
        <WrappedComponent
          ref={ref}
          {...omit(this.props, 'collection', 'disabled', 'index') }
        />
      );
    }
  };
}
