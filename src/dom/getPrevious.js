var getSibling = require("./getSibling");

module.exports = function (element, selector) {
	return getSibling(element, selector, "previousElementSibling");
};