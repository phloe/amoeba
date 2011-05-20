(function(scripts, document, index, load, head){
	
	head = document.getElementsByTagName("head")[0];
	
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
			head.appendChild(script);
		}
	};
		
	load();

})(["{arguments}"], document);