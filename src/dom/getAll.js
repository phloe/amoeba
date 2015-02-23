module.exports = function (selector, parent) {
	var nodelist = (parent || document).querySelectorAll(selector);
	var index = nodelist.length;
	var elements = [];
	while (index--) {
		elements[index] = nodelist[index];
	}
	return elements;
};