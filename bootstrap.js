(function(source, document, tag, firstScript){
    tag = "script";
	firstScript = document.getElementsByTagName(tag)[0];
	script = document.createElement(tag);
	script.src = source;
	firstScript.parentNode.insertBefore(script, firstScript);
})("{arguments}", document);