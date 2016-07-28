import find from 'lodash/find';
import sortBy from 'lodash/sortBy';

export default class Manager {
	refs = {};
	add(collection, ref) {
		if (!this.refs[collection]) this.refs[collection] = [];

		this.refs[collection].push(ref)
	}
	remove(collection, ref) {
		let index = this.getIndex(collection, ref);

		if (index !== -1) {
			this.refs[collection].splice(index, 1);
		}
	}
	getActive() {
		return find(this.refs[this.active.collection], ({node}) => node.sortableInfo.index == this.active.index);
	}
	getIndex(collection, ref) {
		return this.refs[collection].indexOf(ref);
	}
	getOrderedRefs(collection = this.active.collection) {
		return sortBy(this.refs[collection], ({node}) => node.sortableInfo.index);
	}
}
