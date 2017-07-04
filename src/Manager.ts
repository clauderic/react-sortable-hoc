import { find, sortBy } from 'lodash';

export interface SortableNode extends HTMLElement {
  sortableInfo: {
    index: number,
    collection: string,
    manager: Manager,
  };
}

export default class Manager {
  refs: { [collection: string]: HTMLElement[] };
  active: { collection: string, index: number };

  constructor() {
    this.refs = {};
  }

  add(collection: string, ref: HTMLElement) {
    if (!this.refs[collection]) {
      this.refs[collection] = [];
    }

    this.refs[collection].push(ref);
  }

  remove(collection: string, ref: HTMLElement) {
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
      this.refs[this.active.collection],
      // eslint-disable-next-line eqeqeq
      ({ node }: { node: SortableNode }) => node.sortableInfo.index == this.active.index
    );
  }

  getIndex(collection: string, ref: HTMLElement) {
    return this.refs[collection].indexOf(ref);
  }

  getOrderedRefs(collection = this.active.collection) {
    return sortBy(this.refs[collection], ({ node }: { node: SortableNode }) => node.sortableInfo.index);
  }
}
