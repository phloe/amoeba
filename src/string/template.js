var each = require("../each");

module.exports = function (template, object, delimiters) {
	var string = template + "";

	delimiters = delimiters || ["{", "}"];

	each(object, function (value, key) {
		string = string.replace(delimiters[0] + key + delimiters[1], value);
	});

	return string;
};