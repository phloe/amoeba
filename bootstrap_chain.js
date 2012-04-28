(function(scripts, doc){

	var index = scripts.length;
	
	(function load (script) {
		if (index) {
			script = doc.createElement("script");
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
			doc.body.appendChild(script);
			script.src = scripts[--index];
		}
	})();

})(["{arguments}"], document);