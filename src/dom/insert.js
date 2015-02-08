module.exports = function (parent, element, context) {
	var relation, children;

	if (typeof element === "string") {
		element = document.createTextNode(element);
	}

	if (context === undefined) {
		context = "bottom";
	}

	switch (context) {

		case "before":
			relation = parent;
			parent = parent.parentNode;
			break;

		case "after":
			relation = parent.nextElementSibling;
			parent = (!relation) ? parent : parent.parentNode;
			break;

		case "bottom":
			break;

		/*
			gets caught by default.
		
		case "top":
			context = 0;
		*/
		
		default:
			if (typeof context !== "number") {
				context = 0;
			}
			children = parent.children;
			if (context < 0) {
				context += children.length;
			}
			if (children.length > context) {
				relation = children[context + 1];
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