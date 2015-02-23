var type = require("./type");

var insert = require("./dom/insert");
var remove = require("./dom/remove");
var addClass = require("./dom/addClass");
var removeClass = require("./dom/removeClass");
var contains = require("./dom/contains");
var on = require("./dom/on");
var off = require("./dom/off");
var get = require("./dom/get");
var getAll = require("./dom/getAll");
var getChildren = require("./dom/getChildren");
var getSiblings = require("./dom/getSiblings");
var getNext = require("./dom/getNext");
var getPrevious = require("./dom/getPrevious");
var matches = require("./dom/matches");

function Wrapper (element) {
	this.el = element || null;
}

Wrapper.prototype = {

	insert: function (contents, context) {

		if (type(contents) !== "array") {
			contents = [contents];
		}

		var content;
		var length = contents.length;
		var index = 0;

		while (index < length) {
			content = contents[index++];
			insert(this.el, content.el || content, context);
		}

		return this;
	},

	remove: function () {
		remove(this.el);
		return this;
	},

	get: function (selector) {
		var element = get(selector, this.el);
		return element ? new Wrapper(element) : null;
	},

	next: function (selector) {
		var element = getNext(this.el, selector);
		return element ? new Wrapper(element) : null;
	},

	prev: function (selector) {
		var element = getPrevious(this.el, selector);
		return element ? new Wrapper(element) : null;
	},

	getAll: function (selector) {
		return getAll(selector, this.el);
	},

	children: function (selector) {
		return getChildren(this.el, selector);
	},

	siblings: function (selector) {
		return getSiblings(this.el, selector);
	},

	contains: function (child) {
		return contains(this.el, child.el || child);
	},

	matches: function (selector) {
		return matches(this.el, selector);
	},

	addClass: function (className) {
		addClass(this.el, className);

		return this;
	},

	removeClass: function (className) {
		removeClass(this.el, className);

		return this;
	},

	on: function (eventType, callback) {
		on(this.el, eventType, callback);

		return this;
	},

	off: function (eventType, callback) {
		off(this.el, eventType, callback);

		return this;
	}

};

module.exports = Wrapper;