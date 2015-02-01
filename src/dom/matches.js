var html = document.documentElement;
var matches = html.matches || html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector || html.oMatchesSelector;

module.exports = function (element, selector) {
	return matches.call(element, selector);
};