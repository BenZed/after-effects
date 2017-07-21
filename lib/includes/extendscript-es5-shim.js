'use strict'

/*
  This is a include file that can be included in the after effects Scripts/Startup
  folder that will act as an es5 shim for the Adobe After Effects scripting
  environment. This is slightly different than a standard es5 shim in that it is
  specifically written to work in the after effects environment.
*/

Array.isArray = Array.isArray || function (obj) {
  return obj instanceof Array
}

Array.prototype.every = Array.prototype.every || function (testFunc, thisArg) {
  if (this == null) throw new TypeError('this is null or undefined')

  if (typeof testFunc !== 'function') throw new TypeError()

  // ensure this is an object in case some wiseass does
  // Array.prototype.every.call("string", ...) or some shit
  var obj = Object(this)

  // cast obj.length to integer
  var length = obj.length >>> 0

  var key = 0
  while (key < length) {
    // using key in obj rather than obj[key], so
    // that this function will still work casted to objects or strings
    // or whatever
    if (key in obj) {
      var value = obj[key]
      var pass = testFunc.call(thisArg, value, key, obj)

      if (!pass) return false
    }

    key++
  }
  return true
}

Array.prototype.filter = Array.prototype.filter || function (testFunc, thisArg) {
  if (this == null) throw new TypeError('this is null or undefined')

  if (typeof testFunc !== 'function') throw new TypeError()

  var obj = Object(this)
  var length = obj.length >>> 0
  var result = []

  var key = 0
  while (key < length) {
    if (key in obj) {
      var value = obj[key]

      var pass = testFunc.call(thisArg, value, key, obj)
      if (pass) result.push(value)
    }
    key++
  }
}

Array.prototype.forEach = Array.prototype.forEach || function (callback, thisArg) {
  if (this == null) throw new TypeError('this is null or undefined')

  if (typeof callback !== 'function') throw new TypeError()

  var obj = Object(this)
  var length = obj.length >>> 0

  var key = 0

  while (key < length) {
    if (key in obj) {
      var value = obj[key]

      callback.call(thisArg, value, key, obj)
    }
    key++
  }
}
