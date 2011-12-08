(function(source, document, tag, firstScript){
    tag = "script";
	firstScript = document.getElementsByTagName(tag)[0];
	script = document.createElement(tag);
	firstScript.parentNode.insertBefore(script, firstScript);
	script.src = source;
})("{arguments}", document);