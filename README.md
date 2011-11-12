# Amoeba <sub>(alpha)</sub><super>*</super>

Micro API designed for use in bootstrap bookmarklets.

Amoeba was made from the following assumptions:

1. Smaller size is more important than features; existing libraries are too big and may also collide with other scripts.

2. Only modern browsers needs to be supported; users are expected to be intermediate to advanced users.

It currently weighs in at just above 2Kb minified and gzipped.

It's used in the bookmarklet builder on [amoeba-js.net](http://amoeba-js.net/).

## Usage

The API is exposed as a variable in global scope (window); by default as `_amoeba` - but you can set it to whatever namespace you want.

If you wanted to use it as `foobar` all you need to do is add `?name=foobar` to the end of the source:

    <script src="http://amoeba-js.net/js/?name=foobar"></script>


<hr/>


<super>*</super> API is subject to change drasticly and documentation is rather spotty :D

