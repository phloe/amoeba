(function(scripts, _document, index, load, head){
	
	head = _document.getElementsByTagName("head")[0],
	
	index = scripts.length,
		
	load = function (script) {
		if (index) {
			script = _document.createElement("script");
			script.onload = load;
			script.onreadystatechange = function () { 
				if (script.readyState == "loaded") {
					load();
				}
			}
			script.src = scripts[--index];
			head.appendChild(script);
		}
	};
		
	load();

})(["{arguments}"], document);