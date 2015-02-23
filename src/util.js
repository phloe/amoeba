var type = require("./type");
var request = require("./request");
var extend = require("./extend");
var toQuery = require("./toQuery");

var parseQuery = require("./string/parseQuery");
var template = require("./string/template");

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

	request: request,

	type: type,

	extend: extend,

	toQuery: toQuery,

	parseQuery: parseQuery,

	template: template

};