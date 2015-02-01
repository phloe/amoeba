var toArray = require("../toArray");

module.exports = function (selector, parent) {
	return toArray((parent || document).querySelectorAll(selector));
};