var fs = require('fs'),
    Path = require('path'),
    jph = require('json-parse-helpfulerror');

/**
 * Default options.
 *
 * @type {Object}
 */
exports.options = {
    // merge all passed/found config files, see `cjson.extend`
    merge: false,
    // allows you to do some string replacements, see `cjson.replace`.
    replace: null,
    // freeze config recursively, see `cjson.freeze`
    freeze: false,
    // you can use any other extension for your config files, f.e. *.cjson
    ext: '.json',
    // you can use any parser you want. the default uses JSON.parse for maximum
    // speed, if it throws it uses uses an alternative parser to give more
    // helpful errors
    parse: jph.parse
}

/**
 * Remove single and multilie comments. Make sure to
 * leave them inside of strings.
 *
 * @param {String} json file.
 * @return {String} json without comments.
 */
exports.decomment = function(str) {
    var i,
        curChar, nextChar,
        inString = false,
        inComment = false,
        newStr = '';

    for (i = 0; i < str.length; ++i) {
        curChar = str.charAt(i);
        nextChar = str.charAt(i + 1);

        // it's either closing or opening inString and it is not escaped
        if (!inComment && curChar === '"' && str.charAt(i - 1) !== '\\') {
            inString = !inString;
        }

        // we are not inside of a string
        if (!inString) {
            // singleline comment start
            if (!inComment && curChar + nextChar === '//') {
                ++i;
                inComment = 1;
            // singleline comment end
            } else if (inComment === 1 && curChar === '\n') {
                inComment = false;
            // multiline comment start
            } else if (!inComment && curChar + nextChar === '/*') {
                ++i;
                inComment = 2;
                curChar = '';
            // multiline comment end
            } else if (inComment === 2 && curChar + nextChar === '*/') {
                ++i;
                inComment = false;
                curChar = '';
            }

            if (inComment) {
                curChar = '';
            }
        }

        newStr += curChar;
    }


    return newStr;
};

/**
 * Decomment the string and parse json.
 *
 * @param {String} json.
 * @param {Function} [reviver] will be called for every key and value at every
 *     level of the final result.
 * @return {Object} parsed json object.
 */
exports.parse = function(str, reviver) {
    return exports.options.parse(exports.decomment(str), reviver);
};

/**
 * Replace templates with data. {{toReplace}}
 *
 * @param {String} json.
 * @param {Object} data data hash.
 * @return {String} json string with replaced data.
 */
exports.replace = function(str, data) {
    return str.replace(/\{\{([^}]+)\}\}/g, function(match, search) {
        if (data.hasOwnProperty(search)) {
            // If the variable is an object, stringify it before replacement.
            // The false positive of "null" is fine in this case.
            if (typeof data[search] === 'object') {
                return JSON.stringify(data[search]);
            }
            return data[search];
        }
        return match;
    });
};

/**
 * Merge objects to the first one
 *
 * @param {Boolean|Object} deep if set true, deep merge will be done.
 * @param {Object} obj1 any object.
 * @param {Object} obj2 any object.
 * @return {Object} target merged object.
 */
exports.extend = (function() {
    var toString = Object.prototype.toString,
        obj = '[object Object]';

    return function extend(deep, obj1, obj2 /*, obj1, obj2, obj3 */) {
        // take first argument, if its not a boolean
        var args = arguments,
            i = deep === true ? 1 : 0,
            key,
            target = args[i];

        for (++i; i < args.length; ++i) {
            for (key in args[i]) {
                if (deep === true &&
                    target[key] &&
                    // if not doing this check you may end in
                    // endless loop if using deep option
                    toString.call(args[i][key]) === obj &&
                    toString.call(target[key]) === obj) {

                    // create a copy of target object to avoid subobjects changes
                    target[key] = extend(deep, {}, target[key]);

                    extend(deep, target[key], args[i][key]);
                } else {
                    target[key] = args[i][key];
                }
            }
        }

        return target;
    };
}());

/**
 * Freeze the object recursively.
 *
 * @param {Object} obj.
 * @return {Object}
 */
exports.freeze = function freeze(obj) {
    var key;

    if (obj instanceof Object) {
        for (key in obj) {
            freeze(obj[key]);
        }

        Object.freeze(obj);
    }
};

/**
 * Load and parse a config file/files.
 *
 * @param {String|Array} path absolute path/paths to the file/files or dir.
 * @param {Object|Boolean} [options] if true, extend all jsons to the first one,
 *     it can be also object {merge: true, replace: {key: 'value'}}
 * @return {Object} conf parsed json object.
 */
exports.load = function load(path, options) {
    var data, paths, conf;

    if (options === true) {
        options = {merge: true};
    }

    options = exports.extend({}, exports.options, options);

    if (Array.isArray(path)) {
        conf = {};
        path.forEach(function(path) {
            var data = load(path, options),
                filename;

            if (options.merge) {
                exports.extend(true, conf, data);
            } else {
                filename = Path.basename(path, options.ext);
                conf[filename] = data;
            }
        });

        return conf;
    }

    if (fs.statSync(path).isDirectory()) {
        paths = [];
        fs.readdirSync(path).forEach(function(filename) {
            var file = Path.join(path, filename);

            if (Path.extname(file) == options.ext && fs.statSync(file).isFile()) {
                paths.push(file);
            }
        });

        return load(paths, options);
    }

    data = fs.readFileSync(path, 'utf-8');

    // replace BOM Character
    data = data.replace(/\ufeff/g, '');

    if (options.replace) {
        data = exports.replace(data, options.replace);
    }

    try {
        data = exports.parse(data);
    } catch(err) {
        err.message += '\nFile: "' + path + '"';
        throw err;
    }

    if (options.freeze) {
        exports.freeze(data);
    }

    return data;
};
