_amoeba.iterate = $each;

_amoeba.create = function (t, o) {
/*
	if (o.props) {
		var events = {}, found;
		$each(o.props, function(v, k){
			var m = k.match(/^on.+/);
			if (m) {
				events[m[1]] = v;
				found = true;
			}
			delete o.props[k];
		});
		if (found) {
			o.props.events = events;
		}
	}
	*/
	var el = new Element(t, o.props || {});
	if (o && o.content) _amoeba.insert(o.content, el);
	return el;
};

_amoeba.extend = $merge;

_amoeba.insert = function (cs, el) {
	el = el || _amoeba.base;
	cs = ($type(cs)=="array") ? cs : [cs];
	cs.each(function(c){
		if ($type(c)=="string") {
			c = document.createTextNode(c);
		};
		el.appendChild(c);
	});
};

_amoeba.getAll = function (s, el) {
	return $(el || document).getElements(s);
};

_amoeba.get = function (s, el) {
	return $(el || document).getElement(s);
};

_amoeba.html = function (el, s) {
	if (!s) {
		return el.innerHTML;
	}
	else {
		el.setHTML(s);
	};
};

_amoeba.template = function (s, o, d) {
	var t = s, d = d || ["{", "}"];
	$each(o, function(v, k){
		t = t.replace(d[0] + k + d[1], v);
	});
	return t;
};

_amoeba.panel = function (c) {
	var panel = new Element("div", {className: "_amoeba"});
	if (c) {
		_amoeba.insert(c, panel);
	};
	_amoeba.insert(panel);
	return panel;
};

_amoeba.request = function(u, o){
	var m = u.match(/^(http(?:s?)):\/\/([^\/]+)/); 
	if (u.match())
};

