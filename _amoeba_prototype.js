_amoeba.create = function (t, o) {
	var el = document.createElement(t);
	if (o && o.content) _amoeba.insert(el, o.content);
	if (o && o.props) _amoeba.extend(el, o.props);
	return el;
};

_amoeba.extend = function (o, ps) {
	for (var k in ps) {
		if (ps.hasOwnProperty(k)) {
			var p = ps[k];
			if ((typeof(p)).match(/number|string|boolean|function/)) {
				o[k] = p;
			} 
			else {
				if (!o[k]) o[k] = {};
				_amoeba.extend(o[k], p);
			};
		};
	};
};

_amoeba.insert = function (el, cs) {
	cs = (cs instanceof Array) ? cs : [cs];
	for (var i=0, c; c=cs[i]; i++) el.appendChild((c.nodeName) ? c : document.createTextNode(c));
};

_amoeba.get = 