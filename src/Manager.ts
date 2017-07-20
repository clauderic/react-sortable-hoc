import {find, sortBy} from 'lodash';

export type Collection = string | number;

export interface SortableNode extends HTMLElement {
  sortableInfo: {
    index?: number;
    collection?: Collection;
    manager: Manager;
  };
}

export interface Ref {
  node: SortableNode;
  collection?: Collection;
  edgeOffset?: {
    top: number;
    left: number;
  };
}

export default class Manager {
  refs: {[collection: string]: Ref[]};
  active: {collection: Collection; index: number} | undefined;

  constructor() {
    this.refs = {};
  }

  add(collection: Collection, ref: Ref) {
    if (!this.refs[collection]) {
      this.refs[collection] = [];
    }

    this.refs[collection].push(ref);
  }

  remove(collection: Collection, ref: Ref) {
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
      ({node}) => node.sortableInfo.index === active.index
    );
  }

  getIndex(collection: Collection, ref: Ref) {
    return this.refs[collection].indexOf(ref);
  }

  getOrderedRefs(collection?: Collection) {
    // = this.active.collection) {
    const collectionToUse =
      collection === undefined && this.active !== undefined
        ? this.active.collection
        : collection;

    if (collectionToUse === undefined) {
      return;
    }

    return sortBy(
      this.refs[collectionToUse],
      ({node}) => node.sortableInfo.index
    );
  }
}
