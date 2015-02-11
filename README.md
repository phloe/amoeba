![Amoeba micro API](http://amoeba-js.net/img/type.svg)

Micro API designed for use in bootstrap bookmarklets.

Amoeba was made from the following assumptions:

1. Smaller size is more important than features; existing libraries are too big and may also collide with other scripts.

2. Only modern browsers (IE9+) need to be supported; users are expected to be intermediate to advanced users.

It currently weighs in at just 2.1Kb minified and gzipped.



## _amoeba

Exposes the internal `$` (get) and `$$` (getAll) functions and `_` (util) namespace.
References are passed into the callback function as arguments (so you could call them whatever you like).

	_amoeba(function($, $$, _){
		var page = $("#page");
		if (page.match(".active")) {
			var divs = page.getAll("div");
		}
	});


## $ (get)

Finds an element matching the supplied selector or wraps an existing element.

###### Arguments

* `selector` (String or Element) The CSS selector matching the element you want - or an existing element.
* `parent` (Element) Optional. Root element for the search.

###### Returns

(Wrapper or null) An instance of Wrapper or null.


## $$ (getAll)

Returns an array of elements that match the supplied selector.

###### Arguments

* `selector` (String) The CSS selector matching the elements you want.
* `parent` (Element) Optional. Root element for the search.

###### Returns

(Array) An array containing elements.


## _ (util)

Holds the methods for the main API.


### load

Loads a script onto the page and optionally executes a callback function on load.

###### Arguments

* `url` (String) The url of the script to be loaded.
* `func` (Function) Optional. A function that is called when the script has loaded.

###### Returns

(Element) A script element.

###### Example

	_.load("http://amoeba-js.net/js", function(){
		alert("script loaded");
	});


### request

Creates and sends an XMLHttpRequest.

###### Arguments

* `url` (String) The url of the script to be loaded.
* `func` (Function) A function that is called with the XMLHttpRequest object as an argument when the script has loaded.
* `options` (Object) Optional.
   * `data` (Object) Optional. An object containing the key-value pairs sent with the request.
   * `method` (String) Optional. The mode of the request; "get" or "post". Default is "get".	
   * `async` (Boolean) Optional. A boolean to set asynchronous mode on or off. Default is true.
   * `headers` (Object) Optional. An Object containing additional headers.

###### Returns

(XMLHttpRequest) An XMLHttpRequest object.

###### Example

	_.request(
		"/api/data.json",
		function (data) {
			data = JSON.parse(data);
			console.log(data);
		},
		{
			id: "0123456789"
		},
		"GET"
	);


### type

Identifies the type of the supplied variable.

###### Arguments

* `subject` (mixed) The variable whose type is to be identified.

###### Returns

(String) A string: "boolean", "number", "string", "array", "object", "function", "regexp", "date", "math", "location", "element", "nodelist", "htmlcollection" or "undefined".

###### Example

	var myVariable = ["hello", "world"];
	var myType = _.type(myVariable);
	//myType == "array"

Credits: Kangax



### extend

Extends (or overwrite) a given object with the properties of the supplied object properties recursively.

###### Arguments

* `subject` (Object) Object to extend.
* `properties` (Object) Object containing properties to extend with.

###### Example

	var myObject = {
		message: "hello",
		recipient: "steve"
	};
	_.extend(myObject, {recipient: "world"});
	// myObject = {
	//	message: "hello",
	//	recipient: "world"
	//};


### toQuery

Returns a querystring built from the supplied object.

###### Arguments

* `subject` (Object) Object to transform into a querystring.

###### Example

	var myObject = {
		message: "hello",
		recipient: "world"
	};
	var myQueryString = _.toQuery(myObject);
	// myQueryString = "message=hello&recipient=world";



### parseQuery

Returns an object containing the querystring data contained in the supplied string.

###### Arguments

* `string` (String) The string to be transformed.

###### Example

	// window.location.href =
	// "http://www.mydomain.com/index.php?message=hello&recipient=world";
	var myObject = _.parseQuery(window.location.href);
	//myObject = {
	//	message: "hello",
	//	recipient: "world"
	//};



### template

Returns a template string populated with the data of the supplied object.

###### Arguments

* `template` (String) A string with tokens.
* `object` (Object) An object containing the data needed for populating the template.
* `delimiters` (Array) Optional. An array containing 2 strings that define how tokens are marked up within the supplied template. Defaults are curly braces; { and }.

###### Example

	var myTemplate = "{message}, {recipient}!";
	var myObject = {
		message: "hello",
		recipient: "world"
	};
	var myMessage = _.template(myTemplate, myObject);
	// myMessage = "hello, world!";



### create

Returns a newly created DOM element with the supplied properties from the options object. The created element is appended to the parent element if supplied. If a context is
The options argument can be omitted in favour of the parent argument.

###### Arguments

* `tag` (String) Name of the element.
* `options` (Object) Optional. An object containing properties for the element.
* `parent` (Element) Optional. An element to which the created element should be appended.
* `context` (String) Optional. A string that specifies the relation to the parent element; "top" - insert as the first element inside parent. "bottom" - insert as the last element inside parent. "before" - insert before parent (outside). "after" - insert after parent (outside). Default is "bottom".

###### Returns

(Wrapper) A wrapped element.

###### Example

	var myElement = _.create(
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


## Wrapper


### insert

Inserts the supplied content into the wrapped element.

###### Arguments

* `content` (String, Number, Element, Array or HtmlCollection) Content to be appended. If an array is supplied it should only consist of strings (text or html), numbers or elements.
* `context` (String or Number) Optional. A string or number that specifies the relation to the parent element;
   * `"top"` - insert as the first elements inside parent.
   * `"bottom"` - insert as the last elements inside parent.
   * `"before"` - insert before parent (outside).
   * `"after"` - insert after parent (outside).
   * a number - corresponds to the index of the childnodes where content will be inserted. Negative numbers have their index calculated in reverse.
Default is `"bottom"`.

###### Returns

(Wrapper) The wrapped element.


### remove 

Remove the element from the DOM.

###### Returns

(Wrapper) The wrapped element.


### get

Finds the first element that matches the provided selector.

###### Arguments

* `selector` (String) The CSS selector matching the element to be returned.

###### Returns

(Wrapper|Null) An element or null if no matching element is found.

###### Example

	var body = $("body");
	var firstUserItem = body.get("ul.users li");
	var checkedRadio = body.get("input[name='optIn'][type='radio'][checked]");


### getAll

Returns an array containing all elements that match the supplied selector.

###### Arguments

* `selector` (String) See {@link Wapper.get}

###### Returns

(Array)

###### Example

	var body = $("body");
	var userItems = body.getAll("ul.users li");


### children

Returns an array of child elements. If the selector argument is supplied only the elements matching it will be returned.

###### Arguments

* `selector` (String) See Wapper.get.

###### Returns

(Array)

###### Example

	var ul = $("ul");
	var activeUserItems = ul.children(".active");


### siblings

Returns an array of sibling elements. If the selector argument is supplied only the elements matching it will be returned.

###### Arguments

* `selector` (String) See Wapper.get.

###### Returns

(Array)

###### Example

	var firstDiv = $("body div");
	var otherDivs = firstDiv.siblings("div");


### next

Returns the next sibling element. If the selector argument is supplied the first matching sibling element proceeding it will be returned.

###### Arguments

* `selector` (String) See Wapper.get.

###### Returns

(Wrapper|Null)

###### Example

	var firstDiv = $("body div");
	var nextDiv = firstDiv.next("div");


### prev

Returns the previous sibling element. If the selector argument is supplied the first matching sibling element preceding it will be returned.

###### Arguments

* `selector` (String) See Wapper.get.

###### Returns

(Wrapper|Null)

###### Example

	var lastDiv = $$("body div")[0];
	var prevDiv = lastDiv.prev("div");


### contains

Returns true if the supplied child is a descendant of the wrapped element.

###### Arguments

* `child` (Wrapper|Element) The element to test against.

###### Returns

(Boolean)

###### Example

	var body = $("body");
	var div = $("div");
	if (body.contains(div)) {
		// do stuff
	}


### match

Returns true or false for whether the supplied selector matches the element.

###### Arguments

* `selector` (String) Selector to match against wrapped element.

###### Returns

(Boolean)

###### Example

	$("div.class").match(".class");


### addClass

Adds the supplied classname if it doesn't exist on the wrapped element.

###### Arguments

* `className` (String) The classname to add.

###### Returns

(Wrapper) The wrapped element.

###### Example

	$("div.user").addClass("active");


### removeClass

Removes the supplied classname if it exists on the wrapped element.

###### Arguments

* `className` (String) The classname to remove.

###### Returns

(Wrapper) The wrapped element.

###### Example

	$("div.active").removeClass("active");


### on

Add an event to the wrapped element.

###### Arguments

* `event` (String) The type of event to add.
* `func` (Function) The function to call on the event.

###### Returns

(Wrapper) The wrapped element.

###### Example

	$("button").on("click", function(){
		// do stuff
	});


### off

Remove an event from the wrapped element.

###### Arguments

* `event` (String) The type of event to remove.
* `func` (Function) The function to remove.

###### Returns

(Wrapper) The wrapped element.

###### Example

	var handleClick = function(){
		// do stuff
	};
	$("button").off("click", handleClick);

