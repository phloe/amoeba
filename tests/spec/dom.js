describe("dom", function() {
	var $, $$, _;
	
	beforeEach(function() {
		_amoeba(function (get, getAll, api) {
			$ = get;
			$$ = getAll;
			_ = api;
		});
	});
	


	describe("get", function() {
		
		it("should return a wrapped element when passed an element: document.body", function() {
			var body = $(document.body);
			expect("el" in body).toEqual(true);
			expect(_.type(body.el)).toEqual("element");
			expect(body.el).toEqual(document.body);
		});
		
		it("should return a wrapped element when passed a selector: \"head script[type]\"", function() {
			var script = $("head script[type]");
			expect("el" in script).toEqual(true);
			expect(_.type(script.el)).toEqual("element");
		});

	});
	

});