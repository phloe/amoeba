(function(scripts, doc){

	var state, 
		tag = "script",
	
		index = scripts.length,
	
		firstScript = doc.getElementsByTagName(tag)[0];
	
<<<<<<< HEAD
	(function load (script) {
=======
	function load (script) {
>>>>>>> ...
		if (index) {
			script = doc.createElement(tag);
            state = script.onreadystatechange;
			if (state !== undefined) {
				state = function () {
					if (script.readyState == "loaded") {
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
<<<<<<< HEAD
	})();
=======
	}();
>>>>>>> ...

})(["{arguments}"], document);