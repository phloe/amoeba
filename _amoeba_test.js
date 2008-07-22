(function(){
	_amoeba.panel(
		_amoeba.create("button", {
			props: {
				style: {
					backgroundColor: "#000",
					color: "#FFF",
					border: "0",
					lineheight: "50px",
					fontSize: "25px"
				},
				onclick: function () {
					alert(document.title);
				}
			},
			content: "hello, world"
		})
	);
	
	var template = 	"<h3>{header}</h3>";
		template += "<p>{text}</p>";
	
	var data = [
		{header: "Hello, World", 	text: "I was looking forward to these newfangled bookmarklets you've been going on about."},
		{header: "Goodbye, Idiot",	text: "But this is fairly disapointing to say the least."}
	];
	
	_amoeba.iterate(data, function (o) {
		_amoeba.html(
			_amoeba.panel(),
			_amoeba.template(template, o)
		);
	});
	
	_amoeba.request("http://rasmus.phloe.dk/", "tester");
	
})();