export default class Manager {
  refs = {};

  add(collection, ref) {
    if (!this.refs[collection]) {
      this.refs[collection] = [];
    }

    this.refs[collection].push(ref);
  }

  remove(collection, ref) {
    const index = this.findIndex(collection, ref);

    if (index !== -1) {
      this.refs[collection].splice(index, 1);
    }
  }

  isActive() {
    return this.active;
  }

  getActive() {
    return this.nodeAtIndex(this.active.index);
  }

  nodeAtIndex(index, collection = this.active.collection) {
    return this.refs[collection].find(
      // eslint-disable-next-line eqeqeq
      ({node}) => node.sortableInfo.index == index,
    );
  }

  findIndex(collection, ref) {
    return this.refs[collection].indexOf(ref);
  }

  getOrderedRefs(collection = this.active.collection) {
    return this.refs[collection].sort(sortByIndex);
  }

  getRefs(collection = this.active.collection) {
    return this.refs[collection];
  }
}

function sortByIndex(
  {
    node: {
      sortableInfo: {index: index1},
    },
  },
  {
    node: {
      sortableInfo: {index: index2},
    },
  },
) {
  return index1 - index2;
}
