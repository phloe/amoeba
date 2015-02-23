// _amoeba.js - micro api for bookmarklets.

var Wrapper = require("./src/wrapper.js");
var util = require("./src/util.js");

var get = require("./src/dom/get");
var getAll = require("./src/dom/getAll");

module.exports = function (callback) {
	callback(function (selector) {
		var element = get(selector);
		return element ? new Wrapper(element) : null;
	}, getAll, util);
};
