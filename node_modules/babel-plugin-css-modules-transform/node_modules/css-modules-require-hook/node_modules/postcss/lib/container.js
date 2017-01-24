'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _declaration = require('./declaration');

var _declaration2 = _interopRequireDefault(_declaration);

var _warnOnce = require('./warn-once');

var _warnOnce2 = _interopRequireDefault(_warnOnce);

var _comment = require('./comment');

var _comment2 = _interopRequireDefault(_comment);

var _node = require('./node');

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function cleanSource(nodes) {
    return nodes.map(function (i) {
        if (i.nodes) i.nodes = cleanSource(i.nodes);
        delete i.source;
        return i;
    });
}

/**
 * @callback childCondition
 * @param {Node} node    - container child
 * @param {number} index - child index
 * @param {Node[]} nodes - all container children
 * @return {boolean}
 */

/**
 * @callback childIterator
 * @param {Node} node    - container child
 * @param {number} index - child index
 * @return {false|undefined} returning `false` will break iteration
 */

/**
 * The {@link Root}, {@link AtRule}, and {@link Rule} container nodes
 * inherit some common methods to help work with their children.
 *
 * Note that all containers can store any content. If you write a rule inside
 * a rule, PostCSS will parse it.
 *
 * @extends Node
 * @abstract
 * @ignore
 */

var Container = function (_Node) {
    _inherits(Container, _Node);

    function Container() {
        _classCallCheck(this, Container);

        return _possibleConstructorReturn(this, _Node.apply(this, arguments));
    }

    Container.prototype.push = function push(child) {
        child.parent = this;
        this.nodes.push(child);
        return this;
    };

    /**
     * Iterates through the container’s immediate children,
     * calling `callback` for each child.
     *
     * Returning `false` in the callback will break iteration.
     *
     * This method only iterates through the container’s immediate children.
     * If you need to recursively iterate through all the container’s descendant
     * nodes, use {@link Container#walk}.
     *
     * Unlike the for `{}`-cycle or `Array#forEach` this iterator is safe
     * if you are mutating the array of child nodes during iteration.
     * PostCSS will adjust the current index to match the mutations.
     *
     * @param {childIterator} callback - iterator receives each node and index
     *
     * @return {false|undefined} returns `false` if iteration was broke
     *
     * @example
     * const root = postcss.parse('a { color: black; z-index: 1 }');
     * const rule = root.first;
     *
     * for ( let decl of rule.nodes ) {
     *     decl.cloneBefore({ prop: '-webkit-' + decl.prop });
     *     // Cycle will be infinite, because cloneBefore moves the current node
     *     // to the next index
     * }
     *
     * rule.each(decl => {
     *     decl.cloneBefore({ prop: '-webkit-' + decl.prop });
     *     // Will be executed only for color and z-index
     * });
     */


    Container.prototype.each = function each(callback) {
        if (!this.lastEach) this.lastEach = 0;
        if (!this.indexes) this.indexes = {};

        this.lastEach += 1;
        var id = this.lastEach;
        this.indexes[id] = 0;

        if (!this.nodes) return undefined;

        var index = void 0,
            result = void 0;
        while (this.indexes[id] < this.nodes.length) {
            index = this.indexes[id];
            result = callback(this.nodes[index], index);
            if (result === false) break;

            this.indexes[id] += 1;
        }

        delete this.indexes[id];

        return result;
    };

    /**
     * Traverses the container’s descendant nodes, calling callback
     * for each node.
     *
     * Like container.each(), this method is safe to use
     * if you are mutating arrays during iteration.
     *
     * If you only need to iterate through the container’s immediate children,
     * use {@link Container#each}.
     *
     * @param {childIterator} callback - iterator receives each node and index
     *
     * @return {false|undefined} returns `false` if iteration was broke
     *
     * @example
     * root.walk(node => {
     *   // Traverses all descendant nodes.
     * });
     */


    Container.prototype.walk = function walk(callback) {
        return this.each(function (child, i) {
            var result = callback(child, i);
            if (result !== false && child.walk) {
                result = child.walk(callback);
            }
            return result;
        });
    };

    /**
     * Traverses the container’s descendant nodes, calling callback
     * for each declaration node.
     *
     * If you pass a filter, iteration will only happen over declarations
     * with matching properties.
     *
     * Like {@link Container#each}, this method is safe
     * to use if you are mutating arrays during iteration.
     *
     * @param {string|RegExp} [prop]   - string or regular expression
     *                                   to filter declarations by property name
     * @param {childIterator} callback - iterator receives each node and index
     *
     * @return {false|undefined} returns `false` if iteration was broke
     *
     * @example
     * root.walkDecls(decl => {
     *   checkPropertySupport(decl.prop);
     * });
     *
     * root.walkDecls('border-radius', decl => {
     *   decl.remove();
     * });
     *
     * root.walkDecls(/^background/, decl => {
     *   decl.value = takeFirstColorFromGradient(decl.value);
     * });
     */


    Container.prototype.walkDecls = function walkDecls(prop, callback) {
        if (!callback) {
            callback = prop;
            return this.walk(function (child, i) {
                if (child.type === 'decl') {
                    return callback(child, i);
                }
            });
        } else if (prop instanceof RegExp) {
            return this.walk(function (child, i) {
                if (child.type === 'decl' && prop.test(child.prop)) {
                    return callback(child, i);
                }
            });
        } else {
            return this.walk(function (child, i) {
                if (child.type === 'decl' && child.prop === prop) {
                    return callback(child, i);
                }
            });
        }
    };

    /**
     * Traverses the container’s descendant nodes, calling callback
     * for each rule node.
     *
     * If you pass a filter, iteration will only happen over rules
     * with matching selectors.
     *
     * Like {@link Container#each}, this method is safe
     * to use if you are mutating arrays during iteration.
     *
     * @param {string|RegExp} [selector] - string or regular expression
     *                                     to filter rules by selector
     * @param {childIterator} callback   - iterator receives each node and index
     *
     * @return {false|undefined} returns `false` if iteration was broke
     *
     * @example
     * const selectors = [];
     * root.walkRules(rule => {
     *   selectors.push(rule.selector);
     * });
     * console.log(`Your CSS uses ${selectors.length} selectors');
     */


    Container.prototype.walkRules = function walkRules(selector, callback) {
        if (!callback) {
            callback = selector;

            return this.walk(function (child, i) {
                if (child.type === 'rule') {
                    return callback(child, i);
                }
            });
        } else if (selector instanceof RegExp) {
            return this.walk(function (child, i) {
                if (child.type === 'rule' && selector.test(child.selector)) {
                    return callback(child, i);
                }
            });
        } else {
            return this.walk(function (child, i) {
                if (child.type === 'rule' && child.selector === selector) {
                    return callback(child, i);
                }
            });
        }
    };

    /**
     * Traverses the container’s descendant nodes, calling callback
     * for each at-rule node.
     *
     * If you pass a filter, iteration will only happen over at-rules
     * that have matching names.
     *
     * Like {@link Container#each}, this method is safe
     * to use if you are mutating arrays during iteration.
     *
     * @param {string|RegExp} [name]   - string or regular expression
     *                                   to filter at-rules by name
     * @param {childIterator} callback - iterator receives each node and index
     *
     * @return {false|undefined} returns `false` if iteration was broke
     *
     * @example
     * root.walkAtRules(rule => {
     *   if ( isOld(rule.name) ) rule.remove();
     * });
     *
     * let first = false;
     * root.walkAtRules('charset', rule => {
     *   if ( !first ) {
     *     first = true;
     *   } else {
     *     rule.remove();
     *   }
     * });
     */


    Container.prototype.walkAtRules = function walkAtRules(name, callback) {
        if (!callback) {
            callback = name;
            return this.walk(function (child, i) {
                if (child.type === 'atrule') {
                    return callback(child, i);
                }
            });
        } else if (name instanceof RegExp) {
            return this.walk(function (child, i) {
                if (child.type === 'atrule' && name.test(child.name)) {
                    return callback(child, i);
                }
            });
        } else {
            return this.walk(function (child, i) {
                if (child.type === 'atrule' && child.name === name) {
                    return callback(child, i);
                }
            });
        }
    };

    /**
     * Traverses the container’s descendant nodes, calling callback
     * for each comment node.
     *
     * Like {@link Container#each}, this method is safe
     * to use if you are mutating arrays during iteration.
     *
     * @param {childIterator} callback - iterator receives each node and index
     *
     * @return {false|undefined} returns `false` if iteration was broke
     *
     * @example
     * root.walkComments(comment => {
     *   comment.remove();
     * });
     */


    Container.prototype.walkComments = function walkComments(callback) {
        return this.walk(function (child, i) {
            if (child.type === 'comment') {
                return callback(child, i);
            }
        });
    };

    /**
     * Inserts new nodes to the start of the container.
     *
     * @param {...(Node|object|string|Node[])} children - new nodes
     *
     * @return {Node} this node for methods chain
     *
     * @example
     * const decl1 = postcss.decl({ prop: 'color', value: 'black' });
     * const decl2 = postcss.decl({ prop: 'background-color', value: 'white' });
     * rule.append(decl1, decl2);
     *
     * root.append({ name: 'charset', params: '"UTF-8"' });  // at-rule
     * root.append({ selector: 'a' });                       // rule
     * rule.append({ prop: 'color', value: 'black' });       // declaration
     * rule.append({ text: 'Comment' })                      // comment
     *
     * root.append('a {}');
     * root.first.append('color: black; z-index: 1');
     */


    Container.prototype.append = function append() {
        for (var _len = arguments.length, children = Array(_len), _key = 0; _key < _len; _key++) {
            children[_key] = arguments[_key];
        }

        for (var _iterator = children, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var child = _ref;

            var nodes = this.normalize(child, this.last);
            for (var _iterator2 = nodes, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
                var _ref2;

                if (_isArray2) {
                    if (_i2 >= _iterator2.length) break;
                    _ref2 = _iterator2[_i2++];
                } else {
                    _i2 = _iterator2.next();
                    if (_i2.done) break;
                    _ref2 = _i2.value;
                }

                var node = _ref2;
                this.nodes.push(node);
            }
        }
        return this;
    };

    /**
     * Inserts new nodes to the end of the container.
     *
     * @param {...(Node|object|string|Node[])} children - new nodes
     *
     * @return {Node} this node for methods chain
     *
     * @example
     * const decl1 = postcss.decl({ prop: 'color', value: 'black' });
     * const decl2 = postcss.decl({ prop: 'background-color', value: 'white' });
     * rule.prepend(decl1, decl2);
     *
     * root.append({ name: 'charset', params: '"UTF-8"' });  // at-rule
     * root.append({ selector: 'a' });                       // rule
     * rule.append({ prop: 'color', value: 'black' });       // declaration
     * rule.append({ text: 'Comment' })                      // comment
     *
     * root.append('a {}');
     * root.first.append('color: black; z-index: 1');
     */


    Container.prototype.prepend = function prepend() {
        for (var _len2 = arguments.length, children = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            children[_key2] = arguments[_key2];
        }

        children = children.reverse();
        for (var _iterator3 = children, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
            var _ref3;

            if (_isArray3) {
                if (_i3 >= _iterator3.length) break;
                _ref3 = _iterator3[_i3++];
            } else {
                _i3 = _iterator3.next();
                if (_i3.done) break;
                _ref3 = _i3.value;
            }

            var child = _ref3;

            var nodes = this.normalize(child, this.first, 'prepend').reverse();
            for (var _iterator4 = nodes, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
                var _ref4;

                if (_isArray4) {
                    if (_i4 >= _iterator4.length) break;
                    _ref4 = _iterator4[_i4++];
                } else {
                    _i4 = _iterator4.next();
                    if (_i4.done) break;
                    _ref4 = _i4.value;
                }

                var node = _ref4;
                this.nodes.unshift(node);
            }for (var id in this.indexes) {
                this.indexes[id] = this.indexes[id] + nodes.length;
            }
        }
        return this;
    };

    Container.prototype.cleanRaws = function cleanRaws(keepBetween) {
        _Node.prototype.cleanRaws.call(this, keepBetween);
        if (this.nodes) {
            for (var _iterator5 = this.nodes, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
                var _ref5;

                if (_isArray5) {
                    if (_i5 >= _iterator5.length) break;
                    _ref5 = _iterator5[_i5++];
                } else {
                    _i5 = _iterator5.next();
                    if (_i5.done) break;
                    _ref5 = _i5.value;
                }

                var node = _ref5;
                node.cleanRaws(keepBetween);
            }
        }
    };

    /**
     * Insert new node before old node within the container.
     *
     * @param {Node|number} exist             - child or child’s index.
     * @param {Node|object|string|Node[]} add - new node
     *
     * @return {Node} this node for methods chain
     *
     * @example
     * rule.insertBefore(decl, decl.clone({ prop: '-webkit-' + decl.prop }));
     */


    Container.prototype.insertBefore = function insertBefore(exist, add) {
        exist = this.index(exist);

        var type = exist === 0 ? 'prepend' : false;
        var nodes = this.normalize(add, this.nodes[exist], type).reverse();
        for (var _iterator6 = nodes, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
            var _ref6;

            if (_isArray6) {
                if (_i6 >= _iterator6.length) break;
                _ref6 = _iterator6[_i6++];
            } else {
                _i6 = _iterator6.next();
                if (_i6.done) break;
                _ref6 = _i6.value;
            }

            var node = _ref6;
            this.nodes.splice(exist, 0, node);
        }var index = void 0;
        for (var id in this.indexes) {
            index = this.indexes[id];
            if (exist <= index) {
                this.indexes[id] = index + nodes.length;
            }
        }

        return this;
    };

    /**
     * Insert new node after old node within the container.
     *
     * @param {Node|number} exist             - child or child’s index
     * @param {Node|object|string|Node[]} add - new node
     *
     * @return {Node} this node for methods chain
     */


    Container.prototype.insertAfter = function insertAfter(exist, add) {
        exist = this.index(exist);

        var nodes = this.normalize(add, this.nodes[exist]).reverse();
        for (var _iterator7 = nodes, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
            var _ref7;

            if (_isArray7) {
                if (_i7 >= _iterator7.length) break;
                _ref7 = _iterator7[_i7++];
            } else {
                _i7 = _iterator7.next();
                if (_i7.done) break;
                _ref7 = _i7.value;
            }

            var node = _ref7;
            this.nodes.splice(exist + 1, 0, node);
        }var index = void 0;
        for (var id in this.indexes) {
            index = this.indexes[id];
            if (exist < index) {
                this.indexes[id] = index + nodes.length;
            }
        }

        return this;
    };

    Container.prototype.remove = function remove(child) {
        if (typeof child !== 'undefined') {
            (0, _warnOnce2.default)('Container#remove is deprecated. ' + 'Use Container#removeChild');
            this.removeChild(child);
        } else {
            _Node.prototype.remove.call(this);
        }
        return this;
    };

    /**
     * Removes node from the container and cleans the parent properties
     * from the node and its children.
     *
     * @param {Node|number} child - child or child’s index
     *
     * @return {Node} this node for methods chain
     *
     * @example
     * rule.nodes.length  //=> 5
     * rule.removeChild(decl);
     * rule.nodes.length  //=> 4
     * decl.parent        //=> undefined
     */


    Container.prototype.removeChild = function removeChild(child) {
        child = this.index(child);
        this.nodes[child].parent = undefined;
        this.nodes.splice(child, 1);

        var index = void 0;
        for (var id in this.indexes) {
            index = this.indexes[id];
            if (index >= child) {
                this.indexes[id] = index - 1;
            }
        }

        return this;
    };

    /**
     * Removes all children from the container
     * and cleans their parent properties.
     *
     * @return {Node} this node for methods chain
     *
     * @example
     * rule.removeAll();
     * rule.nodes.length //=> 0
     */


    Container.prototype.removeAll = function removeAll() {
        for (var _iterator8 = this.nodes, _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
            var _ref8;

            if (_isArray8) {
                if (_i8 >= _iterator8.length) break;
                _ref8 = _iterator8[_i8++];
            } else {
                _i8 = _iterator8.next();
                if (_i8.done) break;
                _ref8 = _i8.value;
            }

            var node = _ref8;
            node.parent = undefined;
        }this.nodes = [];
        return this;
    };

    /**
     * Passes all declaration values within the container that match pattern
     * through callback, replacing those values with the returned result
     * of callback.
     *
     * This method is useful if you are using a custom unit or function
     * and need to iterate through all values.
     *
     * @param {string|RegExp} pattern    - replace pattern
     * @param {object} opts              - options to speed up the search
     * @param {string} opts.prop         - an array of property names
     * @param {string} opts.fast         - string that’s used
     *                                     to narrow down values and speed up
     *                                     the regexp search
     * @param {function|string} callback - string to replace pattern
     *                                     or callback that returns a new value.
     *                                     The callback will receive
     *                                     the same arguments as those passed
     *                                     to a function parameter
     *                                     of `String#replace`.
     *
     * @return {Node} this node for methods chain
     *
     * @example
     * root.replaceValues(/\d+rem/, { fast: 'rem' }, string => {
     *   return 15 * parseInt(string) + 'px';
     * });
     */


    Container.prototype.replaceValues = function replaceValues(pattern, opts, callback) {
        if (!callback) {
            callback = opts;
            opts = {};
        }

        this.walkDecls(function (decl) {
            if (opts.props && opts.props.indexOf(decl.prop) === -1) return;
            if (opts.fast && decl.value.indexOf(opts.fast) === -1) return;

            decl.value = decl.value.replace(pattern, callback);
        });

        return this;
    };

    /**
     * Returns `true` if callback returns `true`
     * for all of the container’s children.
     *
     * @param {childCondition} condition - iterator returns true or false.
     *
     * @return {boolean} is every child pass condition
     *
     * @example
     * const noPrefixes = rule.every(i => i.prop[0] !== '-');
     */


    Container.prototype.every = function every(condition) {
        return this.nodes.every(condition);
    };

    /**
     * Returns `true` if callback returns `true` for (at least) one
     * of the container’s children.
     *
     * @param {childCondition} condition - iterator returns true or false.
     *
     * @return {boolean} is every child pass condition
     *
     * @example
     * const hasPrefix = rule.every(i => i.prop[0] === '-');
     */


    Container.prototype.some = function some(condition) {
        return this.nodes.some(condition);
    };

    /**
     * Returns a `child`’s index within the {@link Container#nodes} array.
     *
     * @param {Node} child - child of the current container.
     *
     * @return {number} child index
     *
     * @example
     * rule.index( rule.nodes[2] ) //=> 2
     */


    Container.prototype.index = function index(child) {
        if (typeof child === 'number') {
            return child;
        } else {
            return this.nodes.indexOf(child);
        }
    };

    /**
     * The container’s first child.
     *
     * @type {Node}
     *
     * @example
     * rule.first == rules.nodes[0];
     */


    Container.prototype.normalize = function normalize(nodes, sample) {
        var _this2 = this;

        if (typeof nodes === 'string') {
            var parse = require('./parse');
            nodes = cleanSource(parse(nodes).nodes);
        } else if (!Array.isArray(nodes)) {
            if (nodes.type === 'root') {
                nodes = nodes.nodes;
            } else if (nodes.type) {
                nodes = [nodes];
            } else if (nodes.prop) {
                if (typeof nodes.value === 'undefined') {
                    throw new Error('Value field is missed in node creation');
                } else if (typeof nodes.value !== 'string') {
                    nodes.value = String(nodes.value);
                }
                nodes = [new _declaration2.default(nodes)];
            } else if (nodes.selector) {
                var Rule = require('./rule');
                nodes = [new Rule(nodes)];
            } else if (nodes.name) {
                var AtRule = require('./at-rule');
                nodes = [new AtRule(nodes)];
            } else if (nodes.text) {
                nodes = [new _comment2.default(nodes)];
            } else {
                throw new Error('Unknown node type in node creation');
            }
        }

        var processed = nodes.map(function (i) {
            if (typeof i.raws === 'undefined') i = _this2.rebuild(i);

            if (i.parent) i = i.clone();
            if (typeof i.raws.before === 'undefined') {
                if (sample && typeof sample.raws.before !== 'undefined') {
                    i.raws.before = sample.raws.before.replace(/[^\s]/g, '');
                }
            }
            i.parent = _this2;
            return i;
        });

        return processed;
    };

    Container.prototype.rebuild = function rebuild(node, parent) {
        var _this3 = this;

        var fix = void 0;
        if (node.type === 'root') {
            var Root = require('./root');
            fix = new Root();
        } else if (node.type === 'atrule') {
            var AtRule = require('./at-rule');
            fix = new AtRule();
        } else if (node.type === 'rule') {
            var Rule = require('./rule');
            fix = new Rule();
        } else if (node.type === 'decl') {
            fix = new _declaration2.default();
        } else if (node.type === 'comment') {
            fix = new _comment2.default();
        }

        for (var i in node) {
            if (i === 'nodes') {
                fix.nodes = node.nodes.map(function (j) {
                    return _this3.rebuild(j, fix);
                });
            } else if (i === 'parent' && parent) {
                fix.parent = parent;
            } else if (node.hasOwnProperty(i)) {
                fix[i] = node[i];
            }
        }

        return fix;
    };

    Container.prototype.eachInside = function eachInside(callback) {
        (0, _warnOnce2.default)('Container#eachInside is deprecated. ' + 'Use Container#walk instead.');
        return this.walk(callback);
    };

    Container.prototype.eachDecl = function eachDecl(prop, callback) {
        (0, _warnOnce2.default)('Container#eachDecl is deprecated. ' + 'Use Container#walkDecls instead.');
        return this.walkDecls(prop, callback);
    };

    Container.prototype.eachRule = function eachRule(selector, callback) {
        (0, _warnOnce2.default)('Container#eachRule is deprecated. ' + 'Use Container#walkRules instead.');
        return this.walkRules(selector, callback);
    };

    Container.prototype.eachAtRule = function eachAtRule(name, callback) {
        (0, _warnOnce2.default)('Container#eachAtRule is deprecated. ' + 'Use Container#walkAtRules instead.');
        return this.walkAtRules(name, callback);
    };

    Container.prototype.eachComment = function eachComment(callback) {
        (0, _warnOnce2.default)('Container#eachComment is deprecated. ' + 'Use Container#walkComments instead.');
        return this.walkComments(callback);
    };

    _createClass(Container, [{
        key: 'first',
        get: function get() {
            if (!this.nodes) return undefined;
            return this.nodes[0];
        }

        /**
         * The container’s last child.
         *
         * @type {Node}
         *
         * @example
         * rule.last == rule.nodes[rule.nodes.length - 1];
         */

    }, {
        key: 'last',
        get: function get() {
            if (!this.nodes) return undefined;
            return this.nodes[this.nodes.length - 1];
        }
    }, {
        key: 'semicolon',
        get: function get() {
            (0, _warnOnce2.default)('Node#semicolon is deprecated. Use Node#raws.semicolon');
            return this.raws.semicolon;
        },
        set: function set(val) {
            (0, _warnOnce2.default)('Node#semicolon is deprecated. Use Node#raws.semicolon');
            this.raws.semicolon = val;
        }
    }, {
        key: 'after',
        get: function get() {
            (0, _warnOnce2.default)('Node#after is deprecated. Use Node#raws.after');
            return this.raws.after;
        },
        set: function set(val) {
            (0, _warnOnce2.default)('Node#after is deprecated. Use Node#raws.after');
            this.raws.after = val;
        }

        /**
         * @memberof Container#
         * @member {Node[]} nodes - an array containing the container’s children
         *
         * @example
         * const root = postcss.parse('a { color: black }');
         * root.nodes.length           //=> 1
         * root.nodes[0].selector      //=> 'a'
         * root.nodes[0].nodes[0].prop //=> 'color'
         */

    }]);

    return Container;
}(_node2.default);

exports.default = Container;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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RFQ7QUFFQSxlQUFPLEtBQUssU0FBTCxDQUFlLFFBQWYsRUFBeUIsUUFBekIsQ0FBUDtBQUNILEs7O3dCQUVELFUsdUJBQVcsSSxFQUFNLFEsRUFBVTtBQUN2QixnQ0FBUyx5Q0FDQSxvQ0FEVDtBQUVBLGVBQU8sS0FBSyxXQUFMLENBQWlCLElBQWpCLEVBQXVCLFFBQXZCLENBQVA7QUFDSCxLOzt3QkFFRCxXLHdCQUFZLFEsRUFBVTtBQUNsQixnQ0FBUywwQ0FDQSxxQ0FEVDtBQUVBLGVBQU8sS0FBSyxZQUFMLENBQWtCLFFBQWxCLENBQVA7QUFDSCxLOzs7OzRCQXpIVztBQUNSLGdCQUFLLENBQUMsS0FBSyxLQUFYLEVBQW1CLE9BQU8sU0FBUDtBQUNuQixtQkFBTyxLQUFLLEtBQUwsQ0FBVyxDQUFYLENBQVA7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs7NEJBUVc7QUFDUCxnQkFBSyxDQUFDLEtBQUssS0FBWCxFQUFtQixPQUFPLFNBQVA7QUFDbkIsbUJBQU8sS0FBSyxLQUFMLENBQVcsS0FBSyxLQUFMLENBQVcsTUFBWCxHQUFvQixDQUEvQixDQUFQO0FBQ0g7Ozs0QkEyR2U7QUFDWixvQ0FBUyx1REFBVDtBQUNBLG1CQUFPLEtBQUssSUFBTCxDQUFVLFNBQWpCO0FBQ0gsUzswQkFFYSxHLEVBQUs7QUFDZixvQ0FBUyx1REFBVDtBQUNBLGlCQUFLLElBQUwsQ0FBVSxTQUFWLEdBQXNCLEdBQXRCO0FBQ0g7Ozs0QkFFVztBQUNSLG9DQUFTLCtDQUFUO0FBQ0EsbUJBQU8sS0FBSyxJQUFMLENBQVUsS0FBakI7QUFDSCxTOzBCQUVTLEcsRUFBSztBQUNYLG9DQUFTLCtDQUFUO0FBQ0EsaUJBQUssSUFBTCxDQUFVLEtBQVYsR0FBa0IsR0FBbEI7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OztrQkFhVyxTIiwiZmlsZSI6ImNvbnRhaW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEZWNsYXJhdGlvbiBmcm9tICcuL2RlY2xhcmF0aW9uJztcbmltcG9ydCB3YXJuT25jZSAgICBmcm9tICcuL3dhcm4tb25jZSc7XG5pbXBvcnQgQ29tbWVudCAgICAgZnJvbSAnLi9jb21tZW50JztcbmltcG9ydCBOb2RlICAgICAgICBmcm9tICcuL25vZGUnO1xuXG5mdW5jdGlvbiBjbGVhblNvdXJjZShub2Rlcykge1xuICAgIHJldHVybiBub2Rlcy5tYXAoIGkgPT4ge1xuICAgICAgICBpZiAoIGkubm9kZXMgKSBpLm5vZGVzID0gY2xlYW5Tb3VyY2UoaS5ub2Rlcyk7XG4gICAgICAgIGRlbGV0ZSBpLnNvdXJjZTtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogQGNhbGxiYWNrIGNoaWxkQ29uZGl0aW9uXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgICAgLSBjb250YWluZXIgY2hpbGRcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIGNoaWxkIGluZGV4XG4gKiBAcGFyYW0ge05vZGVbXX0gbm9kZXMgLSBhbGwgY29udGFpbmVyIGNoaWxkcmVuXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5cbiAvKipcbiAgKiBAY2FsbGJhY2sgY2hpbGRJdGVyYXRvclxuICAqIEBwYXJhbSB7Tm9kZX0gbm9kZSAgICAtIGNvbnRhaW5lciBjaGlsZFxuICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIGNoaWxkIGluZGV4XG4gICogQHJldHVybiB7ZmFsc2V8dW5kZWZpbmVkfSByZXR1cm5pbmcgYGZhbHNlYCB3aWxsIGJyZWFrIGl0ZXJhdGlvblxuICAqL1xuXG4vKipcbiAqIFRoZSB7QGxpbmsgUm9vdH0sIHtAbGluayBBdFJ1bGV9LCBhbmQge0BsaW5rIFJ1bGV9IGNvbnRhaW5lciBub2Rlc1xuICogaW5oZXJpdCBzb21lIGNvbW1vbiBtZXRob2RzIHRvIGhlbHAgd29yayB3aXRoIHRoZWlyIGNoaWxkcmVuLlxuICpcbiAqIE5vdGUgdGhhdCBhbGwgY29udGFpbmVycyBjYW4gc3RvcmUgYW55IGNvbnRlbnQuIElmIHlvdSB3cml0ZSBhIHJ1bGUgaW5zaWRlXG4gKiBhIHJ1bGUsIFBvc3RDU1Mgd2lsbCBwYXJzZSBpdC5cbiAqXG4gKiBAZXh0ZW5kcyBOb2RlXG4gKiBAYWJzdHJhY3RcbiAqIEBpZ25vcmVcbiAqL1xuY2xhc3MgQ29udGFpbmVyIGV4dGVuZHMgTm9kZSB7XG5cbiAgICBwdXNoKGNoaWxkKSB7XG4gICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XG4gICAgICAgIHRoaXMubm9kZXMucHVzaChjaGlsZCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEl0ZXJhdGVzIHRocm91Z2ggdGhlIGNvbnRhaW5lcuKAmXMgaW1tZWRpYXRlIGNoaWxkcmVuLFxuICAgICAqIGNhbGxpbmcgYGNhbGxiYWNrYCBmb3IgZWFjaCBjaGlsZC5cbiAgICAgKlxuICAgICAqIFJldHVybmluZyBgZmFsc2VgIGluIHRoZSBjYWxsYmFjayB3aWxsIGJyZWFrIGl0ZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIG9ubHkgaXRlcmF0ZXMgdGhyb3VnaCB0aGUgY29udGFpbmVy4oCZcyBpbW1lZGlhdGUgY2hpbGRyZW4uXG4gICAgICogSWYgeW91IG5lZWQgdG8gcmVjdXJzaXZlbHkgaXRlcmF0ZSB0aHJvdWdoIGFsbCB0aGUgY29udGFpbmVy4oCZcyBkZXNjZW5kYW50XG4gICAgICogbm9kZXMsIHVzZSB7QGxpbmsgQ29udGFpbmVyI3dhbGt9LlxuICAgICAqXG4gICAgICogVW5saWtlIHRoZSBmb3IgYHt9YC1jeWNsZSBvciBgQXJyYXkjZm9yRWFjaGAgdGhpcyBpdGVyYXRvciBpcyBzYWZlXG4gICAgICogaWYgeW91IGFyZSBtdXRhdGluZyB0aGUgYXJyYXkgb2YgY2hpbGQgbm9kZXMgZHVyaW5nIGl0ZXJhdGlvbi5cbiAgICAgKiBQb3N0Q1NTIHdpbGwgYWRqdXN0IHRoZSBjdXJyZW50IGluZGV4IHRvIG1hdGNoIHRoZSBtdXRhdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2NoaWxkSXRlcmF0b3J9IGNhbGxiYWNrIC0gaXRlcmF0b3IgcmVjZWl2ZXMgZWFjaCBub2RlIGFuZCBpbmRleFxuICAgICAqXG4gICAgICogQHJldHVybiB7ZmFsc2V8dW5kZWZpbmVkfSByZXR1cm5zIGBmYWxzZWAgaWYgaXRlcmF0aW9uIHdhcyBicm9rZVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjb25zdCByb290ID0gcG9zdGNzcy5wYXJzZSgnYSB7IGNvbG9yOiBibGFjazsgei1pbmRleDogMSB9Jyk7XG4gICAgICogY29uc3QgcnVsZSA9IHJvb3QuZmlyc3Q7XG4gICAgICpcbiAgICAgKiBmb3IgKCBsZXQgZGVjbCBvZiBydWxlLm5vZGVzICkge1xuICAgICAqICAgICBkZWNsLmNsb25lQmVmb3JlKHsgcHJvcDogJy13ZWJraXQtJyArIGRlY2wucHJvcCB9KTtcbiAgICAgKiAgICAgLy8gQ3ljbGUgd2lsbCBiZSBpbmZpbml0ZSwgYmVjYXVzZSBjbG9uZUJlZm9yZSBtb3ZlcyB0aGUgY3VycmVudCBub2RlXG4gICAgICogICAgIC8vIHRvIHRoZSBuZXh0IGluZGV4XG4gICAgICogfVxuICAgICAqXG4gICAgICogcnVsZS5lYWNoKGRlY2wgPT4ge1xuICAgICAqICAgICBkZWNsLmNsb25lQmVmb3JlKHsgcHJvcDogJy13ZWJraXQtJyArIGRlY2wucHJvcCB9KTtcbiAgICAgKiAgICAgLy8gV2lsbCBiZSBleGVjdXRlZCBvbmx5IGZvciBjb2xvciBhbmQgei1pbmRleFxuICAgICAqIH0pO1xuICAgICAqL1xuICAgIGVhY2goY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKCAhdGhpcy5sYXN0RWFjaCApIHRoaXMubGFzdEVhY2ggPSAwO1xuICAgICAgICBpZiAoICF0aGlzLmluZGV4ZXMgKSB0aGlzLmluZGV4ZXMgPSB7IH07XG5cbiAgICAgICAgdGhpcy5sYXN0RWFjaCArPSAxO1xuICAgICAgICBsZXQgaWQgPSB0aGlzLmxhc3RFYWNoO1xuICAgICAgICB0aGlzLmluZGV4ZXNbaWRdID0gMDtcblxuICAgICAgICBpZiAoICF0aGlzLm5vZGVzICkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgICAgICBsZXQgaW5kZXgsIHJlc3VsdDtcbiAgICAgICAgd2hpbGUgKCB0aGlzLmluZGV4ZXNbaWRdIDwgdGhpcy5ub2Rlcy5sZW5ndGggKSB7XG4gICAgICAgICAgICBpbmRleCAgPSB0aGlzLmluZGV4ZXNbaWRdO1xuICAgICAgICAgICAgcmVzdWx0ID0gY2FsbGJhY2sodGhpcy5ub2Rlc1tpbmRleF0sIGluZGV4KTtcbiAgICAgICAgICAgIGlmICggcmVzdWx0ID09PSBmYWxzZSApIGJyZWFrO1xuXG4gICAgICAgICAgICB0aGlzLmluZGV4ZXNbaWRdICs9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgdGhpcy5pbmRleGVzW2lkXTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYXZlcnNlcyB0aGUgY29udGFpbmVy4oCZcyBkZXNjZW5kYW50IG5vZGVzLCBjYWxsaW5nIGNhbGxiYWNrXG4gICAgICogZm9yIGVhY2ggbm9kZS5cbiAgICAgKlxuICAgICAqIExpa2UgY29udGFpbmVyLmVhY2goKSwgdGhpcyBtZXRob2QgaXMgc2FmZSB0byB1c2VcbiAgICAgKiBpZiB5b3UgYXJlIG11dGF0aW5nIGFycmF5cyBkdXJpbmcgaXRlcmF0aW9uLlxuICAgICAqXG4gICAgICogSWYgeW91IG9ubHkgbmVlZCB0byBpdGVyYXRlIHRocm91Z2ggdGhlIGNvbnRhaW5lcuKAmXMgaW1tZWRpYXRlIGNoaWxkcmVuLFxuICAgICAqIHVzZSB7QGxpbmsgQ29udGFpbmVyI2VhY2h9LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtjaGlsZEl0ZXJhdG9yfSBjYWxsYmFjayAtIGl0ZXJhdG9yIHJlY2VpdmVzIGVhY2ggbm9kZSBhbmQgaW5kZXhcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge2ZhbHNlfHVuZGVmaW5lZH0gcmV0dXJucyBgZmFsc2VgIGlmIGl0ZXJhdGlvbiB3YXMgYnJva2VcbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogcm9vdC53YWxrKG5vZGUgPT4ge1xuICAgICAqICAgLy8gVHJhdmVyc2VzIGFsbCBkZXNjZW5kYW50IG5vZGVzLlxuICAgICAqIH0pO1xuICAgICAqL1xuICAgIHdhbGsoY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaCggKGNoaWxkLCBpKSA9PiB7XG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gY2FsbGJhY2soY2hpbGQsIGkpO1xuICAgICAgICAgICAgaWYgKCByZXN1bHQgIT09IGZhbHNlICYmIGNoaWxkLndhbGsgKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gY2hpbGQud2FsayhjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmF2ZXJzZXMgdGhlIGNvbnRhaW5lcuKAmXMgZGVzY2VuZGFudCBub2RlcywgY2FsbGluZyBjYWxsYmFja1xuICAgICAqIGZvciBlYWNoIGRlY2xhcmF0aW9uIG5vZGUuXG4gICAgICpcbiAgICAgKiBJZiB5b3UgcGFzcyBhIGZpbHRlciwgaXRlcmF0aW9uIHdpbGwgb25seSBoYXBwZW4gb3ZlciBkZWNsYXJhdGlvbnNcbiAgICAgKiB3aXRoIG1hdGNoaW5nIHByb3BlcnRpZXMuXG4gICAgICpcbiAgICAgKiBMaWtlIHtAbGluayBDb250YWluZXIjZWFjaH0sIHRoaXMgbWV0aG9kIGlzIHNhZmVcbiAgICAgKiB0byB1c2UgaWYgeW91IGFyZSBtdXRhdGluZyBhcnJheXMgZHVyaW5nIGl0ZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfFJlZ0V4cH0gW3Byb3BdICAgLSBzdHJpbmcgb3IgcmVndWxhciBleHByZXNzaW9uXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGZpbHRlciBkZWNsYXJhdGlvbnMgYnkgcHJvcGVydHkgbmFtZVxuICAgICAqIEBwYXJhbSB7Y2hpbGRJdGVyYXRvcn0gY2FsbGJhY2sgLSBpdGVyYXRvciByZWNlaXZlcyBlYWNoIG5vZGUgYW5kIGluZGV4XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtmYWxzZXx1bmRlZmluZWR9IHJldHVybnMgYGZhbHNlYCBpZiBpdGVyYXRpb24gd2FzIGJyb2tlXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJvb3Qud2Fsa0RlY2xzKGRlY2wgPT4ge1xuICAgICAqICAgY2hlY2tQcm9wZXJ0eVN1cHBvcnQoZGVjbC5wcm9wKTtcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIHJvb3Qud2Fsa0RlY2xzKCdib3JkZXItcmFkaXVzJywgZGVjbCA9PiB7XG4gICAgICogICBkZWNsLnJlbW92ZSgpO1xuICAgICAqIH0pO1xuICAgICAqXG4gICAgICogcm9vdC53YWxrRGVjbHMoL15iYWNrZ3JvdW5kLywgZGVjbCA9PiB7XG4gICAgICogICBkZWNsLnZhbHVlID0gdGFrZUZpcnN0Q29sb3JGcm9tR3JhZGllbnQoZGVjbC52YWx1ZSk7XG4gICAgICogfSk7XG4gICAgICovXG4gICAgd2Fsa0RlY2xzKHByb3AsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICggIWNhbGxiYWNrICkge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBwcm9wO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMud2FsayggKGNoaWxkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCBjaGlsZC50eXBlID09PSAnZGVjbCcgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhjaGlsZCwgaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoIHByb3AgaW5zdGFuY2VvZiBSZWdFeHAgKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53YWxrKCAoY2hpbGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIGNoaWxkLnR5cGUgPT09ICdkZWNsJyAmJiBwcm9wLnRlc3QoY2hpbGQucHJvcCkgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhjaGlsZCwgaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy53YWxrKCAoY2hpbGQsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIGNoaWxkLnR5cGUgPT09ICdkZWNsJyAmJiBjaGlsZC5wcm9wID09PSBwcm9wICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soY2hpbGQsIGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJhdmVyc2VzIHRoZSBjb250YWluZXLigJlzIGRlc2NlbmRhbnQgbm9kZXMsIGNhbGxpbmcgY2FsbGJhY2tcbiAgICAgKiBmb3IgZWFjaCBydWxlIG5vZGUuXG4gICAgICpcbiAgICAgKiBJZiB5b3UgcGFzcyBhIGZpbHRlciwgaXRlcmF0aW9uIHdpbGwgb25seSBoYXBwZW4gb3ZlciBydWxlc1xuICAgICAqIHdpdGggbWF0Y2hpbmcgc2VsZWN0b3JzLlxuICAgICAqXG4gICAgICogTGlrZSB7QGxpbmsgQ29udGFpbmVyI2VhY2h9LCB0aGlzIG1ldGhvZCBpcyBzYWZlXG4gICAgICogdG8gdXNlIGlmIHlvdSBhcmUgbXV0YXRpbmcgYXJyYXlzIGR1cmluZyBpdGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IFtzZWxlY3Rvcl0gLSBzdHJpbmcgb3IgcmVndWxhciBleHByZXNzaW9uXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gZmlsdGVyIHJ1bGVzIGJ5IHNlbGVjdG9yXG4gICAgICogQHBhcmFtIHtjaGlsZEl0ZXJhdG9yfSBjYWxsYmFjayAgIC0gaXRlcmF0b3IgcmVjZWl2ZXMgZWFjaCBub2RlIGFuZCBpbmRleFxuICAgICAqXG4gICAgICogQHJldHVybiB7ZmFsc2V8dW5kZWZpbmVkfSByZXR1cm5zIGBmYWxzZWAgaWYgaXRlcmF0aW9uIHdhcyBicm9rZVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjb25zdCBzZWxlY3RvcnMgPSBbXTtcbiAgICAgKiByb290LndhbGtSdWxlcyhydWxlID0+IHtcbiAgICAgKiAgIHNlbGVjdG9ycy5wdXNoKHJ1bGUuc2VsZWN0b3IpO1xuICAgICAqIH0pO1xuICAgICAqIGNvbnNvbGUubG9nKGBZb3VyIENTUyB1c2VzICR7c2VsZWN0b3JzLmxlbmd0aH0gc2VsZWN0b3JzJyk7XG4gICAgICovXG4gICAgd2Fsa1J1bGVzKHNlbGVjdG9yLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAoICFjYWxsYmFjayApIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gc2VsZWN0b3I7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLndhbGsoIChjaGlsZCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggY2hpbGQudHlwZSA9PT0gJ3J1bGUnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soY2hpbGQsIGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKCBzZWxlY3RvciBpbnN0YW5jZW9mIFJlZ0V4cCApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndhbGsoIChjaGlsZCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggY2hpbGQudHlwZSA9PT0gJ3J1bGUnICYmIHNlbGVjdG9yLnRlc3QoY2hpbGQuc2VsZWN0b3IpICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soY2hpbGQsIGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMud2FsayggKGNoaWxkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCBjaGlsZC50eXBlID09PSAncnVsZScgJiYgY2hpbGQuc2VsZWN0b3IgPT09IHNlbGVjdG9yICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soY2hpbGQsIGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJhdmVyc2VzIHRoZSBjb250YWluZXLigJlzIGRlc2NlbmRhbnQgbm9kZXMsIGNhbGxpbmcgY2FsbGJhY2tcbiAgICAgKiBmb3IgZWFjaCBhdC1ydWxlIG5vZGUuXG4gICAgICpcbiAgICAgKiBJZiB5b3UgcGFzcyBhIGZpbHRlciwgaXRlcmF0aW9uIHdpbGwgb25seSBoYXBwZW4gb3ZlciBhdC1ydWxlc1xuICAgICAqIHRoYXQgaGF2ZSBtYXRjaGluZyBuYW1lcy5cbiAgICAgKlxuICAgICAqIExpa2Uge0BsaW5rIENvbnRhaW5lciNlYWNofSwgdGhpcyBtZXRob2QgaXMgc2FmZVxuICAgICAqIHRvIHVzZSBpZiB5b3UgYXJlIG11dGF0aW5nIGFycmF5cyBkdXJpbmcgaXRlcmF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd8UmVnRXhwfSBbbmFtZV0gICAtIHN0cmluZyBvciByZWd1bGFyIGV4cHJlc3Npb25cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gZmlsdGVyIGF0LXJ1bGVzIGJ5IG5hbWVcbiAgICAgKiBAcGFyYW0ge2NoaWxkSXRlcmF0b3J9IGNhbGxiYWNrIC0gaXRlcmF0b3IgcmVjZWl2ZXMgZWFjaCBub2RlIGFuZCBpbmRleFxuICAgICAqXG4gICAgICogQHJldHVybiB7ZmFsc2V8dW5kZWZpbmVkfSByZXR1cm5zIGBmYWxzZWAgaWYgaXRlcmF0aW9uIHdhcyBicm9rZVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiByb290LndhbGtBdFJ1bGVzKHJ1bGUgPT4ge1xuICAgICAqICAgaWYgKCBpc09sZChydWxlLm5hbWUpICkgcnVsZS5yZW1vdmUoKTtcbiAgICAgKiB9KTtcbiAgICAgKlxuICAgICAqIGxldCBmaXJzdCA9IGZhbHNlO1xuICAgICAqIHJvb3Qud2Fsa0F0UnVsZXMoJ2NoYXJzZXQnLCBydWxlID0+IHtcbiAgICAgKiAgIGlmICggIWZpcnN0ICkge1xuICAgICAqICAgICBmaXJzdCA9IHRydWU7XG4gICAgICogICB9IGVsc2Uge1xuICAgICAqICAgICBydWxlLnJlbW92ZSgpO1xuICAgICAqICAgfVxuICAgICAqIH0pO1xuICAgICAqL1xuICAgIHdhbGtBdFJ1bGVzKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICggIWNhbGxiYWNrICkge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBuYW1lO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMud2FsayggKGNoaWxkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCBjaGlsZC50eXBlID09PSAnYXRydWxlJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNoaWxkLCBpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICggbmFtZSBpbnN0YW5jZW9mIFJlZ0V4cCApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLndhbGsoIChjaGlsZCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICggY2hpbGQudHlwZSA9PT0gJ2F0cnVsZScgJiYgbmFtZS50ZXN0KGNoaWxkLm5hbWUpICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soY2hpbGQsIGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMud2FsayggKGNoaWxkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCBjaGlsZC50eXBlID09PSAnYXRydWxlJyAmJiBjaGlsZC5uYW1lID09PSBuYW1lICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soY2hpbGQsIGkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJhdmVyc2VzIHRoZSBjb250YWluZXLigJlzIGRlc2NlbmRhbnQgbm9kZXMsIGNhbGxpbmcgY2FsbGJhY2tcbiAgICAgKiBmb3IgZWFjaCBjb21tZW50IG5vZGUuXG4gICAgICpcbiAgICAgKiBMaWtlIHtAbGluayBDb250YWluZXIjZWFjaH0sIHRoaXMgbWV0aG9kIGlzIHNhZmVcbiAgICAgKiB0byB1c2UgaWYgeW91IGFyZSBtdXRhdGluZyBhcnJheXMgZHVyaW5nIGl0ZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Y2hpbGRJdGVyYXRvcn0gY2FsbGJhY2sgLSBpdGVyYXRvciByZWNlaXZlcyBlYWNoIG5vZGUgYW5kIGluZGV4XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtmYWxzZXx1bmRlZmluZWR9IHJldHVybnMgYGZhbHNlYCBpZiBpdGVyYXRpb24gd2FzIGJyb2tlXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJvb3Qud2Fsa0NvbW1lbnRzKGNvbW1lbnQgPT4ge1xuICAgICAqICAgY29tbWVudC5yZW1vdmUoKTtcbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICB3YWxrQ29tbWVudHMoY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FsayggKGNoaWxkLCBpKSA9PiB7XG4gICAgICAgICAgICBpZiAoIGNoaWxkLnR5cGUgPT09ICdjb21tZW50JyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soY2hpbGQsIGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnRzIG5ldyBub2RlcyB0byB0aGUgc3RhcnQgb2YgdGhlIGNvbnRhaW5lci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Li4uKE5vZGV8b2JqZWN0fHN0cmluZ3xOb2RlW10pfSBjaGlsZHJlbiAtIG5ldyBub2Rlc1xuICAgICAqXG4gICAgICogQHJldHVybiB7Tm9kZX0gdGhpcyBub2RlIGZvciBtZXRob2RzIGNoYWluXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNvbnN0IGRlY2wxID0gcG9zdGNzcy5kZWNsKHsgcHJvcDogJ2NvbG9yJywgdmFsdWU6ICdibGFjaycgfSk7XG4gICAgICogY29uc3QgZGVjbDIgPSBwb3N0Y3NzLmRlY2woeyBwcm9wOiAnYmFja2dyb3VuZC1jb2xvcicsIHZhbHVlOiAnd2hpdGUnIH0pO1xuICAgICAqIHJ1bGUuYXBwZW5kKGRlY2wxLCBkZWNsMik7XG4gICAgICpcbiAgICAgKiByb290LmFwcGVuZCh7IG5hbWU6ICdjaGFyc2V0JywgcGFyYW1zOiAnXCJVVEYtOFwiJyB9KTsgIC8vIGF0LXJ1bGVcbiAgICAgKiByb290LmFwcGVuZCh7IHNlbGVjdG9yOiAnYScgfSk7ICAgICAgICAgICAgICAgICAgICAgICAvLyBydWxlXG4gICAgICogcnVsZS5hcHBlbmQoeyBwcm9wOiAnY29sb3InLCB2YWx1ZTogJ2JsYWNrJyB9KTsgICAgICAgLy8gZGVjbGFyYXRpb25cbiAgICAgKiBydWxlLmFwcGVuZCh7IHRleHQ6ICdDb21tZW50JyB9KSAgICAgICAgICAgICAgICAgICAgICAvLyBjb21tZW50XG4gICAgICpcbiAgICAgKiByb290LmFwcGVuZCgnYSB7fScpO1xuICAgICAqIHJvb3QuZmlyc3QuYXBwZW5kKCdjb2xvcjogYmxhY2s7IHotaW5kZXg6IDEnKTtcbiAgICAgKi9cbiAgICBhcHBlbmQoLi4uY2hpbGRyZW4pIHtcbiAgICAgICAgZm9yICggbGV0IGNoaWxkIG9mIGNoaWxkcmVuICkge1xuICAgICAgICAgICAgbGV0IG5vZGVzID0gdGhpcy5ub3JtYWxpemUoY2hpbGQsIHRoaXMubGFzdCk7XG4gICAgICAgICAgICBmb3IgKCBsZXQgbm9kZSBvZiBub2RlcyApIHRoaXMubm9kZXMucHVzaChub2RlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnNlcnRzIG5ldyBub2RlcyB0byB0aGUgZW5kIG9mIHRoZSBjb250YWluZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gey4uLihOb2RlfG9iamVjdHxzdHJpbmd8Tm9kZVtdKX0gY2hpbGRyZW4gLSBuZXcgbm9kZXNcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge05vZGV9IHRoaXMgbm9kZSBmb3IgbWV0aG9kcyBjaGFpblxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjb25zdCBkZWNsMSA9IHBvc3Rjc3MuZGVjbCh7IHByb3A6ICdjb2xvcicsIHZhbHVlOiAnYmxhY2snIH0pO1xuICAgICAqIGNvbnN0IGRlY2wyID0gcG9zdGNzcy5kZWNsKHsgcHJvcDogJ2JhY2tncm91bmQtY29sb3InLCB2YWx1ZTogJ3doaXRlJyB9KTtcbiAgICAgKiBydWxlLnByZXBlbmQoZGVjbDEsIGRlY2wyKTtcbiAgICAgKlxuICAgICAqIHJvb3QuYXBwZW5kKHsgbmFtZTogJ2NoYXJzZXQnLCBwYXJhbXM6ICdcIlVURi04XCInIH0pOyAgLy8gYXQtcnVsZVxuICAgICAqIHJvb3QuYXBwZW5kKHsgc2VsZWN0b3I6ICdhJyB9KTsgICAgICAgICAgICAgICAgICAgICAgIC8vIHJ1bGVcbiAgICAgKiBydWxlLmFwcGVuZCh7IHByb3A6ICdjb2xvcicsIHZhbHVlOiAnYmxhY2snIH0pOyAgICAgICAvLyBkZWNsYXJhdGlvblxuICAgICAqIHJ1bGUuYXBwZW5kKHsgdGV4dDogJ0NvbW1lbnQnIH0pICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbW1lbnRcbiAgICAgKlxuICAgICAqIHJvb3QuYXBwZW5kKCdhIHt9Jyk7XG4gICAgICogcm9vdC5maXJzdC5hcHBlbmQoJ2NvbG9yOiBibGFjazsgei1pbmRleDogMScpO1xuICAgICAqL1xuICAgIHByZXBlbmQoLi4uY2hpbGRyZW4pIHtcbiAgICAgICAgY2hpbGRyZW4gPSBjaGlsZHJlbi5yZXZlcnNlKCk7XG4gICAgICAgIGZvciAoIGxldCBjaGlsZCBvZiBjaGlsZHJlbiApIHtcbiAgICAgICAgICAgIGxldCBub2RlcyA9IHRoaXMubm9ybWFsaXplKGNoaWxkLCB0aGlzLmZpcnN0LCAncHJlcGVuZCcpLnJldmVyc2UoKTtcbiAgICAgICAgICAgIGZvciAoIGxldCBub2RlIG9mIG5vZGVzICkgdGhpcy5ub2Rlcy51bnNoaWZ0KG5vZGUpO1xuICAgICAgICAgICAgZm9yICggbGV0IGlkIGluIHRoaXMuaW5kZXhlcyApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4ZXNbaWRdID0gdGhpcy5pbmRleGVzW2lkXSArIG5vZGVzLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjbGVhblJhd3Moa2VlcEJldHdlZW4pIHtcbiAgICAgICAgc3VwZXIuY2xlYW5SYXdzKGtlZXBCZXR3ZWVuKTtcbiAgICAgICAgaWYgKCB0aGlzLm5vZGVzICkge1xuICAgICAgICAgICAgZm9yICggbGV0IG5vZGUgb2YgdGhpcy5ub2RlcyApIG5vZGUuY2xlYW5SYXdzKGtlZXBCZXR3ZWVuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluc2VydCBuZXcgbm9kZSBiZWZvcmUgb2xkIG5vZGUgd2l0aGluIHRoZSBjb250YWluZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge05vZGV8bnVtYmVyfSBleGlzdCAgICAgICAgICAgICAtIGNoaWxkIG9yIGNoaWxk4oCZcyBpbmRleC5cbiAgICAgKiBAcGFyYW0ge05vZGV8b2JqZWN0fHN0cmluZ3xOb2RlW119IGFkZCAtIG5ldyBub2RlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtOb2RlfSB0aGlzIG5vZGUgZm9yIG1ldGhvZHMgY2hhaW5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogcnVsZS5pbnNlcnRCZWZvcmUoZGVjbCwgZGVjbC5jbG9uZSh7IHByb3A6ICctd2Via2l0LScgKyBkZWNsLnByb3AgfSkpO1xuICAgICAqL1xuICAgIGluc2VydEJlZm9yZShleGlzdCwgYWRkKSB7XG4gICAgICAgIGV4aXN0ID0gdGhpcy5pbmRleChleGlzdCk7XG5cbiAgICAgICAgbGV0IHR5cGUgID0gZXhpc3QgPT09IDAgPyAncHJlcGVuZCcgOiBmYWxzZTtcbiAgICAgICAgbGV0IG5vZGVzID0gdGhpcy5ub3JtYWxpemUoYWRkLCB0aGlzLm5vZGVzW2V4aXN0XSwgdHlwZSkucmV2ZXJzZSgpO1xuICAgICAgICBmb3IgKCBsZXQgbm9kZSBvZiBub2RlcyApIHRoaXMubm9kZXMuc3BsaWNlKGV4aXN0LCAwLCBub2RlKTtcblxuICAgICAgICBsZXQgaW5kZXg7XG4gICAgICAgIGZvciAoIGxldCBpZCBpbiB0aGlzLmluZGV4ZXMgKSB7XG4gICAgICAgICAgICBpbmRleCA9IHRoaXMuaW5kZXhlc1tpZF07XG4gICAgICAgICAgICBpZiAoIGV4aXN0IDw9IGluZGV4ICkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhlc1tpZF0gPSBpbmRleCArIG5vZGVzLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluc2VydCBuZXcgbm9kZSBhZnRlciBvbGQgbm9kZSB3aXRoaW4gdGhlIGNvbnRhaW5lci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Tm9kZXxudW1iZXJ9IGV4aXN0ICAgICAgICAgICAgIC0gY2hpbGQgb3IgY2hpbGTigJlzIGluZGV4XG4gICAgICogQHBhcmFtIHtOb2RlfG9iamVjdHxzdHJpbmd8Tm9kZVtdfSBhZGQgLSBuZXcgbm9kZVxuICAgICAqXG4gICAgICogQHJldHVybiB7Tm9kZX0gdGhpcyBub2RlIGZvciBtZXRob2RzIGNoYWluXG4gICAgICovXG4gICAgaW5zZXJ0QWZ0ZXIoZXhpc3QsIGFkZCkge1xuICAgICAgICBleGlzdCA9IHRoaXMuaW5kZXgoZXhpc3QpO1xuXG4gICAgICAgIGxldCBub2RlcyA9IHRoaXMubm9ybWFsaXplKGFkZCwgdGhpcy5ub2Rlc1tleGlzdF0pLnJldmVyc2UoKTtcbiAgICAgICAgZm9yICggbGV0IG5vZGUgb2Ygbm9kZXMgKSB0aGlzLm5vZGVzLnNwbGljZShleGlzdCArIDEsIDAsIG5vZGUpO1xuXG4gICAgICAgIGxldCBpbmRleDtcbiAgICAgICAgZm9yICggbGV0IGlkIGluIHRoaXMuaW5kZXhlcyApIHtcbiAgICAgICAgICAgIGluZGV4ID0gdGhpcy5pbmRleGVzW2lkXTtcbiAgICAgICAgICAgIGlmICggZXhpc3QgPCBpbmRleCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4ZXNbaWRdID0gaW5kZXggKyBub2Rlcy5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZW1vdmUoY2hpbGQpIHtcbiAgICAgICAgaWYgKCB0eXBlb2YgY2hpbGQgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgd2Fybk9uY2UoJ0NvbnRhaW5lciNyZW1vdmUgaXMgZGVwcmVjYXRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICAnVXNlIENvbnRhaW5lciNyZW1vdmVDaGlsZCcpO1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdXBlci5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIG5vZGUgZnJvbSB0aGUgY29udGFpbmVyIGFuZCBjbGVhbnMgdGhlIHBhcmVudCBwcm9wZXJ0aWVzXG4gICAgICogZnJvbSB0aGUgbm9kZSBhbmQgaXRzIGNoaWxkcmVuLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtOb2RlfG51bWJlcn0gY2hpbGQgLSBjaGlsZCBvciBjaGlsZOKAmXMgaW5kZXhcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge05vZGV9IHRoaXMgbm9kZSBmb3IgbWV0aG9kcyBjaGFpblxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBydWxlLm5vZGVzLmxlbmd0aCAgLy89PiA1XG4gICAgICogcnVsZS5yZW1vdmVDaGlsZChkZWNsKTtcbiAgICAgKiBydWxlLm5vZGVzLmxlbmd0aCAgLy89PiA0XG4gICAgICogZGVjbC5wYXJlbnQgICAgICAgIC8vPT4gdW5kZWZpbmVkXG4gICAgICovXG4gICAgcmVtb3ZlQ2hpbGQoY2hpbGQpIHtcbiAgICAgICAgY2hpbGQgPSB0aGlzLmluZGV4KGNoaWxkKTtcbiAgICAgICAgdGhpcy5ub2Rlc1tjaGlsZF0ucGFyZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLm5vZGVzLnNwbGljZShjaGlsZCwgMSk7XG5cbiAgICAgICAgbGV0IGluZGV4O1xuICAgICAgICBmb3IgKCBsZXQgaWQgaW4gdGhpcy5pbmRleGVzICkge1xuICAgICAgICAgICAgaW5kZXggPSB0aGlzLmluZGV4ZXNbaWRdO1xuICAgICAgICAgICAgaWYgKCBpbmRleCA+PSBjaGlsZCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4ZXNbaWRdID0gaW5kZXggLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgY2hpbGRyZW4gZnJvbSB0aGUgY29udGFpbmVyXG4gICAgICogYW5kIGNsZWFucyB0aGVpciBwYXJlbnQgcHJvcGVydGllcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge05vZGV9IHRoaXMgbm9kZSBmb3IgbWV0aG9kcyBjaGFpblxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBydWxlLnJlbW92ZUFsbCgpO1xuICAgICAqIHJ1bGUubm9kZXMubGVuZ3RoIC8vPT4gMFxuICAgICAqL1xuICAgIHJlbW92ZUFsbCgpIHtcbiAgICAgICAgZm9yICggbGV0IG5vZGUgb2YgdGhpcy5ub2RlcyApIG5vZGUucGFyZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLm5vZGVzID0gW107XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBhc3NlcyBhbGwgZGVjbGFyYXRpb24gdmFsdWVzIHdpdGhpbiB0aGUgY29udGFpbmVyIHRoYXQgbWF0Y2ggcGF0dGVyblxuICAgICAqIHRocm91Z2ggY2FsbGJhY2ssIHJlcGxhY2luZyB0aG9zZSB2YWx1ZXMgd2l0aCB0aGUgcmV0dXJuZWQgcmVzdWx0XG4gICAgICogb2YgY2FsbGJhY2suXG4gICAgICpcbiAgICAgKiBUaGlzIG1ldGhvZCBpcyB1c2VmdWwgaWYgeW91IGFyZSB1c2luZyBhIGN1c3RvbSB1bml0IG9yIGZ1bmN0aW9uXG4gICAgICogYW5kIG5lZWQgdG8gaXRlcmF0ZSB0aHJvdWdoIGFsbCB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xSZWdFeHB9IHBhdHRlcm4gICAgLSByZXBsYWNlIHBhdHRlcm5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0cyAgICAgICAgICAgICAgLSBvcHRpb25zIHRvIHNwZWVkIHVwIHRoZSBzZWFyY2hcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0cy5wcm9wICAgICAgICAgLSBhbiBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvcHRzLmZhc3QgICAgICAgICAtIHN0cmluZyB0aGF04oCZcyB1c2VkXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gbmFycm93IGRvd24gdmFsdWVzIGFuZCBzcGVlZCB1cFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSByZWdleHAgc2VhcmNoXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbnxzdHJpbmd9IGNhbGxiYWNrIC0gc3RyaW5nIHRvIHJlcGxhY2UgcGF0dGVyblxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yIGNhbGxiYWNrIHRoYXQgcmV0dXJucyBhIG5ldyB2YWx1ZS5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgY2FsbGJhY2sgd2lsbCByZWNlaXZlXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIHNhbWUgYXJndW1lbnRzIGFzIHRob3NlIHBhc3NlZFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgZnVuY3Rpb24gcGFyYW1ldGVyXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2YgYFN0cmluZyNyZXBsYWNlYC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge05vZGV9IHRoaXMgbm9kZSBmb3IgbWV0aG9kcyBjaGFpblxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiByb290LnJlcGxhY2VWYWx1ZXMoL1xcZCtyZW0vLCB7IGZhc3Q6ICdyZW0nIH0sIHN0cmluZyA9PiB7XG4gICAgICogICByZXR1cm4gMTUgKiBwYXJzZUludChzdHJpbmcpICsgJ3B4JztcbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICByZXBsYWNlVmFsdWVzKHBhdHRlcm4sIG9wdHMsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICggIWNhbGxiYWNrICkge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBvcHRzO1xuICAgICAgICAgICAgb3B0cyA9IHsgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMud2Fsa0RlY2xzKCBkZWNsID0+IHtcbiAgICAgICAgICAgIGlmICggb3B0cy5wcm9wcyAmJiBvcHRzLnByb3BzLmluZGV4T2YoZGVjbC5wcm9wKSA9PT0gLTEgKSByZXR1cm47XG4gICAgICAgICAgICBpZiAoIG9wdHMuZmFzdCAgJiYgZGVjbC52YWx1ZS5pbmRleE9mKG9wdHMuZmFzdCkgPT09IC0xICkgcmV0dXJuO1xuXG4gICAgICAgICAgICBkZWNsLnZhbHVlID0gZGVjbC52YWx1ZS5yZXBsYWNlKHBhdHRlcm4sIGNhbGxiYWNrKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBgdHJ1ZWAgaWYgY2FsbGJhY2sgcmV0dXJucyBgdHJ1ZWBcbiAgICAgKiBmb3IgYWxsIG9mIHRoZSBjb250YWluZXLigJlzIGNoaWxkcmVuLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtjaGlsZENvbmRpdGlvbn0gY29uZGl0aW9uIC0gaXRlcmF0b3IgcmV0dXJucyB0cnVlIG9yIGZhbHNlLlxuICAgICAqXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gaXMgZXZlcnkgY2hpbGQgcGFzcyBjb25kaXRpb25cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogY29uc3Qgbm9QcmVmaXhlcyA9IHJ1bGUuZXZlcnkoaSA9PiBpLnByb3BbMF0gIT09ICctJyk7XG4gICAgICovXG4gICAgZXZlcnkoY29uZGl0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vZGVzLmV2ZXJ5KGNvbmRpdGlvbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBgdHJ1ZWAgaWYgY2FsbGJhY2sgcmV0dXJucyBgdHJ1ZWAgZm9yIChhdCBsZWFzdCkgb25lXG4gICAgICogb2YgdGhlIGNvbnRhaW5lcuKAmXMgY2hpbGRyZW4uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2NoaWxkQ29uZGl0aW9ufSBjb25kaXRpb24gLSBpdGVyYXRvciByZXR1cm5zIHRydWUgb3IgZmFsc2UuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBpcyBldmVyeSBjaGlsZCBwYXNzIGNvbmRpdGlvblxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjb25zdCBoYXNQcmVmaXggPSBydWxlLmV2ZXJ5KGkgPT4gaS5wcm9wWzBdID09PSAnLScpO1xuICAgICAqL1xuICAgIHNvbWUoY29uZGl0aW9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vZGVzLnNvbWUoY29uZGl0aW9uKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgYGNoaWxkYOKAmXMgaW5kZXggd2l0aGluIHRoZSB7QGxpbmsgQ29udGFpbmVyI25vZGVzfSBhcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Tm9kZX0gY2hpbGQgLSBjaGlsZCBvZiB0aGUgY3VycmVudCBjb250YWluZXIuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IGNoaWxkIGluZGV4XG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJ1bGUuaW5kZXgoIHJ1bGUubm9kZXNbMl0gKSAvLz0+IDJcbiAgICAgKi9cbiAgICBpbmRleChjaGlsZCkge1xuICAgICAgICBpZiAoIHR5cGVvZiBjaGlsZCA9PT0gJ251bWJlcicgKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ub2Rlcy5pbmRleE9mKGNoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBjb250YWluZXLigJlzIGZpcnN0IGNoaWxkLlxuICAgICAqXG4gICAgICogQHR5cGUge05vZGV9XG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJ1bGUuZmlyc3QgPT0gcnVsZXMubm9kZXNbMF07XG4gICAgICovXG4gICAgZ2V0IGZpcnN0KCkge1xuICAgICAgICBpZiAoICF0aGlzLm5vZGVzICkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZXNbMF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGNvbnRhaW5lcuKAmXMgbGFzdCBjaGlsZC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtOb2RlfVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBydWxlLmxhc3QgPT0gcnVsZS5ub2Rlc1tydWxlLm5vZGVzLmxlbmd0aCAtIDFdO1xuICAgICAqL1xuICAgIGdldCBsYXN0KCkge1xuICAgICAgICBpZiAoICF0aGlzLm5vZGVzICkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZXNbdGhpcy5ub2Rlcy5sZW5ndGggLSAxXTtcbiAgICB9XG5cbiAgICBub3JtYWxpemUobm9kZXMsIHNhbXBsZSkge1xuICAgICAgICBpZiAoIHR5cGVvZiBub2RlcyA9PT0gJ3N0cmluZycgKSB7XG4gICAgICAgICAgICBsZXQgcGFyc2UgPSByZXF1aXJlKCcuL3BhcnNlJyk7XG4gICAgICAgICAgICBub2RlcyA9IGNsZWFuU291cmNlKHBhcnNlKG5vZGVzKS5ub2Rlcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoICFBcnJheS5pc0FycmF5KG5vZGVzKSApIHtcbiAgICAgICAgICAgIGlmICggbm9kZXMudHlwZSA9PT0gJ3Jvb3QnICkge1xuICAgICAgICAgICAgICAgIG5vZGVzID0gbm9kZXMubm9kZXM7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBub2Rlcy50eXBlICkge1xuICAgICAgICAgICAgICAgIG5vZGVzID0gW25vZGVzXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIG5vZGVzLnByb3AgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCB0eXBlb2Ygbm9kZXMudmFsdWUgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIGZpZWxkIGlzIG1pc3NlZCBpbiBub2RlIGNyZWF0aW9uJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZW9mIG5vZGVzLnZhbHVlICE9PSAnc3RyaW5nJyApIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZXMudmFsdWUgPSBTdHJpbmcobm9kZXMudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBub2RlcyA9IFtuZXcgRGVjbGFyYXRpb24obm9kZXMpXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIG5vZGVzLnNlbGVjdG9yICkge1xuICAgICAgICAgICAgICAgIGxldCBSdWxlID0gcmVxdWlyZSgnLi9ydWxlJyk7XG4gICAgICAgICAgICAgICAgbm9kZXMgPSBbbmV3IFJ1bGUobm9kZXMpXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIG5vZGVzLm5hbWUgKSB7XG4gICAgICAgICAgICAgICAgbGV0IEF0UnVsZSA9IHJlcXVpcmUoJy4vYXQtcnVsZScpO1xuICAgICAgICAgICAgICAgIG5vZGVzID0gW25ldyBBdFJ1bGUobm9kZXMpXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIG5vZGVzLnRleHQgKSB7XG4gICAgICAgICAgICAgICAgbm9kZXMgPSBbbmV3IENvbW1lbnQobm9kZXMpXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIG5vZGUgdHlwZSBpbiBub2RlIGNyZWF0aW9uJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcHJvY2Vzc2VkID0gbm9kZXMubWFwKCBpID0+IHtcbiAgICAgICAgICAgIGlmICggdHlwZW9mIGkucmF3cyA9PT0gJ3VuZGVmaW5lZCcgKSBpID0gdGhpcy5yZWJ1aWxkKGkpO1xuXG4gICAgICAgICAgICBpZiAoIGkucGFyZW50ICkgaSA9IGkuY2xvbmUoKTtcbiAgICAgICAgICAgIGlmICggdHlwZW9mIGkucmF3cy5iZWZvcmUgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgICAgIGlmICggc2FtcGxlICYmIHR5cGVvZiBzYW1wbGUucmF3cy5iZWZvcmUgIT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgICAgICAgICBpLnJhd3MuYmVmb3JlID0gc2FtcGxlLnJhd3MuYmVmb3JlLnJlcGxhY2UoL1teXFxzXS9nLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaS5wYXJlbnQgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBwcm9jZXNzZWQ7XG4gICAgfVxuXG4gICAgcmVidWlsZChub2RlLCBwYXJlbnQpIHtcbiAgICAgICAgbGV0IGZpeDtcbiAgICAgICAgaWYgKCBub2RlLnR5cGUgPT09ICdyb290JyApIHtcbiAgICAgICAgICAgIGxldCBSb290ID0gcmVxdWlyZSgnLi9yb290Jyk7XG4gICAgICAgICAgICBmaXggPSBuZXcgUm9vdCgpO1xuICAgICAgICB9IGVsc2UgaWYgKCBub2RlLnR5cGUgPT09ICdhdHJ1bGUnICkge1xuICAgICAgICAgICAgbGV0IEF0UnVsZSA9IHJlcXVpcmUoJy4vYXQtcnVsZScpO1xuICAgICAgICAgICAgZml4ID0gbmV3IEF0UnVsZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKCBub2RlLnR5cGUgPT09ICdydWxlJyApIHtcbiAgICAgICAgICAgIGxldCBSdWxlID0gcmVxdWlyZSgnLi9ydWxlJyk7XG4gICAgICAgICAgICBmaXggPSBuZXcgUnVsZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKCBub2RlLnR5cGUgPT09ICdkZWNsJyApIHtcbiAgICAgICAgICAgIGZpeCA9IG5ldyBEZWNsYXJhdGlvbigpO1xuICAgICAgICB9IGVsc2UgaWYgKCBub2RlLnR5cGUgPT09ICdjb21tZW50JyApIHtcbiAgICAgICAgICAgIGZpeCA9IG5ldyBDb21tZW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKCBsZXQgaSBpbiBub2RlICkge1xuICAgICAgICAgICAgaWYgKCBpID09PSAnbm9kZXMnICkge1xuICAgICAgICAgICAgICAgIGZpeC5ub2RlcyA9IG5vZGUubm9kZXMubWFwKCBqID0+IHRoaXMucmVidWlsZChqLCBmaXgpICk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBpID09PSAncGFyZW50JyAmJiBwYXJlbnQgKSB7XG4gICAgICAgICAgICAgICAgZml4LnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIG5vZGUuaGFzT3duUHJvcGVydHkoaSkgKSB7XG4gICAgICAgICAgICAgICAgZml4W2ldID0gbm9kZVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaXg7XG4gICAgfVxuXG4gICAgZWFjaEluc2lkZShjYWxsYmFjaykge1xuICAgICAgICB3YXJuT25jZSgnQ29udGFpbmVyI2VhY2hJbnNpZGUgaXMgZGVwcmVjYXRlZC4gJyArXG4gICAgICAgICAgICAgICAgICdVc2UgQ29udGFpbmVyI3dhbGsgaW5zdGVhZC4nKTtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FsayhjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgZWFjaERlY2wocHJvcCwgY2FsbGJhY2spIHtcbiAgICAgICAgd2Fybk9uY2UoJ0NvbnRhaW5lciNlYWNoRGVjbCBpcyBkZXByZWNhdGVkLiAnICtcbiAgICAgICAgICAgICAgICAgJ1VzZSBDb250YWluZXIjd2Fsa0RlY2xzIGluc3RlYWQuJyk7XG4gICAgICAgIHJldHVybiB0aGlzLndhbGtEZWNscyhwcm9wLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgZWFjaFJ1bGUoc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG4gICAgICAgIHdhcm5PbmNlKCdDb250YWluZXIjZWFjaFJ1bGUgaXMgZGVwcmVjYXRlZC4gJyArXG4gICAgICAgICAgICAgICAgICdVc2UgQ29udGFpbmVyI3dhbGtSdWxlcyBpbnN0ZWFkLicpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWxrUnVsZXMoc2VsZWN0b3IsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBlYWNoQXRSdWxlKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHdhcm5PbmNlKCdDb250YWluZXIjZWFjaEF0UnVsZSBpcyBkZXByZWNhdGVkLiAnICtcbiAgICAgICAgICAgICAgICAgJ1VzZSBDb250YWluZXIjd2Fsa0F0UnVsZXMgaW5zdGVhZC4nKTtcbiAgICAgICAgcmV0dXJuIHRoaXMud2Fsa0F0UnVsZXMobmFtZSwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGVhY2hDb21tZW50KGNhbGxiYWNrKSB7XG4gICAgICAgIHdhcm5PbmNlKCdDb250YWluZXIjZWFjaENvbW1lbnQgaXMgZGVwcmVjYXRlZC4gJyArXG4gICAgICAgICAgICAgICAgICdVc2UgQ29udGFpbmVyI3dhbGtDb21tZW50cyBpbnN0ZWFkLicpO1xuICAgICAgICByZXR1cm4gdGhpcy53YWxrQ29tbWVudHMoY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGdldCBzZW1pY29sb24oKSB7XG4gICAgICAgIHdhcm5PbmNlKCdOb2RlI3NlbWljb2xvbiBpcyBkZXByZWNhdGVkLiBVc2UgTm9kZSNyYXdzLnNlbWljb2xvbicpO1xuICAgICAgICByZXR1cm4gdGhpcy5yYXdzLnNlbWljb2xvbjtcbiAgICB9XG5cbiAgICBzZXQgc2VtaWNvbG9uKHZhbCkge1xuICAgICAgICB3YXJuT25jZSgnTm9kZSNzZW1pY29sb24gaXMgZGVwcmVjYXRlZC4gVXNlIE5vZGUjcmF3cy5zZW1pY29sb24nKTtcbiAgICAgICAgdGhpcy5yYXdzLnNlbWljb2xvbiA9IHZhbDtcbiAgICB9XG5cbiAgICBnZXQgYWZ0ZXIoKSB7XG4gICAgICAgIHdhcm5PbmNlKCdOb2RlI2FmdGVyIGlzIGRlcHJlY2F0ZWQuIFVzZSBOb2RlI3Jhd3MuYWZ0ZXInKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmF3cy5hZnRlcjtcbiAgICB9XG5cbiAgICBzZXQgYWZ0ZXIodmFsKSB7XG4gICAgICAgIHdhcm5PbmNlKCdOb2RlI2FmdGVyIGlzIGRlcHJlY2F0ZWQuIFVzZSBOb2RlI3Jhd3MuYWZ0ZXInKTtcbiAgICAgICAgdGhpcy5yYXdzLmFmdGVyID0gdmFsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXJvZiBDb250YWluZXIjXG4gICAgICogQG1lbWJlciB7Tm9kZVtdfSBub2RlcyAtIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGNvbnRhaW5lcuKAmXMgY2hpbGRyZW5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogY29uc3Qgcm9vdCA9IHBvc3Rjc3MucGFyc2UoJ2EgeyBjb2xvcjogYmxhY2sgfScpO1xuICAgICAqIHJvb3Qubm9kZXMubGVuZ3RoICAgICAgICAgICAvLz0+IDFcbiAgICAgKiByb290Lm5vZGVzWzBdLnNlbGVjdG9yICAgICAgLy89PiAnYSdcbiAgICAgKiByb290Lm5vZGVzWzBdLm5vZGVzWzBdLnByb3AgLy89PiAnY29sb3InXG4gICAgICovXG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29udGFpbmVyO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
