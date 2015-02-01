var each = require("./each");

module.exports = function (subject) {
	var vars = [];

	each(subject, function (value, key) {
		vars.push(
			encodeURIComponent(key) + "=" + encodeURIComponent(value)
		);
	});

	return vars.join("&");
};