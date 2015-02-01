var type = require("./type");
var each = require("./each");

module.exports = function (subject, properties) {
	each(properties, function (value, key) {
		var _type = type(value);
		if (_type === "array" || _type === "object") {
			if (!(key in subject)) {
				subject[key] = (_type === "array") ? [] : {};
			}
			extend(subject[key], value);
		}
		else {
			subject[key] = value;
		}
	});

	return subject;
};