'use strict';

exports.__esModule = true;
exports.default = parse;

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(css, opts) {
    if (opts && opts.safe) {
        throw new Error('Option safe was removed. ' + 'Use parser: require("postcss-safe-parser")');
    }

    var input = new _input2.default(css, opts);

    var parser = new _parser2.default(input);
    parser.tokenize();
    parser.loop();

    return parser.root;
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnNlLmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7a0JBR3dCLEs7O0FBSHhCOzs7O0FBQ0E7Ozs7OztBQUVlLFNBQVMsS0FBVCxDQUFlLEdBQWYsRUFBb0IsSUFBcEIsRUFBMEI7QUFDckMsUUFBSyxRQUFRLEtBQUssSUFBbEIsRUFBeUI7QUFDckIsY0FBTSxJQUFJLEtBQUosQ0FBVSw4QkFDUCw0Q0FESCxDQUFOO0FBRUg7O0FBRUQsUUFBSSxRQUFRLG9CQUFVLEdBQVYsRUFBZSxJQUFmLENBQVo7O0FBRUEsUUFBSSxTQUFTLHFCQUFXLEtBQVgsQ0FBYjtBQUNBLFdBQU8sUUFBUDtBQUNBLFdBQU8sSUFBUDs7QUFFQSxXQUFPLE9BQU8sSUFBZDtBQUNIIiwiZmlsZSI6InBhcnNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBhcnNlciBmcm9tICcuL3BhcnNlcic7XG5pbXBvcnQgSW5wdXQgIGZyb20gJy4vaW5wdXQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYXJzZShjc3MsIG9wdHMpIHtcbiAgICBpZiAoIG9wdHMgJiYgb3B0cy5zYWZlICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ09wdGlvbiBzYWZlIHdhcyByZW1vdmVkLiAnICtcbiAgICAgICAgICAgICAgICAgJ1VzZSBwYXJzZXI6IHJlcXVpcmUoXCJwb3N0Y3NzLXNhZmUtcGFyc2VyXCIpJyk7XG4gICAgfVxuXG4gICAgbGV0IGlucHV0ID0gbmV3IElucHV0KGNzcywgb3B0cyk7XG5cbiAgICBsZXQgcGFyc2VyID0gbmV3IFBhcnNlcihpbnB1dCk7XG4gICAgcGFyc2VyLnRva2VuaXplKCk7XG4gICAgcGFyc2VyLmxvb3AoKTtcblxuICAgIHJldHVybiBwYXJzZXIucm9vdDtcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
