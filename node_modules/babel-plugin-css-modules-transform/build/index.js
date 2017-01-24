'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = transformCssModules;

var _path = require('path');

var simpleRequires = ['createImportedName', 'generateScopedName', 'processCss', 'preprocessCss'];

var complexRequires = ['append', 'prepend'];

var defaultOptions = {
    generateScopedName: '[name]__[local]___[hash:base64:5]'
};

function transformCssModules(_ref) {
    var t = _ref.types;

    function resolveModulePath(filename) {
        var dir = (0, _path.dirname)(filename);
        if ((0, _path.isAbsolute)(dir)) return dir;
        if (process.env.PWD) return (0, _path.resolve)(process.env.PWD, dir);
        return (0, _path.resolve)(dir);
    }

    /**
     *
     * @param {String} filepath     javascript file path
     * @param {String} cssFile      requireed css file path
     * @returns {Array} array of class names
     */
    function requireCssFile(filepath, cssFile) {
        var filePathOrModuleName = cssFile;

        // only resolve path to file when we have a file path
        if (!/^\w/i.test(filePathOrModuleName)) {
            var from = resolveModulePath(filepath);
            filePathOrModuleName = (0, _path.resolve)(from, filePathOrModuleName);
        }
        return require(filePathOrModuleName);
    }

    // is css modules require hook initialized?
    var initialized = false;

    var matchExtensions = /\.css$/i;
    function matcher() {
        var extensions = arguments.length <= 0 || arguments[0] === undefined ? ['.css'] : arguments[0];

        var extensionsPatern = extensions.join('|').replace(/\./g, '\\\.');
        return new RegExp('(' + extensionsPatern + ')$', 'i');
    }

    return {
        visitor: {
            Program: function Program(path, _ref2) {
                var opts = _ref2.opts;

                if (initialized) {
                    return;
                }

                var currentConfig = _extends({}, defaultOptions, opts);

                // match file extensions, speeds up transform by creating one
                // RegExp ahead of execution time
                matchExtensions = matcher(currentConfig.extensions);

                // check if there are simple requires and if they are functions
                simpleRequires.forEach(function (key) {
                    if (typeof currentConfig[key] !== 'string') {
                        return;
                    }

                    var modulePath = (0, _path.resolve)(process.cwd(), currentConfig[key]);

                    // this one can be require or string
                    if (key === 'generateScopedName') {
                        try {
                            // if it is existing file, require it, otherwise use value
                            currentConfig[key] = require(modulePath);
                        } catch (e) {
                            try {
                                currentConfig[key] = require(currentConfig[key]);
                            } catch (_e) {
                                // do nothing, because it is not a valid path
                            }
                        }

                        if (typeof currentConfig[key] !== 'function' && typeof currentConfig[key] !== 'string') {
                            throw new Error('Configuration \'' + key + '\' is not a string or function.');
                        }

                        return;
                    }

                    if (currentConfig.hasOwnProperty(key)) {
                        try {
                            currentConfig[key] = require(modulePath);
                        } catch (e) {
                            try {
                                currentConfig[key] = require(currentConfig[key]);
                            } catch (_e) {
                                // do nothing because it is not a valid path
                            }
                        }

                        if (typeof currentConfig[key] !== 'function') {
                            throw new Error('Module \'' + modulePath + '\' does not exist or is not a function.');
                        }
                    }
                });

                complexRequires.forEach(function (key) {
                    if (!currentConfig.hasOwnProperty(key)) {
                        return;
                    }

                    if (!Array.isArray(currentConfig[key])) {
                        throw new Error('Configuration \'' + key + '\' has to be an array.');
                    }

                    currentConfig[key].forEach(function (plugin, index) {
                        // first try to load it using npm
                        try {
                            currentConfig[key][index] = require(plugin);
                        } catch (e) {
                            try {
                                currentConfig[key][index] = require((0, _path.resolve)(process.cwd(), plugin));
                            } catch (_e) {
                                // do nothing
                            }
                        }

                        if (typeof currentConfig[key][index] !== 'function') {
                            throw new Error('Configuration \'' + key + '\' has to be valid path to a module at index ' + index + ' or it does not export a function.');
                        }

                        currentConfig[key][index] = currentConfig[key][index]();
                    });
                });

                require('css-modules-require-hook')(currentConfig);

                initialized = true;
            },
            CallExpression: function CallExpression(path, _ref3) {
                var file = _ref3.file;
                var _path$node = path.node;
                var calleeName = _path$node.callee.name;
                var args = _path$node.arguments;


                if (calleeName !== 'require' || !args.length || !t.isStringLiteral(args[0])) {
                    return;
                }

                var _args = _slicedToArray(args, 1);

                var stylesheetPath = _args[0].value;


                if (matchExtensions.test(stylesheetPath)) {
                    (function () {
                        // if parent expression is variable declarator, replace right side with tokens
                        if (!t.isVariableDeclarator(path.parent)) {
                            throw new Error('You can\'t import css file ' + stylesheetPath + ' to a module scope.');
                        }

                        var requiringFile = file.opts.filename;
                        var tokens = requireCssFile(requiringFile, stylesheetPath);

                        /* eslint-disable new-cap */
                        path.replaceWith(t.ObjectExpression(Object.keys(tokens).map(function (token) {
                            return t.ObjectProperty(t.StringLiteral(token), t.StringLiteral(tokens[token]));
                        })));
                    })();
                }
            }
        }
    };
}