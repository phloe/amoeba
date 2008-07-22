if (!window._amoeba) {
	window._amoeba = {};
};

/*
Function: iterate
	Iterates through the supplied variable and calls the callback function on each step.

Arguments:
	object - (string, array or object) variable to iterate through.

Example:
	(start code)
	var recepients = ["world", "mom", "dad"];
	_amoeba.iterate(recepients, function (recepient, i) {
		alert("Hello, " + recepient + ". You are number " + i);
	});
	// alerts:
	// "Hello, world. You are number 0"
	// "Hello, mom. You are number 1"
	// "Hello, dad. You are number 2"
	(end)
*/

_amoeba.iterate = function (object, func, bind) {
	if (object instanceof String) {
		object = object.split("");
	};
	if (object instanceof Array) {
		for (var i=0, length=object.length; i<length; i++) {
			func.call(bind || object, object[i], i);
		};
	}
	else if (object instanceof Number) {
		for (var i=0, length=object.length; i<length; i++) {
			func.call(bind || object, object[i], i);
		};
	}
	else {
		for (var key in object) {
			if (object.hasOwnProperty(key)) {
				func.call(bind || object, object[key], key);
			};
		};
	};
};

_amoeba.extend = function (object, properties) {
	_amoeba.iterate(properties, function (value, key) {
		if ((typeof(value)).match(/number|string|boolean|function/)) {
			object[key] = value;
		}
		else {
			if (!object[key]) {
				object[key] = {};
			};
			_amoeba.extend(object[key], value);
		};
	});
};

_amoeba.create = function (tag, options) {
	var element = document.createElement(tag);
	if (options && options.content) {
		_amoeba.insert(options.content, element);
	};
	if (options && options.props) {
		_amoeba.extend(element, options.props);
	};
	return element;
};

_amoeba.insert = function (content, element) {
	element = element || _amoeba.base;
	content = (content instanceof Array) ? content : [content];
	for (var i=0, length=content.length; i<length; i++) {
		element.appendChild((content[i].nodeName) ? content[i] : document.createTextNode(content[i]));
	};
};

_amoeba.regs = {
	'html': {
		'id': 			/#([^\.\[\s]+)/,
		'tag':			/^([^#\.\[\s]+)/,
		'class':		/\.([^#\[\s]+)/
	},
	'url': {
		'base':			/^(http(?:s?)):\/\/([^\/]+\/?)/,
		'hash':			/#[^#]*$/,
		'queryClean':	/(^.*\?)|(#.*$)/g
	}
};

_amoeba.getAll = function (selector, element) {
	element = element || document;
	selector = selector.replace(/^.*\s/, "");
	var elements = [];
	var id = selector.match(_amoeba.regs.html.id);
	if (id) {
		elements.push(el.getElementById(id[1]));
	};
	var tag = selector.match(_amoeba.regs.html.tag);
	if (tag) {
		var nodes = element.getElementsByTagName(tag[0])
		for (var i=0, length=nodes.length; i<length; i++) {
			elements.push(nodes[i]);
		};
	};
	var className = selector.match(_amoeba.regs.html.class);
	if (className) {
		for (var i=elements.length-1; i>-1; i--) {
			if (!(className[1] in elements[i].className.split(" "))) {
				elements.splice(i, 1);
			};
		};
	};
	return elements;
};

_amoeba.get = function (selector, element) {
	element = element || document;
	selector = selector.replace(/^.*\s/, "");
	var id = selector.match(_amoeba.regs.html.id);
	if (id) {
		return element.getElementById(id[1]);
	};
	var elements = _amoeba.getAll(selector, element);
	return elements && elements[0] || null;
};

_amoeba.getValue = function (element) {
	switch (element.nodeName) {
		case "select":
			return element.options[element.selectedIndex].value;
			
		case "input":
			switch (element.type) {
				case "checkbox":
				case "radio":
					if (element.checked) {
						return element.value;
					}
					return;
			}
		
		default:
			return element.value;
	}
};

_amoeba.setValue = function (element, value) {
	switch (element.nodeName) {
		case "select":
			_amoeba.iterate(element.options, function (option) {
				if (option.value==value) {
					options.selected = "selected";
				}
			});
			
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
};

_amoeba.html = function (element, html) {
	if (!html) {
		return element.innerHTML;
	}
	else {
		element.innerHTML = html;
	};
};

_amoeba.template = function (template, object, delimiters) {
	var result = template, delimiters = delimiters || ["{", "}"];
	_amoeba.iterate(object, function(value, key){
		result = result.replace(delimiters[0] + key + delimiters[1], value);
	});
	return result;
};

_amoeba.panel = function (content) {
	var panel = _amoeba.create("div", {
		props: {
			className: "_amoeba"
		},
		content: _amoeba.create("button", {
			props: {
				innerHTML: "Close panel",
				title: "Close panel",
				className: "close",
				onclick: function () {
					panel.parentNode.removeChild(panel);
				}
			}
		})
	});
	if (content) {
		_amoeba.insert(content, panel);
	};
	_amoeba.insert(panel);
	return panel;
};

_amoeba.request = function(url, o){
	//console.log(url, o);
	var m = url.match(_amoeba.regs.url.base); 
	/*if (!m || (m[1]==document.location.protocol && m[2]==document.location.host)) {
		// standard xmlhttprequest
	}
	else {*/
		var frame;
		var uid = (_amoeba.request.uid++) + "";
		var send = function () {
			var hash = "request|" + uid;
			_amoeba.request.queue[uid] = {}; 
			window[frame.name].location = m[0] + "_amoeba.html" + "#" + hash + "=ello,guvnor";
			var counter = 0;
			var timer = window.setInterval(function(){
				var m = document.location.href.match(new RegExp("#(" + uid + ")=([^=]+)"));
				if (m && m[1]===uid) {
					if (window.console) console.log(m[1], m[2]);
					delete _amoeba.request.queue[uid+""];
					history.go(-1);
					kill();
				}
				else {
					
				}
			}, 200);
			var kill = function () {
				window.clearInterval(timer);
			};
			
		};
		if (!_amoeba.request.frames[m[2]]) {
			frame = _amoeba.create("iframe", {
				props: {
					src: m[0] + "_amoeba.html#init=" + encodeURIComponent(document.location),
					id: "_amoeba_frame_" + m[2],
					name: "_amoeba_frame_" + m[2],
					width: 1,
					height: 1,
					frameborder: 0,
					scrolling: "no",
					onload: function () {
						if (!_amoeba.request.bandwidth) {
							this.src = this.src.replace(_amoeba.regs.url.hash, "") + "#test=" + _amoeba.repeat("0", 10000);
							_amoeba.request.bandwidth = this.src.match(_amoeba.regs.url.hash)[0].length;
							this.src = this.src.replace(_amoeba.regs.url.hash, "") + "#";
						};
						send();
					}
				}
			});
			frame = _amoeba.base.appendChild(frame);
			_amoeba.request.frames[m[2]] = frame;
		}
		else {
			frame = _amoeba.request.frames[m[2]];
			send();
		}
	//};
};
_amoeba.request.bandwidth = null;
_amoeba.request.uid = 0;
_amoeba.request.queue = {};
_amoeba.request.frames = {};

_amoeba.toQueryObject = function (string) {
	string = string.replace(_amoeba.regs.url.queryClean, "");
	var object = {};
	_amoeba.iterate(string.split("&"), function (pair) {
		pair = pair.split("=");
		object[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	});
	return object;
};

_amoeba.toQueryString = function (object) {
	var string = [];
	_amoeba.iterate(object, function (value, key) {
		string.push(
			[encodeURIComponent(key), encodeURIComponent(value)].join("=")
		);
	});
	return string.join("&");
};

_amoeba.pad = function (string, pad, length) {
	string = string + "";
	return string + _amoeba.repeat(pad, length-string.length);
};

_amoeba.padLeft = function (string, pad, length) {
	string = string + "";
	return _amoeba.repeat(pad, length-string.length) + string;
};

_amoeba.repeat = function (string, length) {
	var repeat = [];
	for (var i = 0; (1 << i) <= length; i++) {
		if ((1 << i) & length) {
			repeat.push(string);
		};
		string += string;
	};
	return repeat.join("");
};

if (!_amoeba.load) {

	_amoeba.load = function (url, func) { 
		var script = _amoeba.base.appendChild(document.createElement("script"));
		if (typeof func=="function") {
			script.onload = func;
			script.onreadystatechange = function () { 
				if (script.readyState == "loaded") {
					func();
				};
			};
		};
		script.setAttribute("src", url);
	};
	
};

if (!_amoeba.base.id || _amoeba.base.id!="_amoeba") {
	_amoeba.base.id = '_amoeba';
	_amoeba.base = _amoeba.base.appendChild(_amoeba.create("div", {props: {id: "_amoeba_container"}}));
	
	_amoeba.insert(
		_amoeba.create("style", {
			props: {type: "text/css"},
			content: "@import url(" + _amoeba.url + "_amoeba.css);/* hello */"
		}),
		_amoeba.get("head")
	);
}

