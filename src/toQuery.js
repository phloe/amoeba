module.exports = function (subject) {
	var string = "";
	var key;

	for (key in subject) {
		string += (string ? "&" : "") + encodeURIComponent(key) + "=" + encodeURIComponent(subject[key]);
	}

	return string;
};