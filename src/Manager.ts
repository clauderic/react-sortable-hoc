import { find, sortBy } from 'lodash';

export interface SortableNode extends HTMLElement {
  sortableInfo: {
    index: number,
    collection: string,
    manager: Manager,
  }
}

export default class Manager {
  refs: { [collection: string]: SortableNode[] };
  active: { collection: string, index: number } | undefined;

  constructor() {
    this.refs = {};
  }

  add(collection: string, ref: SortableNode) {
    if (!this.refs[collection]) {
      this.refs[collection] = [];
    }

    this.refs[collection].push(ref);
  }

  remove(collection: string, ref: SortableNode) {
    const index = this.getIndex(collection, ref);

    if (index !== -1) {
      this.refs[collection].splice(index, 1);
    }
  }

  isActive() {
    return this.active;
  }

  getActive() {
    if (this.active === undefined) {
      return;
    }
    const active = this.active;
    return find(
      this.refs[active.collection],
      // eslint-disable-next-line eqeqeq
      ({ node }: { node: SortableNode }) => node.sortableInfo.index === active.index
    );
  }

  getIndex(collection: string, ref: SortableNode) {
    return this.refs[collection].indexOf(ref);
  }

  getOrderedRefs(collection = this.active.collection) {
    return sortBy(this.refs[collection], ({ node }: { node: SortableNode }) => node.sortableInfo.index);
  }
}
