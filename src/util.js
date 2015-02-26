var create = require("./dom/create");
var load = require("./dom/load");

var Wrapper = require("./wrapper.js");

module.exports = {

	create: function () {
		return new Wrapper(create.apply(null, arguments));
	},

	load: function () {
		return new Wrapper(load.apply(null, arguments));
	},

	request: require("./request"),

	type: require("./type"),

	extend: require("./extend"),

	toQuery: require("./toQuery"),

	fromQuery: require("./string/fromQuery"),

	template: require("./string/template")

};