!function (window, document) {

	var _undefined,

	_true =				true,
	_false =			false,
	_null =				null,

	//_Boolean =			'Boolean',
	_Number =			'Number',
	_String =			'String',
	_Array =			'Array',
	_Object =			'Object',
	_Function =			'Function',
	//_RegExp =			'RegExp',
	//_Date =			'Date',
	//_Math =			'Math',
	//_Location =		'Location',
	_Element =			'Element',
	_NodeList =			'NodeList',
	_HTMLCollection =	'HTMLCollection',
	
	amoeba = function (element) {
		return new wrapper(element); 
	},
	
	load = function (url, func) {
		var options = {src: url};
		return create('script',
			(type(func)===_Function) ?
			extend(options, {
				onload: func,
				onreadystatechange: function () { 
					if (this.readyState === 'loaded') {
						func();
					}
				}
			}) : options, document.body);
	},
	
	request = function (url, func, data, mode, async) {
		var x = new XMLHttpRequest;
		mode = mode || 'get';
		async = (async===_undefined) ? _true : async;
		data = serialize(data, 'query');
		if (data && mode==='get') {
			url += '?' + data;
			data = _null;
		}
		x.open(mode, url, async);
		x.onreadystatechange = function () {
			if (x.readyState===4) func(x);
		};
		x.send(data);
		return x;
	},

	type = function (subject) {
		var type;
		switch (subject) {
		
			case null:
				type = _Object;
				break;
				
			case undefined:
				type = _undefined + "";
				break;
				
			default:
				type = Object.prototype.toString.call(subject).slice(8, -1);
				if (type.indexOf(_Element)>-1) {	
					type = _Element;
				}
				break;
				
		}
		return type;
	},

	iterate = function (subject, func, bind) {
		var key,
			i;
			
		switch (type(subject)) {
			
			case _Number:
				for (i=0; i<subject; i++) {
					func.call(bind || subject, i, i);
				}
				break;
			
			case _String:
			case _Array:
			case _NodeList:
			case _HTMLCollection:
				for (i=0; i<subject.length; i++) {
					func.call(bind || subject, subject[i], i);
				}
				break;
			
			case _Object:
				for (key in subject) {
					if (subject.hasOwnProperty(key)) {
						func.call(bind || subject, subject[key], key);
					}
				}
				break;
			
		}
		return subject;
	},

	// object
	
	extend = function (subject, properties) {
		iterate(properties, function (value, key) {
			var _type = type(value);
			if (_type===_Array || _type===_Object) {
				if (!subject[key]) {
					subject[key] = {};
				}
				extend(subject[key], value);
			}
			else {
				subject[key] = value;
			}
		});
		return subject;
	},
	
	serializers = {
		html: [
			function(subject){
				return ('XMLSerializer' in window) ? (new XMLSerializer()).serializeToString(subject) : subject.outerHTML;
			},
			function(subject){
				return '';
			}
		],
		query: [
			function(subject){
				var string = [], urlEncode = encodeURIComponent;
				iterate(subject, function (value, key) {
					string.push(
						urlEncode(key) + '=' + urlEncode(value)
					);
				});
				return string.join('&');
			},
			function(subject){
				subject = subject.replace(/(^.*\?)|(#.*$)/g, '');
				var _return = {}, urlDecode = decodeURIComponent;
				iterate(subject.split('&'), function (pair) {
					pair = pair.split('=');
					_return[urlDecode(pair[0])] = urlDecode(pair[1]);
				});
				return _return;
			}
		]
	},
	
	serialize = function (subject, context) {
		return (context in serializers) ? serializers[context][0](subject) : _false;
	},

	// array
	
	getIndex = function (array, value, offset) {
		var length = array.length >>> 0,
			offset = Number(offset) || 0;
		offset = (offset < 0) ? Math.ceil(offset) : Math.floor(offset);
		if (offset < 0) {
			offset += length;
		}
		for (; offset < length; offset++) {
			if (offset in array && array[offset] === value) {
				return offset;
			}
		}
		return -1;
	},

	// string
	
	deserialize = function (subject, context) {
		return (context in serializers) ? serializers[context][1](subject) : _false;
	},
	
	populate = function (template, object, delimiters) {
		var string = template;
		delimiters = delimiters || ['{', '}'];
		iterate(object, function (value, key) {
			string = string.replace(delimiters[0] + key + delimiters[1], value);
		});
		return string;
	},

	// dom
	
	wrapper = function (element) {
		this.el = element || _null;
	},
	
	create = function (tag, options, parent, context) {
		if (options && options.nodeType) {
			context = parent || _null;
			parent = options;
			options = _null;
		}
		var element = document.createElement(tag);
		if (options) {
			extend(element, options);
		}
		if (parent) {
			insertSingle(element, parent, context);
		}
		return element;
	},
	
	insertSingle = function (element, parent, context) {
		parent = parent || document.body;
		if (context===_undefined) {
			context = 'bottom';
		}
		var rel,
			children;
			
		switch (context) {
				
			case 'top':
				children = getChildren(parent);
				rel = children && children[0] || _false;
				break;
			
			case 'bottom':
				break;
			
			case 'before':
				rel = parent;
				parent = parent.parentNode;
				break;
				
			case 'after':
				rel = getSiblings('next', parent, _null, _true);
				parent = (!rel) ? parent : parent.parentNode;
				break;
				
			default:
				if (context && 'toFixed' in context) {
					children = getChildren(parent);
					if (context<0) {
						context += children.length;
					}
					if (children.length>context) {
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
		var _type = type(contents),
			i,
			content;
		if (_type===_String || _type===_Element) { 
			contents = [contents];
		}
		for (i=0; i<contents.length; i++) {
			content = contents[i];
			insertSingle(
				content.nodeName ? content : document.createTextNode(content),
				parent,
				context
			);
		}
	},
	
	cssSplit = function (selector) {
		return /^([^#\.\[]+)?(?:#([^\.\[]+))?(?:\.([^#\[]+))?((?:\[[^\]]+\])+)?$/.exec(selector).slice(1);
	},

	getNode = function (selector, parent) {
		parent = parent || document;
		
		var elements = [],
			element,
			nodes,
			values,
			i;
			
		if (selector[1]) {
			element = document.getElementById(selector[1]);
			if (!element) {
				return [];
			}
			if (!selector[0] || selector[0]==='*' || selector[0]===element.nodeName.toLowerCase()) {
			 	if (contains(parent, element)) {
			 		elements.push(element);
			 	}
			}
		}
		else {
			nodes = parent.getElementsByTagName(selector[0] || '*');
			for (i=0; i<nodes.length; i++) {
				elements.push(nodes[i]);
			}
		}
		
		values = match(elements, selector);
		i = elements.length;
			
		while (i--) {
			if (!values[i]) {
				elements.splice(i, 1);
			}
		}
		
		return elements;
	},
	
	traverse = function (context, start, element, selector, first) {

		var next = element[start || context],
			elements = [],
			index = 0;
		
		while (next) {
			if (next.nodeType===1) {
				if (!selector || (selector && match(next, selector))) {
					elements.push(next);
				}
				if (first && index===0) {
					break;
				}
				index++;
			}
			next = next[context];
		}
		return elements;
	},
	
	getSiblings = function (context, element, selector, first) {
		return traverse(context + 'Sibling', '', element, selector || _null, first || _null);
	},
	
	getChildren = function (element, selector, first) {
		return traverse('nextSibling', 'firstChild', element, selector || _null, first || _null);
	},
	
	getAncestor = function (element, selector, first) {
		return traverse('parentNode', '', element, selector || _null, first || _null);
	},
	
	get = function (selector, parent, wrapped) {
		var id = /^#([^ .]+)$/.exec(selector),
			elements,
			element;
			
		if (parent===_true) {
			wrapped = parent;
			parent = _null;
		}
		
		parent = parent || document;
		if (id) {
			element = document.getElementById(id[1]);
			return (element && (parent===document || contains(parent, element))) ? (wrapped ? amoeba(element) : element) : _false;
		}
		var elements = getAll(selector, parent);
		return elements && (wrapped ? amoeba(elements[0]) : elements[0]) || _false;
	},
	
	getAll = function (selector, parent, wrapped) {
		var elements,
			nodeSelectors = selector.split(' '),
			length = nodeSelectors.length,
			nodeSelector,
			i=0, j=0, l,
			element,
			els,
			related,
			prev,
			first,
			reg = /^[><\^\+\~\-_]$/;
			
		if (parent===_true) {
			wrapped = parent;
			parent = _null;
		}
			
		elements = [parent || document];
		
		for (i=0; i<length; i++) {
			nodeSelector = nodeSelectors[i];
			if (!nodeSelector.match(reg)) {
				els = [];
				l = elements.length;
				nodeSelector = cssSplit(nodeSelector);
				for (j=0; j<l; j++) {
					element = elements[j];
					prev = i>0 && nodeSelectors[i-1] || _false;
					first = _false;
					switch (prev) {
					
						// children
						case '>':
							related = getChildren(element, nodeSelector, first);
							break;
						
						// parent. non-standard
						case '<':
							first = _true;
							
						// ancestors. non-standard
						case '^':
							related = getAncestor(element, nodeSelector, first);
							break;
						
						// immediate succeeding sibling
						case '+':
							first = _true;
							
						// succeeding siblings
						case '~':
							related = getSiblings('next', element, nodeSelector, first);
							break;
						
						// immediate preceding sibling. non-standard
						case '-':
							first = _true;
						
						// preceding siblings. non-standard
						case '_':
							related = getSiblings('previous', element, nodeSelector, first);
							break;
						
						// any descendants
						default:
							related = getNode(nodeSelector, element);
							break;
							
					}
					if (related.length) {
						els = els.concat(related);
					}
				}
				elements = els;
				
				if (i!==0 && !(i===1 && prev && prev.match(reg))) {
					j = elements.length;
					while (j--) {
						if (getIndex(elements, elements[j])<j) {
							elements.splice(j, 1);
						}
					}
				}
					
			}
		}
		
		if (wrapped) {
			length = elements.length;
			for (i=0; i<length; i++) {
				elements[i] = amoeba(elements[i]);
			}
		}
		
		return elements;
	},
	
	/*
	
		http://www.quirksmode.org/blog/archives/2006/01/contains_for_mo.html
	
	*/
	
	contains = (window.Node && Node.prototype && !Node.prototype.contains) ?
			function(parent, element){ return !!(parent.compareDocumentPosition(element) & 16); } :
 			function(parent, element){ return parent.contains(element); },
	
	attributeMatch = function (elements, attributes) {
		var j = attributes.length,
			attribute,
			matches = [],
			m,
			name,
			i,
			operator,
			value,
			actualValue;
			
		while (j--) {
			attribute = attributes[j].match(/^([a-zA-Z0-9_-]*[^~|^$*!=])(?:([~|^$*!]?)=['"]?([^'"]*)['"]?)?$/);
			attribute.shift();
			name = attribute[0];
			i = elements.length;
			operator = attribute[1];
			value = attribute[2];
			while (i--) {
				actualValue = elements[i].getAttribute(name);
				m = matches[i]!==_false;
				if (actualValue!==_null && m) {
				 	if (value) {
						switch (operator) {
						
							case '~':
								m = (getIndex(actualValue.split(' '), value)>-1);
								break;
						
							case '|':
								m = (actualValue===value || actualValue.indexOf(value + '-')===0);
								break;
							
							case '^':
								m = (actualValue.indexOf(value)===0);
								break;
							
							case '$':
								m = (actualValue.indexOf(value)===actualValue.length - value.length);
								break;
							
							case '*':
								m = (actualValue.indexOf(value)>-1);
								break;
							
							case '!':
								m = (actualValue!==value);
								break;
								
							default:
								m = (actualValue===value);
								break;
								
						}
					}
				}
				else if (m) {
					m = _false;
				}
				if (!m) {
					matches[i] = m;
				}
			}
		}
		
		return matches;
	},
	
	match = function (elements, selector) {
		var single = ('nodeType' in elements),
			values = [],
			i,
			attributes;
		
		if (single) {
			if ('nodeType' in selector) {
				return (elements==selector);
			}
			elements = [elements];
		}
		
		if ('charAt' in selector) {
			selector = cssSplit(selector);
		}
		
		attributes = selector[3] ? selector[3].slice(1, -1).split('][') : [];
		
		i = elements.length;
		
		if (selector[1]) {
			attributes.unshift('id="' + selector[1] + '"');
		}
		if (selector[2]) {
			attributes.unshift('class~="' + selector[2] + '"');
		}
	
		if (attributes.length) {
			values = attributeMatch(elements, attributes);
		}
		
		while (i--) {
			if (values[i]!==_false && (selector[0] && (selector[0]!=='*' && selector[0]!==elements[i].nodeName.toLowerCase()))) {
				values[i] = _false;
			}
			else if (values[i]===_undefined) {
				values[i] = _true;
			}
		}
		
		return (single) ? values[0] : values;
	},
	
	hasClass = function (element, className) {
		return getIndex(element.className.split(' '), className) > -1;
	},
	
	addClass = function (element, className) {
		if (!hasClass(element, className)) {
			if (element.className.length) {
				className = ' ' + className; 
			}
			element.className += className;
		}
	},
	
	removeClass = function (element, className) {
		element.className = element.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)'), '$1');
	},
	
	getValue = function (element) {
		var value;
		switch (element.nodeName) {
			case "select":
				value = element.options[element.selectedIndex].value;
				
			case "input":
				switch (element.type) {
					case "checkbox":
					case "radio":
						if (element.checked) {
							value = element.value;
						}
				}
			
			default:
				value = element.value;
		}
		
		return value;
	},
	
	setValue = function (element, value) {
		switch (element.nodeName) {
			case "select":
				var option = get('option[value=' + value + ']', element);
				if (option) {
					option.selected = selected;
				}
				
			case "input":
				switch (element.type) {
					case "checkbox":
					case "radio":
						if (element.value==value) {
							element.checked = "checked";
						}
						return;
				}
			
			default:
				element.value = value;
				break;
		}
	},
	
	addEvent = (window.addEventListener) ? function (element, event, func) {
		element.addEventListener(event, func, _false);
	} : (window.attachEvent) ? function (element, event, func) {
		element.attachEvent('on' + event, func);
	} : function (element, event, func) {
		element['on' + event] = func;
	},
	
	removeEvent = (window.removeEventListener) ? function (element, event, func) {
		element.removeEventListener(event, func, _false);   
	} : (window.detachEvent) ? function (element, event, func) {
		element.detachEvent('on' + event, func);  
	} : function (element, event, func) {
		element['on' + event] = _null;
	},
	
	scripts = getAll('head script'),
	namespace = scripts[scripts.length-1].src.replace(/^[^?]+\??/, '') || '_amoeba';

	this[namespace] = extend(amoeba, {
		
		/*
		Function: load
			Loads a script onto the page and optionally executes a callback function on load.
			
		Arguments:
			url -	(string) The url of the script to be loaded.
			func -	(function) Optional. A function that is called when the script has loaded.
		
		Returns:
			
			
		Example:
			(start code)
			
			_amoeba.load('http://amoeba-js.net/js', function(){
				alert('script loaded');
			});
			
			(end)
		*/
		
		load: load,
		
		/*
		Function: request
			.
			
		Arguments:
			url -	(string) The url of the script to be loaded.
			func -	(function) A function that is called when the script has loaded.
			data -	(object) Optional. An object containing the key-value pairs sent with the request.
			mode -	(string) Optional. The mode of the request; "get" or "post". Default is "get".
			async -	(boolean) Optional. A boolean to set asynchronous mode on or off. Default is true.
		
		Returns:
			
			
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
			A string: "Boolean", "Number", "String", "Array", "Object", "Function", "RegExp", "Date", "Math", "Location", "Element", "NodeList" or "HTMLCollection".
			
		Example:
			(start code)
			var myVariable = ["hello", "world"];
			
			var myType = _amoeba.type(myVariable);
			
			//myType = "Array"
			(end)
		
		Credits:
			Kangax
		
		*/
	
		type: type,
		
		/*
		Function: iterate
			Iterates through the supplied subject and calls the callback function on each step.
		
		Arguments:
			subject -	(number, string, array, object or htmlcollection) Variable to iterate through. If a number is supplied the callback function is called that number of times. 
			func -		(function) Callback function to call every iteration step.
			bind -		(object) Optional. Variable to bind the this keyword to inside the callback function.
		
		Example:
			(start code)
			var recipients = ["world", "steve", "dave"];
			
			amoeba.iterate(recipients, function (recipient, i) {
				alert("Hello, " + recipient + ". You are number " + i);
			});
			
			// alerts:
			// "Hello, world. You are number 0"
			// "Hello, steve. You are number 1"
			// "Hello, dave. You are number 2"
			(end)
			
		*/
		
		iterate: iterate,
	
		
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
		
		Function: serialize
			Returns a serialized string built from the supplied object.
		
		Arguments:
			subject -		(object) Object to transform into a serialized string. 
		
		Example:
			(start code)
			var myObject = {
				message: "hello",
				recipient: "world"
			};
			
			var myQueryString = _amoeba.serialize(myObject, 'query');
			
			// myQueryString = "message=hello&recipient=world";
			(end)
		*/
	
		serialize: serialize, 
		
		/*
		Function: deserialize
			Returns an object containing the querystring data contained in the supplied serialized string.
		
		Arguments:
			string -		(string) The serialized string to be transformed.
			context -		(string) The serialized string to be transformed.
		
		Example:
			(start code)
			// document.location.href = 
			// 'http://www.mydomain.com/index.php?message=hello&recipient=world';
			
			var myObject = _amoeba.deserialize(document.location.href, 'query');
			
			//myObject = {
			//	message: "hello",
			//	recipient: "world"
			//};
			(end)
		*/
		
		deserialize: deserialize,
	
		/*
		Function: populate
			Returns a template string populated with the data of the supplied object.
		
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
			
			var myMessage = _amoeba.populate(myTemplate, myObject);
			
			// myMessage = "hello, world!";
			(end)
		*/
	
		populate: populate,
		
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
			var body = _amoeba.get('body');
			
			var firstChild = _amoeba.get('> *');
			
			var firstUserList = _amoeba.get('body ul.users');
			
			var checkedRadio = _amoeba.get('input[name="optIn"][type="radio"][checked]');
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
		Function: hasClass
			Returns true or false for whether the supplied selector matches the element. 
		
		Arguments:
			elements -	(array or element) . 
			selector -	(string) Element to append the supplied content to.
		
		Example:
			(start code)
			(end)
		*/
		
		hasClass: hasClass,
		
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
		Function: getValue
			Returns true or false for whether the supplied selector matches the element. 
		
		Arguments:
			elements -	(array or element) . 
			selector -	(string) Element to append the supplied content to.
		
		Example:
			(start code)
			(end)
		*/
		
		getValue: getValue,
		
		/*
		Function: setValue
			Returns true or false for whether the supplied selector matches the element. 
		
		Arguments:
			elements -	(array or element) . 
			selector -	(string) Element to append the supplied content to.
		
		Example:
			(start code)
			(end)
		*/
		
		setValue: setValue,
		
		/*
		Function: addEvent
			Returns true or false for whether the supplied selector matches the element. 
		
		Arguments:
			elements -	(array or element) . 
			selector -	(string) Element to append the supplied content to.
		
		Example:
			(start code)
			(end)
		*/
		
		addEvent: addEvent,
		
		/*
		Function: removeEvent
			Returns true or false for whether the supplied selector matches the element. 
		
		Arguments:
			elements -	(array or element) . 
			selector -	(string) Element to append the supplied content to.
		
		Example:
			(start code)
			(end)
		*/
		
		removeEvent: removeEvent
		
	});
	
	extend(wrapper.prototype, {
	
		insert: function (content, context) {
			insert(content, this.el, context);
			return this;
		},
		
		get: function (selector) {
			return get(selector, this.el);
		},
		
		getAll: function (selector) {
			return getAll(selector, this.el);
		},
		
		contains: function (element) {
			return contains(this.el, element);
		},
		
		match: function (selector) {
			return match(this.el, selector);
		},
	
		hasClass: function (className) {
			return hasClass(this.el, className);
		},
		
		addClass: function (className) {
			addClass(this.el, className);
			return this;
		},
		
		removeClass: function (className) {
			removeClass(this.el, className);
			return this;
		},
		
		getValue: function () {
			return getValue(this.el);
		},
		
		setValue: function (value) {
			setValue(this.el, value);
			return this;
		},
		
		addEvent: function (event, func) {
			addEvent(this.el, event, func);
			return this;
		},
		
		removeEvent: function (event, func) {
			removeEvent(this.el, event, func);
			return this;
		}
		
	});


}(this, document);