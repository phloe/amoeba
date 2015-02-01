module.exports = function (selector, parent) {
	if (typeof selector !== "string") {
		return selector;
	}

	return (parent || document).querySelector(selector);
};