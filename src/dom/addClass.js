module.exports = function (element, className) {
	var classList = element.className.split(/\s+/);
	var index = classList.indexOf(className);

	if (index < 0) {
		classList.push(className);
		element.className = classList.join(" ");
	}
};