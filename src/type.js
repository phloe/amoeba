/*
	
	Credits: Kangax for the clever toString bit.
	
*/

var toString = ({}).toString;

module.exports = function (subject) {
	var type;

	switch (subject) {

		case null:
			type = "object";
			break;

		case undefined:
			type = undefined + "";
			break;

		default:
			type = toString.call(subject).slice(8, -1).toLowerCase();
			if (type.indexOf("element") > -1) {
				type = "element";
			}
			break;

	}

	return type;
};