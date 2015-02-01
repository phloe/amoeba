var matches = require("./matches");

module.exports = function (element, eventType, callback) {
	var useCapture = false;
	if (eventType.indexOf(" ") > -1) {
		var _callback = callback;
		var split = eventType.split(" ");
		var selector = split[1];

		eventType = split[0];

		useCapture = true;

		callback = function (event) {
			var target = event.target;
			if (matches(target, selector)) {
				_callback.apply(target, [event, target]);
				event.stopPropagation();
			}
		};
	}
	element.addEventListener(eventType, callback, useCapture);
};