module.exports = function (url, callback) {
	var script = document.createElement("script");
	var head = document.head || document.getElementsByTagName("head")[0];
	head.appendChild(script);

	if (callback) {
		script.onload = callback;
	}

	script.src = url;

	return script;
};