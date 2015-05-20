var html = document.documentElement;
var matches = html.matches || html.matchesSelector || html.mozMatchesSelector ||
	html.webkitMatchesSelector || html.msMatchesSelector || html.oMatchesSelector ||
	function (selector) {
		var elements = this.parentNode.querySelectorAll(selector);
		var length = elements.length;
		var i = 0;
		while (i < length) {
			if (elements[i++] === this) {
				return true;
			}
		}
		return false;
	};

module.exports = function (element, selector) {
	return matches.call(element, selector);
};
