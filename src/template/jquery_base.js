class Event {

	constructor(event, currentTarget) {
		this._event = event;
		this.ctrlKey = event.ctrlKey;
		this.currentTarget = currentTarget;
	}

	preventDefault() {
		this._event.preventDefault();
	}
}

class HTMLEntityList {

	constructor(objs) {
		this._objs = objs;

		this.length = objs.length;
	}

	on(event, delegate, fct) {

		if( (typeof delegate) === 'function' ) {
			fct = delegate;
			delegate = undefined;
		}

		let handler =  (event) => {

			let target = event.currentTarget;

			if (delegate ) {

				target = event.target;
				while( target && target != event.currentTarget ) {

					if( target.matches(delegate) )
						break;

					target = target.parentNode;
				}

				if( target === event.currentTarget )
					return true;

			}

			return fct( new Event(event, target) );

		};

		for( let obj of this._objs )
			obj.addEventListener(event, handler);

	}

	size() {
		return this._objs.length;
	}

	get(idx) {
		return this._objs[idx];
	}

	removeClass(class_name) {
		for( let obj of this._objs )
			obj.classList.remove(class_name);
	}

	addClass(class_name) {
		for( let obj of this._objs )
			obj.classList.add(class_name);
	}

	hasClass(class_name) {
		return this._objs[0].classList.contains(class_name);
	}

	toggleClass(class_name, enable = ! this.hasClass(class_name) ) {

		if(enable)
			this.addClass(class_name);
		else
			this.removeClass(class_name);
	}

	attr(attr_name, attr_value) {

		if(attr_value === undefined)
			return this._objs[0].getAttribute(attr_name);

		for( let obj of this._objs)
			obj.setAttribute(attr_name, attr_value);
	}

	parent() {
		return $(this._objs[0].parentNode);
	}

	trigger(event) {

		for( let obj of this._objs)
			obj.dispatchEvent( new Event(event) );
		
	}

	find(arg) {
		return $(arg, this._objs[0]);
	}
}


function $(arg, parent = document) {

	switch( typeof arg ) {

		case 'function':

			if (document.readyState !== "loading")
				arg();
			else
				document.addEventListener("DOMContentLoaded", arg);

			return;

		case 'string':
			return new HTMLEntityList( parent.querySelectorAll(arg) );

		case 'object':
			return new HTMLEntityList([arg]);
	}
}

module.exports = $;
