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
## Basic Usage

    var ae = require("after-effects");
_Ta Daaaa_. The rest of this readme assumes ae is the after effects module.

To execute some code in After Effects:

    ae(() => alert("Hello!\nFrom node.js"));

_What fun!_

Provided that After Effects is installed in your Applications/Program directory, and that you haven't renamed any of the folders or something, this will work.
___
## Scripting Considerations
The After Effects scripting environment is a completely different engine than node.js. Node.js has no access to the After Effects environment, and vice versa:

    var foo = "bar";

    //this will not work:
    ae(() => alert(foo));

If you'd like to send data from node.js to After Effects, you have to supply it as an argument along with the execute command:

    var foo = "bar";

    ae((foo_from_node) => alert(foo_from_node), foo);

What you're really doing when you use the execute method is converting the supplied function to a string and then sending it to After Effects to parse. As a result, whatever data you supply has to be convertible to JSON.

You can also retrieve data from After Effects with the same restriction:

    var project_name = ae(() => {
        if (app.project.file)
            return app.project.file.name;
        else
            return "(project not yet saved)";
    });

    console.log(project_name);

Also see the [After Effects Scripting Guide](http://blogs.adobe.com/aftereffects/files/2012/06/After-Effects-CS6-Scripting-Guide.pdf) for information about the After Effects Javascript API.
___
## Sync vs Async

The default shortcut function will run the code synchronously and block NodeJS until complete, however, you can also send code to After Effects asynchronously:

    //execute sends code to after effects, returning a Promise
    ae.execute(() => {
      return app.project.activeItem.name;
    })
    .then(name => console.log(name))
    .catch(err => console.log('No Active Item'));

The default shortcut function actually is just a shortcut to ae.executeSync:

    function save_current_project() {
      app.project.save();
    }

    ae.executeSync(save_current_project);
    //is the same as
    ae(save_current_project);

___
## Options
The ae object has a couple of options:

	ae.options.errorHandling = true;
	ae.options.minify = false;
    ae.options.program = null;
	ae.options.includes = [
		'./node_modules/after-effects/lib/includes/console.jsx',
		'./node_modules/after-effects/lib/includes/es5-shim.jsx',
		'./node_modules/after-effects/lib/includes/get.jsx'
	]

This would be how you set defaults.

### errorHandling
With errorHandling enabled, errors thrown in After Effects will be suppressed and returned in the promise result:

    ae.options.errorHandling = true;

    ae.execute(() => throw new Error("FooBar got FooBarred all the way to FooBar."))
    .then(result => console.log(result)) // empty
    .catch(err => console.log(err)); // contains error

With errorHandling disabled, After Effects will create a popup and prevent further code execution until it is dealt with.

### minify
If true, the code will be minified before being sent to After Effects. This is disabled by default, which is different from previous versions of this package. I feel there's little point in spending the extra time to minify code that isn't going over a network. Still, you can set minify to true if you're into that sort of thing.

    ae.options.minify = true;

### program
By default, ae will look for an After Effects installation in your platforms default application directory. If you've installed it elsewhere, you'll have to set this to the custom app directory.

    ae.options.program = path.join('OtherAppDirectory','Adobe After Effects 2015');

Also handy if you've installed multiple versions of After Effects on your machine, and you'd like to target a specific one.

### includes
Includes is an array which will concatanate the code from other files into your command, for use inside After Effects.
The defaults are as follows:

##### _console.js_

Provides console.log to the After Effects namespace. 'console.log' inside After Effects will return logs to the node.js console when execution is complete, assuming you correctly have *Preferences -> General -> Allow Scripts to Write Files and Access Network* set inside After Effects.

##### _es5-shim.js_

The javascript environment within After Effects is very dated, pre ES5. With es5-shim included, methods and functions available in es5 will be available.

    ae.execute(() => {
        [1,2,3,4].forEach(i => alert(i)); // wont throw an error
    });

Also notice that you can use ES6 syntax when executing code. It's parsed through [babel](https://www.npmjs.com/package/babel) before being sent to After Effects.

##### _get.js_
Provides a jQuery inspired selector object to work with items in After Effects inside of an object called 'get':

    ae.execute(() => {
        //finds every composition with 'final' in the name
        //and alerts it
        get.comps(/Final/)
           .each(comp => alert(comp.name));
    });

See the API for the get object below.

### Include Considerations
The default options exist in their current state to benefit quickstarting. I just want to fire up atom and run an ae command without thinking too much about it. That said, there are a couple of things you can do to optimize it's usage.

#### _Persistent Environment_
The scripting environment inside After Effects persists between executions, unless
you manually reset it or restart After Effects.

    ae(()=> console.log('includes ran'));
    ae.options.includes = [];

    //Once you've run your includes,
    //you can disable them and still benefit from their usage in the namespace:
    ae(()=> ["shim","still","exists"].forEach(str => alert(str)));

You have access to the After Effects global namespace, through $.global:

    ae(() => $.global.whoKilledKenny = "you bastards");

    var who = ae(() => $.global.whoKilledKenny);
    console.log(who); //you bastards

#### _Scripts directory_

There is a convenience method to get the scripts directory associated with the current After Effects install:

    console.log(ae.scriptsDir);

This will throw an error if After Effects can't be found. This is useful if you want to include any scripts in the Scripts Directory that might exist.

#### _Startup Folder_
Alternatively, You can copy the scripts provided in the lib folder to the After Scripts/Startup folder inside your After Effects installation. Then will be run and added to the global namespace when After Effects is starting, and will not have to be included while executing commands from ae.

#### _.jsx vs .js_
If you just installed After Effects, you'll notice that all of the files in the Scripts Directory end in .jsx
If you're familiar with React, you're probably wondering what the hell they're doing there. Well, long before Facebooks React, Adobe's primary javascript format was .jsx. This is because the Adobe javascript Engine has an xml literal built into it:

    var xml = <foo><bar/></foo>

We can't take advantage of that xml literal inside nodejs because babel doesn't have a preset for it. As a result, if you try to include a .jsx file, ae will assume it's written in Adobe Javascript. ae will not babelify or minify it, otherwise it will could cause errors if the XML literal was used.

___
## Advanced Usage

If you're going to execute a particular method frequently, you can precompile it as a command, which will prevent it from having to be babelified or minified again:

    var create_composition = new ae.Command(name => {
      name = typeof name === "string" ? name : "New Comp";
      app.project.items.addComp(name, 1920, 1080, 1, 24, 10);
    });

Commands, once made, can be executed with different arguments:

    ae(create_composition, "First Comp");
    //or
    ae.execute(create_composition, "Super Comp");
    //or
    create_composition.executeSync("Oh we got ourselves a badass here");
    //you get the idea
    create_composition.execute("Breast Milk");

Commands have their own set of options. By default, they are the same as the options set on ae.options:

    ae.options.minify = true;
    var getNumItems = new ae.Command(() => app.project.numItems); //will minify

Command options cannot be changed:

    ae.options.errorHandling = false;
    var breakForFun = new ae.Command(() => throw("This is MY house."));

    ae.options.errorHandling = true;
    breakForFun.executeSync(); // will still alert inside in AE
    breakForFun.errorHandling = true; //throws error

You can create commands with their own options:

    var getProjectName = new ae.Command(()=> app.project.file.name, { includes: null, minify: true });
___
## Creating Scripts
Rather than executing code, you can create scripts for use in After Effects:

     ae.create(() => {

        let say_name =  item => alert(item.name);
        say_name(app.project.activeItem);

     }, "SayName.jsx");

This script will be available for After Effects to use in it's scripts folder. The filename provided will be treated as a relative URI, so if you want to create a script in the Scripts/Startup folder:

     ae.create(() => {

       alert("After Effects totally just started.");

     }, "Startup/SayHello.jsx");

If you'd like to place scripts somewhere other than the scripts folder, you can pass an absolute path:

     ae.create(() => {
        app.project.activeItem.remove();
     }, path.join(__dirname, "Created Scripts", "DeleteActiveItem.jsx"));

You can also create a script out of a command, with baked arguments:

    var renameActiveItem = new ae.Command( name => app.project.activeItem.name = name);
    ae.create(renameActiveItem, "RenameActiveItemLarry.jsx", "Larry");

If you don't provide a filetype exention scripts will be created as .jsx by default. After Effects doesn't care what the filetype extension is, but you might as well leave it as .jsx by convention.

You can also create scripts syncronously with ae.createSync();

___
## 'get' API

The **get** method (if enabled) is a jQuery inspired selector object to work with items in After Effects.

It parses arguments of various types into three kinds of information in order to make selections.

### Argument Types

#### Type
Quite simply, type arguments narrow down what types of objects can be selected. Constructors for Compositions, Folder, Layers or Properties can be passed in as types.

#### Context
Context arguments provide the scope of objects to select from. ItemCollections, LayerCollections, QueryResults or Arrays of instances of each can be passed in as contexts.

#### Selector
Selector arguments fine tune what the results of a selection. Strings, Regular Expressions, Numbers or Functions can be passed as selectors.

### Making Selections

These arguments can be passed in any order, and you can supply any number of them. Or none at all:

    //selects every single item, layer and
    //and property in the current project.
    var everything = get();

To select every object of a specific type, throw in a type argument.

    //CompItem is the constructor for composition objects.
    var allComps = get(CompItem);

Adding a selector argument allows you to fine tune the selection even further:

    //String selectors match item names
    var mainComp = get(CompItem, "Main");

    //Regular expressions also work on names
    var allCopies = get(FootageItem, /Copy$/);

    //Number selectors match item labels
    var pinkLayers = get(AVLayer, 4);

Adding a context argument allows you to narrow the scope of your selection:

    var solidsFolderContents = get(FootageItem, "Solids").children();
    var redLabelledItems = get(1, solidsFolderContents);

Collections can also be used as contexts:

    var activeComp = app.project.activeItem;
    var activeCompLayers = get(AVLayer, activeComp.layers);

As you've seen, not providing a type will result in EVERY type of object being selected. If you only want a couple of types, you can provide mulitple type arguments:

    var allVectorLayers = get(TextLayer, ShapeLayer);
    var allItems = get(CompItem, FolderItem, FootageItem);

Providing multiple types can get wordy. You can provide arrays of pre-arranged type definitions:

    var allLayerTypes = [CameraLayer, LightLayer, TextLayer, AVLayer, ShapeLayer];
    var allLayers = get(allLayerTypes);
    var allRedLayers = get(1, allLayers);

Or you can use shortcuts on the get object;

    var allRedLayers = get.layers(1);
    var itemsNamedFinal = get.items("Final");
    var compsNamedMain = get.comps("Main");

The query results have chain-able commands, as well:

    var redFoldersNamedAssets = get("Assets").folders().filter(1);

The children() method returns all objects contained within a selection.

    var textLayersInCompsNamedMain = get.comps("Main").children(TextLayer);

Functions can also be used as selectors:

    var guideLayers = get.layers(lay => lay.guideLayer);
    var longRedComps = get.comps(c => c.duration > 60 && c.label == 1);

    //all layers in compositions in folders with more than five items
    //that have inpoints close to the beginning of the timeline.
    var sel = get.folders(fold => fold.numItems > 5)
                        .children(CompItem)
                        .children(lay => lay.inPoint < 0.5);
### Working with Selections

Selections can be unboxed, to get an array of the elements inside:

    var gotComps = get.comps("Main");
    var comps = gotComps.selection(); //all elements
    var comp = gotComps.selection(0);//first element in selection

There are also methods on a queryResult that can be used on the selections:

    //.each iterates through every item in the selection
    get.comps("Main").each(c => c.comment = "Approved");

    //.set sets each item in a selection to the given value, if possible
    get.layers(1).set("locked", true);

    //.set can also take a function that returns a value
    get(CompItem, AVLayer)
        .set("width", i => i.width * 2)
        .set("height", i => i.height * 2);

    //.call looks for a matching method name, and calls it with any provided arguments
    get.comps().call("setProxyToNone");

___

# Version 0.4.0

Windows support has been added, but hasn't been tested rigorously. Input about broken/undocumented functionality is highly welcome, especially from windows users.
