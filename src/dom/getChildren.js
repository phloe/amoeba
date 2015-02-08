var matches = require("./matches");
var slice = [].slice;

module.exports = function (element, selector) {
	var children = slice.call(element.children);
	
	if (selector) {
		return children.filter(function (element) {
			return matches(element, selector);
		});
	}
	
	return children;
};