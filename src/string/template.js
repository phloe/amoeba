module.exports = function (template, object, delimiters) {
	var string = template + "";
	var key;
	
	delimiters = delimiters || ["{", "}"];

	for (key in object) {
		string = string.replace(delimiters[0] + key + delimiters[1], object[key]);
	}

	return string;
};