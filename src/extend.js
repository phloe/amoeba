var type = require("./type");

module.exports = function extend (subject, properties) {
	var property, value, _type;
	
	for (property in properties) {
		if (properties.hasOwnProperty(property)) {
			value = properties[property]
			_type = type(value);
			if (_type === "array" || _type === "object") {
				if (!(key in subject)) {
					subject[key] = (_type === "array") ? [] : {};
				}
				extend(subject[key], value);
			}
			else {
				subject[key] = value;
			}
		}
	}

	return subject;
};