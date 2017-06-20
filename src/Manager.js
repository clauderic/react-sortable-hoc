import find from 'lodash/find';
import sortBy from 'lodash/sortBy';

export default class Manager {
  refs = {};

  add(collection, ref) {
    if (!this.refs[collection]) {
      this.refs[collection] = [];
    }

    this.refs[collection].push(ref);
  }

  remove(collection, ref) {
    const index = this.getIndex(collection, ref);

    if (index !== -1) {
      this.refs[collection].splice(index, 1);
    }
  }

  isActive() {
    return this.active;
  }

  getActive() {
    if (!this.active) return null
    const activeRef = this.refs[this.active.collection]
    if (!activeRef) return null
    return find(
      activeRef,
      // eslint-disable-next-line eqeqeq
      ({node}) => node.sortableInfo.index == this.active.index
    ) || activeRef.slice(-1).pop();
  }

  getIndex(collection, ref) {
    return this.refs[collection].indexOf(ref);
  }

  getOrderedRefs(collection = this.active.collection) {
    return sortBy(this.refs[collection], ({node}) => node.sortableInfo.index);
  }
}
