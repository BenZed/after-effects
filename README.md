#after-effects 

##Why?
* You're running a node.js server with After Effects installed, and you'd like to run render commands server-side.

* You use node.js locally, and prefer not to run AE scripts with the ExtendScript toolkit.

* You'd like to run and create AE scripts using ES6 syntax.

* Because it angers your religious mother, and you want to be rebellious.

## Requirements
Obviously, you need After Effects installed on your machine. As of this writing (Feburary 25, 2016), this module only works in an OSX environment.

Additionally, in order for results from After Effects to be readable, enable:

*Preferences -> General -> Allow Scripts to Write Files and Access Network*


## Basic Usage

    var ae = require("after-effects");
_Ta Daaaa_. The rest of this readme assumes ae is the after effects module. 

To execute some code in After Effects:
    
    ae.execute(() => alert("Hello!\nFrom node.js"));

_What fun!_

Provided that After Effects is installed in your Applications directory, and that you haven't renamed any of the folders or something, this will work. 

## Scripting Considerations
The After Effects scripting environment is a completely different engine than node.js. Node.js has no access to the After Effects environment, and vice versa:
    
    var foo = "bar";
    
    //this will not work:
    ae.execute(() => alert(foo));

If you'd like to send data from node.js to After Effects, you have to supply it as an argument along with the execute command:

    var foo = "bar";
    
    ae.execute((foo_from_node) => alert(foo_from_node), foo)

What you're really doing when you use the execute method is converting the supplied function to a string and then sending it to After Effects to parse. As a result, whatever data you supply has to be convertible to JSON.

You can also retrieve data from After Effects with the same restriction:

    //returns a promise:
    ae.execute(() => {
        if (app.project.file)
            return app.project.file.name;
        else
            return "(project not yet saved)";
    })
    .then(project_name => console.log(project_name));

Also see the [After Effects Scripting Guide] (http://blogs.adobe.com/aftereffects/files/2012/06/After-Effects-CS6-Scripting-Guide.pdf) for information about the After Effects Javascript API.

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

## Options
How to set options: 

    ae.options({
        errorHandling: true,
        es5Shim: true,
        aeQuery: true,
        minify: true,
        checkDir: "/Applications",
        appName: null,
    });
These are also the defaults.

###errorHandling
With errorHandling enabled, errors thrown in After Effects will be suppressed and returned in the promise result:
    
    ae.options({
        errorHandling: true,
    });

    ae.execute(() => {
        throw new Error("FooBar got FooBarred all the way to FooBar.")
    })
    .then(
        result => console.log(result), // empty
        err => console.log(err) // contains error
    );

With errorHandling disabled, After Effects create a popup and prevent further code execution until it is dealt with.

###es5Shim
The javascript environment within After Effects is very dated, pre ES5. With es5Shim enabled, methods and functions available in es5 will be available:

    ae.options({
        es5Shim: true,
    });

    ae.execute(() => {
        [1,2,3,4].forEach(i => alert(i)); // wont throw an error
    });

Also notice that you can use ES6 syntax (as per your node version) when executing code. It's parsed through [babel](https://www.npmjs.com/package/babel) before being sent to After Effects.

The es5Shim also provides console.log to the After Effects namespace, which is an alias of $.writeln (which is the default).

Note that console.log inside After Effects will log things to the ExtendScript console, and will not be visible to node.

###aeQuery
Provides a jQuery inspired selector object to work with items in After Effects inside of an object called 'get':

    ae.options({
        aeQuery: true,
    });

    ae.execute(() => {
        //finds every composition with 'final' in the name
        //and alerts it
        get.comps(/Final/)
           .each(comp => alert(comp.name));
    });

See the API for the get object below.

###minify
If true, the code will be minified before being sent to After Effects. Handy to disable for testing.
    
    ae.options({
        minify: false //disable for testing, so the debug in ExtendScript is easier to read.
    });

###checkDir
The directory to look for an After Effects installation.
    
    ae.options({
        checkDir: "/SomeWhere/Else",
    });


###appName
If set to 'null' the module looks for any folder w. So if you have CS6 and CC 2015 installed, it'll target CS6, which is a previous version.

If you'd like to target a specific version:
    
    ae.options({
        appName: "Adobe After Effects 2015",
    });
    ae.execute(() => alert("AHA!\nExecuted in CC 2015"));

## 'get' API

The **get** method (if enabled) is a jQuery inspired selector object to work with items in After Effects.

It parses arguments of various types into three kinds of information in order to make selections.

###Argument Types

####Type
Quite simply, type arguments narrow down what types of objects can be selected. Constructors for Compositions, Folder, Layers or Properties can be passed in as types.

####Context
Context arguments provide the scope of objects to select from. ItemCollections, LayerCollections, QueryResults or Arrays of instances of each can be passed in as contexts.

####Selector
Selector arguments fine tune what the results of a selection. Strings, Regular Expressions, Numbers or Functions can be passed as selectors.

###Making Selections

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

    var solidsFolderContents = get(FootageItem, "Solids");
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
###Working with Selections

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