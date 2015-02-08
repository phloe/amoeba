module.exports = function parseQuery (subject) {
	var object = {};
	var pairs = subject.replace(/(^[^?]*\?)|(#[^#]*$)/g, "").split("&");
	var length = pairs.length;
	var index = 0;
	var pair;
	
	while (index < length) {
		pair = pairs[index].split("=");
		object[decodeURIComponent(pair[0])] = (pair[1]) ? decodeURIComponent(pair[1]) : null;
		index++;
	}

	return object;
};