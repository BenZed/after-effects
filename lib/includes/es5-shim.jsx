/*
  This is a include file that can be included in the after effects Scripts/Startup folder
  that will act as an es5 shim for the Adobe After Effects scripting environment.
*/

/* globals $ */
/* eslint-disable no-var */

/****************************************************************/
// Array Shims
/****************************************************************/
Array.isArray = Array.isArray ? Array.isArray : function(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
};

Array.prototype.every = Array.prototype.every ? Array.prototype.every : function(callbackfn, thisArg) {
  'use strict';
  var T, k;

  if (this == null) {
    throw new TypeError('this is null or not defined');
  }

  // 1. Let O be the result of calling ToObject passing the this
  //    value as the argument.
  var O = Object(this);

  // 2. Let lenValue be the result of calling the Get internal method
  //    of O with the argument "length".
  // 3. Let len be ToUint32(lenValue).
  var len = O.length >>> 0;

  // 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
  if (typeof callbackfn !== 'function') {
    throw new TypeError();
  }

  // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
  if (arguments.length > 1) {
    T = thisArg;
  }

  // 6. Let k be 0.
  k = 0;

  // 7. Repeat, while k < len
  while (k < len) {

    var kValue;

    // a. Let Pk be ToString(k).
    //   This is implicit for LHS operands of the in operator
    // b. Let kPresent be the result of calling the HasProperty internal
    //    method of O with argument Pk.
    //   This step can be combined with c
    // c. If kPresent is true, then
    if (k in O) {

      // i. Let kValue be the result of calling the Get internal method
      //    of O with argument Pk.
      kValue = O[k];

      // ii. Let testResult be the result of calling the Call internal method
      //     of callbackfn with T as the this value and argument list
      //     containing kValue, k, and O.
      var testResult = callbackfn.call(T, kValue, k, O);

      // iii. If ToBoolean(testResult) is false, return false.
      if (!testResult) {
        return false;
      }
    }
    k++;
  }
  return true;
};

Array.prototype.filter = Array.prototype.filter ? Array.prototype.filter : function(fun/*, thisArg*/) {
  'use strict';

  if (this === void 0 || this === null) {
    throw new TypeError();
  }

  var t = Object(this);
  var len = t.length >>> 0;
  if (typeof fun !== 'function') {
    throw new TypeError();
  }

  var res = [];
  var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
  for (var i = 0; i < len; i++) {
    if (i in t) {
      var val = t[i];

      // NOTE: Technically this should Object.defineProperty at
      //       the next index, as push can be affected by
      //       properties on Object.prototype and Array.prototype.
      //       But that method's new, and collisions should be
      //       rare, so use the more-compatible alternative.
      if (fun.call(thisArg, val, i, t)) {
        res.push(val);
      }
    }
  }

  return res;
};

Array.prototype.forEach = Array.prototype.forEach ? Array.prototype.forEach : function(callback, thisArg) {

  var T, k;

  if (this == null) {
    throw new TypeError(' this is null or not defined');
  }

  // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
  var O = Object(this);

  // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
  // 3. Let len be ToUint32(lenValue).
  var len = O.length >>> 0;

  // 4. If IsCallable(callback) is false, throw a TypeError exception.
  // See: http://es5.github.com/#x9.11
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }

  // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
  if (arguments.length > 1) {
    T = thisArg;
  }

  // 6. Let k be 0
  k = 0;

  // 7. Repeat, while k < len
  while (k < len) {

    var kValue;

    // a. Let Pk be ToString(k).
    //   This is implicit for LHS operands of the in operator
    // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
    //   This step can be combined with c
    // c. If kPresent is true, then
    if (k in O) {

      // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
      kValue = O[k];

      // ii. Call the Call internal method of callback with T as the this value and
      // argument list containing kValue, k, and O.
      callback.call(T, kValue, k, O);
    }
    // d. Increase k by 1.
    k++;
  }
  // 8. return undefined
};

Array.prototype.indexOf = Array.prototype.indexOf ? Array.prototype.indexOf : function(searchElement, fromIndex) {

  var k;

  // 1. Let o be the result of calling ToObject passing
  //    the this value as the argument.
  if (this == null) {
    throw new TypeError('"this" is null or not defined');
  }

  var o = Object(this);

  // 2. Let lenValue be the result of calling the Get
  //    internal method of o with the argument "length".
  // 3. Let len be ToUint32(lenValue).
  var len = o.length >>> 0;

  // 4. If len is 0, return -1.
  if (len === 0) {
    return -1;
  }

  // 5. If argument fromIndex was passed let n be
  //    ToInteger(fromIndex); else let n be 0.
  var n = +fromIndex || 0;

  if (Math.abs(n) === Infinity) {
    n = 0;
  }

  // 6. If n >= len, return -1.
  if (n >= len) {
    return -1;
  }

  // 7. If n >= 0, then Let k be n.
  // 8. Else, n<0, Let k be len - abs(n).
  //    If k is less than 0, then let k be 0.
  k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

  // 9. Repeat, while k < len
  while (k < len) {
    // a. Let Pk be ToString(k).
    //   This is implicit for LHS operands of the in operator
    // b. Let kPresent be the result of calling the
    //    HasProperty internal method of o with argument Pk.
    //   This step can be combined with c
    // c. If kPresent is true, then
    //    i.  Let elementK be the result of calling the Get
    //        internal method of o with the argument ToString(k).
    //   ii.  Let same be the result of applying the
    //        Strict Equality Comparison Algorithm to
    //        searchElement and elementK.
    //  iii.  If same is true, return k.
    if (k in o && o[k] === searchElement) {
      return k;
    }
    k++;
  }
  return -1;
};

Array.prototype.lastIndexOf = Array.prototype.lastIndexOf ? Array.prototype.lastIndexOf : function(searchElement /*, fromIndex*/) {
  'use strict';

  if (this === void 0 || this === null) {
    throw new TypeError();
  }

  var n, k,
    t = Object(this),
    len = t.length >>> 0;
  if (len === 0) {
    return -1;
  }

  n = len - 1;
  if (arguments.length > 1) {
    n = Number(arguments[1]);
    if (n != n) {
      n = 0;
    }
    else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) { //eslint-disable-line no-extra-parens
      n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
  }

  for (k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n); k >= 0; k--) {
    if (k in t && t[k] === searchElement) {
      return k;
    }
  }
  return -1;
};

Array.prototype.map = Array.prototype.map ? Array.prototype.map : function(callback, thisArg) {

  var T, A, k;

  if (this == null) {
    throw new TypeError(' this is null or not defined');
  }

  // 1. Let O be the result of calling ToObject passing the |this|
  //    value as the argument.
  var O = Object(this);

  // 2. Let lenValue be the result of calling the Get internal
  //    method of O with the argument "length".
  // 3. Let len be ToUint32(lenValue).
  var len = O.length >>> 0;

  // 4. If IsCallable(callback) is false, throw a TypeError exception.
  // See: http://es5.github.com/#x9.11
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }

  // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
  if (arguments.length > 1) {
    T = thisArg;
  }

  // 6. Let A be a new array created as if by the expression new Array(len)
  //    where Array is the standard built-in constructor with that name and
  //    len is the value of len.
  A = new Array(len);

  // 7. Let k be 0
  k = 0;

  // 8. Repeat, while k < len
  while (k < len) {

    var kValue, mappedValue;

    // a. Let Pk be ToString(k).
    //   This is implicit for LHS operands of the in operator
    // b. Let kPresent be the result of calling the HasProperty internal
    //    method of O with argument Pk.
    //   This step can be combined with c
    // c. If kPresent is true, then
    if (k in O) {

      // i. Let kValue be the result of calling the Get internal
      //    method of O with argument Pk.
      kValue = O[k];

      // ii. Let mappedValue be the result of calling the Call internal
      //     method of callback with T as the this value and argument
      //     list containing kValue, k, and O.
      mappedValue = callback.call(T, kValue, k, O);

      // iii. Call the DefineOwnProperty internal method of A with arguments
      // Pk, Property Descriptor
      // { Value: mappedValue,
      //   Writable: true,
      //   Enumerable: true,
      //   Configurable: true },
      // and false.

      // In browsers that support Object.defineProperty, use the following:
      // Object.defineProperty(A, k, {
      //   value: mappedValue,
      //   writable: true,
      //   enumerable: true,
      //   configurable: true
      // });

      // For best browser support, use the following:
      A[k] = mappedValue;
    }
    // d. Increase k by 1.
    k++;
  }

  // 9. return A
  return A;
};

Array.prototype.reduce = Array.prototype.reduce ? Array.prototype.reduce : function(callback /*, initialValue*/) {
  'use strict';
  if (this == null) {
    throw new TypeError('Array.prototype.reduce called on null or undefined');
  }
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }
  var t = Object(this), len = t.length >>> 0, k = 0, value;
  if (arguments.length == 2) {
    value = arguments[1];
  } else {
    while (k < len && !(k in t)) {
      k++;
    }
    if (k >= len) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    value = t[k++];
  }
  for (; k < len; k++) {
    if (k in t) {
      value = callback(value, t[k], k, t);
    }
  }
  return value;
};

Array.prototype.reduceRight = Array.prototype.reduceRight ? Array.prototype.reduceRight : function(callback /*, initialValue*/) {
  'use strict';
  if (null === this || 'undefined' === typeof this) {
    throw new TypeError('Array.prototype.reduce called on null or undefined' );
  }
  if ('function' !== typeof callback) {
    throw new TypeError(callback + ' is not a function');
  }
  var t = Object(this), len = t.length >>> 0, k = len - 1, value;
  if (arguments.length >= 2) {
    value = arguments[1];
  } else {
    while (k >= 0 && !(k in t)) {
      k--;
    }
    if (k < 0) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    value = t[k--];
  }
  for (; k >= 0; k--) {
    if (k in t) {
      value = callback(value, t[k], k, t);
    }
  }
  return value;
};

Array.prototype.some = Array.prototype.some ? Array.prototype.some : function(fun/*, thisArg*/) {
  'use strict';

  if (this == null) {
    throw new TypeError('Array.prototype.some called on null or undefined');
  }

  if (typeof fun !== 'function') {
    throw new TypeError();
  }

  var t = Object(this);
  var len = t.length >>> 0;

  var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
  for (var i = 0; i < len; i++) {
    if (i in t && fun.call(thisArg, t[i], i, t)) {
      return true;
    }
  }

  return false;
};

/****************************************************************/
// Date Polyfill
/****************************************************************/

if (!Date.prototype.toISOString) {
  (function() {

    function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }

    Date.prototype.toISOString = function() {
      return this.getUTCFullYear() +
        '-' + pad(this.getUTCMonth() + 1) +
        '-' + pad(this.getUTCDate()) +
        'T' + pad(this.getUTCHours()) +
        ':' + pad(this.getUTCMinutes()) +
        ':' + pad(this.getUTCSeconds()) +
        '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
        'Z';
    };

  }());
}

Date.prototype.toJSON = Date.prototype.toJSON ? Date.prototype.toJSON : function () {
  return this.toISOString(this);
};

/****************************************************************/
// Function Shims
/****************************************************************/

Function.prototype.bind = Function.prototype.bind ? Function.prototype.bind : function(oThis) {
  if (typeof this !== 'function') {
    // closest thing possible to the ECMAScript 5
    // internal IsCallable function
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
  }

  var aArgs   = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      fNOP    = function() {},
      fBound  = function() {
        return fToBind.apply(this instanceof fNOP
               ? this
               : oThis,
               aArgs.concat(Array.prototype.slice.call(arguments)));
      };

  if (this.prototype) {
    // Function.prototype don't have a prototype property
    fNOP.prototype = this.prototype;
  }
  fBound.prototype = new fNOP();

  return fBound;
};


/****************************************************************/
// Object Shims
/****************************************************************/

if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'), //eslint-disable-line no-extra-parens
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

/****************************************************************/
// String Shims
/****************************************************************/

String.prototype.trim = String.prototype.trim ? String.prototype.trim : function() {
  return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};

String.prototype.includes = String.prototype.includes ? String.prototype.includes : function(search, start) {
  'use strict';
  if (typeof start !== 'number') {
    start = 0;
  }

  if (start + search.length > this.length) {
    return false;
  } else {
    return this.indexOf(search, start) !== -1;
  }
};

/****************************************************************/
// Object Shams
/****************************************************************/
/*!
 * https://github.com/es-shims/es5-shim
 * @license es5-shim Copyright 2009-2015 by contributors, MIT License
 * see https://github.com/es-shims/es5-shim/blob/master/LICENSE
 */

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
  'use strict';

  /* global define, exports, module */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.returnExports = factory();
  }
}($.global, function () {

var call = Function.call;
var prototypeOfObject = Object.prototype;
var owns = call.bind(prototypeOfObject.hasOwnProperty);
var isEnumerable = call.bind(prototypeOfObject.propertyIsEnumerable);
var toStr = call.bind(prototypeOfObject.toString);

// If JS engine supports accessors creating shortcuts.
var defineGetter;
var defineSetter;
var lookupGetter;
var lookupSetter;
var supportsAccessors = owns(prototypeOfObject, '__defineGetter__');
if (supportsAccessors) {
  /* eslint-disable no-underscore-dangle */
  defineGetter = call.bind(prototypeOfObject.__defineGetter__);
  defineSetter = call.bind(prototypeOfObject.__defineSetter__);
  lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
  lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
  /* eslint-enable no-underscore-dangle */
}

// ES5 15.2.3.2
// http://es5.github.com/#x15.2.3.2
if (!Object.getPrototypeOf) {
  // https://github.com/es-shims/es5-shim/issues#issue/2
  // http://ejohn.org/blog/objectgetprototypeof/
  // recommended by fschaefer on github
  //
  // sure, and webreflection says ^_^
  // ... this will nerever possibly return null
  // ... Opera Mini breaks here with infinite loops
  Object.getPrototypeOf = function getPrototypeOf(object) {
    /* eslint-disable no-proto */
    var proto = object.__proto__;
    /* eslint-enable no-proto */
    if (proto || proto === null) {
      return proto;
    } else if (toStr(object.constructor) === '[object Function]') {
      return object.constructor.prototype;
    } else if (object instanceof Object) {
      return prototypeOfObject;
    } else {
      // Correctly return null for Objects created with `Object.create(null)`
      // (shammed or native) or `{ __proto__: null}`.  Also returns null for
      // cross-realm objects on browsers that lack `__proto__` support (like
      // IE <11), but that's the best we can do.
      return null;
    }
  };
}

// ES5 15.2.3.3
// http://es5.github.com/#x15.2.3.3

var doesGetOwnPropertyDescriptorWork = function doesGetOwnPropertyDescriptorWork(object) {
  try {
    object.sentinel = 0;
    return Object.getOwnPropertyDescriptor(object, 'sentinel').value === 0;
  } catch (exception) {
    return false;
  }
};

// check whether getOwnPropertyDescriptor works if it's given. Otherwise, shim partially.
if (Object.defineProperty) {
  var getOwnPropertyDescriptorWorksOnObject = doesGetOwnPropertyDescriptorWork({});
  var getOwnPropertyDescriptorWorksOnDom = typeof document === 'undefined' ||
  doesGetOwnPropertyDescriptorWork(document.createElement('div'));
  if (!getOwnPropertyDescriptorWorksOnDom || !getOwnPropertyDescriptorWorksOnObject) {
    var getOwnPropertyDescriptorFallback = Object.getOwnPropertyDescriptor;
  }
}

if (!Object.getOwnPropertyDescriptor || getOwnPropertyDescriptorFallback) {
  var ERR_NON_OBJECT = 'Object.getOwnPropertyDescriptor called on a non-object: ';

  /* eslint-disable no-proto */
  Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
    if (typeof object !== 'object' && typeof object !== 'function' || object === null) {
      throw new TypeError(ERR_NON_OBJECT + object);
    }

    // make a valiant attempt to use the real getOwnPropertyDescriptor
    // for I8's DOM elements.
    if (getOwnPropertyDescriptorFallback) {
      try {
        return getOwnPropertyDescriptorFallback.call(Object, object, property);
      } catch (exception) {
        // try the shim if the real one doesn't work
      }
    }

    var descriptor;

    // If object does not owns property return undefined immediately.
    if (!owns(object, property)) {
      return descriptor;
    }

    // If object has a property then it's for sure `configurable`, and
    // probably `enumerable`. Detect enumerability though.
    descriptor = {
      enumerable: isEnumerable(object, property),
      configurable: true
    };

    // If JS engine supports accessor properties then property may be a
    // getter or setter.
    if (supportsAccessors) {
      // Unfortunately `__lookupGetter__` will return a getter even
      // if object has own non getter property along with a same named
      // inherited getter. To avoid misbehavior we temporary remove
      // `__proto__` so that `__lookupGetter__` will return getter only
      // if it's owned by an object.
      var prototype = object.__proto__;
      var notPrototypeOfObject = object !== prototypeOfObject;
      // avoid recursion problem, breaking in Opera Mini when
      // Object.getOwnPropertyDescriptor(Object.prototype, 'toString')
      // or any other Object.prototype accessor
      if (notPrototypeOfObject) {
        object.__proto__ = prototypeOfObject;
      }

      var getter = lookupGetter(object, property);
      var setter = lookupSetter(object, property);

      if (notPrototypeOfObject) {
        // Once we have getter and setter we can put values back.
        object.__proto__ = prototype;
      }

      if (getter || setter) {
        if (getter) {
          descriptor.get = getter;
        }
        if (setter) {
          descriptor.set = setter;
        }
        // If it was accessor property we're done and return here
        // in order to avoid adding `value` to the descriptor.
        return descriptor;
      }
    }

    // If we got this far we know that object has an own property that is
    // not an accessor so we set it as a value and return descriptor.
    descriptor.value = object[property];
    descriptor.writable = true;
    return descriptor;
  };
  /* eslint-enable no-proto */
}

// ES5 15.2.3.4
// http://es5.github.com/#x15.2.3.4
if (!Object.getOwnPropertyNames) {
  Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
    return Object.keys(object);
  };
}

// ES5 15.2.3.5
// http://es5.github.com/#x15.2.3.5
if (!Object.create) {

  // Contributed by Brandon Benvie, October, 2012
  var createEmpty;
  var supportsProto = !({ __proto__: null } instanceof Object);
            // the following produces false positives
            // in Opera Mini => not a reliable check
            // Object.prototype.__proto__ === null

  // Check for document.domain and active x support
  // No need to use active x approach when document.domain is not set
  // see https://github.com/es-shims/es5-shim/issues/150
  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  /* global ActiveXObject */
  var shouldUseActiveX = function shouldUseActiveX() {
    // return early if document.domain not set
    if (!document.domain) {
      return false;
    }

    try {
      return !!new ActiveXObject('htmlfile');
    } catch (exception) {
      return false;
    }
  };

  // This supports IE8 when document.domain is used
  // see https://github.com/es-shims/es5-shim/issues/150
  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  var getEmptyViaActiveX = function getEmptyViaActiveX() {
    var empty;
    var xDoc;

    xDoc = new ActiveXObject('htmlfile');

    xDoc.write('<script><\/script>');
    xDoc.close();

    empty = xDoc.parentWindow.Object.prototype;
    xDoc = null;

    return empty;
  };

  // The original implementation using an iframe
  // before the activex approach was added
  // see https://github.com/es-shims/es5-shim/issues/150
  var getEmptyViaIFrame = function getEmptyViaIFrame() {
    var iframe = document.createElement('iframe');
    var parent = document.body || document.documentElement;
    var empty;

    iframe.style.display = 'none';
    parent.appendChild(iframe);
    /* eslint-disable no-script-url */
    iframe.src = 'javascript:';
    /* eslint-enable no-script-url */

    empty = iframe.contentWindow.Object.prototype;
    parent.removeChild(iframe);
    iframe = null;

    return empty;
  };

  /* global document */
  if (supportsProto || typeof document === 'undefined') {
    createEmpty = function () {
      return { __proto__: null };
    };
  } else {
    // In old IE __proto__ can't be used to manually set `null`, nor does
    // any other method exist to make an object that inherits from nothing,
    // aside from Object.prototype itself. Instead, create a new global
    // object and *steal* its Object.prototype and strip it bare. This is
    // used as the prototype to create nullary objects.
    createEmpty = function () {
      // Determine which approach to use
      // see https://github.com/es-shims/es5-shim/issues/150
      var empty = shouldUseActiveX() ? getEmptyViaActiveX() : getEmptyViaIFrame();

      delete empty.constructor;
      delete empty.hasOwnProperty;
      delete empty.propertyIsEnumerable;
      delete empty.isPrototypeOf;
      delete empty.toLocaleString;
      delete empty.toString;
      delete empty.valueOf;

      var Empty = function Empty() {};
      Empty.prototype = empty;
      // short-circuit future calls
      createEmpty = function () {
        return new Empty();
      };
      return new Empty();
    };
  }

  Object.create = function create(prototype, properties) {

    var object;
    var Type = function Type() {}; // An empty constructor.

    if (prototype === null) {
      object = createEmpty();
    } else {
      if (typeof prototype !== 'object' && typeof prototype !== 'function') {
        // In the native implementation `parent` can be `null`
        // OR *any* `instanceof Object`  (Object|Function|Array|RegExp|etc)
        // Use `typeof` tho, b/c in old IE, DOM elements are not `instanceof Object`
        // like they are in modern browsers. Using `Object.create` on DOM elements
        // is...err...probably inappropriate, but the native version allows for it.
        throw new TypeError('Object prototype may only be an Object or null'); // same msg as Chrome
      }
      Type.prototype = prototype;
      object = new Type();
      // IE has no built-in implementation of `Object.getPrototypeOf`
      // neither `__proto__`, but this manually setting `__proto__` will
      // guarantee that `Object.getPrototypeOf` will work as expected with
      // objects created using `Object.create`
      /* eslint-disable no-proto */
      object.__proto__ = prototype;
      /* eslint-enable no-proto */
    }

    if (properties !== void 0) {
      Object.defineProperties(object, properties);
    }

    return object;
  };
}

// ES5 15.2.3.6
// http://es5.github.com/#x15.2.3.6

// Patch for WebKit and IE8 standard mode
// Designed by hax <hax.github.com>
// related issue: https://github.com/es-shims/es5-shim/issues#issue/5
// IE8 Reference:
//   http://msdn.microsoft.com/en-us/library/dd282900.aspx
//   http://msdn.microsoft.com/en-us/library/dd229916.aspx
// WebKit Bugs:
//   https://bugs.webkit.org/show_bug.cgi?id=36423

var doesDefinePropertyWork = function doesDefinePropertyWork(object) {
  try {
    Object.defineProperty(object, 'sentinel', {});
    return 'sentinel' in object;
  } catch (exception) {
    return false;
  }
};

// check whether defineProperty works if it's given. Otherwise,
// shim partially.
if (Object.defineProperty) {
  var definePropertyWorksOnObject = doesDefinePropertyWork({});
  var definePropertyWorksOnDom = typeof document === 'undefined' ||
    doesDefinePropertyWork(document.createElement('div'));
  if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
    var definePropertyFallback = Object.defineProperty,
      definePropertiesFallback = Object.defineProperties;
  }
}

if (!Object.defineProperty || definePropertyFallback) {
  var ERR_NON_OBJECT_DESCRIPTOR = 'Property description must be an object: ';
  var ERR_NON_OBJECT_TARGET = 'Object.defineProperty called on non-object: ';
  var ERR_ACCESSORS_NOT_SUPPORTED = 'getters & setters can not be defined on this javascript engine';

  Object.defineProperty = function defineProperty(object, property, descriptor) {
    if (typeof object !== 'object' && typeof object !== 'function' || object === null) {
      throw new TypeError(ERR_NON_OBJECT_TARGET + object);
    }
    if (typeof descriptor !== 'object' && typeof descriptor !== 'function' || descriptor === null) {
      throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
    }
    // make a valiant attempt to use the real defineProperty
    // for I8's DOM elements.
    if (definePropertyFallback) {
      try {
        return definePropertyFallback.call(Object, object, property, descriptor);
      } catch (exception) {
        // try the shim if the real one doesn't work
      }
    }

    // If it's a data property.
    if ('value' in descriptor) {
      // fail silently if 'writable', 'enumerable', or 'configurable'
      // are requested but not supported
      /*
      // alternate approach:
      if ( // can't implement these features; allow false but not true
        ('writable' in descriptor && !descriptor.writable) ||
        ('enumerable' in descriptor && !descriptor.enumerable) ||
        ('configurable' in descriptor && !descriptor.configurable)
      ))
        throw new RangeError(
          'This implementation of Object.defineProperty does not support configurable, enumerable, or writable.'
        );
      */

      if (supportsAccessors && (lookupGetter(object, property) || lookupSetter(object, property))) {
        // As accessors are supported only on engines implementing
        // `__proto__` we can safely override `__proto__` while defining
        // a property to make sure that we don't hit an inherited
        // accessor.
        /* eslint-disable no-proto */
        var prototype = object.__proto__;
        object.__proto__ = prototypeOfObject;
        // Deleting a property anyway since getter / setter may be
        // defined on object itself.
        delete object[property];
        object[property] = descriptor.value;
        // Setting original `__proto__` back now.
        object.__proto__ = prototype;
        /* eslint-enable no-proto */
      } else {
        object[property] = descriptor.value;
      }
    } else {
      if (!supportsAccessors && ('get' in descriptor || 'set' in descriptor)) {
        throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
      }
      // If we got that far then getters and setters can be defined !!
      if ('get' in descriptor) {
        defineGetter(object, property, descriptor.get);
      }
      if ('set' in descriptor) {
        defineSetter(object, property, descriptor.set);
      }
    }
    return object;
  };
}

// ES5 15.2.3.7
// http://es5.github.com/#x15.2.3.7
if (!Object.defineProperties || definePropertiesFallback) {
  Object.defineProperties = function defineProperties(object, properties) {
    // make a valiant attempt to use the real defineProperties
    if (definePropertiesFallback) {
      try {
        return definePropertiesFallback.call(Object, object, properties);
      } catch (exception) {
        // try the shim if the real one doesn't work
      }
    }

    Object.keys(properties).forEach(function (property) {
      if (property !== '__proto__') {
        Object.defineProperty(object, property, properties[property]);
      }
    });
    return object;
  };
}

// ES5 15.2.3.8
// http://es5.github.com/#x15.2.3.8
if (!Object.seal) {
  Object.seal = function seal(object) {
    if (Object(object) !== object) {
      throw new TypeError('Object.seal can only be called on Objects.');
    }
    // this is misleading and breaks feature-detection, but
    // allows "securable" code to "gracefully" degrade to working
    // but insecure code.
    return object;
  };
}

// ES5 15.2.3.9
// http://es5.github.com/#x15.2.3.9
if (!Object.freeze) {
  Object.freeze = function freeze(object) {
    if (Object(object) !== object) {
      throw new TypeError('Object.freeze can only be called on Objects.');
    }
    // this is misleading and breaks feature-detection, but
    // allows "securable" code to "gracefully" degrade to working
    // but insecure code.
    return object;
  };
}

// detect a Rhino bug and patch it
try {
  Object.freeze(function () {});
} catch (exception) {
  Object.freeze = (function (freezeObject) {
    return function freeze(object) {
      if (typeof object === 'function') {
        return object;
      } else {
        return freezeObject(object);
      }
    };
  }(Object.freeze));
}

// ES5 15.2.3.10
// http://es5.github.com/#x15.2.3.10
if (!Object.preventExtensions) {
  Object.preventExtensions = function preventExtensions(object) {
    if (Object(object) !== object) {
      throw new TypeError('Object.preventExtensions can only be called on Objects.');
    }
    // this is misleading and breaks feature-detection, but
    // allows "securable" code to "gracefully" degrade to working
    // but insecure code.
    return object;
  };
}

// ES5 15.2.3.11
// http://es5.github.com/#x15.2.3.11
if (!Object.isSealed) {
  Object.isSealed = function isSealed(object) {
    if (Object(object) !== object) {
      throw new TypeError('Object.isSealed can only be called on Objects.');
    }
    return false;
  };
}

// ES5 15.2.3.12
// http://es5.github.com/#x15.2.3.12
if (!Object.isFrozen) {
  Object.isFrozen = function isFrozen(object) {
    if (Object(object) !== object) {
      throw new TypeError('Object.isFrozen can only be called on Objects.');
    }
    return false;
  };
}

// ES5 15.2.3.13
// http://es5.github.com/#x15.2.3.13
if (!Object.isExtensible) {
  Object.isExtensible = function isExtensible(object) {
    // 1. If Type(O) is not Object throw a TypeError exception.
    if (Object(object) !== object) {
      throw new TypeError('Object.isExtensible can only be called on Objects.');
    }
    // 2. Return the Boolean value of the [[Extensible]] internal property of O.
    var name = '';
    while (owns(object, name)) {
      name += '?';
    }
    object[name] = true;
    var returnValue = owns(object, name);
    delete object[name];
    return returnValue;
  };
}

}));
