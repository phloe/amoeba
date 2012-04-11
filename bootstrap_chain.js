(function(scripts, doc){

	var tag = "script",
		index = scripts.length,
		firstScript = 
			// <featureDetect>
			(doc.querySelector) ? 
			// </featureDetect>
			// <modern>
				doc.querySelector(tag)
			// </modern>
			// <featureDetect>
			: 
			// </featureDetect>
			// <IE>
				doc.getElementsByTagName(tag)[0]
			// </IE>
			;
	
	(function load (script) {
		if (index) {
			script = doc.createElement(tag);
			// <featureDetect>
			if (script.readyState) {
			// </featureDetect>
			// <IE>
				script.onreadystatechange = function () {
					if (script.readyState == "loaded" || script.readyState == "complete") {
						script.onreadystatechange = null;
						load();
					}
				};
			// </IE>
			// <featureDetect>
			}
			else {
			// </featureDetect>
			// <modern>
				script.onload = load;
			// </modern>
			// <featureDetect>
			}
			// </featureDetect>
			firstScript.parentNode.insertBefore(script, firstScript);
			script.src = scripts[--index];
			firstScript = script;
		}
	})();

})(["{arguments}"], document);