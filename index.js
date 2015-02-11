// _amoeba.js - micro api for bookmarklets.
// https://github.com/rasmusfl0e/amoeba


var type = require("./src/type");
var request = require("./src/request");
var extend = require("./src/extend");
var toQuery = require("./src/toQuery");

var parseQuery = require("./src/string/parseQuery");
var template = require("./src/string/template");

var create = require("./src/dom/create");
var insert = require("./src/dom/insert");
var remove = require("./src/dom/remove");
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

	create: function () {
		return new Wrapper(create.apply(null, arguments));
	},

	load: function () {
		return new Wrapper(load.apply(null, arguments));
	},

	request: request,

	type: type,

	extend: extend,

	toQuery: toQuery,

	parseQuery: parseQuery,

	template: template

};

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

module.exports = function (callback) {
	callback(function (selector) {
		var element = get(selector);
		return element ? new Wrapper(element) : null;
	}, getAll, util);
};
