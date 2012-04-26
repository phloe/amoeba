# Amoeba <sub>(alpha)</sub><super>*</super>

Micro API designed for use in bootstrap bookmarklets.

Amoeba was made from the following assumptions:

1. Smaller size is more important than features; existing libraries are too big and may also collide with other scripts.

2. Only modern browsers need to be supported; users are expected to be intermediate to advanced users.

It currently weighs in at just 1.6Kb minified and gzipped.

It's used in the bookmarklet builder on [amoeba-js.net](http://amoeba-js.net/).

## Usage

Include the API like so:

	<script src="//amoeba-js.net/js/"></script>

Use it in a script like this:

	_amoeba(function($, $$, _){
		var foo = $("#foo");
		// do stuff with foo
		_.each($$("div.bar[title]"), function (bar) {
			// do stuff bar
		});
	});


<hr/>


<super>*</super> API is subject to change drastically and documentation is rather spotty :D

