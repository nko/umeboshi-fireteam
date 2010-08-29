/*
 * 
 * Find more about this plugin by visiting
 * http://miniapps.co.uk/
 *
 * Copyright (c) 2010 Alex Gibson, http://miniapps.co.uk/
 * Released under MIT license 
 * http://miniapps.co.uk/license/
 * 
 * Version 1.1 - Last updated: July 22 2010
 * 
 */


var resolutionHeight;
var resolutionWidth;
 

function WKTouch(node, options) {

	this.node = typeof node == 'object' ? node : document.getElementById(node);

	this.options = {
		dragable : false,
		scalable : false,
		rotatable : false,
		opacity : false,
		slider: false
	}
    
	// User defined options
	if (typeof options == 'object') {
		for (var i in options) {
			this.options[i] = options[i];
		}
	}
}

//static property to store the zIndex for an element
//WKTouch.zIndexCount = 1;
        
//touch event handler
WKTouch.prototype.handleEvent = function (e) {
    switch (e.type) {
        case 'touchstart': this.onTouchStart(e); break;
        case 'touchmove': this.onTouchMove(e); break;
        case 'touchend': this.onTouchEnd(e); break;
        case 'touchcancel': this.onTouchCancel(e); break;
    }
};

WKTouch.prototype.init = function () {          
    this.startX = 0; //starting X coordinate
    this.startY = 0; //starting Y coordinate
    this.curX = 0; //current X coordinate
    this.curY = 0; //current Y coordinate
    this.elementPosX = 0; //offset left coordinate
    this.elementPosY = 0; //offset top coordinate
    this.rotation = 0; //default rotation in degrees
    this.scale = 1.0; //default scale value
    this.gesture = false; //gesture flag
    this.node.addEventListener('touchstart', this, false);
};

WKTouch.prototype.onTouchStart = function (e) {
    e.preventDefault();
    //bring item to the front
    //this.node.style.zIndex = WKTouch.zIndexCount++;
    //drag event
    if ((e.targetTouches.length === 1) && (this.options.dragable)) { 
        //get starting coordinates
        this.startX = e.targetTouches[0].pageX;
        this.startY = e.targetTouches[0].pageY;
        //get offset coordinates
        this.elementPosX = this.node.offsetLeft;
        this.elementPosY = this.node.offsetTop; 
    }        
    //add touchmove and touchend event listeners
    this.node.addEventListener('touchmove', this, false);
    this.node.addEventListener('touchend', this, false);
    this.node.addEventListener('touchcancel', this, false);
    //set opacity
    if (this.options.opacity) {
        this.node.style.opacity = '0.5';
    }
};
        
WKTouch.prototype.onTouchMove = function (e) {
    e.preventDefault();
	
	//elementoPai = this.node.parentNode;
	//elementoPai.style.top = '0px';
	teto = 0; //should be elementoPai.top + this.node.top
	piso = 690-141;
	valor_escrito = 0;
	
    //drag event
    if ((e.targetTouches.length === 1) && (this.options.dragable)) {
        //calculate distance
        this.curX = e.targetTouches[0].pageX - this.startX;
        this.curY = e.targetTouches[0].pageY - this.startY;
        //set position
        //this.node.style.left = (this.elementPosX + this.curX) + "px";
		
		if (this.options.slider) {
							
							valor_lido = this.elementPosY + this.curY;
							
							valor_escrito = valor_lido;
							if (valor_lido < teto) {valor_escrito = teto}
							if (valor_lido > piso) {valor_escrito = piso}
							 
				        	
				        	this.node.style.top = (valor_escrito) + "px";
							//console.log(valor_escrito);
						}
						else{
	        //set position
	        this.node.style.left = (this.elementPosX + this.curX) + "px";
	        this.node.style.top = (this.elementPosY + this.curY) + "px";
		}
    }
    else if ((e.targetTouches.length === 2) && ((this.options.scalable) || (this.options.rotatable))) {
        //gesture event
        this.gesture = true;
        var myTransform = "";
        //scale and rotate
        if (this.options.scalable) {
            myTransform += "scale(" + (this.scale * e.scale) + ")";
        } 
        if (this.options.rotatable) {
            myTransform += "rotate(" + ((this.rotation + e.rotation) % 360) + "deg)";
        }
        this.node.style.webkitTransform = myTransform;
    }
};
        
WKTouch.prototype.onTouchEnd = function (e) {
    e.preventDefault(); 
    //remove event listeners
    this.node.removeEventListener('touchmove', this, false);
    this.node.removeEventListener('touchend', this, false);
    this.node.removeEventListener('touchcancel', this, false);
    //gesture event
    if (this.gesture) {
        //store scale and rotate values
        this.scale *= e.scale;
        this.rotation = (this.rotation + e.rotation) % 360;
        this.gesture = false;
    }
    this.startX = 0;
    this.startY = 0;
    this.elementPosX = 0;
    this.elementPosY = 0;
    //set opacity
    if (this.options.opacity) {
        this.node.style.opacity = '1';
    }   
};

WKTouch.prototype.onTouchCancel = function (e) {
    e.preventDefault();
    //remove event listeners
    this.node.removeEventListener('touchmove', this, false);
    this.node.removeEventListener('touchend', this, false);
    this.node.removeEventListener('touchcancel', this, false);
    //gesture event
    if (this.gesture) {
        //store scale and rotate values
        this.scale *= e.scale;
        this.rotation = (this.rotation + e.rotation) % 360;
        this.gesture = false;
    }
    this.startX = 0;
    this.startY = 0;
    this.elementPosX = 0;
    this.elementPosY = 0;
    //set opacity
    if (this.options.opacity) {
        element.style.opacity = '1';
    }   
};

