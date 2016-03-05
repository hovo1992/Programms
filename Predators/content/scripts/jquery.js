(function(){
'use strict';
HTMLElement.prototype.setProps = function (attributes) {
		for (var prop in attributes) {
			if ('function' == typeof this[prop]) {
				if (Array.isArray(attributes[prop])) {
					for (var i = 0; i < attributes[prop].length; i++) {
						this[prop](attributes[prop][i]);
					}
				} else
					this[prop](attributes[prop]);
			} else
				this.attr('prop', attributes[prop]);
		} 
		return this;
}

window.create = function(selector, attributes, ns) {
	var match = /\w+:?\w*/.exec(selector),
		tag = document.createElementNS(ns || NAMESPACES.HTML, match[0]);
	if (attributes != undefined) {
		tag.setProps(attributes);
	}
	return tag;
}
window.$ = function(selector, attributes, ns) {
	var pattern = /:(text|password|radio|checkbox|submit|reset|button|image|file)|(selected)/,
		elements,
		matchs,
		index = 1;

	function sizzle(number) {

		switch(number) {
			case 1:
				elements = document.querySelectorAll('[type=' + selector.slice(1) + ']'); 
				break;
			case 2:
				elements = document.querySelectorAll('[selected=' + selector.slice(1) + ']');
				break;
		}
		// elements = document.querySelectorAll('[type=' + selector.slice(1) + ']');
	}

	if ('function' == typeof selector) {
		document.ready(selector);
		return;
	}
	if ('string' == typeof selector) {
		// if (/^<\w+:?\w*>$/.test(selector)) {
		// 	return create(selector, attributes, ns);
		// 
		if(pattern.test(selector)) {
			matchs = pattern.exec(selector);
			matchs != null && sizzle(matchs.length - 1);
			
		} else {
			elements = document.querySelectorAll(selector);
		}

		for (var i = 0; i < elements.length; i++) {
			elements[i].setProps(attributes);
		}

		return (elements.length == 1 ? elements[0] : elements);
	}

	if (Object == selector.constructor) {
		return create(selector.selector, attributes, selector.ns);
	}
	return selector;

	// if(selector instanceof HTMLDocument){
	// 	this.prototype.ready = function(func){
	// 		document.on('DOMContentLoaded', func);
	// 	}
	// }
//////////////////////////////////////////////////////////////////////

function Wrapper() {};
var wrapper = new Wrapper();

/*Array.prototype*/wrapper.dim = function (val, size) {
	 var i;
	 size = size || this.length;
	 for (i = 0; i < size; i += 1) {
	 	this[i] = val;
	 }

	 return this;
}


}




HTMLElement.prototype.find = function(selector){////////////////add attr
	var elements = this.querySelectorAll(selector);

	return (elements.length == 1 ? elements[0] : elements);

}

HTMLElement.prototype.val = function(value){
	if(null == value){
		return this.value;		
	}
	if('function' == typeof value){
		return (this.val(value.call(this)));	
	}
	return (this.value = value, this);
}

// EventTarget.prototype.on = function (event, handler) {
// 	var events = event.split(/,\s*/);//combine with the off

// 	for(var eventName in events) {
// 		this.addEventListener(events[eventName], handler);
// 	}

// 	return this;
// }

EventTarget.prototype.on = function (events, handler, selector) {///////////////////////////////////
	var eventList = events.split(/,\s*/);

	for(var eventName in eventList) {
		this.addEventListener(eventList[eventName],
			selector ?
			(function () {
				if (eventList[eventName].srcElement == this.find(selector)) { //.target
					handler();
				}
			}) : handler,
		false);
		return this;
	}
}

EventTarget.prototype.off = function (event, handler) {
	var events = event.split(/,\s*/);

	for(var eventName in events) {
		this.removeEventListener(events[eventName], handler);
	}

	return this;
}

HTMLElement.prototype.content = function(val) {
	(null == val) ? this.textContent : this.textContent = val;
	return this;
}

//Object.prototype.attr = function (attribute, value) {
//	this.setAttribute(attribute, value);
//	return this;
//}


HTMLElement.prototype.removeAttr = function(attrName) {
	if(attrName){
		return (this.removeAttribute(attrName), this);
	}
	return this;
}

HTMLElement.prototype.attr = function(attrName, attrValue) {  ///if attr is a function
    switch (arguments.length) {
        case 1: {
            if ('string' == typeof attrName) {
                return this.getAttribute(attrName);
            }
            var params = arguments[0];
            for (var i in params) {
                this.setAttribute(i, params[i]);
            }
            break;
        }
        case 2: {
            this.setAttribute(attrName, attrValue);
            break;
        }
    }
    return this;
}

HTMLElement.prototype.prop = function(propName, propValue){
	if(null != propName){ //avoid inversing
		if(null != propValue){
			return (this[propName] = propValue, this);
		}
		return this[propName];
	}
	return this;
}

HTMLElement.prototype.removeProp = function(propName){
	return null == propName ? this  : (this[propName] = undefined, (delete this[propName], this));
}


HTMLElement.prototype.css = function (attrName, attrValue) {
	switch (arguments.length) {
		case 1: {
			if ('string' == typeof attrName) {
				return this.style[attrName];
			}
			var params = arguments[0];
			for (var param in params) {
				this.style[param] = params[param];
			}
			break;
		}
		case 2: {
			this.style[attrName] = attrValue;
			break;
		}
	}
	return this;
}

HTMLElement.prototype.append = function (child) {
	if(1 == arguments.length){
		this.appendChild(child);
	}else{
		for(var i = 0; i < arguments.length; i++){
			this.appendChild(arguments[i]);
		}
	}
	return this;
}

HTMLElement.prototype.text = function(text){
	if(null == text){
		return this.innerText;
	}
	return (this.innerText = text, this);
}
// const DELIMITERS = {
// 		EMPTY: '',
// 		SPACE: ' ',
// 		COMMA: ',',
// 		FULL_POINT: '.',
// 	}
// 		Object.prototype[DELIMITERS.FULL_POINT + 'changeHandler'] =
// 			function changeHandler(events, handler, $delegate) {
// 				var that = this;
// 				var pattern = /\s/;

// 				events
// 					.replace(pattern, '')
// 					.split(DELIMITERS.COMMA)
// 					.forEach($delegate, that);

// 				return that;
// 			}
// 			Object.prototype.removeProp = function (propNames) {
// 				return this
// 						[DELIMITERS.FULL_POINT + 'changeHandler']
// 						(this, DELIMITERS.EMPTY, function (propNames) { delete this[propNames]; });
// 			}
// 			EventTarget.prototype.on = function (events, handler) {
// 				return (this
// 					[DELIMITERS.FULL_POINT + 'changeHandler']
// 					(events, handler, function (item) { this.addEventListener(item, handler); }),
// 					this);
// 			}

Node.prototype.parent = function(){
	return this.parentNode;
}
Element.prototype.parent = function(){
	return this.parentElement;
}
// Element.prototype.closest = function(selector){
// 	var target = this,
// 		targetParent = this.parentNode;

// 	while(!targetParent.find(selector).length){
// 		target = targetParent;
// 		targetParent = targetParent.parentNode;
// 	}
	
// 	return target;
// }

Element.prototype.closest = function (selector) {
	var targetParent = this.parentNode;
	while(targetParent.tagName.toLowerCase() != selector ){
		targetParent = targetParent.parentElement;
		if (!targetParent) {
			return window;
		}
	}
	return targetParent;
}

Node.prototype.load = Node.prototype.ready = function(delegate){
	this.on('load', delegate);
}
Document.prototype.ready = function(delegate){
	this.on('DOMContentLoaded', delegate);
}

function $log(text) {
	return console.log(text);
}
function $dir(target) {
	return console.dir(target);
}
}());