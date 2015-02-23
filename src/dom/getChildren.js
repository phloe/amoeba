var matches = require("./matches");

module.exports = function (element, selector) {
	var nodelist = element.children;
	var index = nodelist.length;
	var elements = [];
	while (index--) {
		elements[index] = nodelist[index];
	}
	
	if (selector) {
		return elements.filter(function (element) {
			return matches(element, selector);
		});
	}
	
	return elements;
};