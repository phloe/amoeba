var matches = require("./matches");

module.exports = function (element, eventType, callback) {
	var useCapture = false;
	var spaceIndex = eventType.indexOf(" ");
	if (spaceIndex > -1) {
		var _callback = callback;
		var selector = eventType.slice(spaceIndex + 1);

		eventType = eventType.slice(0, spaceIndex);

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