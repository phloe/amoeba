var type = require("../type");
var extend = require("../extend");
var insert = require("./insert");

module.exports = function (tag, options, parent, context) {
	var element = document.createElement(tag);

	if (type(options) === "element") {
		context = parent || null;
		parent = options;
		options = null;
	}

	if (options) {
		extend(element, options);
	}

	if (parent) {
		insert(parent, element, context);
	}

	return element;
};