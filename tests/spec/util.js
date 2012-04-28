describe("util", function() {
	var $, $$, _;
	
	beforeEach(function() {
		_amoeba(function (get, getAll, api) {
			$ = get;
			$$ = getAll;
			_ = api;
		});
	});
	


	describe("type testing", function() {
		
		it("should return \"boolean\" for: true", function() {
			expect(_.type(true)).toEqual("boolean");
		});
	
		it("should return \"number\" for: 1234567.890", function() {
			expect(_.type(1234567.890)).toEqual("number");
		});
	
		it("should return \"string\" for: \"foo\"", function() {
			expect(_.type("foo")).toEqual("string");
		});
	
		it("should return \"array\" for: [\"foo\", \"bar\"]", function() {
			expect(_.type(["foo", "bar"])).toEqual("array");
		});
	
		it("should return \"object\" for: {foo: \"bar\"}", function() {
			expect(_.type({foo: "bar"})).toEqual("object");
		});
	
		it("should return \"object\" for: null", function() {
			expect(_.type(null)).toEqual("object");
		});
	
		it("should return \"undefined\" for: window.foo", function() {
			expect(_.type(window.foo)).toEqual("undefined");
		});
	
		it("should return \"element\" for: <div>", function() {
			expect(_.type(document.createElement("div"))).toEqual("element");
		});

	});
	

});