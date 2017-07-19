# after-effects
___

## Why?
* You're running a node.js server with After Effects installed, and you'd like to run render commands server-side.

* You use node.js locally, and prefer not to run AE scripts with the ExtendScript toolkit.

* You'd like to run and create AE scripts using ES6 syntax.

* Because it angers your religious mother, and you want to be rebellious.

## Requirements
Obviously, you need After Effects installed on your machine.
Additionally, in your After Effects preferences, enable:

*Preferences -> General -> Allow Scripts to Write Files and Access Network*

___

# Migration to Version 1

Version 1 contains **breaking** changes to the API that embrace a more functional, encapsulated style.

## Option changes

Options are no longer set on ae.options or along with commands. In order to change
options, you instance a new AfterEffects runner:

```js

import { AfterEffects } from 'after-effects'

// Any command run from this instance will be sent to the After Effects render engine,
// rather than the regular UI mode.

const ae = new AfterEffects({ renderEngine: true })

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

### ```es5-shim```
es5-shim has been split into it's own module. As of ```after-effects @1.0.0-alpha.1```
it is not included.

### ```get```
Query selector has been removed. Eventually it will be given it's own repo
and you'll be able to include it.

For now if you need the get functionality, use the older after-effects package,
or add the script to your After Effects StartUp folder manually.

___
## Basic Usage

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

## Scripting Considerations
The After Effects scripting environment is a completely different engine than node.js. Node.js has no access to the After Effects environment, and vice versa:

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

## Sync vs Async

The default shortcut function will run the code synchronously and block NodeJS until complete, however, you can also send code to After Effects asynchronously:

```js
//execute sends code to after effects, returning a Promise
ae.execute(() => {
  return app.project.activeItem.name
})
.then(name => console.log(name))
.catch(err => console.log('No Active Item'))
```

The default shortcut function actually is just a shortcut to ```ae.executeSync```:

```js
function save_current_project() {
  app.project.save()
}

ae.executeSync(save_current_project)
//is the same as
ae(save_current_project)
```
___

#### _Persistent Environment_
The scripting environment inside After Effects persists between executions, unless
you manually reset it or restart After Effects.

You have access to the After Effects global namespace, through ```global```:
```js
ae(() => global.whoKilledKenny = "you bastards")

var who = ae(() => global.whoKilledKenny)
console.log(who) //you bastards
```
#### _Scripts directory_

There is a convenience method to get the scripts directory associated with the current After Effects install:
```js
console.log(ae.scriptsDir)
```

This will throw an error if After Effects can't be found. This is useful if you want to include any scripts in the Scripts Directory that might exist.

#### _Startup Folder_
Alternatively, You can copy the scripts provided in the lib folder to the After Scripts/Startup folder inside your After Effects installation. Then will be run and added to the global namespace when After Effects is starting, and will not have to be included while executing commands from ae.

___
## Advanced Usage

```js
// Rewrite the details about commands
```
___
## Creating Scripts
Rather than executing code, you can create scripts for use in After Effects:

```js
ae.create(() => {

  alert(app.project.activeItem.name)

}, 'AlertActiveItemName.jsx')
```

This script will be available for After Effects to use in it's scripts folder. The filename provided will be treated as a relative URI, so if you want to create a script in the Scripts/Startup folder:

```js
ae.create(() => {

  alert('After Effects totally just started.')

}, 'Startup/SayHello.jsx')
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

If you don't provide a filetype exstension scripts will be created as .jsx by default. After Effects doesn't care what the filetype extension is, but you might as well leave it as .jsx by convention.

You can also create scripts syncronously with ae.createSync()

___
