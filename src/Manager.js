import find from 'ramda/src/find';
import sortBy from 'ramda/src/sortBy';

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
    return find(
      // eslint-disable-next-line eqeqeq
      ({node}) => node.sortableInfo.index == this.active.index
    )(this.refs[this.active.collection]);
  }

  getIndex(collection, ref) {
    return this.refs[collection].indexOf(ref);
  }

  getOrderedRefs(collection = this.active.collection) {
    return sortBy(({node}) => node.sortableInfo.index)(this.refs[collection]);
  }
}
