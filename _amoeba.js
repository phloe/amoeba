(function (global, document) {

    var amoeba = function (element) {
		return new wrapper(element);
	},

	load = function (url, func, s) {
		var tag = "script",
			script = create(tag, get(tag), "before");
		script.onload = func;
		script.src = url;
		return script;
	},

	request = function (url, func, data, mode, async) {
		var xhr = new XMLHttpRequest();
		mode = mode || "get";
		async = (async === undefined) ? true : async;
		data = toQuery(data);
		if (data && mode == "get") {
			url += "?" + data;
			data = null;
		}
		xhr.open(mode, url, async);
		xhr.onload = function () {
			func(xhr.responseText, xhr.responseXML);
		};
		xhr.send(data);
		return xhr;
	},

	type = function (subject) {
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
		var key,
			i;

		switch (type(subject)) {

			case "number":
				for (i = 0; i < subject; i++) {
					func.call(bind || subject, i, i);
				}
				break;

			case "string":
				subject = subject.split("");
			case "array":
			case "nodelist":
			case "htmlcollection":
				for (i = 0, l = subject.length; i < l; i++) {
					func.call(bind || subject, subject[i], i);
				}
				break;

			case "object":
				for (key in subject) {
					if (subject.hasOwnProperty(key)) {
						func.call(bind || subject, subject[key], key);
					}
				}
				break;

		}
		return subject;
	},

	// Object

	extend = function (subject, properties) {
		each(properties, function (value, key) {
			var valueType = type(value);
			if (valueType === "array" || valueType === "object") {
				subject[key] = subject[key] || {};
				extend(subject[key], value);
			}
			else {
				subject[key] = value;
			}
		});
		return subject;
	},

	toQuery = function(subject){
		var string = [], urlEncode = encodeURIComponent;
		each(subject, function (value, key) {
			string.push(
				urlEncode(key) + "=" + urlEncode(value)
			);
		});
		return string.join("&");
	},

	// String

	parseQuery = function(subject){
		var object = {}, urlDecode = decodeURIComponent;
		each(subject.replace(/(^[^?]*\?)|(#[^#]*$)/g, "").split("&"), function (pair) {
			pair = pair.split("=");
			object[urlDecode(pair[0])] = (pair[1]) ? urlDecode(pair[1]) : null;
		});
		return object;
	},

	template = function (template, object, delimiters) {
		var string = template;
		delimiters = delimiters || ["{", "}"];
		each(object, function (value, key) {
			string = string.replace(delimiters[0] + key + delimiters[1], value);
		});
		return string;
	},

	// DOM

	wrapper = function (element) {
		this.element = element || null;
	},

	create = function (tag, options, parent, context, wrapped) {
		if (type(options) == "element") {
			context = parent || null;
			parent = options;
			options = null;
		}
		var element = document.createElement(tag);
		if (options) {
			extend(element, options);
		}
		if (parent) {
			insertSingle(element, parent, context);
		}
		return (wrapped) ? amoeba(element) : element;
	},

	insertSingle = function (element, parent, context) {
		parent = parent || body;
		if (context === undefined) {
			context = "bottom";
		}
		var rel,
			children;

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
				rel = getSiblings("next", parent, null, true);
				parent = (!rel) ? parent : parent.parentNode;
				break;

			default:
				if (type(context) === "number") {
					children = getChildren(parent);
					if (context < 0) {
						context += children.length;
					}
					if (children.length > context) {
						rel = children[context+1];
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

	insert = function (contents, parent, context) {
		var contentType = type(contents),
			i,
			content;
		if (contentType === "string" || contentType === "element") {
			contents = [contents];
		}
		for (i = 0; i < contents.length; i++) {
			content = contents[i];
			insertSingle(
				(content.nodeName) ? content : document.createTextNode(content),
				parent,
				context
			);
		}
	},

	/*

	remove: function () {},

	erase: function () {},

	*/

	get = function (selector, parent, wrapped) {
		var element;

		if (typeof parent == "boolean") {
			wrapped = parent;
			parent = null;
		}
		
		element = (parent || document).querySelector(selector);

		return (element && wrapped) ? amoeba(element) : element;
	},

	getAll = function (selector, parent, wrapped) {
		if (typeof parent == "boolean") {
			wrapped = parent;
			parent = null;
		}
		var nodelist = (parent || document).querySelectorAll(selector),
			node, i = nodelist.length, elements = [];

		while (i--) {
			node = nodelist[i];
			elements[i] = (wrapped) ? amoeba(node) : node;
		}

		return elements;
	},

	getChildren = function (element, selector, wrapped) {
		var nodelist = element.childNodes,
			node, i = 0, l = nodelist.length, elements = [];

		for (; i < l, node = nodelist[i]; i++) {
			if (node.nodeType === 1 && match(node, selector)) {
				elements.push(
					(wrapped) ? amoeba(node) : node
				);
			}
		}

		return elements;

	},

	getSiblings = function (element, selector, wrapped) {
		var node = element.parentNode.firstChild,
			elements = [];

		while (node) {
			if (node != parent && node.nodeType === 1 && match(node, selector)) {
				elements.push(
					(wrapped) ? amoeba(node) : node
				);
			}
			node = node.nextSibling;
		}

		return elements;

	},

	getNext = function(element, selector, wrapped){
		var node = element.nextSibling;

		while (node) {
			if (node.nodeType === 1) {
				if (match(node, selector)) {
					return (wrapped) ? amoeba(node) : node;
				}
				else {
					return false;
				}
			}
			node = node.nextSibling;
		}

		return false;
	},

	getPrevious = function(element, selector, wrapped){
		var node = element.previousSibling;

		while (node) {
			if (node.nodeType === 1) {
				if (match(node, selector)) {
					return (wrapped) ? amoeba(node) : node;
				}
				else {
					return false;
				}
			}
			node = node.previousSibling;
		}

		return false;
	},

	/*

		http://www.quirksmode.org/blog/archives/2006/01/contains_for_mo.html

	*/

	contains = (global.Node && Node.prototype && Node.prototype.compareDocumentPosition) ?
			function(element, child){ return !!(element.compareDocumentPosition(child) & 16); } :
 			function(element, child){ return element.contains(child); },

	name = "atchesSelector",
	
	docEl = document.documentElement,

	matchesSelector = docEl["m" + name] || docEl["mozM" + name] || docEl["webkitM" + name] || docEl["msM" + name] || docEl["oM" + name],

	match = function (element, selector) {	
		return matchesSelector.call(element, selector);
	},

	addClass = function (element, className) {
		var classList = element.className.split(/\s+/),
			index = classList.indexOf(className);
		if (index == -1) {
			classList.push(className);
			element.className = classList.join(" ");
		}
	},

	removeClass = function (element, className) {
		var classList = element.className.split(/\s+/),
			index = classList.indexOf(className);
		if (index > -1) {
			classList.splice(index, 1);
			element.className = classList.join(" ");
		}
	},

	on = function (event, element, func) {
		element.addEventListener(event, func, false);
	},

	off = function (event, element, func) {
		element.removeEventListener(event, func, false);
	},

	body = document.body, script = get("script[href*='?name=']"),

	namespace = script && script.src.replace(/^[^?]+\?name=/, "") || "_amoeba";

	global[namespace] = extend(amoeba, {

		/*
		Function: load
			Loads a script onto the page and optionally executes a callback function on load.

		Arguments:
			url -	(string) The url of the script to be loaded.
			func -	(function) Optional. A function that is called when the script has loaded.

		Returns:


		Example:
			(start code)

			_amoeba.load("http://amoeba-js.net/js", function(){
				alert("script loaded");
			});

			(end)
		*/

		load: load,

		/*
		Function: request
			.

		Arguments:
			url -	(string) The url of the script to be loaded.
			func -	(function) A function that is called with the XMLHttpRequest object as an argument when the script has loaded.
			data -	(object) Optional. An object containing the key-value pairs sent with the request.
			mode -	(string) Optional. The mode of the request; "get" or "post". Default is "get".
			async -	(boolean) Optional. A boolean to set asynchronous mode on or off. Default is true.

		Returns:
			An XMLHttpRequest object.


		Example:
			(start code)
			(end)
		*/

		request: request,

		/*
		Function: type
			Identifies the type of the supplied variable.

		Arguments:
			subject -	(mixed) The variable whose type is to be identified.

		Returns:
			A string: "boolean", "number", "string", "array", "object", "function", "regexp", "date", "math", "location", "element", "nodelist", "htmlcollection" or "undefined".

		Example:
			(start code)
			var myVariable = ["hello", "world"];

			var myType = _amoeba.type(myVariable);

			//myType = "array"
			(end)

		Credits:
			Kangax

		*/

		type: type,

		/*
		Function: each
			Iterates through the supplied subject and calls the callback function on each step.

		Arguments:
			subject -	(number, string, array, object or htmlcollection) Variable to iterate through. If a number is supplied the callback function is called that number of times.
			func -		(function) Callback function to call every iteration step.
			bind -		(object) Optional. Variable to bind the this keyword to inside the callback function.

		Example:
			(start code)
			var recipients = ["world", "steve", "dave"];

			amoeba.each(recipients, function (recipient, i) {
				alert("Hello, " + recipient + ". You are number " + i);
			});

			// alerts:
			// "Hello, world. You are number 0"
			// "Hello, steve. You are number 1"
			// "Hello, dave. You are number 2"
			(end)

		*/

		each: each,


		/*
		Function: extend
			Extends (or overwrite) a given object with the properties of the supplied object properties recursively.

		Arguments:
			subject -		(object) Object to extend.
			properties -	(object) Object containing properties to extend with.

		Example:
			(start code)
			var myObject = {
				message: "hello",
				recipient: "steve"
			};

			_amoeba.extend(myObject, {recipient: "world"});

			// myObject = {
			//	message: "hello",
			//	recipient: "world"
			//};
			(end)

		*/

		extend: extend,

		/*

		Function: toQuery
			Returns a serialized string built from the supplied object.

		Arguments:
			subject -		(object) Object to transform into a serialized string.

		Example:
			(start code)
			var myObject = {
				message: "hello",
				recipient: "world"
			};

			var myQueryString = _amoeba.serialize(myObject, "query");

			// myQueryString = "message=hello&recipient=world";
			(end)
		*/

		toQuery: toQuery,

		/*
		Function: parseQuery
			Returns an object containing the querystring data contained in the supplied serialized string.

		Arguments:
			string -		(string) The serialized string to be transformed.

		Example:
			(start code)
			// document.location.href =
			// "http://www.mydomain.com/index.php?message=hello&recipient=world";

			var myObject = _amoeba.deserialize(document.location.href, "query");

			//myObject = {
			//	message: "hello",
			//	recipient: "world"
			//};
			(end)
		*/

		parseQuery: parseQuery,

		/*
		Function: template
			Returns a template string populatedd with the data of the supplied object.

		Arguments:
			template -		(string) A string with tokens.
			object -		(object) An object containing the data needed for populating the template.
			delimiters - 	(array) Optional. An array containing 2 strings that define how tokens are marked up within the supplied template. Defaults are curly braces; { and }.

		Example:
			(start code)
			var myTemplate = "{message}, {recipient}!";

			var myObject = {
				message: "hello",
				recipient: "world"
			};

			var myMessage = _amoeba.template(myTemplate, myObject);

			// myMessage = "hello, world!";
			(end)
		*/

		template: template,

		/*
		Function: create
			Returns a newly created DOM element with the supplied properties from the options object. The created element is appended to the parent element if supplied. If a context is
			The options argument can be omited in favor of the parent argument.

		Arguments:
			tag -		(string) Name of the element.
			options -	(object) Optional. An object containing properties for the element.
			parent -	(element) Optional. An element to which the created element should be appended.
			context -	(string) Optional. A string that specifies the relation to the parent element; "top" - insert as the first element inside parent. "bottom" - insert as the last element inside parent. "before" - insert before parent (outside). "after" - insert after parent (outside). Default is "bottom".

		Example:
			(start code)
			var myElement = _amoeba.create(
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
			(end)
		*/

		create:	create,

		/*
		Function: insert
			Inserts the supplied content into the parent element.

		Arguments:
			content -	(string, number, element, array or htmlcollection) Content to be appended. If an array is supplied it should only consist of strings (text or html), numbers or elements.
			parent -	(element) Element to append the supplied content to.
			context -	(string) Optional. A string that specifies the relation to the parent element; "top" - insert as the first elements inside parent. "bottom" - insert as the last elements inside parent. "before" - insert before parent (outside). "after" - insert after parent (outside). Default is "bottom".

		Example:
			(start code)
			(end)
		*/

		insert: insert,

		/*
		Function: get
			Finds the first element that matches the provided selector. If the parent argument is supplied only elements within that element will be returned.

		Returns:
			An element or false if no matching element is found.

		Arguments:
			selector -	(string) The CSS selector matching the element to be returned. Supported selectors are: type, id, class, child (requires whitespace) and attribute (CSS2: attribute presence and value, CSS3: substring matches) selectors. Multiple class and attribute selectors are supported. Each described node in the selector should have the following required order: type, id, class, attribute, eg. 'input#optIn.required[type="checkbox"]'.
			parent -	(element) Optional. The root element for the search. Default is document.

		Example:
			(start code)
			var body = _amoeba.get("body");

			var firstChild = _amoeba.get("> *");

			var firstUserList = _amoeba.get("body ul.users");

			var checkedRadio = _amoeba.get("input[name="optIn"][type="radio"][checked]");
			(end)
		*/

		get: get,

		/*
		Function: getAll
			Returns an array containing all elements that match the supplied selector. If a parent argument is supplied only elements within that parent element is returned.

		Syntax:
			(start code)
			_amoeba.getAll(selector, parent);
			(end)

		Arguments:
			selector -	(string) .
			parent -	(element) Optional. Element to . Default is document.

		Example:
			(start code)
			var myContent = ["hello,", "<em>world</em>", _amoeba.dom.create("", {})];

			var myQueryString = "message=hello&recipient=world";

			var myObject = _amoeba.toQueryString(myObject);

			//myObject = {
			//	message: "hello",
			//	recipient: "world"
			//};
			(end)
		*/

		getAll: getAll,

		/*
		Function: getChildren
			Returns true or false for whether the supplied selector matches the element.

		Arguments:
			elements -	(array or element) .
			selector -	(string) Element to append the supplied content to.

		Example:
			(start code)
			(end)
		*/

		getChildren: getChildren,

		/*
		Function: getSiblings
			Returns true or false for whether the supplied selector matches the element.

		Arguments:
			elements -	(array or element) .
			selector -	(string) Element to append the supplied content to.

		Example:
			(start code)
			(end)
		*/

		getSiblings: getSiblings,

		/*
		Function: getNext
			Returns true or false for whether the supplied selector matches the element.

		Arguments:
			elements -	(array or element) .
			selector -	(string) Element to append the supplied content to.

		Example:
			(start code)
			(end)
		*/

		getNext: getNext,

		/*
		Function: getPrevious
			Returns true or false for whether the supplied selector matches the element.

		Arguments:
			elements -	(array or element) .
			selector -	(string) Element to append the supplied content to.

		Example:
			(start code)
			(end)
		*/

		getPrevious: getPrevious,

		/*
		Function: contains
			Returns true or false for whether the supplied selector matches the element.

		Arguments:
			elements -	(array or element) .
			selector -	(string) Element to append the supplied content to.

		Example:
			(start code)
			(end)
		*/

		contains: contains,

		/*
		Function: match
			Returns true or false for whether the supplied selector matches the element.

		Arguments:
			elements -	(array or element) .
			selector -	(string) Element to append the supplied content to.

		Example:
			(start code)
			(end)
		*/

		match: match,

		/*
		Function: addClass
			Returns true or false for whether the supplied selector matches the element.

		Arguments:
			elements -	(array or element) .
			selector -	(string) Element to append the supplied content to.

		Example:
			(start code)
			(end)
		*/

		addClass: addClass,

		/*
		Function: removeClass
			Returns true or false for whether the supplied selector matches the element.

		Arguments:
			elements -	(array or element) .
			selector -	(string) Element to append the supplied content to.

		Example:
			(start code)
			(end)
		*/

		removeClass: removeClass,

		/*
		Function: on
			Returns true or false for whether the supplied selector matches the element.

		Arguments:
			elements -	(array or element) .
			selector -	(string) Element to append the supplied content to.

		Example:
			(start code)
			(end)
		*/

		on: on,

		/*
		Function: off
			Returns true or false for whether the supplied selector matches the element.

		Arguments:
			elements -	(array or element) .
			selector -	(string) Element to append the supplied content to.

		Example:
			(start code)
			(end)
		*/

		off: off

	});

	wrapper.prototype = {

		insert: function (content, context) {
			insert(content, this.element, context);
			return this;
		},

		get: function (selector) {
			return get(selector, this.element);
		},

		getAll: function (selector) {
			return getAll(selector, this.element);
		},

		getChildren: function (selector, wrapped) {
			return getChildren(this.element, selector, wrapped);
		},

		getSiblings: function (selector, wrapped) {
			return getSiblings(this.element, selector, wrapped);
		},

		getNext: function (selector, wrapped) {
			return getNext(this.element, selector, wrapped);
		},

		getPrevious: function (selector, wrapped) {
			return getPrevious(this.element, selector, wrapped);
		},

		contains: function (element) {
			return contains(this.element, element);
		},

		match: function (selector) {
			return match(this.element, selector);
		},

		addClass: function (className) {
			addClass(this.element, className);
			return this;
		},

		removeClass: function (className) {
			removeClass(this.element, className);
			return this;
		},

		on: function (event, func) {
			on(event, this.element, func);
			return this;
		},

		off: function (event, func) {
			off(event, this.element, func);
			return this;
		}

	};


}(this, document));