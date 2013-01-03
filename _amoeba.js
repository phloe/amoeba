this._amoeba = this._amoeba || (function (global, document) {
	"use strict";

	var type = function (subject) {
		var type;
		
		switch (subject) {

			case null:
				type = "object";
				break;

			case undefined:
				type = undefined + "";
				break;

			default:
				type = ({}).toString.call(subject).slice(8, -1).toLowerCase();
				if (type.indexOf("element") > -1) {
					type = "element";
				}
				break;

		}
		
		return type;
	},

	each = function (subject, func, bind) {
		var key, i = 0, length, _type = type(subject);

		if (_type == "number") {
				while (i < subject) {
					func.call(bind || subject, i++);
				}
		}
		else if (_type == "object") {
			for (key in subject) {
				if (subject.hasOwnProperty(key)) {
					func.call(bind || subject, subject[ key ], key, i++);
				}
			}
		}
		else {
			if (_type == "string") {
				subject = subject.split("");
			}
			if (_type == "array" || _type == "nodelist" || _type == "htmlcollection") {
				length = subject.length;
				while (i < length) {
					func.call(bind || subject, subject[i], i++);
				}
			}
		}
		
		return subject;
	},

// Object
	
	extend = function (subject, properties) {
		each(properties, function (value, key) {
			var valueType = type(value);
			if (valueType == "array" || valueType == "object") {
				if (!(key in subject)) {
					subject[key] = (valueType == "array") ? [] : {};
				}
				extend(subject[key], value);
			}
			else {
				subject[key] = value;
			}
		});
		
		return subject;
	},

	toQuery = function (subject) {
		var string = [];
		
		each(subject, function (value, key) {
			string.push(
				encodeURIComponent(key) + "=" + encodeURIComponent(value)
			);
		});
		
		return string.join("&");
	},

// String

	parseQuery = function (subject) {
		var object = {};
		
		each(subject.replace(/(^[^?]*\?)|(#[^#]*$)/g, "").split("&"), function (pair) {
			pair = pair.split("=");
			object[decodeURIComponent(pair[0])] = (pair[1]) ? decodeURIComponent(pair[1]) : null;
		});
		
		return object;
	},

	template = function (template, object, delimiters) {
		var string = template + "";
		
		delimiters = delimiters || ["{", "}"];
		
		each(object, function (value, key) {
			string = string.replace(delimiters[0] + key + delimiters[1], value);
		});
		
		return string;
	},

// DOM

	create = function (tag, options, parent, context) {
		var element = document.createElement(tag);
		
		if (type(options) == "element") {
			context = parent || null;
			parent = options;
			options = null;
		}
		
		if (options) {
			extend(element, options);
		}
		
		if (parent) {
			insert(parent, element, context);
		}
		
		return element;
	},

	insert = function (parent, element, context) {
		
		if (type(element) == "string") {
			element = document.createTextNode(element);
		}
		
		if (context == undefined) {
			context = "bottom";
		}
		
		var rel, children;

		switch (context) {

			case "before":
				rel = parent;
				parent = parent.parentNode;
				break;

			case "after":
				rel = getNext(parent);
				parent = (!rel) ? parent : parent.parentNode;
				break;

			case "bottom":
				break;

			case "top":
				context = 0;

			default:
				if (type(context) == "number") {
					children = getChildren(parent);
					if (context < 0) {
						context += children.length;
					}
					if (children.length > context) {
						rel = children[context + 1];
					}
				}
				break;

		}
		if (rel) {
			parent.insertBefore(element, rel);
		}
		else {
			parent.appendChild(element);
		}
	},

	//remove: function () {},

	//erase: function () {},

	get = function (selector, parent) {
		if (typeof selector != "string") {
			return selector;
		}

		return (parent || document).querySelector(selector);
	},

	getAll = function (selector, parent) {
		return (parent || document).querySelectorAll(selector);
	},

	getChildren = function (element, selector) {
		var children = element.childNodes,
			elements = [],
			length = children.length,
			i = 0;

		while (i < length) {
			element = children[i++];
			if (element.nodeType == 1 && (!selector || match(element, selector))) {
				elements.push(element);
			}
		}

		return elements;

	},

	getSiblings = function (element, selector) {
		var elements = getChildren(element.parentNode, selector),
			index = elements.indexOf(element);
		
		elements.splice(index, 1);
			
		return elements;
	},

	getSibling = function(element, selector, context) {
		element = element[context];

		while (element) {
			if (element.nodeType == 1 && (!selector || match(element, selector))) {
				return element;
			}
			element = element[context];
		}

		return null;
	},

	getNext = function(element, selector) {
		return getSibling(element, selector, "nextSibling");
	},

	getPrevious = function(element, selector) {
		return getSibling(element, selector, "previousSibling");
	},

	html = document.documentElement,

	matchesSelector = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector || html.oMatchesSelector,
	
	match = function (element, selector) {
		return matchesSelector.call(element, selector);
	},
	
	load = function (url, callback) {
		var script = create("script", document.body);
			
		if (callback) {
			script.onload = callback;
		}
		
		script.src = url;
		
		return script;
	},
	
	request = function (url, callback, data, mode, async, headers) {
		var xhr = new XMLHttpRequest();
		
		headers = headers || {};
		mode = mode || "GET";
		async = (async === undefined) ? true : async;
		
		if (data) {
			data = toQuery(data);
			if (mode == "GET") {
				url += "?" + data;
				data = null;
			}
			else if (!("Content-type" in headers)) {
				headers["Content-type"] = "application/x-www-form-urlencoded";
			}
		}
		
		xhr.open(mode, url, async);
		
		for (var key in headers) {
			xhr.setRequestHeader(key, headers[key]);
		}
		
		if (callback) {
			xhr.onload = function () {
				callback(xhr.responseText, xhr.responseXML);
			};
		}
		
		xhr.send(data);
		
		return xhr;
	},
	
	util = {

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
		
	},
	
	wrap = function (element) {
		return (element) ? new Wrapper(element) : element;
	},
	
	wrapAll = function (elements) {
		var i = elements.length,
			_elements = [];

		while (i--) {
			_elements[i] = new Wrapper(elements[i]);
		}
		
		return _elements;
	},
	
	getWrapped = function (selector, parent) {
		return wrap(get(selector, parent));
	},
	
	getAllWrapped = function (selector, parent) {
		return wrapAll(getAll(selector, parent));
	},

	Wrapper = function (element) {
		this.el = element || null;
	};

	Wrapper.prototype = {

		insert: function (contents, context) {
			
			if (type(contents) != "array") {
				contents = [contents];
			}
			
			var content,
				length = contents.length,
				i = 0;
			
			while (i < length) {
				content = contents[i++];
				insert(this.el, content.el || content , context);
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

/*

	http://www.quirksmode.org/blog/archives/2006/01/contains_for_mo.html

*/
	
		contains: (global.Node && Node.prototype && Node.prototype.compareDocumentPosition) ?
			function (child) {
				return !!(this.el.compareDocumentPosition(child.el) & 16);
			} :
			function (child) {
				return this.el.contains(child.el);
			},

		match: function (selector) {
			return matchesSelector.call(this.el, selector);
		},

		addClass: function (className) {
			var element = this.el,
				classList = element.className.split(/\s+/),
				index = classList.indexOf(className);
			
			if (index == -1) {
				classList.push(className);
				element.className = classList.join(" ");
			}
			
			return this;
		},

		removeClass: function (className) {
			var element = this.el,
				classList = element.className.split(/\s+/),
				index = classList.indexOf(className);
			
			if (index > -1) {
				classList.splice(index, 1);
				element.className = classList.join(" ");
			}
			
			return this;
		},

		on: function (event, func) {
			var useCapture = false;
			if (event.indexOf(" ") > -1) {
				var _func = func,
					split = event.split(" "),
					selector = split[1];
				
				event = split[0];
				
				useCapture = true;
				
				func = function (e) {
					var target = e.target;
					if (match(target, selector)) {
						_func.apply(target, [e, wrap(target)]);
						e.stopPropagation();
					}
				}
			}
			this.el.addEventListener(event, func, useCapture);
			
			return this;
		},

		off: function (event, func) {
			this.el.removeEventListener(event, func, false);
			
			return this;
		}

	};
	
	return function (callback) {
		callback(getWrapped, getAllWrapped, util);
	};

} (this, document));