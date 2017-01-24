/*eslint no-console: 0*/
var SourceMapConsumer = require('source-map').SourceMapConsumer;
var path = require('path-browserify');

// If true, the caches are reset before a stack trace formatting operation
var emptyCacheBetweenOperations = false;

// Maps a file path to a string containing the file contents
var fileContentsCache = {};

// Maps a file path to a source map for that file
var sourceMapCache = {};

// Regex for detecting source maps
var reSourceMap = /^data:application\/json[^,]+base64,/;

function retrieveFile(path) {
  // Trim the path to make sure there is no extra whitespace.
  path = path.trim();
  if (path in fileContentsCache) {
    return fileContentsCache[path];
  }

  try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, false);
    xhr.send(null);
    var contents = null
    if (xhr.readyState === 4 && xhr.status === 200) {
      contents = xhr.responseText
    }

  } catch (e) {
    contents = null;
  }

  return fileContentsCache[path] = contents;
}

// Support URLs relative to a directory, but be careful about a protocol prefix
// in case we are in the browser (i.e. directories may start with "http://")
function supportRelativeURL(file, url) {
  if (!file) return url;
  var dir = path.dirname(file);
  var match = /^\w+:\/\/[^\/]*/.exec(dir);
  var protocol = match ? match[0] : '';
  return protocol + path.resolve(dir.slice(protocol.length), url);
}

function retrieveSourceMapURL(source, position) {
  var fileData = fileContentsCache[source];
  if (!fileData) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', source, false);
      xhr.send(null);
      if (xhr.readyState === 4 && xhr.status === 200) {
        fileData = xhr.responseText;
        fileContentsCache[source] = fileData;
      }
      if (xhr.status !== 200) return null
    } catch (e) { return null }

    // Support providing a sourceMappingURL via the SourceMap header
    var sourceMapHeader = xhr.getResponseHeader('SourceMap') ||
                          xhr.getResponseHeader('X-SourceMap');
    if (sourceMapHeader) {
      return sourceMapHeader;
    }
  }

  var re = /(?:\/\/[@#][ \t]+sourceMappingURL=([^\s'"]+?)[ \t]*$)|(?:\/\*[@#][ \t]+sourceMappingURL=([^\*]+?)[ \t]*(?:\*\/)[ \t]*$)/mg;
  // Keep executing the search to find the *last* sourceMappingURL to avoid
  // picking up sourceMappingURLs from comments, strings, etc.
  var lastMatch, match;
  while (match = re.exec(fileData)) lastMatch = match; // eslint-disable-line
  if (!lastMatch) {
    var line = fileData.split(/(?:\r\n|\r|\n)/)[position.line - 1];
    line = line.replace(/^.*sourceMappingURL=/, '').replace(/"\s*\);\s*$/,'')
    if (reSourceMap.test(line)) return line;
    return null;
  }
  return lastMatch[1];
}

// Can be overridden by the retrieveSourceMap option to install. Takes a
// generated source filename; returns a {map, optional url} object, or null if
// there is no source map.  The map field may be either a string or the parsed
// JSON object (ie, it must be a valid argument to the SourceMapConsumer
// constructor).
function retrieveSourceMap(source, position) {
  if (/^script:\/\/$/.test(source)) return null;
  var sourceMappingURL = retrieveSourceMapURL(source, position);
  if (!sourceMappingURL) return null;

  // Read the contents of the source map
  var sourceMapData;
  if (reSourceMap.test(sourceMappingURL)) {
    // Support source map URL as a data url
    var rawData = sourceMappingURL.slice(sourceMappingURL.indexOf(',') + 1);
    sourceMapData = new Buffer(rawData, 'base64').toString();
    sourceMapData = JSON.parse(sourceMapData)
    source = sourceMapData.sources[0]
    sourceMappingURL = null;
  } else {
    // Support source map URLs relative to the source URL
    sourceMappingURL = supportRelativeURL(source, sourceMappingURL);
    sourceMapData = retrieveFile(sourceMappingURL);
  }

  if (!sourceMapData) {
    return null;
  }

  return {
    url: sourceMappingURL,
    map: sourceMapData
  };
}

function mapSourcePosition(position) {
  var sourceMap = sourceMapCache[position.source];
  if (!sourceMap) {
    // Call the (overrideable) retrieveSourceMap function to get the source map.
    var urlAndMap = retrieveSourceMap(position.source, position);
    if (urlAndMap) {
      var source = urlAndMap.url ? position.source : urlAndMap.map.sources[0]
      position.source = source
      sourceMap = sourceMapCache[source] = {
        url: urlAndMap.url,
        map: new SourceMapConsumer(urlAndMap.map)
      };

      // Load all sources stored inline with the source map into the file cache
      // to pretend like they are already loaded. They may not exist on disk.
      if (sourceMap.map.sourcesContent) {
        sourceMap.map.sources.forEach(function(source, i) {
          var contents = sourceMap.map.sourcesContent[i];
          if (contents) {
            var url = supportRelativeURL(sourceMap.url, source);
            fileContentsCache[url] = contents;
          }
        });
      }
    } else {
      sourceMap = sourceMapCache[position.source] = {
        url: null,
        map: null
      };
    }
  }

  // Resolve the source URL relative to the URL of the source map
  if (sourceMap && sourceMap.map) {
    var pos
    if (position.eval) {
      pos = {
        line: position.eval[0],
        column: position.eval[1]
      }
    } else {
      pos = {
        line: position.line,
        column: position.column
      }
    }

    var originalPosition = sourceMap.map.originalPositionFor(pos);

    // Only return the original position if a matching line was found. If no
    // matching line is found then we return position instead, which will cause
    // the stack trace to print the path and line for the compiled file. It is
    // better to give a precise location in the compiled file than a vague
    // location in the original file.
    if (originalPosition.source !== null) {
      originalPosition.source = supportRelativeURL(
        sourceMap.url, originalPosition.source);
      return originalPosition;
    }
  }

  return position;
}

// Parses code generated by FormatEvalOrigin(), a function inside V8:
// https://code.google.com/p/v8/source/browse/trunk/src/messages.js
function getEvalPosition(origin, ln, cn) {
  // Most eval() calls are in this format
  var match = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(origin);

  if (match) {
    var position = mapSourcePosition({
      source: match[2],
      line: match[3],
      column: match[4] - 1,
      eval:[ln, cn]
    });

    return position
  }

  // Parse nested eval() calls using recursion
  match = /^eval at ([^(]+) \((.+)\)$/.exec(origin);
  if (match) {
    return getEvalPosition(match[2]);
  }

  // Make sure we still return useful information if we didn't find anything
  return origin;
}

// This is copied almost verbatim from the V8 source code at
// https://code.google.com/p/v8/source/browse/trunk/src/messages.js. The
// implementation of wrapCallSite() used to just forward to the actual source
// code of CallSite.prototype.toString but unfortunately a new release of V8
// did something to the prototype chain and broke the shim. The only fix I
// could find was copy/paste.
function CallSiteToString() {
  var fileName;
  var fileLocation = '';
  if (this.isNative()) {
    fileLocation = 'native';
  } else {
    fileName = this.getScriptNameOrSourceURL();
    if (!fileName && this.isEval()) {
      fileLocation = this.getEvalOrigin();
      fileLocation += ', ';  // Expecting source position to follow.
    }

    if (fileName) {
      fileLocation += fileName;
    } else {
      // Source code does not originate from a file and is not native, but we
      // can still get the source position inside the source string, e.g. in
      // an eval string.
      fileLocation += '<anonymous>';
    }
    var lineNumber = this.getLineNumber();
    if (lineNumber != null) {
      fileLocation += ':' + lineNumber;
      var columnNumber = this.getColumnNumber();
      if (columnNumber) {
        fileLocation += ':' + columnNumber;
      }
    }
  }

  var line = '';
  var functionName = this.getFunctionName();
  var addSuffix = true;
  var isConstructor = this.isConstructor();
  var isMethodCall = !(this.isToplevel() || isConstructor);
  if (isMethodCall) {
    var typeName = this.getTypeName();
    var methodName = this.getMethodName();
    if (functionName) {
      if (typeName && functionName.indexOf(typeName) != 0) {
        line += typeName + '.';
      }
      line += functionName;
      if (methodName && functionName.indexOf('.' + methodName) != functionName.length - methodName.length - 1) {
        line += ' [as ' + methodName + ']';
      }
    } else {
      line += typeName + '.' + (methodName || '<anonymous>');
    }
  } else if (isConstructor) {
    line += 'new ' + (functionName || '<anonymous>');
  } else if (functionName) {
    line += functionName;
  } else {
    line += fileLocation;
    addSuffix = false;
  }
  if (addSuffix) {
    line += ' (' + fileLocation + ')';
  }
  return line;
}

function cloneCallSite(frame) {
  var object = {};
  Object.getOwnPropertyNames(Object.getPrototypeOf(frame)).forEach(function(name) {
    object[name] = /^(?:is|get)/.test(name) ? function() { return frame[name].call(frame); } : frame[name];
  });
  object.toString = CallSiteToString;
  return object;
}

function wrapCallSite(frame) {
  // Most call sites will return the source file from getFileName(), but code
  // passed to eval() ending in "//# sourceURL=..." will return the source file
  // from getScriptNameOrSourceURL() instead
  if (frame.isNative()) return frame
  var source = frame.getFileName() || frame.getScriptNameOrSourceURL();
  var position
  if (source) {
    var line = frame.getLineNumber();
    var column = frame.getColumnNumber() - 1;
    position = mapSourcePosition({
      source: source,
      line: line,
      column: column
    });
    frame = cloneCallSite(frame);
    frame.getFileName = function() { return position.source.replace(/\?.*$/, ''); };
    frame.getLineNumber = function() { return position.line; };
    frame.getColumnNumber = function() { return position.column ? position.column + 1 : column; };
    frame.getScriptNameOrSourceURL = function() { return position.source; };
    return frame;
  }

  // Code called using eval() needs special handling
  var origin = frame.isEval() && frame.getEvalOrigin();
  if (origin) {
    // ln and cn in eval
    var ln = frame.getLineNumber()
    var cn = frame.getColumnNumber()
    position = getEvalPosition(origin, ln, cn);
    frame = cloneCallSite(frame);
    frame.getScriptNameOrSourceURL = function() { return position.source.replace(/\?.*$/, ''); };
    frame.getLineNumber = function() { return position.line; };
    frame.getColumnNumber = function() { return position.column ? position.column + 1: cn; };
    frame.getEvalOrigin = function() { return origin; };
    frame.getFileName = function () { return position.source}
    return frame;
  }

  // If we get here then we were unable to change the source position
  return frame;
}

// This function is part of the V8 stack trace API, for more info see:
// http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
function prepareStackTrace(error, stack) {
  if (emptyCacheBetweenOperations) {
    fileContentsCache = {};
    sourceMapCache = {};
  }
  stack = stack.filter(function (frame) {
    var source = frame.getFileName() || frame.getScriptNameOrSourceURL();
    return !/node_modules\/mocha/.test(source)
  })
  return error + stack.map(function(frame) {
    return '\n    at ' + wrapCallSite(frame);
  }).join('');
}

// Generate position and snippet of original source with pointer
function getErrorSource(error) {
  var match = /\n    at [^(]+ \((.*):(\d+):(\d+)\)/.exec(error.stack); // eslint-disable-line
  if (match) {
    var source = match[1];
    var line = +match[2];
    var column = +match[3];

    // Support the inline sourceContents inside the source map
    var contents = fileContentsCache[source];


    // Format the line from the original source code like node does
    if (contents) {
      var code = contents.split(/(?:\r\n|\r|\n)/)[line - 1];
      if (code) {
        return source + ':' + line + '\n' + code + '\n' +
          new Array(column).join(' ') + '^';
      }
    }
  }
  return null;
}

exports.wrapCallSite = wrapCallSite;
exports.getErrorSource = getErrorSource;
exports.mapSourcePosition = mapSourcePosition;
exports.retrieveSourceMap = retrieveSourceMap;

module.exports = function (option) {
  option = option || {}
  if (/^file/i.test(location.protocol)) {
    console.warn('stack-source-map not works on file protocol')
  } else {
    Error.prepareStackTrace = prepareStackTrace;
  }
  if (option.hasOwnProperty('empty')) emptyCacheBetweenOperations = option.empty
}

