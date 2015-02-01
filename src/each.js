var type = require("./type");

module.exports = function (subject, callback, bind) {
	var key;
	var index = 0;
	var length;
	var _type = type(subject);

	if (_type === "number") {
		while (index < subject) {
			callback.call(bind || subject, index++);
		}
	}
	else if (_type === "object") {
		for (key in subject) {
			if (subject.hasOwnProperty(key)) {
				callback.call(bind || subject, subject[ key ], key, index++);
			}
		}
	}
	else {
		if (_type === "string") {
			subject = subject.split("");
		}
		if (_type === "array" || _type === "nodelist" || _type === "htmlcollection") {
			length = subject.length;
			while (index < length) {
				callback.call(bind || subject, subject[index], index++);
			}
		}
	}

	return subject;
};