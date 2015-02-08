var slice = [].slice;

module.exports = function (selector, parent) {
	return slice.call((parent || document).querySelectorAll(selector));
};