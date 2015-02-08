var toQuery = require("./toQuery");

module.exports = function (url, callback, options) {
	options = options || {};
	
	var xhr = new XMLHttpRequest();
	var data = options.data || null;
	var method = options.method || "get";
	var async = ("async" in options) ? options.async : true;
	var headers = options.headers || {};
	var key;

	if (data) {
		data = toQuery(data);
		if (method.toLowerCase() === "get") {
			url += "?" + data;
			data = null;
		}
		else if (!("Content-type" in headers)) {
			headers["Content-type"] = "application/x-www-form-urlencoded";
		}
	}

	xhr.open(mode, url, async);

	for (key in headers) {
		xhr.setRequestHeader(key, headers[key]);
	}

	if (callback) {
		xhr.onload = function () {
			callback(xhr.responseText, xhr.responseXML);
		};
	}

	xhr.send(data);

	return xhr;
};