# after-effects
___

# Why?
* You're running a node.js server with After Effects installed, and you'd like to run render commands server-side.

* You use node.js locally, and prefer not to run AE scripts with the ExtendScript toolkit.

* You'd like to run and create AE scripts using ES6 syntax.

* Because it angers your religious mother, and you want to be rebellious.

## Requirements
Obviously, you need After Effects installed on your machine.
Additionally, in your After Effects preferences, enable:

*Preferences -> General -> Allow Scripts to Write Files and Access Network*

___
# Basic Usage

```js

import ae from 'after-effects'

```

_Ta Daaaa_. The rest of this **README** assumes ae is the after effects module.

To execute some code in After Effects:
```js

ae(() => alert('Hello!\nFrom node.js'))
```

_What fun!_

Provided that After Effects is installed in your Applications/Program directory, and that you haven't renamed any of the folders or something, this will work.

___

# Scripting Considerations
The After Effects scripting environment is a completely different engine than Node.js. Node.js has no access to the After Effects environment, and vice versa:

```js
const foo = 'bar'

//this will not work:
ae(() => alert(foo))
```

If you'd like to send data from node.js to After Effects, you have to supply it as an argument along with the execute command:

```js
const foo = "bar"

ae((foo_from_node) => alert(foo_from_node), foo)
```

What you're really doing when you use the execute method is converting the supplied function to a string and then sending it to After Effects to parse. As a result, whatever data you supply has to be convertible to JSON.

You can also retrieve data from After Effects with the same restriction:

```js
const projectName = ae(() => {
  if (app.project.file)
    return app.project.file.name
  else
    return "(project not yet saved)"
})

console.log(projectName)
```

Also see the [After Effects Scripting Guide](http://blogs.adobe.com/aftereffects/files/2012/06/After-Effects-CS6-Scripting-Guide.pdf) for information about the After Effects Javascript API.
___

#### _Sync vs Async_

The default shortcut function will run the code synchronously and block NodeJS until complete, however, you can also send code to After Effects asynchronously:

```js
//execute sends code to after effects, returning a Promise

void async function main () {
  try {
    const name = await ae.execute(() => app.project.activeItem.name)
    console.log(name)

  } catch (err) {
    console.log('No Active Item')
  }
}()
```

The default shortcut function actually is just a shortcut to ```ae.executeSync```:

```js
function saveCurrentProject() {
  app.project.save()
}

ae.executeSync(saveCurrentProject)
//is the same as
ae(saveCurrentProject)
```


#### _Persistent Environment_
The scripting environment inside After Effects persists between executions, unless
you manually reset it from the ExtendScript application or by restarting After Effects.

You have access to the After Effects global namespace, through ```global```:
```js
ae(() => global.whoKilledKenny = "you bastards")

const who = ae(() => global.whoKilledKenny)
console.log(who) //you bastards
```

---
# Advanced Usage

## Inputs

In addition to supplying ``ae`` with ``function(){}``s, you can also supply:
```js
// Strings
ae('alert("A string of code.")')

// File Paths
ae('./path/to/file.js')
```

``ae`` will parse the contents use that instead.

## Commands

By default, when you supply a function to ``ae``, it gets transpiled by *babel*
to ensure that modern javascript will work in the aging After Effects scripting
engine.

If you're running a server and are going to be sending the same instructions frequently,
you can use commands. Once created, a command doesn't have to be transpiled again.

```js

import ae, { Command } from 'after-effects'

const renderCommand = new Command(() => app.project.renderQueue.render())

```

Commands, after transpiled, can still receive different arguments.

```js

const renameActiveItem = new Command(name => app.project.activeItem.name = name)

ae(renameActiveItem, 'Larry')
ae(renameActiveItem, 'Steve')

```

___
# Creating Scripts
Rather than executing code, you can create scripts for use in After Effects:

```js

void async function main () {

  await ae.create(() => {

    alert(app.project.activeItem.name)

  }, 'AlertActiveItemName.jsx')

}()
```

This script will be available for After Effects to use in it's scripts folder. The filename provided will be treated as a relative URI, so if you want to create a script in the Scripts/Startup folder:

```js
void async function main () {

  await ae.create(() => {

    alert('After Effects totally just started.')

  }, 'Startup/SayHello.jsx')

}()
```

If you'd like to place scripts somewhere other than the scripts folder, you can pass an absolute path:

```js
 ae.create(() => {
    app.project.activeItem.remove()
 }, path.join(__dirname, 'Created Scripts', 'DeleteActiveItem.jsx'))
```

You can also create a script out of a command, with baked arguments:

```js
const renameActiveItem = new ae.Command( name => app.project.activeItem.name = name)
ae.create(renameActiveItem, 'RenameActiveItemLarry.jsx', 'Larry')
```

If you don't provide a filetype exstension scripts will be created as ```.jsx``` by default. After Effects doesn't care what the filetype extension is, but you might as well leave it as ```.jsx``` by convention.

You can also create scripts *syncronously* with ```ae.createSync()```

___

# Version 1 Changes

Version 1 contains **breaking** changes to the API that embrace a more functional, encapsulated style.

## Option changes

Options are no longer set on ```ae.options``` or along with commands. In order to change
options, you instance a new AfterEffects runner:

```js

import { AfterEffects } from 'after-effects'

// Any command run from this instance will be sent to the After Effects render engine,
// rather than the regular UI mode.

const aer = new AfterEffects({ renderEngine: true })

```

The default export is not just an instance of the AfterEffects runner with
default options:

```js

import ae, { AfterEffects } from 'after-effects'

// ae and aeCopy will behave identically
const aeCopy = new AfterEffects()

// Sending commands to ae2017 will ensure they run in CC 2017
const ae2017 = new AfterEffects({
  program: '/Applications/Adobe After Effects CC 2017'
})

// Sending commands to ae2017 will ensure they run in CS6
const aeCS6 = new AfterEffects({
  program: '/Applications/Adobe After Effects CS6'
})

```

## Includes

Default includes have been removed.

You can still add includes that will be compiled into commands, but this is only
recommended if you are intending to create scripts that will be distributed to others.
If you are only scripting for your own environment, it's recommended you put the
includes in your After Effects scripts Startup folder either manually or by:
```js
  // es5 shim will load any time after effects starts.
  ae.createSync('./node_modules/extendscript-es5-shim/index.js', 'Startup/es5-shim.jsx')
```

### ```extendscript-es5-shim```
Speaking of which, the shim that was in the previous version has been abandoned,
favouring a community package in order to take advantage of the ```extendscript-es5-shim```,
you can now install it as a peer dependency:
```
npm install extendscript-es5-shim
```

And then set it as an include:
```js
  import { AfterEffects } from 'after-effects'

  const ae = new AfterEffects({
    includes: [
      './node_modules/extendscript-es5-shim/index.js', // files can be included
      '$.global.FAVOURITE_COLOR = "blue"',             // or strings of code
      function foo () { alert('bar')}                  // or functions
    ]
  })
```

Or copy it as detailed above.

### ```get```
Query selector has been removed, in favour of a superior solution. Once completed,
it will be given its own repo and includable as mentioned.

---

# Not yet Documented:
- options:
  - handleErrors
  - writeResults
  - renderEngine
  - programDir
  - logger
  - shortcut
  - includes
- function expressions vs regular code
- .jsx
- checkRenderEngine helpers
