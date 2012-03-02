(function(scripts, doc){

	var tag = "script",
	
		index = scripts.length,
	
		firstScript = doc.getElementsByTagName(tag)[0];
	
	(function load (script) {
		if (index) {
			script = doc.createElement(tag);
			if (script.readyState) {
				script.onreadystatechange = function () {
					if (script.readyState == "loaded" || script.readyState == "complete") {
						script.onreadystatechange = null;
						load();
					}
				};
			}
			else {
				script.onload = load;
			}
			firstScript.parentNode.insertBefore(script, firstScript);
			script.src = scripts[--index];
			firstScript = script;
		}
	})();

})(["{arguments}"], document);