(function() {
		'use strict';
		var NAMESPACES = {
			HTML: 'http://www.w3.org/1999/xhtml'
		};

		HTMLElement.prototype.setProps = function (attributes) {
			for (var prop in attributes) {
				if(attributes.hasOwnProperty(prop)) {
					if ('function' == typeof this[prop]) {
						if ($.isArray(attributes[prop])) {
							for (let i = 0; i < attributes[prop].length; i++) {
								this[prop](attributes[prop][i]);
							}
						} else {
							this[prop](attributes[prop]);
						}

					} else {
						this.attr('prop', attributes[prop]);
					}
				}
			} 
			return this;
		}

		function create(selector, attributes, ns) {
			var match = /\w+(?::\w+)?/.exec(selector),
			tag = document.createElementNS(ns || NAMESPACES.HTML, match[0]);
			if (undefined != attributes) {
				tag.setProps(attributes);
			}
			return tag;
		}

		function Wrapper() {};
		var wrapper = new Wrapper();

		/*Array.prototype*/
		wrapper.dim = function (val, size) {
			var i;
			size = size || this.length;
			for (i = 0; i < size; i += 1) {
				this[i] = val;
			}

			return this;
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
	// 			EventTarget.  .on = function (events, handler) {
	// 				return (this
	// 					[DELIMITERS.FULL_POINT + 'changeHandler']
	// 					(events, handler, function (item) { this.addEventListener(item, handler); }),
	// 					this);
	// 			}
	// Element.prototype.closest = function(selector){
	// 	var target = this,
	// 		targetParent = this.parentNode;

	// 	while(!targetParent.find(selector).length){
	// 		target = targetParent;
	// 		targetParent = targetParent.parentNode;
	// 	}

	// 	return target;
	// }
	Node.prototype.parent = function(){
		return this.parentNode;
	}
	Element.prototype.parent = function(){
		return this.parentElement;
	}
	HTMLElement.prototype.find = function(selector){////////////////add attr
		var elements = this.querySelectorAll(selector);
		return (1 == elements.length) ? elements[0] : elements;
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
		return (null == val ? this.textContent : (this.textContent = val, this));
	}

	//Object.prototype.attr = function (attribute, value) {
	//	this.setAttribute(attribute, value);
	//	return this;
	//}


	HTMLElement.prototype.removeAttr = function(attrName) {
		return (attrName && this.removeAttribute(attrName), this);
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

	// HTMLElement.prototype.prop = function(propName, propValue){
	// 	return ( null == propName && this) ||( null == propValue && this[propName]) || (this[propName] = propValue, this);
	// }

	HTMLElement.prototype.prop = function (propName, propValue) {
		return (null == propName ? this
			: null == propValue ? this[propName]
			: (this[propName] = propValue, this));
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
		var children = 1 == arguments.length ? [child] : arguments;

		for(var i = 0; i < arguments.length; i++){
			this.appendChild(arguments[i]);
		}
		return this;
	}

	HTMLElement.prototype.text = function(text){
		return (null == text && this.innerText)
		|| (this.innerText = text, this);
	}

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

	window.$ = function(selector, attributes, ns) {
		var pattern = /:(text|password|radio|checkbox|submit|reset|button|image|file)(\w+:first)/,
		elements,
		matchs,
		index = 1;

		function sizzle(selector) {
			switch(selector) {
				case 'first':
					elements = document.querySelectorAll(selector)[0];
					break;
				default:
					elements = document.querySelectorAll('[type=' + selector.slice(1) + ']');
					break;
			}
			// elements = document.querySelectorAll('[type=' + selector.slice(1) + ']');
		}
		switch(selector.constructor){
			case Function: document.ready(selector); return;		
			case Object: return create(selector.selector, attributes, selector.ns);
			case String: 
				if (/^<\w+:?\w*>$/.test(selector)) {
					return create(selector, attributes, ns);
				}
				if(pattern.test(selector)) {
					matchs = pattern.exec(selector);
					elements = sizzle(matchs[1]);
					
				} else {
					elements = document.querySelectorAll(selector);
				}

				if(attributes){
					for (var i = 0; i < elements.length; i++) {
						elements[i].setProps(attributes);
					}
				}
				return (elements.length == 1 ? elements[0] : elements);
				
				default: return selector;
			}
		}
		
		$.log = function(text){
			return console.log(text);
		}
		$.dir = function(target){
			return console.dir(target);
		}
		$.isArray = Array.isArray;

		// if(selector instanceof HTMLDocument){
		// 	this.prototype.ready = function(func){
		// 		document.on('DOMContentLoaded', func);
		// 	}
		// }
	//////////////////////////////////////////////////////////////////////

	
})();