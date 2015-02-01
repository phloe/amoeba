var matches = require("./matches");
var toArray = require("../toArray");

module.exports = function (element, selector) {
	var children = toArray(element.children);
	
	if (selector) {
		return children.filter(function (element) {
			return matches(element, selector);
		});
	}
	
	return children;
};