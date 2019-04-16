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
    const nodes = this.refs[this.active.collection];

    for (let i = 0, len = nodes.length; i < len; i++) {
      const {node} = nodes[i];

      // eslint-disable-next-line eqeqeq
      if (node.sortableInfo.index == this.active.index) {
        return nodes[i];
      }
    }
    
    return undefined;
  }

  getIndex(collection, ref) {
    return this.refs[collection].indexOf(ref);
  }

  getOrderedRefs(collection = this.active.collection) {
    return this.refs[collection].sort(sortByIndex);
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
