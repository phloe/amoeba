module.exports = function (element, eventType, callback) {
	element.removeEventListener(eventType, callback, false);
};