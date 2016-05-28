const	ae = require("../index");

var numItems = ae(() => {
	return get.items().count();
});

console.log(`${numItems} items in After Effects.`);
