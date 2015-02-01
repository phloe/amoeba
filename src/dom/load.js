var create = require("./create");

module.exports = function (url, callback) {
	var script = create("script", document.body);

	if (callback) {
		script.onload = callback;
	}

	script.src = url;

	return script;
};