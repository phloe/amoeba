(function(scripts, document, index, load){
	
	index = scripts.length;
		
	load = function (script) {
		if (index) {
			script = document.createElement("script");
			if (script.onreadystatechange!==undefined) {
				script.onreadystatechange = function () { 
					if (script.readyState == "loaded") {
						load();
					}
				}
			}
			else {
				script.onload = load;
			}
			script.src = scripts[--index];
			document.body.appendChild(script);
		}
	};
		
	load();

})(["{arguments}"], document);