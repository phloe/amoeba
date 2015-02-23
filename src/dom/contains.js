/*

	Credits: http://www.quirksmode.org/blog/archives/2006/01/contains_for_mo.html

*/

var func = function (child) {
	return element.contains(child);
};

if (window.Node && Node.prototype && Node.prototype.compareDocumentPosition) {
	func = function (child) {
		return !!(element.compareDocumentPosition(child) & 16);
	};
}

module.exports = func;
