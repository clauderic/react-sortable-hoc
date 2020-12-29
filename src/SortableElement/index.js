import invariant from 'invariant';
import PropTypes from 'prop-types';
import * as React from 'react';
import {findDOMNode} from 'react-dom';
import {SortableContext} from '../SortableContainer';
import {omit, provideDisplayName} from '../utils';

const propTypes = {
  index: PropTypes.number.isRequired,
  collection: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  disabled: PropTypes.bool,
};

const omittedProps = Object.keys(propTypes);

export default function sortableElement(
  WrappedComponent,
  config = {withRef: false},
) {
  return class WithSortableElement extends React.Component {
    static displayName = provideDisplayName(
      'sortableElement',
      WrappedComponent,
    );

    static contextType = SortableContext;

    static propTypes = propTypes;

    static defaultProps = {
      collection: 0,
    };

    componentDidMount() {
      this.register();
    }

    componentDidUpdate(prevProps) {
      if (this.node) {
        if (prevProps.index !== this.props.index) {
          this.node.sortableInfo.index = this.props.index;
        }

        if (prevProps.disabled !== this.props.disabled) {
          this.node.sortableInfo.disabled = this.props.disabled;
        }
      }

      if (prevProps.collection !== this.props.collection) {
        this.unregister(prevProps.collection);
        this.register();
      }
    }

    componentWillUnmount() {
      this.unregister();
    }

    register() {
      const {collection, disabled, index} = this.props;
      const node = findDOMNode(this);

      node.sortableInfo = {
        collection,
        disabled,
        index,
        manager: this.context.manager,
      };

      this.node = node;
      this.ref = {node};

      this.context.manager.add(collection, this.ref);
    }

    unregister(collection = this.props.collection) {
      this.context.manager.remove(collection, this.ref);
    }

    getWrappedInstance() {
      invariant(
        config.withRef,
        'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableElement() call',
      );
      return this.wrappedInstance.current;
    }

    render() {
      const ref = config.withRef ? this.wrappedInstance : null;

      return <WrappedComponent ref={ref} {...omit(this.props, omittedProps)} />;
    }
  };
}
