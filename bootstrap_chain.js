(function(scripts, doc){

	var index = scripts.length;
	
	(function load () {
		if (index) {
			var script = doc.createElement("script");
			script.onload = load;
			doc.body.appendChild(script);
			script.src = scripts[--index];
		}
	})();

})(["{arguments}"], document);