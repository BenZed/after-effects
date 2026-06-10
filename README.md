# after-effects

[![CI](https://github.com/BenZed/after-effects/actions/workflows/ci.yml/badge.svg)](https://github.com/BenZed/after-effects/actions/workflows/ci.yml)

Send instructions to the After Effects scripting environment from node.js.

# Why?

* You're running a node.js server with After Effects installed, and you'd like to run render commands server-side.
* You use node.js locally, and prefer not to run AE scripts with the ExtendScript toolkit.
* You'd like to write AE scripts in modern javascript and have them transpiled for the aging ExtendScript engine automatically.
* Because it angers your religious mother, and you want to be rebellious.

## Requirements

Obviously, you need After Effects installed on your machine (macOS or Windows).
Additionally, in your After Effects preferences, enable:

*Preferences -> General -> Allow Scripts to Write Files and Access Network*

# Basic Usage

```js
import { executeSync } from 'after-effects'

executeSync(() => alert('Hello!\nFrom node.js'))
```

_What fun!_

Provided that After Effects is installed in your Applications/Program directory, and that you haven't renamed any of the folders or something, this will work.

The default export is `executeSync`, so this is equivalent:

```js
import ae from 'after-effects'

ae(() => alert('Hello!\nFrom node.js'))
```

# Scripting Considerations

The After Effects scripting environment is a completely different engine than node.js. Node.js has no access to the After Effects environment, and vice versa:

```js
const foo = 'bar'

// this will not work:
executeSync(() => alert(foo))
```

If you'd like to send data from node.js to After Effects, supply it as arguments after the function. Whatever you supply has to survive a round trip through JSON:

```js
const foo = 'bar'

executeSync(fooFromNode => alert(fooFromNode), foo)
```

You can retrieve data from After Effects with the same restriction. Results come back wrapped in an `ExecuteResult`, along with any `console.log` calls the script made:

```js
const { result, logs } = executeSync(() => {
    console.log('checking project...')

    return app.project.file
        ? app.project.file.name
        : '(project not yet saved)'
})

console.log(result) // the project name
console.log(logs)   // [['checking project...']]
```

Also see the [After Effects Scripting Guide](https://ae-scripting.docsforadobe.dev/) for information about the After Effects javascript API.

### Sync vs Async

`executeSync` blocks node until After Effects is done. `execute` returns a Promise:

```js
import { execute } from 'after-effects'

const { result } = await execute(() => app.project.activeItem.name)
console.log(result)
```

### Persistent Environment

The scripting environment inside After Effects persists between executions, unless you manually reset it or restart After Effects. You have access to the After Effects global namespace through `global`:

```js
executeSync(() => global.whoKilledKenny = 'you bastards')

const { result } = executeSync(() => global.whoKilledKenny)
console.log(result) // you bastards
```

# Configuration

Instead of a bare function, you can pass a config object as the first argument:

```js
executeSync({
    source: name => app.project.activeItem.name = name,

    // (default true) return the script's result and logs to node
    serializeResult: true,

    // (default true) transpile the source to es3 for the ExtendScript engine.
    // set false to send modern javascript untouched.
    transpileToEs3: true,

    // (default false) prepend a library shim so the source can use modern
    // methods inside After Effects - see below
    prependEsnextShim: true,

    // prepend arbitrary strings of es3 code for edge cases
    prependCustomEs3: ['$.global.FAVOURITE_COLOR = "blue"'],

    // where to look for the After Effects install, if not the standard
    // Applications/Program Files location. useful for selecting a specific
    // version when several are installed.
    appPath: '/Applications/Adobe After Effects 2026'

}, 'Larry') // arguments follow as usual
```

### The esnext shim

The ExtendScript engine inside After Effects is ES3 — it predates even `JSON`. With `prependEsnextShim: true`, your script runs after a shim that provides the es5 baseline ([extendscript-es5-shim](https://www.npmjs.com/package/extendscript-es5-shim), including `JSON`) plus es2015+ library methods: `Object.assign/values/entries/fromEntries`, `Array.from/of`, `Array.prototype.find/findIndex/findLast/findLastIndex/includes/fill/flat/flatMap/at`, `String.prototype.includes/startsWith/endsWith/repeat/padStart/padEnd/trimStart/trimEnd/at/replaceAll`, `Number.isInteger/isFinite/isNaN/isSafeInteger`, `Math.trunc/sign/cbrt/log2/log10/hypot`, and friends.

Engine-level features cannot be shimmed into ES3 and are not available inside After Effects: `Symbol`, `Promise`, `Map`/`Set`, iterators, generators, `Proxy` and `Reflect`. Syntax (arrow functions, `const`/`let`, destructuring, template literals, classes) is handled separately by the babel transpile step and works regardless of the shim.

# Creating Scripts

Rather than executing code, you can create `.jsx` scripts for use in After Effects:

```js
import { createScript, createScriptSync } from 'after-effects'

await createScript({
    source: () => alert('After Effects totally just started.'),
    serializeResult: false,
    prependEsnextShim: true,

    // relative paths land in the After Effects scripts folder.
    // 'Startup/...' scripts run when After Effects launches.
    scriptName: 'Startup/SayHello.jsx'
})
```

Absolute `scriptName` paths are written as-is, anywhere on disk.

# Error Handling

Errors thrown inside After Effects are serialized back and rethrown in node as `AfterEffectsScriptError`. Two other error types cover the usual suspects:

```js
import {
    executeSync,
    AfterEffectsScriptError, // your script threw inside After Effects
    AfterEffectsMissingError, // After Effects could not be found
    NoResultError             // results could not be read back - usually the
                              // 'Allow Scripts to Write Files' pref is off
} from 'after-effects'

try {
    executeSync(() => app.project.activeItem.name)
} catch (err) {
    if (err instanceof AfterEffectsScriptError)
        console.log('No active item, probably:', err.message)
}
```

# Development

```sh
npm ci
npm run typecheck
npm run lint
npm test
```

The test suite runs on linux, windows and macOS in CI. After Effects itself can't be installed on hosted runners, so everything up to the process boundary is covered: transpilation, script generation, the shim, results parsing and install discovery against fabricated directory trees.

### Roadmap

* `renderEngine` option is accepted but not yet wired to the render engine launch logic.
* Adobe is migrating its apps from ExtendScript to UXP (modern javascript). When UXP scripting lands properly in After Effects, `transpileToEs3` will default to `false` in a major version bump.
