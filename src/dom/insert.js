var type = require("../type");
var getNext = require("./getNext");
var getChildren = require("./getChildren");

module.exports = function (parent, element, context) {

	if (type(element) === "string") {
		element = document.createTextNode(element);
	}

	if (context === undefined) {
		context = "bottom";
	}

	var relation, children;

	switch (context) {

		case "before":
			relation = parent;
			parent = parent.parentNode;
			break;

		case "after":
			relation = getNext(parent);
			parent = (!relation) ? parent : parent.parentNode;
			break;

		case "bottom":
			break;

		case "top":
			context = 0;

		default:
			if (type(context) === "number") {
				children = getChildren(parent);
				if (context < 0) {
					context += children.length;
				}
				if (children.length > context) {
					relation = children[context + 1];
				}
			}
			break;

	}
	if (relation) {
		parent.insertBefore(element, relation);
	}
	else {
		parent.appendChild(element);
	}
};