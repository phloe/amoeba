var toQuery = require("./toQuery");

module.exports = function (url, callback, data, mode, async, headers) {
	var xhr = new XMLHttpRequest();
	var key;
	
	headers = headers || {};
	mode = mode || "get";
	async = (async === undefined) ? true : async;

	if (data) {
		data = toQuery(data);
		if (mode.toLowerCase() === "get") {
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