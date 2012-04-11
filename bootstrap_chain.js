(function(scripts, doc){

	var tag = "script",
		index = scripts.length,
		firstScript = 
			// <featureDetect>
			(doc.querySelector) ? 
			// </featureDetect>
			// <querySelector>
				doc.querySelector(tag)
			// </querySelector>
			// <featureDetect>
			: 
			// </featureDetect>
			// <getElementsByTagName>
				doc.getElementsByTagName(tag)[0]
			// </getElementsByTagName>
			;
	
	(function load (script) {
		if (index) {
			script = doc.createElement(tag);
			// <featureDetect>
			if (script.readyState) {
			// </featureDetect>
			// <readyState>
				script.onreadystatechange = function () {
					if (script.readyState == "loaded" || script.readyState == "complete") {
						script.onreadystatechange = null;
						load();
					}
				};
			// </readyState>
			// <featureDetect>
			}
			else {
			// </featureDetect>
			// <onload>
				script.onload = load;
			// </onload>
			// <featureDetect>
			}
			// </featureDetect>
			firstScript.parentNode.insertBefore(script, firstScript);
			script.src = scripts[--index];
			firstScript = script;
		}
	})();

})(["{arguments}"], document);