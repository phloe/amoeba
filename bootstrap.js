(function(source, doc, tag, firstScript){
    tag = "script";
	firstScript = doc.getElementsByTagName(tag)[0];
	script = doc.createElement(tag);
	firstScript.parentNode.insertBefore(script, firstScript);
	script.src = source;
})("{arguments}", document);