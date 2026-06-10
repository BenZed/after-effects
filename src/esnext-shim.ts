/**
 * ES3-compatible polyfills for es2015+ library methods, layered on top of
 * extendscript-es5-shim.
 *
 * Everything here is synchronous and implementable in the ExtendScript
 * engine. Features that require engine support are deliberately absent:
 * Symbol, Promise, Map/Set, iterators, generators, Proxy and Reflect.
 */
export default `
// ---- esnext additions for the es3 ExtendScript engine ----

// Object -------------------------------------------------------------------

if (!Object.assign)
    Object.assign = function assign(target) {
        if (target === null || target === undefined)
            throw new TypeError('Cannot convert undefined or null to object');

        var to = Object(target);
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            if (source === null || source === undefined)
                continue;
            for (var key in source)
                if (Object.prototype.hasOwnProperty.call(source, key))
                    to[key] = source[key];
        }
        return to;
    };

if (!Object.values)
    Object.values = function values(obj) {
        var result = [];
        for (var key in obj)
            if (Object.prototype.hasOwnProperty.call(obj, key))
                result.push(obj[key]);
        return result;
    };

if (!Object.entries)
    Object.entries = function entries(obj) {
        var result = [];
        for (var key in obj)
            if (Object.prototype.hasOwnProperty.call(obj, key))
                result.push([key, obj[key]]);
        return result;
    };

if (!Object.fromEntries)
    Object.fromEntries = function fromEntries(entries) {
        var result = {};
        for (var i = 0; i < entries.length; i++)
            result[entries[i][0]] = entries[i][1];
        return result;
    };

// Array statics -------------------------------------------------------------

if (!Array.of)
    Array.of = function of() {
        var result = [];
        for (var i = 0; i < arguments.length; i++)
            result.push(arguments[i]);
        return result;
    };

if (!Array.from)
    Array.from = function from(arrayLike, mapFn, thisArg) {
        if (arrayLike === null || arrayLike === undefined)
            throw new TypeError('Array.from requires an array-like object');

        var items = Object(arrayLike);
        var len = Math.floor(Math.abs(Number(items.length) || 0));
        var result = [];
        for (var i = 0; i < len; i++) {
            var value = items[i];
            result.push(mapFn ? mapFn.call(thisArg, value, i) : value);
        }
        return result;
    };

// Array.prototype -----------------------------------------------------------

if (!Array.prototype.find)
    Array.prototype.find = function find(predicate, thisArg) {
        for (var i = 0; i < this.length; i++)
            if (predicate.call(thisArg, this[i], i, this))
                return this[i];
        return undefined;
    };

if (!Array.prototype.findIndex)
    Array.prototype.findIndex = function findIndex(predicate, thisArg) {
        for (var i = 0; i < this.length; i++)
            if (predicate.call(thisArg, this[i], i, this))
                return i;
        return -1;
    };

if (!Array.prototype.findLast)
    Array.prototype.findLast = function findLast(predicate, thisArg) {
        for (var i = this.length - 1; i >= 0; i--)
            if (predicate.call(thisArg, this[i], i, this))
                return this[i];
        return undefined;
    };

if (!Array.prototype.findLastIndex)
    Array.prototype.findLastIndex = function findLastIndex(predicate, thisArg) {
        for (var i = this.length - 1; i >= 0; i--)
            if (predicate.call(thisArg, this[i], i, this))
                return i;
        return -1;
    };

if (!Array.prototype.includes)
    Array.prototype.includes = function includes(searchElement, fromIndex) {
        var start = fromIndex || 0;
        if (start < 0)
            start = Math.max(this.length + start, 0);
        for (var i = start; i < this.length; i++) {
            var element = this[i];
            if (element === searchElement)
                return true;
            // SameValueZero: NaN equals NaN
            if (element !== element && searchElement !== searchElement)
                return true;
        }
        return false;
    };

if (!Array.prototype.fill)
    Array.prototype.fill = function fill(value, start, end) {
        var len = this.length;
        var from = start === undefined ? 0 : start;
        var to = end === undefined ? len : end;
        if (from < 0) from = Math.max(len + from, 0);
        if (to < 0) to = Math.max(len + to, 0);
        for (var i = from; i < Math.min(to, len); i++)
            this[i] = value;
        return this;
    };

if (!Array.prototype.flat)
    Array.prototype.flat = function flat(depth) {
        var d = depth === undefined ? 1 : depth;
        var result = [];
        for (var i = 0; i < this.length; i++) {
            var value = this[i];
            if (d > 0 && Object.prototype.toString.call(value) === '[object Array]') {
                var inner = value.flat(d - 1);
                for (var j = 0; j < inner.length; j++)
                    result.push(inner[j]);
            } else
                result.push(value);
        }
        return result;
    };

if (!Array.prototype.flatMap)
    Array.prototype.flatMap = function flatMap(callback, thisArg) {
        return this.map(function (value, index, array) {
            return callback.call(thisArg, value, index, array);
        }).flat(1);
    };

if (!Array.prototype.at)
    Array.prototype.at = function at(index) {
        var i = index < 0 ? this.length + index : index;
        return i >= 0 && i < this.length ? this[i] : undefined;
    };

// String.prototype ----------------------------------------------------------

if (!String.prototype.includes)
    String.prototype.includes = function includes(search, start) {
        return this.indexOf(search, start || 0) !== -1;
    };

if (!String.prototype.startsWith)
    String.prototype.startsWith = function startsWith(search, position) {
        var pos = position || 0;
        return this.substring(pos, pos + search.length) === search;
    };

if (!String.prototype.endsWith)
    String.prototype.endsWith = function endsWith(search, endPosition) {
        var end = endPosition === undefined ? this.length : endPosition;
        return this.substring(end - search.length, end) === search;
    };

if (!String.prototype.repeat)
    String.prototype.repeat = function repeat(count) {
        if (count < 0)
            throw new RangeError('repeat count must be non-negative');
        var result = '';
        for (var i = 0; i < count; i++)
            result += this;
        return result;
    };

if (!String.prototype.padStart)
    String.prototype.padStart = function padStart(targetLength, padString) {
        var pad = padString === undefined ? ' ' : String(padString);
        var result = String(this);
        if (pad.length === 0)
            return result;
        while (result.length < targetLength)
            result = pad.substring(0, Math.min(pad.length, targetLength - result.length)) + result;
        return result;
    };

if (!String.prototype.padEnd)
    String.prototype.padEnd = function padEnd(targetLength, padString) {
        var pad = padString === undefined ? ' ' : String(padString);
        var result = String(this);
        if (pad.length === 0)
            return result;
        while (result.length < targetLength)
            result += pad.substring(0, Math.min(pad.length, targetLength - result.length));
        return result;
    };

if (!String.prototype.trimStart)
    String.prototype.trimStart = function trimStart() {
        return String(this).replace(/^\\s+/, '');
    };

if (!String.prototype.trimEnd)
    String.prototype.trimEnd = function trimEnd() {
        return String(this).replace(/\\s+$/, '');
    };

if (!String.prototype.at)
    String.prototype.at = function at(index) {
        var i = index < 0 ? this.length + index : index;
        return i >= 0 && i < this.length ? this.charAt(i) : undefined;
    };

if (!String.prototype.replaceAll)
    String.prototype.replaceAll = function replaceAll(search, replacement) {
        // string patterns only; regex patterns should use replace with /g
        return String(this).split(search).join(replacement);
    };

// Number --------------------------------------------------------------------

if (Number.EPSILON === undefined)
    Number.EPSILON = Math.pow(2, -52);

if (Number.MAX_SAFE_INTEGER === undefined)
    Number.MAX_SAFE_INTEGER = 9007199254740991;

if (Number.MIN_SAFE_INTEGER === undefined)
    Number.MIN_SAFE_INTEGER = -9007199254740991;

if (!Number.isNaN)
    Number.isNaN = function isNaN(value) {
        return typeof value === 'number' && value !== value;
    };

if (!Number.isFinite)
    Number.isFinite = function isFinite(value) {
        return typeof value === 'number' &&
            value === value &&
            value !== Infinity &&
            value !== -Infinity;
    };

if (!Number.isInteger)
    Number.isInteger = function isInteger(value) {
        return Number.isFinite(value) && Math.floor(value) === value;
    };

if (!Number.isSafeInteger)
    Number.isSafeInteger = function isSafeInteger(value) {
        return Number.isInteger(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER;
    };

if (!Number.parseInt)
    Number.parseInt = parseInt;

if (!Number.parseFloat)
    Number.parseFloat = parseFloat;

// Math ----------------------------------------------------------------------

if (!Math.trunc)
    Math.trunc = function trunc(value) {
        return value < 0 ? Math.ceil(value) : Math.floor(value);
    };

if (!Math.sign)
    Math.sign = function sign(value) {
        var n = Number(value);
        if (n !== n || n === 0)
            return n;
        return n > 0 ? 1 : -1;
    };

if (!Math.cbrt)
    Math.cbrt = function cbrt(value) {
        var result = Math.pow(Math.abs(value), 1 / 3);
        return value < 0 ? -result : result;
    };

if (!Math.log2)
    Math.log2 = function log2(value) {
        return Math.log(value) / Math.LN2;
    };

if (!Math.log10)
    Math.log10 = function log10(value) {
        return Math.log(value) / Math.LN10;
    };

if (!Math.hypot)
    Math.hypot = function hypot() {
        var sum = 0;
        for (var i = 0; i < arguments.length; i++)
            sum += arguments[i] * arguments[i];
        return Math.sqrt(sum);
    };
`
