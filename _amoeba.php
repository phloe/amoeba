<?php

	$js = file_get_contents("_amoeba_widget.js");

	$bookmark = makeInline($js);

	$js = file_get_contents("_widget.js");

	$widget = makeInline($js);
	
	function makeInline ($script) {
		//return preg_replace('/[\n\r\t]/', "", $script);
		return 'javascript:(function(){'.preg_replace('/\s*([\(\)\{\}\|\&;:,\"\'+\-=*\/\!])\s*/', "$1", $script).'})()';
	};


	// (){}[].,:;'!=/_ -> numbers and eval the shite?
	
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>Testing 1 2 3</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<script src="jsmin.js"></script>
		<script>
			function __amoeba_load () {
				<?php print $js; ?>
			};
			var js_base = jsmin("", '<?php print $bookmark; ?>', 3);
			var js_widget = jsmin("", '<?php print $widget; ?>', 3);
			function makeLink () {
				var js;
				if (document.getElementById("include").checked) {
					js = js_base.replace(/\{(script|loader|url)\}/g, function (_0, _1) {
						return document.getElementById(_1).value;
					});
				}
				else {
					js = js_widget.replace(/\{(script|loader|url)\}/g, function (_0, _1) {
						return document.getElementById(_1).value;
					});
				}
				var bookmark = document.getElementById("userBookmark");
				if (!bookmark) {
					bookmark = document.body.appendChild(document.createElement("a"));
					bookmark.id = "userBookmark";
					bookmarkStats = document.body.appendChild(document.createElement("span"));
				}
				else {
					var bookmarkStats = bookmark.nextSibling;
				}
				
				bookmark.href = js;
				bookmark.innerHTML = document.getElementById("bookmarkText").value;
				bookmarkStats.innerHTML = " chars: " + js.length;
			};
			function bookmarkify () {
				document.getElementById("bookmark").href = jsmin("", "javascript:(function(){" + document.getElementById("javascript").value + "})();", 3);
			};
		</script>
		<style type="text/css">
		</style>
	</head>
	<body>
		<p>
			<label for="bookmarkText">bookmark text:</label>
			<input id="bookmarkText" type="text" value="My bookmark" />
		</p>	
		<p>
			<label for="script">bookmark script file:</label>
			<input id="script" type="text" value="http://rasmus.phloe.dk/_amoeba_test.js" />
		</p>
		<p>
			<label for="script">bookmark script:</label>
			<textarea id="script"></textarea>
		</p>
		<p>
			<label for="include">include amoeba:</label>
			<input id="include" type="checkbox" value="include" checked="checked"/>
		</p>	
		<p>
			<label for="url">amoeba base url:</label>
			<input id="url" type="text" value="http://rasmus.phloe.dk/" />
		</p>	
		<p>
			<label for="loader">amoeba loader:</label>
			<input id="loader" type="text" value="_amoeba.js" />
		</p>
		<button onclick="makeLink();">Make bookmark</button>
		<br/>
		<br/>
    
		<p>
			<label for="javascript">bookmark script:</label>
			<textarea id="javascript"></textarea>
		</p>
		<p>
			<a id="bookmark">Custom bookmark</a>
		</p>
		<button onclick="bookmarkify();">Bookmarkify</button>
    </body>
</html>
