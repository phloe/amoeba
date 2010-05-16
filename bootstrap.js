(function(){

	var _document = document,
	
	scripts = arguments,
	
	index = scripts.length,
		
	load = function () {
		if (!index) {
			return;
		}
		var script = _document.createElement("script");
		script.onload = load;
		script.onreadystatechange = function () { 
			if (script.readyState == "loaded") {
				load();
			}
		}
		script.src = scripts[--index];
		_document.getElementsByTagName("head")[0].appendChild(script);
	};
		
	load();

})("{arguments}");