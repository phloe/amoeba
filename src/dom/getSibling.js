var matches = require("./matches");

module.exports = function (element, selector, context) {
	element = element[context];

	while (element) {
		if (!selector || matches(element, selector)) {
			return element;
		}
		element = element[context];
	}

	return null;
};