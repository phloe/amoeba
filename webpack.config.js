var name = "_amoeba";

module.exports = {
	target: "web",
	debug: false,
	entry: {
		_amoeba: "./index.js",
	},
	output: {
		path: "./dist/",
		filename: "[name].js",
		library: name,
		libraryTarget: "umd"
	}
};