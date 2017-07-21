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
  if (this == null) {
    throw new TypeError('this is null or undefined')
  }

  if (typeof testFunc !== 'function') {
    throw new TypeError()
  }
  // ensure this is an object in case some wiseass does
  // Array.prototype.every.call("string", ...) or some shit
  const obj = Object(this)

  // cast obj.length to integer
  const length = obj.length >>> 0

  let key = 0
  while (key < length) {
    // using key in obj rather than obj[key], so
    // that this function will still work casted to objects or strings
    // or whatever
    if (key in obj) {
      const value = obj[key]
      const pass = testFunc.call(thisArg, value, key, obj)

      if (!pass) {
        return false
      }
    }

    key++
  }
  return true
}

Array.prototype.filter = Array.prototype.filter || function (testFunc, thisArg) {

  if (this == null) {
    throw new TypeError('this is null or undefined')
  }

  if (typeof testFunc !== 'function') {
    throw new TypeError()
  }

  const obj = Object(this)
  const length = obj.length >>> 0
  const result = []

  let key = 0
  while (key < length) {
    if (key in obj) {
      const value = obj[key]

      const pass = testFunc.call(thisArg, value, key, obj)
      if (pass) {
        result.push(value)
      }
    }
    key++
  }
}

Array.prototype.forEach = Array.prototype.forEach || function (callback, thisArg) {

  if (this == null) {
    throw new TypeError('this is null or undefined')
  }

  if (typeof callback !== 'function') {
    throw new TypeError()
  }

  const obj = Object(this)
  const length = obj.length >>> 0

  let key = 0

  while (key < length) {
    if (key in obj) {
      const value = obj[key]

      callback.call(thisArg, value, key, obj)
    }
    key++
  }
}
