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
		var key, i, length, _type = type(subject);

		if (_type === "number") {
				for (i = 0; i < subject; i++) {
					func.call(bind || subject, i, i);
				}
		}
		else if (_type === "object") {
			for (key in subject) {
				if (subject.hasOwnProperty(key)) {
					func.call(bind || subject, subject[ key ], key);
				}
			}
		}
		else {
			if (_type === "string") {
				subject = subject.split("");
			}
			if (_type === "array" || _type === "nodelist" || _type === "htmlcollection") {
				length = subject.length;
				for (i = 0; i < length; i++) {
					func.call(bind || subject, subject[i], i);
				}
			}
		}
		
		return subject;
	},

// Object
	
	extend = function (subject, properties) {
		each(properties, function (value, key) {
			var valueType = type(value);
			if (valueType === "array" || valueType === "object") {
				if (!(key in subject)) {
					subject[key] = (valueType === "array") ? [] : {};
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
		var string = [],
			urlEncode = encodeURIComponent;
		
		each(subject, function (value, key) {
			string.push(
				urlEncode(key) + "=" + urlEncode(value)
			);
		});
		
		return string.join("&");
	},

// String

	parseQuery = function (subject) {
		var object = {},
			urlDecode = decodeURIComponent;
		
		each(subject.replace(/(^[^?]*\?)|(#[^#]*$)/g, "").split("&"), function (pair) {
			pair = pair.split("=");
			object[urlDecode(pair[0])] = (pair[1]) ? urlDecode(pair[1]) : null;
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

	Wrapper = function (element) {
		this.el = element || null;
		
		return this;
	},

	create = function (tag, options, parent, context) {
		var element = document.createElement(tag);
		
		if (type(options) === "element") {
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
		
		return new Wrapper(element);
	},

	insert = function (parent, element, context) {
		
		if (context === undefined) {
			context = "bottom";
		}
		
		var rel, children;

		switch (context) {

			case "top":
				children = getChildren(parent);
				rel = (children) ? children[0] : false;
				break;

			case "bottom":
				break;

			case "before":
				rel = parent;
				parent = parent.parentNode;
				break;

			case "after":
				rel = getNext(parent);
				parent = (!rel) ? parent : parent.parentNode;
				break;

			default:
				if (type(context) === "number") {
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
		if (typeof selector !== "string") {
			return new Wrapper(selector);
		}

		var element = (parent || document).querySelector(selector);

		return (element) ? new Wrapper(element) : element;
	},


	getAll = function (selector, parent) {
		var nodelist = (parent || document).querySelectorAll(selector),
			i = nodelist.length,
			elements = [];

		while (i--) {
			elements[i] = new Wrapper(nodelist[i]);
		}

		return elements;
	},

	getChildren = function (element, selector) {
		var i, l,
			children = element.childNodes,
			length = children.length,
			elements = [];

		for (i = 0; i < length; i++) {
			element = children[i];
			if (element.nodeType === 1 && (!selector || match(element, selector))) {
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

	getNext = function(element, selector) {
		element = element.nextSibling;

		while (element) {
			if (element.nodeType === 1) {
				if (!selector || match(element, selector)) {
					return element;
				}
			}
			element = element.nextSibling;
		}

		return null;
	},

	getPrevious = function(element, selector) {
		element = element.previousSibling;

		while (element) {
			if (element.nodeType === 1) {
				if (!selector || match(element, selector)) {
					return element;
				}
			}
			element = element.previousSibling;
		}

		return null;
	},

	html = document.documentElement,

	matchesSelector = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector || html.oMatchesSelector,
	
	match = function (element, selector) {
		return matchesSelector.call(element, selector);
	},

	
	util = {

		
		load: function (url, callback) {
			var script = create("script", document.body);
				
			if (callback) {
				script.on("load", callback);
			}
			
			script.el.src = url;
			
			return script;
		},
		
		request: function (url, callback, data, mode, async, headers) {
			var xhr = new XMLHttpRequest();
			
			headers = headers || {};
			mode = mode || "GET";
			async = (async === undefined) ? true : async;
			
			if (data) {
				data = toQuery(data);
				if (mode === "GET") {
					url += "?" + data;
					data = null;
				}
				else if (!("Content-type" in headers)) {
					headers["Content-type"] = "application/x-www-form-urlencoded";
				}
			}
			
			xhr.open(mode, url, async);
			
			each(headers, function (value, key) {
				xhr.setRequestHeader(key, value);
			});
			
			if (callback) {
				xhr.onload = function () {
					callback(xhr.responseText, xhr.responseXML);
				};
			}
			
			xhr.send(data);
			
			return xhr;
		},
		
		type: type,
		
		each: each,
		
		extend: extend,
		
		toQuery: toQuery,
		
		parseQuery: parseQuery,
		
		template: template,
		
		create: create
		
	};
	
	/*
	ListWrapper = function (elements) {
		this.els = elements || [];
		return this;
	}
	
	util.each(Wrapper.protoype, function (method, name, index) {
		ListWrapper.prototype[name] = function () {
			var length = this.els;
			for (var i = 0; i < length; i++) {
				
			}
		};
	});
	*/

	Wrapper.prototype = {

		insert: function (contents, context) {
			var i, content, length,
				contentType = type(contents);
			
			if (contentType === "string" || contentType === "element") {
				contents = [contents];
			}
			
			length = contents.length;
			
			for (i = 0; i < length; i++) {
				content = contents[i];
				insert(
					this.el,
					(content.nodeName) ? content : document.createTextNode(content),
					context
				);
			}
		
			return this;
		},

		get: function (selector) {
			return get(selector, this.el);
		},

		getAll: function (selector) {
			return getAll(selector, this.el);
		},

		children: function (selector) {
			var i,
				elements = getChildren(this.el, selector),
				length = elements.length;
				
			for (i = 0; i < length; i++) {
				elements[i] = new Wrapper(elements[i]);
			}
			
			return elements;
		},

		siblings: function (selector) {
			var i,
				elements = getSiblings(this.el, selector),
				length = elements.length;
				
			for (i = 0; i < length; i++) {
				elements[i] = new Wrapper(elements[i]);
			}
			
			return elements;
		},

		next: function (selector) {
			var element = getNext(this.el, selector);
			
			return (element) ? new Wrapper(element) : element;
		},

		prev: function (selector) {
			var element = getPrevious(this.el, selector);
			return (element) ? new Wrapper(element) : element;
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
			
			if (index === -1) {
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
			if (~event.indexOf(" ")) {
				var _func = func,
					split = event.split(" "),
					selector = split[1];
				
				event = split[0];
				
				func = function (e) {
					var target = e.target;
					if (match(target, selector)) {
						_func.apply(target, [e, new Wrapper(target)]);
						e.stopPropagation();
					}
				}
			}
			this.el.addEventListener(event, func, false);
			
			return this;
		},

		off: function (event, func) {
			this.el.removeEventListener(event, func, false);
			
			return this;
		}

	};
	
	return function (callback) {
		callback(get, getAll, util);
	};

} (this, document));