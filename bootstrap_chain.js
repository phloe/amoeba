(function(scripts, document, index, tag, firstScript, load){

	tag = "script";

	index = scripts.length;

	firstScript = document.getElementsByTagName(tag)[0];

	load = function (script) {
		if (index) {
			script = document.createElement(tag);
			if (script.onreadystatechange !== undefined) {
				script.onreadystatechange = function () {
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