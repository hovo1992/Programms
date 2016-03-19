var NAMESPACES = {
	HTML: 'http://www.w3.org/1999/xhtml',
	SVG: 'http://www.w3.org/2000/svg'
};

(function(){
	'use strict';

	HTMLElement.prototype.setProps = function (attributes) {
		for (var prop in attributes) {
			if (attributes.hasOwnProperty(prop)) {
				if ('function' == typeof this[prop]) {
					if (Array.isArray(attributes[prop])) {
						for (var i = 0; i < attributes[prop].length; i++) {
							this[prop](attributes[prop][i]);
						}
					} else
					this[prop](attributes[prop]);
				} else
				this.attr(prop, attributes[prop]);
			}
		}
		return this;
	}

	function create(selector, attributes, ns) {
		var match = /\w+:?\w*/.exec(selector),
		tag = document.createElementNS(ns || NAMESPACES.HTML, match[0]);
		if (attributes != undefined) {
			tag.setProps(attributes);
		}
		return tag;
	}

	function sizzle(selector) {
		switch (selector) {
			case first:
			return document.querySelectorAll(selector)[0];
			break;
			default: return document.querySelectorAll('[type = ' + selector + ']');
		}
	}

	window.$ = function (selector, attributes, ns) {
		var reg = /:(text|password|radio|checkbox|submit|reset|button|image|file|first)/,
		elements;
		switch (selector.constructor) {
			case Function: document.ready(selector);
			return;
			case Object: return create(selector.selector, attributes, selector.ns);
			case String: 
			if (/^<\w+:?\w*>$/.test(selector)) {
				return create(selector, attributes, ns);
			}
			if (reg.test(selector)){
				var matches = reg.exec(selector);
				elements = sizzle(matches[1]);
			} else {
				elements = document.querySelectorAll(selector);
			}
			if (attributes) {
				for (var i = 0; i < elements.length; i++) {
					elements[i].setProps(attributes);
				}
			}
			return (elements.length == 1 ? elements[0] : elements);
			default: return selector;
		}
	}

	HTMLElement.prototype.find = function(selector){
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

	EventTarget.prototype.on = function (events, handler, selector) {
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

	HTMLElement.prototype.prop = function(propName, propValue) {
		if(null != propName) { //avoid inversing
			if(null != propValue) {
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

	Node.prototype.parent = function(){
		return this.parentNode;
	}
	Element.prototype.parent = function(){
		return this.parentElement;
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

	function $log(text) {
		return console.log(text);
	}
	function $dir(target) {
		return console.dir(target);
	}
}());