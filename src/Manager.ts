import { find, sortBy } from 'lodash';

export interface SortableNode extends HTMLElement {
  sortableInfo: {
    index: number,
    collection: string,
    manager: Manager,
  },
}

export interface Ref {
  node: SortableNode,
  collection: string,
  edgeOffset: { top: number, left: number } | undefined
}

export default class Manager {
  refs: { [collection: string]: Ref[] };
  active: { collection: string, index: number } | undefined;

  constructor() {
    this.refs = {};
  }

  add(collection: string, ref: Ref) {
    if (!this.refs[collection]) {
      this.refs[collection] = [];
    }

    this.refs[collection].push(ref);
  }

  remove(collection: string, ref: Ref) {
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
      ({ node }) => node.sortableInfo.index === active.index
    );
  }

  getIndex(collection: string, ref: Ref) {
    return this.refs[collection].indexOf(ref);
  }

  getOrderedRefs(collection?: string) {// = this.active.collection) {
    const collectionToUse = (/*if*/ collection === undefined && this.active !== undefined
      ? this.active.collection
      : collection
    );

    if (collectionToUse === undefined) {
      return;
    }

    return sortBy(
      this.refs[collectionToUse],
      ({ node }) => node.sortableInfo.index
    );
  }
}
