module.exports = function (element, className) {
	var classList = element.className.split(/\s+/);
	var index = classList.indexOf(className);

	if (index > -1) {
		classList.splice(index, 1);
		element.className = classList.join(" ");
	}
};