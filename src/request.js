var each = require("./each");
var toQuery = require("./toQuery");

module.exports = function (url, callback, data, mode, async, headers) {
	var xhr = new XMLHttpRequest();

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

	each(headers, function (header, key) {
		xhr.setRequestHeader(key, header);
	});

	if (callback) {
		xhr.onload = function () {
			callback(xhr.responseText, xhr.responseXML);
		};
	}

	xhr.send(data);

	return xhr;
};