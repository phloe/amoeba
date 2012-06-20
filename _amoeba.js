/*

***_amoeba***

Exposes the internal `get` and `getAll` functions and the internal `util` namespace.
As these are passed into the callback function as arguments you can name them however you like - eg. `$`, `$$`, `_`

	_amoeba(function(get, getAll, util){
		var page = get("#page");
		if (page.match(".active")) {
			page.getAll("div");
		}
	});

*/

var _amoeba = (function (global, document) {
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
		var string = template.slice();
		
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

/*
get
Returns a wrapped element matching the supplied selector.
@argument {String} selector The CSS selector matching the element you want
@argument {Element} parent Optional
@returns {Wrapper} An instance of Wrapper.
*/

	get = function (selector, parent) {
		if (typeof selector !== "string") {
			return new Wrapper(selector);
		}

		var element = (parent || document).querySelector(selector);

		return (element) ? new Wrapper(element) : element;
	},
	
/*
getAll
Returns an array of elements that match the supplied selector.
@argument {String} selector The CSS selector matching the elements you want
@argument {Element} parent Optional
@returns {Array} An array containing elements.
*/

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
			if (element.nodeType === 1 && match(element, selector)) {
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
				if (match(element, selector)) {
					return element;
				}
				else {
					return null;
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
				if (match(element, selector)) {
					return element;
				}
				else {
					return null;
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
	
/*
util
Holds the methods for the main API
*/
	
	util = {
	
/*
Method
util.load
Loads a script onto the page and optionally executes a callback function on load.
Arguments
* `url` (String) The url of the script to be loaded
* `func` (Function) Optional. A function that is called when the script has loaded
@returns {Element} A script element.

	util.load("http://amoeba-js.net/js", function(){
		alert("script loaded");
	});
	
*/
		
		load: function (url, callback) {
			var script = create("script", document.body);
				
			if (callback) {
				script.on("load", callback);
			}
			
			script.el.src = url;
			
			return script;
		},

/*
util.request
Creates and sends an XMLHttpRequest.
Arguments:
@argument {String} url The url of the script to be loaded
@argument {Function} func A function that is called with the XMLHttpRequest object as an argument when the script has loaded
@argument {Object} data Optional. An object containing the key-value pairs sent with the request
@argument {String} mode Optional. The mode of the request; "GET" or "POST" (case sensitive). Default is "GET"
@argument {Boolean} async Optional. A boolean to set asynchronous mode on or off. Default is true
@argument {Object} headers Optional. An Object containing additional headers. 
@returns {XMLHttpRequest} An XMLHttpRequest object.

	util.request("");
	
*/
		
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
				else {
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

/*
util.type
Identifies the type of the supplied variable.
@argument {mixed} subject The variable whose type is to be identified
@returns {String} A string: "boolean", "number", "string", "array", "object", "function", "regexp", "date", "math", "location", "element", "nodelist", "htmlcollection" or "undefined".

	var myVariable = ["hello", "world"];
	var myType = util.type(myVariable);
	//myType == "array"

Credits: Kangax

*/
		
		type: type,

/*
util.each
Iterates through the supplied subject and calls the callback function on each step.
@argument {Number|String|Array|Object|HtmlCollection} subject Variable to iterate through. If a number is supplied the callback function is called that number of times
@argument {Function} func Callback function to call every iteration step
@argument {Object} bind Optional. Variable to bind the this keyword to inside the callback function

	var recipients = ["world", "steve", "dave"];
	util.each(recipients, function (recipient, i) {
		alert("Hello, " + recipient + ". You are number " + (i + 1));
	});
	// alerts:
	// "Hello, world. You are number 1"
	// "Hello, steve. You are number 2"
	// "Hello, dave. You are number 3"
	
*/
		
		each: each,


/*
util.extend
Extends (or overwrite) a given object with the properties of the supplied object properties recursively.
@argument {Object} subject Object to extend
@argument {Object} properties Object containing properties to extend with

	var myObject = {
		message: "hello",
		recipient: "steve"
	};
	util.extend(myObject, {recipient: "world"});
	// myObject = {
	//	message: "hello",
	//	recipient: "world"
	//};
	
*/
		
		extend: extend,

/*
util.toQuery
Returns a querystring built from the supplied object.
@argument {Object} subject Object to transform into a querystring

	var myObject = {
		message: "hello",
		recipient: "world"
	};
	var myQueryString = util.toQuery(myObject);
	// myQueryString = "message=hello&recipient=world";
	
*/
		
		toQuery: toQuery,

/*
util.parseQuery
Returns an object containing the querystring data contained in the supplied string.
@argument {String} string The string to be transformed

	// window.location.href =
	// "http://www.mydomain.com/index.php?message=hello&recipient=world";
	var myObject = util.parseQuery(window.location.href);
	//myObject = {
	//	message: "hello",
	//	recipient: "world"
	//};
	
*/

		
		parseQuery: parseQuery,

/*
util.template
Returns a template string populated with the data of the supplied object.
@argument {String} template A string with tokens
@argument {Object} object An object containing the data needed for populating the template
@argument {Array} delimiters Optional. An array containing 2 strings that define how tokens are marked up within the supplied template. Defaults are curly braces; { and }

	var myTemplate = "{message}, {recipient}!";
	var myObject = {
		message: "hello",
		recipient: "world"
	};
	var myMessage = util.template(myTemplate, myObject);
	// myMessage = "hello, world!";
	
*/
		
		template: template,

/*
util.create
Returns a newly created DOM element with the supplied properties from the options object. The created element is appended to the parent element if supplied. If a context is
The options argument can be omited in favor of the parent argument.
@argument {String} tag Name of the element
@argument {Object} options Optional. An object containing properties for the element
@argument {Element} parent Optional. An element to which the created element should be appended
@argument {String} context Optional. A string that specifies the relation to the parent element; "top" - insert as the first element inside parent. "bottom" - insert as the last element inside parent. "before" - insert before parent (outside). "after" - insert after parent (outside). Default is "bottom"
@returns {Wrapper} A wrapped element. 

	var myElement = util.create(
		"button",
		{
			style: {
				backgroundColor: "red",
				borderColor:	"green",
				color:			"green"
			},
			innerHTML: "click",
			onclick: function(){
				alert("hello, world!");
			}
		},
		document.body,
		"top"
	);
	//	myElement = <button style="background-color: red; border-color: green; color: green;" onclick="alert(\"hello, world!\");">click</button>
	
*/
		
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

/*
Wrapper.insert
Inserts the supplied content into the parent element.
@argument {String|Number|Element|Array|HtmlCollection} content Content to be appended. If an array is supplied it should only consist of strings (text or html), numbers or elements
@argument {Element} parent Element to append the supplied content to
@argument {String|Number} context Optional. A string or number that specifies the relation to the parent element; "top" - insert as the first elements inside parent. "bottom" - insert as the last elements inside parent. "before" - insert before parent (outside). "after" - insert after parent (outside). If the supplied context is a number it corresponds to the index of the childnodes where content will be inserted. Negative numbers have their index calculated in reverse. Default is "bottom"
*/

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

/*
Wrapper.get
Finds the first element that matches the provided selector.
@argument {String} selector The CSS selector matching the element to be returned. Supported selectors are: type, id, class, child (requires whitespace) and attribute (CSS2: attribute presence and value, CSS3: substring matches) selectors. Multiple class and attribute selectors are supported. Each described node in the selector should have the following required order: type, id, class, attribute, eg. tag#id.class[attribute=value]
@returns {Element|Null} An element or null if no matching element is found.

	var body = get("body");
	var firstUserItem = body.get("ul.users li");
	var checkedRadio = body.get("input[name='optIn'][type='radio'][checked]");
	
*/

		get: function (selector) {
			return get(selector, this.el);
		},

/*
Wrapper.getAll
Returns an array containing all elements that match the supplied selector. If a parent argument is supplied only elements within that parent element is returned.
@argument {String} selector See {@link Wapper.get}
@returns {Array}

	var body = get("body");
	var userItems = body.getAll("ul.users li");
	
*/

		getAll: function (selector) {
			return getAll(selector, this.el);
		},

/*
Wrapper.children
Returns an array of wrapped child elements. If the selector argument is supplied only the elements matching it will be returned.
@argument {String} selector See Wapper.get
@returns {Array}

	var ul = get("ul");
	var activeUserItems = ul.children(".active");

*/

		children: function (selector) {
			var i,
				elements = getChildren(this.el, selector),
				length = elements.length;
				
			for (i = 0; i < length; i++) {
				elements[i] = new Wrapper(elements[i]);
			}
			
			return elements;
		},

/*
Wrapper.siblings
Returns an array of wrapped sibling elements. If the selector argument is supplied only the elements matching it will be returned.
@argument {String} selector See Wapper.get
@returns {Array}

	var firstDiv = get("body div");
	var otherDivs = firstDiv.siblings("div");
	
*/

		siblings: function (selector) {
			var i,
				elements = getSiblings(this.el, selector),
				length = elements.length;
				
			for (i = 0; i < length; i++) {
				elements[i] = new Wrapper(elements[i]);
			}
			
			return elements;
		},

/*
Wrapper.next
Returns the next sibling element. If the selector argument is supplied the first matching sibling element proceeding it will be returned.
@argument {String} selector See Wapper.get
@returns {Wrapper|Null}

	var firstDiv = get("body div");
	var nextDiv = firstDiv.next("div");
	
*/

		next: function (selector) {
			var element = getNext(this.el, selector);
			
			return (element) ? new Wrapper(element) : element;
		},

/*
Wrapper.prev
Returns the previous sibling element. If the selector argument is supplied the first matching sibling element preceeding it will be returned.
@argument {String} selector See Wapper.get
@returns {Wrapper|Null}

	var lastDiv = getAll("body div")[0];
	var prevDiv = lastDiv.prev("div");
	
*/

		prev: function (selector) {
			var element = getPrevious(this.el, selector);
			return (element) ? new Wrapper(element) : element;
		},

/*
Wrapper.contains
Returns true if the supplied child is a descendant of the wrapped element.
@argument {Element} child The element to test against
@returns {Wrapper|Null}

	var body = get("body");
	var div = get("div");
	if (body.contains(div)) {
		// do stuff
	}
	
*/

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

/*
Wrapper.match
Returns true or false for whether the supplied selector matches the element.
@argument {String} selector Selector to match against wrapped element
@returns {Boolean}

	get("div.class").match(".class");

*/

		match: function (selector) {
			return matchesSelector.call(this.el, selector);
		},

/*
Wrapper.addClass
Adds the supplied classname if it doesn't exist on the wrapped element.
@argument {String} className The classname to add
@returns The wrapped element.

	get("div.user").addClass("active");

*/

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

/*
Wrapper.removeClass
Removes the supplied classname if it exists on the wrapped element.
@argument {String} className The classname to remove
@returns The wrapped element.

	get("div.active").removeClass("active");
	
*/

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

/*
Wrapper.on
Add an event to the wrapped element.
@argument {String} event The type of event to add
@argument {Function} func The function to call on the event
@returns The wrapped element.

	get("button").on("click", function(){
		// do stuff
	});
	
*/

		on: function (event, func, selector) {
			if (selector) {
				var _func = func;
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

/*
Wrapper.off
Remove an event from the wrapped element.
@argument {String} event The type of event to remove
@argument {Function} func The function to remove
@returns The wrapped element

	var handleClick = function(){
		// do stuff
	};
	get("button").off("click", handleClick);
	
*/

		off: function (event, func) {
			this.el.removeEventListener(event, func, false);
			
			return this;
		}

	};
	
	return function (callback) {
		callback(get, getAll, util);
	};

} (this, document));