var w = window,
	d = document;

if (!w._amoeba) {
	
	var a = w._amoeba = {
		load: function(u, f){ 
			var s = c("script");
			if (typeof f=="function") {
				s.onload = f;
				s.onreadystatechange = function () { 
					if (s.readyState == "loaded") f()
				}
			};
			s.setAttribute("src", u)
		}
	};
	
	function c (t, e) {
		return (e || a.base).appendChild(d.createElement(t))
	};
	
	a.base	= c("div", d.body);
	a.url	= "{url}";
	a.load(a.url+"{loader}", x)
	
}
else x();

function x () {
	_amoeba.load("{script}")
}