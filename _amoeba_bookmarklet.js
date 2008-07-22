var j = 'http://rasmus.phloe.dk/_amoeba_test.js';
function l () {
	_amoeba.load(j)
};

if (!window._amoeba) {
	
	var a = window._amoeba = {
		url: 'http://rasmus.phloe.dk/'
	},
	d = document;
	
	function c (t, e) {
		return (e || a.base).appendChild(d.createElement(t))
	};
	
	a.base = c('div', d.body);
	
	a.load = function(u, f){ 
		var s = c('script');
		if (typeof f=='function') {
			s.onload = f;
			s.onreadystatechange = function () { 
				if (s.readyState == 'loaded') f()
			}
		};
		s.setAttribute('src', u)
	};
	
	a.load(a.url+'_amoeba_loader.js', l)
	
}
else l()