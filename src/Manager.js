import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import {arrayMove} from './utils';

export default class Manager {
	refs = {};
	add(collection, ref) {
		if (!this.refs[collection]) this.refs[collection] = [];

		this.refs[collection].push(ref)
	}
	getIndex(collection, ref) {
		return this.refs[collection].indexOf(ref);
	}
	getOrderedRefs(collection = this.active.collection) {
		return sortBy(this.refs[collection], 'index');
	}
	move(collection, oldIndex, newIndex) {
		const nodes = this.refs[collection];
		arrayMove(nodes, oldIndex, newIndex);
		for (let i = 0, len = nodes.length; i < len; i++) {
			nodes[i].index = i;
			nodes[i].node.sortableInfo.index = i;
		}
	}
	remove(collection, ref) {
		let index = this.getIndex(collection, ref);

		if (index !== -1) {
			this.refs[collection].splice(index, 1);
		}
	}
	getActive() {
		return find(this.refs[this.active.collection], (ref) => ref.index == this.active.index);
	}
}
