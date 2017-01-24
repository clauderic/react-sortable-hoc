'use strict';

var ES = require('../').ES7;
var test = require('tape');

var forEach = require('foreach');
var is = require('object-is');

var hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';

var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;

var coercibleObject = { valueOf: function () { return 3; }, toString: function () { return 42; } };
var valueOfOnlyObject = { valueOf: function () { return 4; }, toString: function () { return {}; } };
var toStringOnlyObject = { valueOf: function () { return {}; }, toString: function () { return 7; } };
var uncoercibleObject = { valueOf: function () { return {}; }, toString: function () { return {}; } };
var objects = [{}, coercibleObject, toStringOnlyObject, valueOfOnlyObject];
var numbers = [0, -0, Infinity, -Infinity, 42];
var nullPrimitives = [undefined, null];
var nonNullNonNumberPrimitives = [true, false, 'foo', ''];
var nonNullPrimitives = nonNullNonNumberPrimitives.concat(numbers);
var nonNumberPrimitives = nullPrimitives.concat(nonNullNonNumberPrimitives);
var primitives = nullPrimitives.concat(nonNullPrimitives);

test('ToPrimitive', function (t) {
    t.test('primitives', function (st) {
		var testPrimitive = function (primitive) {
			st.ok(is(ES.ToPrimitive(primitive), primitive), primitive + ' is returned correctly');
		};
		forEach(primitives, testPrimitive);
		st.end();
	});

	t.test('objects', function (st) {
		st.equal(ES.ToPrimitive(coercibleObject), 3, 'coercibleObject with no hint coerces to valueOf');
		st.ok(is(ES.ToPrimitive({}), '[object Object]'), '{} with no hint coerces to Object#toString');
		st.equal(ES.ToPrimitive(coercibleObject, Number), 3, 'coercibleObject with hint Number coerces to valueOf');
		st.ok(is(ES.ToPrimitive({}, Number), '[object Object]'), '{} with hint Number coerces to NaN');
		st.equal(ES.ToPrimitive(coercibleObject, String), 42, 'coercibleObject with hint String coerces to nonstringified toString');
		st.equal(ES.ToPrimitive({}, String), '[object Object]', '{} with hint String coerces to Object#toString');
		st.equal(ES.ToPrimitive(toStringOnlyObject), 7, 'toStringOnlyObject returns non-stringified toString');
		st.equal(ES.ToPrimitive(valueOfOnlyObject), 4, 'valueOfOnlyObject returns valueOf');
		st.throws(function () { return ES.ToPrimitive(uncoercibleObject); }, TypeError, 'uncoercibleObject throws a TypeError');
		st.end();
	});

	t.end();
});

test('ToBoolean', function (t) {
	t.equal(false, ES.ToBoolean(undefined), 'undefined coerces to false');
	t.equal(false, ES.ToBoolean(null), 'null coerces to false');
	t.equal(false, ES.ToBoolean(false), 'false returns false');
	t.equal(true, ES.ToBoolean(true), 'true returns true');
	forEach([0, -0, NaN], function (falsyNumber) {
		t.equal(false, ES.ToBoolean(falsyNumber), 'falsy number ' + falsyNumber + ' coerces to false');
	});
	forEach([Infinity, 42, 1, -Infinity], function (truthyNumber) {
		t.equal(true, ES.ToBoolean(truthyNumber), 'truthy number ' + truthyNumber + ' coerces to true');
	});
	t.equal(false, ES.ToBoolean(''), 'empty string coerces to false');
	t.equal(true, ES.ToBoolean('foo'), 'nonempty string coerces to true');
	forEach(objects, function (obj) {
		t.equal(true, ES.ToBoolean(obj), 'object coerces to true');
	});
	t.equal(true, ES.ToBoolean(uncoercibleObject), 'uncoercibleObject coerces to true');
	t.end();
});

test('ToNumber', function (t) {
	t.ok(is(NaN, ES.ToNumber(undefined)), 'undefined coerces to NaN');
	t.ok(is(ES.ToNumber(null), 0), 'null coerces to +0');
	t.ok(is(ES.ToNumber(false), 0), 'false coerces to +0');
	t.equal(1, ES.ToNumber(true), 'true coerces to 1');
	t.ok(is(NaN, ES.ToNumber(NaN)), 'NaN returns itself');
	forEach([0, -0, 42, Infinity, -Infinity], function (num) {
		t.equal(num, ES.ToNumber(num), num + ' returns itself');
	});
	forEach(['foo', '0', '4a', '2.0', 'Infinity', '-Infinity'], function (numString) {
		t.ok(is(+numString, ES.ToNumber(numString)), '"' + numString + '" coerces to ' + Number(numString));
	});
	forEach(objects, function (object) {
		t.ok(is(ES.ToNumber(object), ES.ToNumber(ES.ToPrimitive(object))), 'object ' + object + ' coerces to same as ToPrimitive of object does');
	});
	t.throws(function () { return ES.ToNumber(uncoercibleObject); }, TypeError, 'uncoercibleObject throws');
	t.end();
});

test('ToInteger', function (t) {
	t.ok(is(0, ES.ToInteger(NaN)), 'NaN coerces to +0');
	forEach([0, Infinity, 42], function (num) {
		t.ok(is(num, ES.ToInteger(num)), num + ' returns itself');
		t.ok(is(-num, ES.ToInteger(-num)), '-' + num + ' returns itself');
	});
	t.equal(3, ES.ToInteger(Math.PI), 'pi returns 3');
	t.throws(function () { return ES.ToInteger(uncoercibleObject); }, TypeError, 'uncoercibleObject throws');
	t.end();
});

test('ToInt32', function (t) {
	t.ok(is(0, ES.ToInt32(NaN)), 'NaN coerces to +0');
	forEach([0, Infinity], function (num) {
		t.ok(is(0, ES.ToInt32(num)), num + ' returns +0');
		t.ok(is(0, ES.ToInt32(-num)), '-' + num + ' returns +0');
	});
	t.throws(function () { return ES.ToInt32(uncoercibleObject); }, TypeError, 'uncoercibleObject throws');
	t.ok(is(ES.ToInt32(0x100000000), 0), '2^32 returns +0');
	t.ok(is(ES.ToInt32(0x100000000 - 1), -1), '2^32 - 1 returns -1');
	t.ok(is(ES.ToInt32(0x80000000), -0x80000000), '2^31 returns -2^31');
	t.ok(is(ES.ToInt32(0x80000000 - 1), 0x80000000 - 1), '2^31 - 1 returns 2^31 - 1');
	forEach([0, Infinity, NaN, 0x100000000, 0x80000000, 0x10000, 0x42], function (num) {
		t.ok(is(ES.ToInt32(num), ES.ToInt32(ES.ToUint32(num))), 'ToInt32(x) === ToInt32(ToUint32(x)) for 0x' + num.toString(16));
		t.ok(is(ES.ToInt32(-num), ES.ToInt32(ES.ToUint32(-num))), 'ToInt32(x) === ToInt32(ToUint32(x)) for -0x' + num.toString(16));
	});
	t.end();
});

test('ToUint32', function (t) {
	t.ok(is(0, ES.ToUint32(NaN)), 'NaN coerces to +0');
	forEach([0, Infinity], function (num) {
		t.ok(is(0, ES.ToUint32(num)), num + ' returns +0');
		t.ok(is(0, ES.ToUint32(-num)), '-' + num + ' returns +0');
	});
	t.throws(function () { return ES.ToUint32(uncoercibleObject); }, TypeError, 'uncoercibleObject throws');
	t.ok(is(ES.ToUint32(0x100000000), 0), '2^32 returns +0');
	t.ok(is(ES.ToUint32(0x100000000 - 1), 0x100000000 - 1), '2^32 - 1 returns 2^32 - 1');
	t.ok(is(ES.ToUint32(0x80000000), 0x80000000), '2^31 returns 2^31');
	t.ok(is(ES.ToUint32(0x80000000 - 1), 0x80000000 - 1), '2^31 - 1 returns 2^31 - 1');
	forEach([0, Infinity, NaN, 0x100000000, 0x80000000, 0x10000, 0x42], function (num) {
		t.ok(is(ES.ToUint32(num), ES.ToUint32(ES.ToInt32(num))), 'ToUint32(x) === ToUint32(ToInt32(x)) for 0x' + num.toString(16));
		t.ok(is(ES.ToUint32(-num), ES.ToUint32(ES.ToInt32(-num))), 'ToUint32(x) === ToUint32(ToInt32(x)) for -0x' + num.toString(16));
	});
	t.end();
});

test('ToInt16', function (t) {
	t.ok(is(0, ES.ToInt16(NaN)), 'NaN coerces to +0');
	forEach([0, Infinity], function (num) {
		t.ok(is(0, ES.ToInt16(num)), num + ' returns +0');
		t.ok(is(0, ES.ToInt16(-num)), '-' + num + ' returns +0');
	});
	t.throws(function () { return ES.ToInt16(uncoercibleObject); }, TypeError, 'uncoercibleObject throws');
	t.ok(is(ES.ToInt16(0x100000000), 0), '2^32 returns +0');
	t.ok(is(ES.ToInt16(0x100000000 - 1), -1), '2^32 - 1 returns -1');
	t.ok(is(ES.ToInt16(0x80000000), 0), '2^31 returns +0');
	t.ok(is(ES.ToInt16(0x80000000 - 1), -1), '2^31 - 1 returns -1');
	t.ok(is(ES.ToInt16(0x10000), 0), '2^16 returns +0');
	t.ok(is(ES.ToInt16(0x10000 - 1), -1), '2^16 - 1 returns -1');
	t.end();
});

test('ToUint16', function (t) {
	t.ok(is(0, ES.ToUint16(NaN)), 'NaN coerces to +0');
	forEach([0, Infinity], function (num) {
		t.ok(is(0, ES.ToUint16(num)), num + ' returns +0');
		t.ok(is(0, ES.ToUint16(-num)), '-' + num + ' returns +0');
	});
	t.throws(function () { return ES.ToUint16(uncoercibleObject); }, TypeError, 'uncoercibleObject throws');
	t.ok(is(ES.ToUint16(0x100000000), 0), '2^32 returns +0');
	t.ok(is(ES.ToUint16(0x100000000 - 1), 0x10000 - 1), '2^32 - 1 returns 2^16 - 1');
	t.ok(is(ES.ToUint16(0x80000000), 0), '2^31 returns +0');
	t.ok(is(ES.ToUint16(0x80000000 - 1), 0x10000 - 1), '2^31 - 1 returns 2^16 - 1');
	t.ok(is(ES.ToUint16(0x10000), 0), '2^16 returns +0');
	t.ok(is(ES.ToUint16(0x10000 - 1), 0x10000 - 1), '2^16 - 1 returns 2^16 - 1');
	t.end();
});

test('ToInt8', function (t) {
	t.ok(is(0, ES.ToInt8(NaN)), 'NaN coerces to +0');
	forEach([0, Infinity], function (num) {
		t.ok(is(0, ES.ToInt8(num)), num + ' returns +0');
		t.ok(is(0, ES.ToInt8(-num)), '-' + num + ' returns +0');
	});
	t.throws(function () { return ES.ToInt8(uncoercibleObject); }, TypeError, 'uncoercibleObject throws');
	t.ok(is(ES.ToInt8(0x100000000), 0), '2^32 returns +0');
	t.ok(is(ES.ToInt8(0x100000000 - 1), -1), '2^32 - 1 returns -1');
	t.ok(is(ES.ToInt8(0x80000000), 0), '2^31 returns +0');
	t.ok(is(ES.ToInt8(0x80000000 - 1), -1), '2^31 - 1 returns -1');
	t.ok(is(ES.ToInt8(0x10000), 0), '2^16 returns +0');
	t.ok(is(ES.ToInt8(0x10000 - 1), -1), '2^16 - 1 returns -1');
	t.ok(is(ES.ToInt8(0x100), 0), '2^8 returns +0');
	t.ok(is(ES.ToInt8(0x100 - 1), -1), '2^8 - 1 returns -1');
	t.ok(is(ES.ToInt8(0x10), 0x10), '2^4 returns 2^4');
	t.end();
});

test('ToUint8', function (t) {
	t.ok(is(0, ES.ToUint8(NaN)), 'NaN coerces to +0');
	forEach([0, Infinity], function (num) {
		t.ok(is(0, ES.ToUint8(num)), num + ' returns +0');
		t.ok(is(0, ES.ToUint8(-num)), '-' + num + ' returns +0');
	});
	t.throws(function () { return ES.ToUint8(uncoercibleObject); }, TypeError, 'uncoercibleObject throws');
	t.ok(is(ES.ToUint8(0x100000000), 0), '2^32 returns +0');
	t.ok(is(ES.ToUint8(0x100000000 - 1), 0x100 - 1), '2^32 - 1 returns 2^8 - 1');
	t.ok(is(ES.ToUint8(0x80000000), 0), '2^31 returns +0');
	t.ok(is(ES.ToUint8(0x80000000 - 1), 0x100 - 1), '2^31 - 1 returns 2^8 - 1');
	t.ok(is(ES.ToUint8(0x10000), 0), '2^16 returns +0');
	t.ok(is(ES.ToUint8(0x10000 - 1), 0x100 - 1), '2^16 - 1 returns 2^8 - 1');
	t.ok(is(ES.ToUint8(0x100), 0), '2^8 returns +0');
	t.ok(is(ES.ToUint8(0x100 - 1), 0x100 - 1), '2^8 - 1 returns 2^16 - 1');
	t.ok(is(ES.ToUint8(0x10), 0x10), '2^4 returns 2^4');
	t.ok(is(ES.ToUint8(0x10 - 1), 0x10 - 1), '2^4 - 1 returns 2^4 - 1');
	t.end();
});

test('ToUint8Clamp', function (t) {
	t.ok(is(0, ES.ToUint8Clamp(NaN)), 'NaN coerces to +0');
	t.ok(is(0, ES.ToUint8Clamp(0)), '+0 returns +0');
	t.ok(is(0, ES.ToUint8Clamp(-0)), '-0 returns +0');
	t.ok(is(0, ES.ToUint8Clamp(-Infinity)), '-Infinity returns +0');
	t.throws(function () { return ES.ToUint8Clamp(uncoercibleObject); }, TypeError, 'uncoercibleObject throws');
	forEach([255, 256, 0x100000, Infinity], function (number) {
		t.ok(is(255, ES.ToUint8Clamp(number)), number + ' coerces to 255');
	});
	t.equal(1, ES.ToUint8Clamp(1.49), '1.49 coerces to 1');
	t.equal(2, ES.ToUint8Clamp(1.5), '1.5 coerces to 2, because 2 is even');
	t.equal(2, ES.ToUint8Clamp(1.51), '1.51 coerces to 2');

	t.equal(2, ES.ToUint8Clamp(2.49), '2.49 coerces to 2');
	t.equal(2, ES.ToUint8Clamp(2.5), '2.5 coerces to 2, because 2 is even');
	t.equal(3, ES.ToUint8Clamp(2.51), '2.51 coerces to 3');
	t.end();
});

test('ToString', function (t) {
	t.throws(function () { return ES.ToString(uncoercibleObject); }, TypeError, 'uncoercibleObject throws');
	t.end();
});

test('ToObject', function (t) {
	t.throws(function () { return ES.ToObject(undefined); }, TypeError, 'undefined throws');
	t.throws(function () { return ES.ToObject(null); }, TypeError, 'null throws');
	forEach(numbers, function (number) {
		var obj = ES.ToObject(number);
		t.equal(typeof obj, 'object', 'number ' + number + ' coerces to object');
		t.equal(true, obj instanceof Number, 'object of ' + number + ' is Number object');
		t.ok(is(obj.valueOf(), number), 'object of ' + number + ' coerces to ' + number);
	});
	t.end();
});

test('RequireObjectCoercible', function (t) {
	t.equal(false, 'CheckObjectCoercible' in ES, 'CheckObjectCoercible -> RequireObjectCoercible in ES6');
	t.throws(function () { return ES.RequireObjectCoercible(undefined); }, TypeError, 'undefined throws');
	t.throws(function () { return ES.RequireObjectCoercible(null); }, TypeError, 'null throws');
	var isCoercible = function (value) {
		t.doesNotThrow(function () { return ES.RequireObjectCoercible(value); }, '"' + value + '" does not throw');
	};
	forEach(objects.concat(nonNullPrimitives), isCoercible);
	t.end();
});

test('IsCallable', function (t) {
	t.equal(true, ES.IsCallable(function () {}), 'function is callable');
	var nonCallables = [/a/g, {}, Object.prototype, NaN].concat(primitives);
	forEach(nonCallables, function (nonCallable) {
		t.equal(false, ES.IsCallable(nonCallable), nonCallable + ' is not callable');
	});
	t.end();
});

test('SameValue', function (t) {
	t.equal(true, ES.SameValue(NaN, NaN), 'NaN is SameValue as NaN');
	t.equal(false, ES.SameValue(0, -0), '+0 is not SameValue as -0');
	forEach(objects.concat(primitives), function (val) {
		t.equal(val === val, ES.SameValue(val, val), '"' + val + '" is SameValue to itself');
	});
	t.end();
});

test('SameValueZero', function (t) {
	t.equal(true, ES.SameValueZero(NaN, NaN), 'NaN is SameValueZero as NaN');
	t.equal(true, ES.SameValueZero(0, -0), '+0 is SameValueZero as -0');
	forEach(objects.concat(primitives), function (val) {
		t.equal(val === val, ES.SameValueZero(val, val), '"' + val + '" is SameValueZero to itself');
	});
	t.end();
});

test('ToPropertyKey', function (t) {
	forEach(objects.concat(primitives), function (value) {
		t.equal(ES.ToPropertyKey(value), String(value), 'ToPropertyKey(value) === String(value) for non-Symbols');
	});
	if (hasSymbols) {
		t.equal(ES.ToPropertyKey(Symbol.iterator), 'Symbol(Symbol.iterator)', 'ToPropertyKey(Symbol.iterator) === "Symbol(Symbol.iterator)"');
	}
	t.end();
});

test('ToLength', function (t) {
	t.throws(function () { return ES.ToLength(uncoercibleObject); }, TypeError, 'uncoercibleObject throws a TypeError');
	t.equal(3, ES.ToLength(coercibleObject), 'coercibleObject coerces to 3');
	t.equal(42, ES.ToLength('42.5'), '"42.5" coerces to 42');
	t.equal(7, ES.ToLength(7.3), '7.3 coerces to 7');
	forEach([-0, -1, -42, -Infinity], function (negative) {
		t.ok(is(0, ES.ToLength(negative)), negative + ' coerces to +0');
	});
	t.equal(MAX_SAFE_INTEGER, ES.ToLength(MAX_SAFE_INTEGER + 1), '2^53 coerces to 2^53 - 1');
	t.equal(MAX_SAFE_INTEGER, ES.ToLength(MAX_SAFE_INTEGER + 3), '2^53 + 2 coerces to 2^53 - 1');
	t.end();
});

test('IsArray', function (t) {
	t.equal(true, ES.IsArray([]), '[] is array');
	t.equal(false, ES.IsArray({}), '{} is not array');
	t.equal(false, ES.IsArray({ length: 1, 0: true }), 'arraylike object is not array');
	forEach(objects.concat(primitives), function (value) {
		t.equal(false, ES.IsArray(value), value + ' is not array');
	});
	t.end();
});

test('IsRegExp', function (t) {
	forEach([/a/g, new RegExp('a', 'g')], function (regex) {
		t.equal(true, ES.IsRegExp(regex), regex + ' is regex');
	});
	forEach(objects.concat(primitives), function (nonRegex) {
		t.equal(false, ES.IsRegExp(nonRegex), nonRegex + ' is not regex');
	});
	t.end();
});

test('IsPropertyKey', function (t) {
	forEach(numbers.concat(objects), function (notKey) {
		t.equal(false, ES.IsPropertyKey(notKey), notKey + ' is not property key');
	});
	t.equal(true, ES.IsPropertyKey('foo'), 'string is property key');
	if (hasSymbols) {
		t.equal(true, ES.IsPropertyKey(Symbol.iterator), 'Symbol.iterator is property key');
	}
	t.end();
});

test('IsInteger', function (t) {
	for (var i = -100; i < 100; i += 10) {
		t.equal(true, ES.IsInteger(i), i + ' is integer');
		t.equal(false, ES.IsInteger(i + 0.2), (i + 0.2) + ' is not integer');
	}
	t.equal(true, ES.IsInteger(-0), '-0 is integer');
	var notInts = objects.concat([Infinity, -Infinity, NaN, true, false, null, undefined, [], new Date()]);
	if (hasSymbols) { notInts.push(Symbol.iterator); }
	forEach(notInts, function (notInt) {
		t.equal(false, ES.IsInteger(notInt), ES.ToPropertyKey(notInt) + ' is not integer');
	});
	t.equal(false, ES.IsInteger(uncoercibleObject), 'uncoercibleObject is not integer');
	t.end();
});

test('IsExtensible', function (t) {
	forEach(objects, function (object) {
		t.equal(true, ES.IsExtensible(object), object + ' object is extensible');
	});
	forEach(primitives, function (primitive) {
		t.equal(false, ES.IsExtensible(primitive), primitive + ' is not extensible');
	});
	if (Object.preventExtensions) {
		t.equal(false, ES.IsExtensible(Object.preventExtensions({})), 'object with extensions prevented is not extensible');
	}
	t.end();
});

test('CanonicalNumericIndexString', function (t) {
	var throwsOnNonString = function (notString) {
		t.throws(function () { return ES.CanonicalNumericIndexString(notString); }, TypeError, notString + ' is not a string');
	};
	forEach(objects.concat(numbers), throwsOnNonString);
	t.ok(is(-0, ES.CanonicalNumericIndexString('-0')), '"-0" returns -0');
	for (var i = -50; i < 50; i += 10) {
		t.equal(i, ES.CanonicalNumericIndexString(String(i)), '"' + i + '" returns ' + i);
		t.equal(undefined, ES.CanonicalNumericIndexString(String(i) + 'a'), '"' + i + 'a" returns undefined');
	}
	t.end();
});

test('IsConstructor', function (t) {
	t.equal(true, ES.IsConstructor(function () {}), 'function is constructor');
	t.equal(false, ES.IsConstructor(/a/g), 'regex is not constructor');
	forEach(objects, function (object) {
		t.equal(false, ES.IsConstructor(object), object + ' object is not constructor');
	});
	t.end();
});

test('Call', function (t) {
	var receiver = {};
	var notFuncs = objects.concat(primitives).concat([/a/g, new RegExp('a', 'g')]);
	t.plan(notFuncs.length + 4);
	var throwsIfNotCallable = function (notFunc) {
		t.throws(function () { return ES.Call(notFunc, receiver); }, TypeError, notFunc + ' (' + typeof notFunc + ') is not callable');
	};
	forEach(notFuncs, throwsIfNotCallable);
	ES.Call(function (a, b) {
		t.equal(this, receiver, 'context matches expected');
		t.deepEqual([a, b], [1, 2], 'named args are correct');
		t.equal(arguments.length, 3, 'extra argument was passed');
		t.equal(arguments[2], 3, 'extra argument was correct');
	}, receiver, [1, 2, 3]);
	t.end();
});

test('SameValueNonNumber', function (t) {
	var willThrow = [
		[3, 4],
		[NaN, 4],
		[4, ''],
		['abc', true],
		[{}, false]
	];
	forEach(willThrow, function (nums) {
		t.throws(function () { return ES.SameValueNonNumber.apply(ES, nums); }, TypeError, 'value must be same type and non-number');
	});

	forEach(objects.concat(nonNumberPrimitives), function (val) {
		t.equal(val === val, ES.SameValueNonNumber(val, val), '"' + val + '" is SameValueNonNumber to itself');
	});

	t.end();
});
