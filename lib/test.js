const	ae = require("../after-effects");

ae.execute(() => {
	console.log("Hello from After Effects");
	return get().count();
})
.then(num => console.log(`There are ${num} items, layers and properties in the current After Effects project.`))
.catch(err => console.log("After Effects Error: " + err.message));
