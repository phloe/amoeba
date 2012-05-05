(function ( global, document ) {

	var type = function ( subject ) {
		var type;
		
		switch ( subject ) {

			case null:
				type = "object";
				break;

			case undefined:
				type = undefined + "";
				break;

			default:
				type = ({}).toString.call(subject).slice( 8, -1 ).toLowerCase();
				if ( type.indexOf("element") > -1 ) {
					type = "element";
				}
				break;

		}
		
		return type;
	},

	each = function ( subject, func, bind ) {
		var key, i, length;

		switch ( type(subject) ) {

			case "number":
				for ( i = 0; i < subject; i++ ) {
					func.call( bind || subject, i, i );
				}
				break;

			case "string":
				subject = subject.split( "" );
			case "array":
			case "nodelist":
			case "htmlcollection":
				length = subject.length;
				for ( i = 0; i < length; i++ ) {
					func.call( bind || subject, subject[ i ], i );
				}
				break;

			case "object":
				for ( key in subject ) {
					if ( subject.hasOwnProperty(key) ) {
						func.call( bind || subject, subject[ key ], key );
					}
				}
				break;

		}
		
		return subject;
	},

	// Object
	
	extend = function ( subject, properties ) {
		each(properties, function ( value, key ) {
			var valueType = type( value );
			if ( valueType === "array" || valueType === "object" ) {
				if ( !(key in subject) ) {
					subject[ key ] = ( valueType === "array" ) ? [] : {};
				}
				extend( subject[ key ], value );
			}
			else {
				subject[ key ] = value;
			}
		});
		
		return subject;
	},

	toQuery = function ( subject ) {
		var string = [],
			urlEncode = encodeURIComponent;
		
		each( subject, function ( value, key ) {
			string.push(
				urlEncode( key ) + "=" + urlEncode( value )
			);
		});
		
		return string.join( "&" );
	},

	// String

	parseQuery = function ( subject ) {
		var object = {},
			urlDecode = decodeURIComponent;
		
		each( subject.replace( /(^[^?]*\?)|(#[^#]*$)/g, "" ).split( "&" ), function ( pair ) {
			pair = pair.split("=");
			object[ urlDecode( pair[ 0 ] ) ] = ( pair[ 1 ] ) ? urlDecode( pair[ 1 ] ) : null;
		});
		
		return object;
	},

	template = function ( template, object, delimiters ) {
		var string = template.slice();
		
		delimiters = delimiters || [ "{", "}" ];
		
		each( object, function ( value, key ) {
			string = string.replace( delimiters[ 0 ] + key + delimiters[ 1 ], value );
		});
		
		return string;
	},

	// DOM

	wrapper = function ( element ) {
		this.el = element || null;
		
		return this;
	},

	create = function ( tag, options, parent, context ) {
		var element = document.createElement( tag );
		
		if ( type( options ) === "element" ) {
			context = parent || null;
			parent = options;
			options = null;
		}
		
		if ( options ) {
			extend( element, options );
		}
		
		if ( parent ) {
			insert( parent, element, context );
		}
		
		return new wrapper( element );
	},

	insert = function ( parent, element, context ) {
		
		if ( context === undefined ) {
			context = "bottom";
		}
		
		var rel, children;

		switch ( context ) {

			case "top":
				children = getChildren(parent);
				rel = ( children ) ? children[ 0 ] : false;
				break;

			case "bottom":
				break;

			case "before":
				rel = parent;
				parent = parent.parentNode;
				break;

			case "after":
				rel = getNext( parent );
				parent = ( !rel ) ? parent : parent.parentNode;
				break;

			default:
				if ( type( context ) === "number" ) {
					children = getChildren(parent);
					if ( context < 0 ) {
						context += children.length;
					}
					if ( children.length > context ) {
						rel = children[ context + 1 ];
					}
				}
				break;

		}
		if ( rel ) {
			parent.insertBefore( element, rel );
		}
		else {
			parent.appendChild( element );
		}
	},

	/*

	remove: function () {},

	erase: function () {},

	*/

	get = function ( selector, parent ) {
		if ( typeof selector !== "string" ) {
			return new wrapper( selector );
		}

		var element = ( parent || document ).querySelector( selector );

		return ( element ) ? new wrapper( element ) : element;
	},

	getAll = function ( selector, parent ) {
		var node,
			nodelist = ( parent || document ).querySelectorAll( selector ),
			i = nodelist.length,
			elements = [];

		while ( i-- ) {
			elements[ i ] = new wrapper( nodelist[ i ] );
		}

		return elements;
	},

	getChildren = function ( element, selector ) {
		var i, l,
			children = element.childNodes,
			length = children.length,
			elements = [];

		for ( i = 0; i < length; i++ ) {
			element = children[i];
			if ( element.nodeType === 1 && match( element, selector ) ) {
				elements.push( element );
			}
		}

		return elements;

	},

	getSiblings = function ( element, selector ) {
		var elements = getChildren( element.parentNode, selector ),
			index = elements.indexOf( element );
		
		elements.splice( index, 1 );
			
		return elements;
	},

	getNext = function( element, selector ) {
		element = element.nextSibling;

		while ( element ) {
			if ( element.nodeType === 1 ) {
				if ( match( element, selector ) ) {
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

	getPrevious = function( element, selector ) {
		element = element.previousSibling;

		while ( element ) {
			if ( element.nodeType === 1 ) {
				if ( match( element, selector ) ) {
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
	
	api = {
	
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
		
		load: function ( url, callback ) {
			var script = create( "script", document.body ),
				element = script.el;
				
			if ( callback ) {
				element.onload = callback;
			}
			
			element.src = url;
			
			return script;
		},

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
		
		request: function ( url, callback, data, mode, async ) {
			var xhr = new XMLHttpRequest();
			
			mode = mode || "GET";
			async = ( async === undefined ) ? true : async;
			
			if ( data ) {
				data = toQuery( data );
				if ( mode === "GET" ) {
					url += "?" + data;
					data = null;
				}
			}
			
			xhr.open( mode, url, async );
			
			if ( mode === "POST" ) {
				xhr.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );
			}
			
			if ( callback ) {
				xhr.onload = function () {
					callback( xhr.responseText, xhr.responseXML );
				};
			}
			
			xhr.send( data );
			
			return xhr;
		},

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
		
		create: create
		
	};

	wrapper.prototype = {

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

		insert: function ( contents, context ) {
			var i, content, length,
				contentType = type( contents );
			
			if ( contentType === "string" || contentType === "element" ) {
				contents = [ contents ];
			}
			
			length = contents.length;
			
			for ( i = 0; i < length; i++ ) {
				content = contents[ i ];
				insert(
					this.el,
					( content.nodeName ) ? content : document.createTextNode( content ),
					context
				);
			}
		
			return this;
		},

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

		get: function ( selector ) {
			return get( selector, this.el );
			
		},

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

		getAll: function ( selector ) {
			return getAll( selector, this.el );
		},

		/*
		Function: children
		*/

		children: function ( selector ) {
			var i,
				elements = getChildren( this.el, selector ),
				length = elements.length;
				
			for ( i = 0; i < length; i++ ) {
				elements[ i ] = new wrapper( elements [ i ] );
			}
			
			return elements;
		},

		/*
		Function: siblings
		*/

		siblings: function ( selector ) {
			var i,
				elements = getSiblings( this.el, selector ),
				length = elements.length;
				
			for ( i = 0; i < length; i++ ) {
				elements[ i ] = new wrapper( elements [ i ] );
			}
			
			return elements;
		},

		/*
		Function: next
		*/

		next: function ( selector ) {
			var element = getNext( this.el, selector );
			
			return ( element ) ? new wrapper( element ) : element;
		},

		/*
		Function: prev
		*/

		prev: function ( selector ) {
			var element = getPrevious( this.el, selector );
			return ( element ) ? new wrapper( element ) : element;
		},

		/*
		Function: contains
		*/
	
		/*
	
			http://www.quirksmode.org/blog/archives/2006/01/contains_for_mo.html
	
		*/
	
		contains = ( global.Node && Node.prototype && Node.prototype.compareDocumentPosition ) ?
				function ( child ) { return !!(this.el.compareDocumentPosition( child.el ) & 16); } :
	 			function ( child ) { return this.el.contains( child.el ); },

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

		match: function ( selector ) {
			return matchesSelector.call( this.el, selector );
		},

		/*
		Function: addClass
		*/

		addClass: function ( className ) {
			var element = this.el,
				classList = element.className.split( /\s+/ ),
				index = classList.indexOf( className );
			
			if ( index === -1 ) {
				classList.push( className );
				element.className = classList.join( " " );
			}
			
			return this;
		},

		/*
		Function: removeClass
		*/

		removeClass: function ( className ) {
			var element = this.el,
				classList = element.className.split( /\s+/ ),
				index = classList.indexOf( className );
			
			if ( index > -1 ) {
				classList.splice( index, 1 );
				element.className = classList.join( " " );
			}
			
			return this;
		},

		/*
		Function: on
		*/

		on: function ( event, func ) {
			this.el.addEventListener( event, func, false );
			
			return this;
		},

		/*
		Function: off
		*/

		off: function ( event, func ) {
			this.el.removeEventListener( event, func, false );
			
			return this;
		}

	};

	global._amoeba = function ( callback ) {
		callback( get, getAll, api );
	};

} ( this, document ));