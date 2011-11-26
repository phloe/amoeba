(function(scripts, document){

	var state, 
		tag = "script",
	
		index = scripts.length,
	
		firstScript = document.getElementsByTagName(tag)[0],
	
		load = function (script) {
			if (index) {
				script = document.createElement(tag);
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
				script.src = scripts[--index];
				firstScript.parentNode.insertBefore(script, firstScript);
				firstScript = script;
			}
		};

	load();

})(["{arguments}"], document);