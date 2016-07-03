
var imgPosition = 0;
var textPosition = 0;
var position = 1;
var fullscreen = false;
var tryFullScreen = false;
var imgZoomed = false;
var backgroundColor = "#cc3300";
var toolbarColor = "#661a00";


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
    var myobj = {};
    if (!slide.hasOwnProperty("textFormatting")) {
        slide.textFormatting = {};
    }
    overlay = ifProp(slide.textFormatting, "overlay", false);
    center = ifProp(slide.textFormatting, "center", false);
    if (overlay && center) {
        myobj.top = '50%';
        myobj.bottom = 'auto'
        myobj.transform = 'translate(0, -50%)';
    } else if (overlay) {
        myobj.top = ifProp(slide.textFormatting, "top", "70%");
        myobj.bottom = 'auto';
        myobj.transform = 'none';
    } else {
        myobj.top = 'auto';
        //if (displayType == 'fullscreen') {
        //    myobj.bottom = '40px';
        //} else {
            myobj.bottom = 0;
        //}
        myobj.transform = 'none';
    }
    myobj.color = ifProp(slide.textFormatting, "color", "white");
    myobj.fontSize = ifProp(slide.textFormatting, "fontSize", "20px");
    myobj.backgroundColor = ifProp(slide.textFormatting, "backgroundColor", "transparent");
    myobj.opacity = ifProp(slide.textFormatting, "opacity", "1");
    console.log(myobj);
    return myobj;
}

function getImageBoxFormatting(slide, type, i, j) {
    var myobj = {};
    var height = 0;
    for (var j=0; j < slide.text.length; j++) {
        var txtClass = 'sc-image-' + i + '-text-' + j;
        height = Math.max( height, $('.'+txtClass).outerHeight() );
    }
    if ( slide.hasOwnProperty('textFormatting')) {
        var overlay = ifProp(slide.textFormatting, 'overlay', false);
    }
    if (type == "fullscreen") {
        height = height + 40;
    } 
    if (!overlay) {
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

    


