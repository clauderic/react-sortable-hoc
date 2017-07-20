import * as React from 'react';
import * as PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import * as invariant from 'invariant';
import {Collection, SortableNode, Ref} from './Manager';

import {provideDisplayName, omit} from './utils';

export interface SortableElementProps {
  ref?: string,
  collection: Collection;
  disabled?: boolean;
  index: number;
}

type WrappedComponent<T> = (
  React.ComponentClass<T> |
  React.StatelessComponent<T>
);

// Export Higher Order Sortable Element Component
export default function sortableElement<T>(
  WrappedComponent: WrappedComponent<T>,
  config = {withRef: false}
) {
  type Props = T & SortableElementProps;

  return class extends React.Component<Props> {
    node: SortableNode | undefined;
    ref: Ref;

    static displayName = provideDisplayName(
      'sortableElement',
      WrappedComponent
    );

    static contextTypes = {
      manager: PropTypes.object.isRequired,
    };

    componentDidMount() {
      const {collection, disabled, index} = this.props;

      if (!disabled) {
        this.setDraggable(collection, index);
      }
    }

    componentWillReceiveProps(nextProps: Readonly<Props>) {
      if (this.props.index !== nextProps.index && this.node) {
        this.node.sortableInfo.index = nextProps.index;
      }
      if (this.props.disabled !== nextProps.disabled) {
        const {collection, disabled, index} = nextProps;
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
      const {collection, disabled} = this.props;

      if (!disabled) this.removeDraggable(collection);
    }

    setDraggable(collection: Collection, index: number) {
      const node = (this.node = findDOMNode(this as any) as SortableNode);

      if (!node) {
        return;
      }

      node.sortableInfo = {
        index,
        collection,
        manager: this.context.manager,
      };

      this.ref = {node};
      this.context.manager.add(collection, this.ref);
    }

    removeDraggable(collection: Collection) {
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
      const props: any = omit(this.props, 'collection', 'disabled', 'index');

      return (
        <WrappedComponent
          ref={ref}
          {...props}
        />
      );
    }
  };
}
