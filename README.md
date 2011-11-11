Amoeba (alpha)
=============

Micro API designed for use in bootstrap bookmarklets.

Amoeba was made from the following assumptions:

* Smaller size is more important than features.

* Bookmarklets are primarily used by intermediate to advanced users, ie. modern browsers only needs to be supported.

It currently weighs in at just above 2Kb minified and gzipped.

It's used in the bookmarklet builder on <a href="http://amoeba-js.net/">amoeba-js.net</a>.

Usage
-----

The API is exposed as a variable in global scope (window); by default as "_amoeba" - but you can set it to whatever you want.

If you wanted to use it as "foobar" all you need to do is add "?foobar" to the end of the source:

    <script src="http://amoeba-js.net/js/?foobar"></script>