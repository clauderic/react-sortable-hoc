import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';

var Manager = function () {
	function Manager() {
		_classCallCheck(this, Manager);

		this.refs = {};
	}

	_createClass(Manager, [{
		key: 'add',
		value: function add(collection, ref) {
			if (!this.refs[collection]) this.refs[collection] = [];

			this.refs[collection].push(ref);
		}
	}, {
		key: 'remove',
		value: function remove(collection, ref) {
			var index = this.getIndex(collection, ref);

			if (index !== -1) {
				this.refs[collection].splice(index, 1);
			}
		}
	}, {
		key: 'getActive',
		value: function getActive() {
			var _this = this;

			return find(this.refs[this.active.collection], function (_ref) {
				var node = _ref.node;
				return node.sortableInfo.index == _this.active.index;
			});
		}
	}, {
		key: 'getIndex',
		value: function getIndex(collection, ref) {
			return this.refs[collection].indexOf(ref);
		}
	}, {
		key: 'getOrderedRefs',
		value: function getOrderedRefs() {
			var collection = arguments.length <= 0 || arguments[0] === undefined ? this.active.collection : arguments[0];

			return sortBy(this.refs[collection], function (_ref2) {
				var node = _ref2.node;
				return node.sortableInfo.index;
			});
		}
	}]);

	return Manager;
}();

export default Manager;