var getChildren = require("./getChildren");

module.exports = function (element, selector) {
	var elements = getChildren(element.parentNode, selector);
	var index = elements.indexOf(element);

	elements.splice(index, 1);

	return elements;
};