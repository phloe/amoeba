var each = require("../each");

module.exports = function parseQuery (subject) {
	var object = {};

	each(subject.replace(/(^[^?]*\?)|(#[^#]*$)/g, "").split("&"), function (pair) {
		pair = pair.split("=");
		object[decodeURIComponent(pair[0])] = (pair[1]) ? decodeURIComponent(pair[1]) : null;
	});

	return object;
};