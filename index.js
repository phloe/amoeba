// _amoeba.js - micro api for bookmarklets.
// https://github.com/rasmusfl0e/amoeba


var type = require("./src/type");
var each = require("./src/each");
var request = require("./src/request");
var extend = require("./src/extend");
var toQuery = require("./src/toQuery");

var parseQuery = require("./src/string/parseQuery");
var template = require("./src/string/template");

var create = require("./src/dom/create");
var insert = require("./src/dom/insert");
var addClass = require("./src/dom/addClass");
var removeClass = require("./src/dom/removeClass");
var contains = require("./src/dom/contains");
var on = require("./src/dom/on");
var off = require("./src/dom/off");
var get = require("./src/dom/get");
var getAll = require("./src/dom/getAll");
var getChildren = require("./src/dom/getChildren");
var getSiblings = require("./src/dom/getSiblings");
var getNext = require("./src/dom/getNext");
var getPrevious = require("./src/dom/getPrevious");
var matches = require("./src/dom/matches");
var load = require("./src/dom/load");

var util = {

	load: function () {
		return wrap(load.apply(null, arguments));
	},

	request: request,

	type: type,

	each: each,

	extend: extend,

	toQuery: toQuery,

	parseQuery: parseQuery,

	template: template,

	create: function () {
		return wrap(create.apply(null, arguments));
	}

};

function wrap (element) {
	return (element) ? new Wrapper(element) : element;
}

function wrapAll (elements) {
	var index = elements.length;
	var _elements = [];

	while (index--) {
		_elements[index] = new Wrapper(elements[index]);
	}

	return _elements;
}

function getWrapped (selector, parent) {
	return wrap(get(selector, parent));
}

function getAllWrapped (selector, parent) {
	return wrapAll(getAll(selector, parent));
}

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

	get: function (selector) {
		return getWrapped(selector, this.el);
	},

	getAll: function (selector) {
		return getAllWrapped(selector, this.el);
	},

	children: function (selector) {
		return wrapAll(getChildren(this.el, selector));
	},

	siblings: function (selector) {
		return wrapAll(getSiblings(this.el, selector));
	},

	next: function (selector) {
		return wrap(getNext(this.el, selector));
	},

	prev: function (selector) {
		return wrap(getPrevious(this.el, selector));
	},

	contains: function (child) {
		return contains(this.el, child.el);
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

module.exports = function (callback) {
	callback(getWrapped, getAllWrapped, util);
};
