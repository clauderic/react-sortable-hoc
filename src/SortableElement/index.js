import * as React from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import invariant from 'invariant';

import {provideDisplayName, omit} from '../utils';

export default function sortableElement(
  WrappedComponent,
  config = {withRef: false},
) {
  return class WithSortableElement extends React.Component {
    static displayName = provideDisplayName(
      'sortableElement',
      WrappedComponent,
    );

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
      const {collection, disabled, index} = this.props;

      if (!disabled) {
        this.setDraggable(collection, index);
      }
    }

    componentWillReceiveProps(nextProps) {
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

      if (!disabled) {
        this.removeDraggable(collection);
      }
    }

    setDraggable(collection, index) {
      const node = findDOMNode(this);

      node.sortableInfo = {
        index,
        collection,
        manager: this.context.manager,
      };

      this.node = node;
      this.ref = {node};
      this.context.manager.add(collection, this.ref);
    }

    removeDraggable(collection) {
      this.context.manager.remove(collection, this.ref);
    }

    getWrappedInstance() {
      invariant(
        config.withRef,
        'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableElement() call',
      );
      return this.refs.wrappedInstance;
    }

    render() {
      const ref = config.withRef ? 'wrappedInstance' : null;

      return (
        <WrappedComponent
          ref={ref}
          {...omit(this.props, 'collection', 'disabled', 'index')}
        />
      );
    }
  };
}
