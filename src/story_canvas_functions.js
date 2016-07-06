
sc.templateEngine = function (templateId, args) {
	args = args || {};
	var template = $('#'+templateId).html();
	for (arg in args) {
		var str = "{{"+arg+"}}"
		template = template.split(str).join(args[arg]);
	}
	return template;
}



sc.getTextFormatting = function (slide, displayType) {
	tf = slide.textFormatting;
	myobj = {
		fontSize: tf.fontSize,
		color: tf.color,
		backgroundColor: tf.backgroundColor,
		opacity: tf.opacity,
		transform: tf.transform,
		top: tf.top,
		bottom: tf.bottom
	};
    return myobj;
}

sc.getImageBoxFormatting = function getImageBoxFormatting(slide, displayType) {
    var myobj = {};
    if (!slide.textFormatting.overlay) {
        myobj.bottom = '55px';
    }
    return myobj;
}

sc.showTools = function(canvas) {
	$('.sc-left-nav').show();
    $('.sc-right-nav').show();
    $('.sc-toolbar').show();
    $('.story-canvas').stop().css({top : '34px'});
    canvas.toolsHidden = false;
}

sc.hideTools = function(canvas) {
    $('.sc-left-nav').hide();
    $('.sc-right-nav').hide();
    $('.sc-toolbar').hide();
    $('.story-canvas').stop().animate({top : 0}, 1000);
    canvas.toolsHidden = true;
}




sc.openFullWindow = function (canvasName) {
    //window.scrollTo(0, 0);
    $('html, body').css({
        'overflow': 'hidden',
    });
    $('#'+canvasName+'-full-window').fadeIn();
    //$('body').on('swipeup',function() {
    //    closeFullScreen(parentDiv);
    //});
    //$('body').on('swipedown',function() {
    //    closeFullScreen(parentDiv);
    //});  
    
    $('#blackout').show();
    sc.unzoom(canvas, canvas.embeddedDiv);
    canvas.fullWindowShowing = true;
    
}


sc.closeFullWindow = function (canvasName) {
	$('#blackout').hide();
    $('#'+canvasName+'-full-window').hide();
    $('html, body').css({
        'overflow': 'auto',
    });
    $('body').unbind();
    sc.unzoom(canvas, canvas.fullWindowDiv);
    endFullScreen();
    canvas.fullWindowShowing = false;
}

sc.moveBackward = function (canvas) {
	if (canvas.currentSlidePosition == 1) {
		if (canvas.toolsHidden) {
			sc.showTools(canvas);
		}
		return;
	}
    //change slides
	canvas.currentSlidePosition--;
    if (canvas.currentTextPosition != 0) {
        sc.hideSlide(canvas);
        canvas.currentTextPosition--;
        sc.showSlide(canvas);
    } else {
        sc.hideSlide(canvas);
        canvas.currentImagePosition--;
        canvas.currentTextPosition = canvas.slides[canvas.currentImagePosition].text.length - 1;
        sc.showSlide(canvas);
    }
}

sc.moveForward = function (canvas) {
	if (canvas.currentSlidePosition == canvas.slideCount) {
		if (canvas.toolsHidden) {
			sc.showTools(canvas);
		}
		return;
	}
    //change slides
    canvas.currentSlidePosition++;
    if (canvas.currentTextPosition < canvas.slides[canvas.currentImagePosition].text.length - 1) {
        sc.hideSlide(canvas);
        canvas.currentTextPosition++;
        sc.showSlide(canvas);
    } else {
        sc.hideSlide(canvas);
        canvas.currentImagePosition++;
        canvas.currentTextPosition = 0;
        sc.showSlide(canvas);
    }
    
}


sc.showSlide = function (canvas) {
    var imgClass = 'sc-image-' + canvas.currentImagePosition;
    var textClass = "sc-image-" + canvas.currentImagePosition + '-text-' + canvas.currentTextPosition;
    if ( $('.'+imgClass).length ) {
        $('.'+imgClass).parent().stop().fadeIn(500, function() {
            $('.'+textClass).stop().fadeIn(400);
        });
        $(canvas.canvasDiv+' .sc-zoom').show();
    } else {
        $('.'+textClass).stop().fadeIn(400);
        $(canvas.canvasDiv+' .sc-zoom').hide();
    }
    
    
    if (canvas.currentSlidePosition == 1) {
    	$('.sc-back').css({visibility: 'hidden'});
    } else {
    	$('.sc-back').css({visibility: 'visible'});
    }
    if (canvas.currentSlidePosition == canvas.slideCount) {
    	$('.sc-forward').css({visibility : 'hidden'});
    	$('.sc-restart').css({visibility : 'visible'});
    } else {
    	$('.sc-forward').css({visibility : 'visible'});
    	$('.sc-restart').css({visibility : 'hidden'});
    }
    $('.sc-position').text(canvas.currentSlidePosition);
}

sc.hideSlide = function (canvas) {
	var imgClass = 'sc-image-' + canvas.currentImagePosition
    var textClass = "sc-image-" + canvas.currentImagePosition + '-text-' + canvas.currentTextPosition;
    $('.'+imgClass).parent().stop().fadeOut(200);
    $('.'+textClass).stop().fadeOut(200);
    sc.unzoom(canvas, canvas.fullWindowDiv);
    sc.unzoom(canvas, canvas.embeddedDiv);
}

sc.zoom = function (canvas, parentDiv) {
	var imgDiv = parentDiv+' .sc-image-'+canvas.currentImagePosition
	img = $(imgDiv).get( 0 );
	if (img) {
		imgHeight = img.naturalHeight;
		imgWidth = img.naturalWidth;
		boxHeight = $(img).parent().height();
		boxWidth = $(img).parent().width();
		height = (boxHeight-imgHeight)/2;
		width = (boxWidth-imgWidth)/2;
        $(imgDiv)
            .css({maxWidth: 'none', maxHeight: 'none', transform:'none', zIndex: 5000})
            .draggable();
        $(imgDiv)
        	.css({top: height, left: width, margin: 0, height: imgHeight, width: imgWidth, cursor: 'move'});
        $(parentDiv+' .sc-zoom').hide();
		$(parentDiv+' .sc-tap-forward-zone').hide();
		$(parentDiv+' .sc-tap-backward-zone').hide();
		$(parentDiv+' .sc-unzoom').show();
		//$('body').unbind();
	    //$('body').unbind();
		canvas.imageZoomed = true;
	}
}

sc.unzoom = function (canvas, parentDiv) {
	if ($(parentDiv+' .sc-image-'+canvas.currentImagePosition).data('ui-draggable')) {
        $(parentDiv+' .sc-image-'+canvas.currentImagePosition)
        	.draggable( "destroy" )
            .css({maxWidth: '100%', maxHeight: '100%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'})
            .css({width: 'auto', height: 'auto', position: 'absolute', zIndex: 1000, cursor: 'zoom-in'});
	}
	$(parentDiv+' .sc-unzoom').hide();
	$(parentDiv+' .sc-tap-forward-zone').show();
	$(parentDiv+' .sc-tap-backward-zone').show();
	//$('body').on('swipeup',function() {
    //    closeFullScreen(parentDiv);
    //});
    //$('body').on('swipedown',function() {
    //    closeFullScreen(parentDiv);
	canvas.imageZoomed = false;
}





























/*
var imgPosition = 0;
var textPosition = 0;
var position = 1;
var fullscreen = false;
var tryFullScreen = false;
var imgZoomed = false;
var backgroundColor = "#cc3300";
var toolbarColor = "#661a00";
*/


















function moveBackward(parentDiv, slides) {
    //change slides
    position--;
    if (textPosition != 0) {
        hideSlide(parentDiv, imgPosition,textPosition, true);
        textPosition--;
        showSlide(imgPosition,textPosition, parentDiv, slides);
    } else {
        hideSlide(parentDiv, imgPosition,textPosition, false);
        imgPosition--;
        textPosition = slides[imgPosition].text.length - 1;
        showSlide(imgPosition,textPosition, parentDiv, slides);
    }
    //update context
    $('.sc-forward').css({visibility : 'visible'});
    $('.sc-restart').css({color : backgroundColor});
    if (imgPosition == 0 && textPosition == 0) {
        $('.sc-back').css({visibility : 'hidden'});
    }
    $('.sc-position').text(position);
}

function moveForward(parentDiv, slides) {
    //change slides
    position++;
    if (textPosition < slides[imgPosition].text.length - 1) {
        hideSlide(parentDiv, imgPosition,textPosition, true);
        textPosition++;
        showSlide(imgPosition,textPosition, parentDiv, slides);
    } else {
        hideSlide(parentDiv, imgPosition,textPosition, false);
        var lastImgPosition = imgPosition;
        imgPosition++;
        textPosition = 0;
        showSlide(imgPosition,textPosition, parentDiv, slides);
    }
    //update context
    $('.sc-back').css({visibility : 'visible'});
    if (imgPosition == slides.length - 1 && textPosition == slides[imgPosition].text.length - 1) {
        $('.sc-forward').css({visibility : 'hidden'});
        $('.sc-restart').css({color : 'white'});
    }
    $('.sc-position').text(position);
}

function closeFullScreen(parentDiv) {
	$('#blackout').hide();
    $(parentDiv).hide();
    $('html, body').css({
        'overflow': 'auto',
        'height' : 'auto'
    });
    $('body').unbind();
    unzoom(parentDiv, imgPosition);
    fullscreen = false;
    if (tryFullScreen) {
        endFullScreen();
    }
    
}

function openFullScreen(parentDiv) {
    window.scrollTo(0, 0);
    $('html, body').css({
        'overflow': 'hidden',
        'height' : 'auto'
    });
    $(parentDiv).fadeIn();
    //$('body').on('swipeup',function() {
    //    closeFullScreen(parentDiv);
    //});
    //$('body').on('swipedown',function() {
    //    closeFullScreen(parentDiv);
    //});  
    
    $('#blackout').show();
    unzoom(parentDiv, imgPosition);
    fullscreen = true;
}

 function configureWindow(slides, parentDiv) {
    $(parentDiv + ' .sc-image-' + imgPosition).show();
    $('.sc-text').hide();
    var textClass = "sc-image-" + imgPosition + '-text-' + textPosition;
    $('.'+textClass).fadeIn(200);
}

function showSlide(slideNumber, textNumber, parentDiv, slides) {
    var imgClass = 'sc-image-' + slideNumber
    var textClass = "sc-image-" + slideNumber + '-text-' + textNumber;
    if ( $('.'+imgClass).length ) {
        $('.'+imgClass).parent().stop().fadeIn(1000, function() {
            $('.'+textClass).stop().fadeIn(500);
        });
    } else {
        $('.'+textClass).stop().fadeIn(500);
    }
    slide = slides[slideNumber]
    if ( slide.hasOwnProperty('textFormatting')) {
        var overlay = ifProp(slide.textFormatting, 'overlay', true);
    }
    //if (!overlay) {
    //    height = $(parentDiv+' .'+textClass).outerHeight();
    //    $(parentDiv+' .sc-image-box').stop().animate({bottom: height}, 500);
    //} else {
    //    $(parentDiv+' .sc-image-box').stop().animate({bottom: 0}, 500);
    //}
    
}

function hideSlide(parentDiv, slideNumber, textNumber, repeat, speed) {
    var textClass = "sc-image-" + slideNumber + '-text-' + textNumber;
    if (!repeat) {
        $('.sc-image-' + slideNumber).parent().stop().fadeOut(200);
    }
    $('.'+textClass).stop().fadeOut(200);
    unzoom(parentDiv, slideNumber);
    
}

function zoom(parentDiv, imgPosition) {
	img = $(parentDiv+' .sc-image-'+imgPosition).get( 0 );
	if (img) {
		imgHeight = img.naturalHeight;
		imgWidth = img.naturalWidth;
		boxHeight = $(img).parent().height();
		boxWidth = $(img).parent().width();
		height = (boxHeight-imgHeight)/2;
		width = (boxWidth-imgWidth)/2;
        $(parentDiv+' .sc-image-'+imgPosition)
            .css({maxWidth: 'none', maxHeight: 'none', transform:'none', zIndex: 5000})
            .draggable();
        $(parentDiv+' .sc-image-'+imgPosition)
        .css({top: height, left: width, margin: 0, height: imgHeight, width: imgWidth, cursor: 'move'});
        $('.sc-zoom').hide();
		$('.sc-tap-forward-zone').hide();
		$('.sc-tap-backward-zone').hide();
		$('.sc-unzoom').show();
		//$('body').unbind();
	    //$('body').unbind();
		imgZoomed = true;
	}
}

function unzoom(parentDiv, imgPosition) {
	if ($(parentDiv+' .sc-image-'+imgPosition).data('ui-draggable')) {
        $(parentDiv+' .sc-image-'+imgPosition)
        	.draggable( "destroy" )
            .css({maxWidth: '100%', maxHeight: '100%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'})
            .css({width: 'auto', height: 'auto', position: 'absolute', zIndex: 1000, cursor: 'zoom-in'});
	}
	$('.sc-unzoom').hide();
	$('.sc-zoom').show();
	$('.sc-tap-forward-zone').show();
	$('.sc-tap-backward-zone').show();
	//$('body').on('swipeup',function() {
    //    closeFullScreen(parentDiv);
    //});
    //$('body').on('swipedown',function() {
    //    closeFullScreen(parentDiv);
	imgZoomed = false;
}


/*
function bindZoomFeatures(parentDiv, imgPosition) {
	//alert(parentDiv);
	//alert(imgPosition);
	$(parentDiv+' .sc-zoom').unbind().click(function() {
		img = $(parentDiv+' .sc-image-'+imgPosition).get( 0 );
		if (img) {
			imgBox = $(parentDiv+' .sc-image-box-'+imgPosition).get( 0 );
			height = img.naturalHeight;
			width = img.naturalWidth;
			boxHeight = imgBox.naturalHeight;
			boxWidth = imgBox.naturalWidth;
	        $(parentDiv+' .sc-image-'+imgPosition).draggable()
	            .css({maxWidth: 'none', maxHeight: 'none', width: width, height: height});
	        $(parentDiv+' .sc-zoom').replaceWith('<a href="#" class="sc-unzoom"><i class="fa fa-search-minus" aria-hidden="true"></i></a>'); 
		}
		bindZoomFeatures(parentDiv, imgPosition);
    });
    $(parentDiv+' .sc-unzoom').unbind().click(function() {
        $(parentDiv+' .sc-image-'+imgPosition).draggable( "destroy" )
            .css({maxWidth: '100%', maxHeight: '100%'})
            .css({width: 'auto', height: 'auto', position: 'static', left: 'auto', top: 'auto'});
        $(parentDiv+' .sc-unzoom').replaceWith('<a href="#" class="sc-zoom"><i class="fa fa-search-plus" aria-hidden="true"></i></a>');
        bindZoomFeatures(parentDiv, imgPosition);
    });
}
*/


    
function getTextFormatting(slide, displayType) {
	tf = slide.textFormatting;
	myobj = {
		fontSize: tf.fontSize,
		color: tf.color,
		backgroundColor: tf.backgroundColor,
		opacity: tf.opacity,
		transform: tf.transform,
		top: tf.top,
		bottom: tf.bottom
	};
    return myobj;
}

function getImageBoxFormatting(slide, displayType) {
    var myobj = {};
    if (!slide.textFormatting.overlay) {
        myobj.bottom = '55px';
    }
    return myobj;
}

function getImageFormatting(parentDiv,imageNum) {
	var img = $(parentDiv+' .sc-image-'+imageNum).get( 0 );
	if (img) {
		imgHeight = img.naturalHeight;
		imgWidth = img.naturalWidth;
		boxHeight = $(img).parent().height();
		boxWidth = $(img).parent().width();
		top = (boxHeight - imgHeight)/2;
		left = (boxWidth - imgWidth)/2;
		alert(imgHeight + ":" + imgWidth + "  " + boxHeight + ":" + boxWidth);
		return {left: left, top: top};
	}
	return {};
}

    


