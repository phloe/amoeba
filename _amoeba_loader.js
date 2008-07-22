(function(){

	var v = "";
	var f = [
		//"dojo",
		//"Ext",
		//"jQuery",
		//"MooTools",
		//"Prototype",
		//"YAHOO"
	];
	
	for (var i=0, l=f.length; i<l; i++) {
		if (window[f[i]]) {
			v = "_" + f[i].toLowerCase();
			break;
		};
	};
	
	var m = document.location.href.match(/^(http(?:s?)):\/\/([^\/]+\/?)/); 
	if (!_amoeba.url) _amoeba.url = "http://rasmus.phloe.dk/"//m[0];
	_amoeba.base.id = '_amoeba';
	
	_amoeba.load(_amoeba.url + "_amoeba" + v + ".js", function(){
		_amoeba.insert(
			_amoeba.create("style", {
				props: {type: "text/css"},
				content: "@import url(" + _amoeba.url + "_amoeba.css);"
			}),
			_amoeba.get("head")
		);
	});
	
})();