var imgPosition = 0;
var textPosition = 0;
var position = 1;
var fullscreen = false;



	

function makeStoryCanvas(storyData, storyName, embed) {
	embed = embed || false;
	if (embed) {
		makeCanvas(storyData, storyName, 'embedded');
	}
	makeCanvas(storyData, storyName, 'fullscreen');
        if ( storyData.hasOwnProperty("globalSettings") ) {
            if ( storyData.globalSettings.hasOwnProperty("backgroundColor") ) {
                color = storyData.globalSettings.backgroundColor;
                $('.sc-container').css({backgroundColor: color});
                $('.sc-embedded').css({backgroundColor: color});
                $('.sc-toolbar').css({color: color});
                $('.sc-toolbar a').css({color: color});
            }
            if ( storyData.globalSettings.hasOwnProperty("toolbarColor") ) {
                color = storyData.globalSettings.toolbarColor;
                $('.sc-left-nav a').css({color: color});
                $('.sc-right-nav a').css({color: color});
                $('.sc-toolbar').css({backgroundColor: color});
            }
        }
}


function makeCanvas(storyData, storyName, type) {
    var slides = storyData.slides;
    var slideCount = 0;
    for (var i=0; i < slides.length; i++) {
        for (var j=0; j<slides[i].text.length; j++) {
            slideCount++;
        }
    }
    
	var leftNav = '';
	var rightNav = '';
    if ( !is_touch_device() ) {
		leftNav = '<div class="sc-left-nav"><a href="#" class="sc-back"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i></a></div>';
		rightNav = '<div class="sc-right-nav"><a href="#" class="sc-forward"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a></div>';
	}
    
    
    
    if (type == "fullscreen") {
		var parentDiv = "#" + storyName + "-fullscreen";
		$('body').append('<div id="' + storyName + '-fullscreen" class="sc-container ' + storyName + '"></div>');
                var toolbarRight = '<a href="#" class="sc-close"><i class="fa fa-times" aria-hidden="true"></i></a>';
	} else {
		var parentDiv = "#" + storyName + "-container";
                $(parentDiv).addClass(storyName);
                $(parentDiv).addClass('sc-embedded');
                var toolbarRight = '<a href="#" class="' + storyName + '-open"><i class="fa fa-arrows-alt" aria-hidden="true"></i></a>';
	}
    $(parentDiv).html('<div class="story-canvas">' +
        '</div>' +
        '<div class="sc-toolbar">' +
            '<div class="sc-toolbar-right">' +
				'<a href="#" class="sc-restart"><i class="fa fa-fast-backward" aria-hidden="true"></i></a>' +
				'&nbsp;&nbsp;&nbsp;' +
                toolbarRight +
            '</div>' +
            '<div class="sc-toolbar-left">' +
                '<span class="sc-position">1</span>/' + slideCount +
            '</div>' +
        '</div>' +
        leftNav +
        rightNav);
	
    
    for (var i=0; i < slides.length; i++) {
        if (slides[i].img) { 
            $(parentDiv+' .story-canvas').append('<img src="' + slides[i].img + '" alt="' + slides[i].alt + '" class="sc-image-' + i + '" />');
        }
    }
    $(parentDiv+' .story-canvas').append('<div class="sc-text"></div>');

    //create open event for fullscreen or open now for embedded
    if (type == "fullscreen") {
        $('.' + storyName + '-open').click(function() {
            $('html, body').css({
                'overflow': 'hidden',
				'height' : '100%',
            });
            openWindow();
            fullscreen = true;
			toggleFullScreen();
            return false;
        });
    } else {
        openWindow();
    }

    $(parentDiv+' .sc-forward').click(function() {
        moveForward();
        return false;
    });
    
    $(parentDiv+' .sc-back').click(function() {
        moveBackward();
        return false;
    });

    if (type == "fullscreen") {
        $('.sc-close').click(function() {
            closeWindow();
            return false;
        });
    }

    $(parentDiv+' .sc-restart').click(function() {
        textPosition = 0;
        imgPosition = 0;
        position = 1;
        $('.sc-back').css({visibility: 'hidden'});
        $('.sc-forward').css({visibility: 'visible'});
        $('.story-canvas img').hide();
        $('.sc-image-' + imgPosition).show();
        $('.sc-text').css( getTextFormatting(slides[imgPosition]) );
        $('.sc-text').html(slides[imgPosition].text[textPosition]);
	$('.sc-position').text(position);
        return false;
    });

    
    $(parentDiv).mouseout(function() {
        if (imgPosition != 0 || textPosition != 0) {
            $('.sc-left-nav').hide();
            $('.sc-right-nav').hide();
            $('.sc-toolbar').hide();
        }
    });
    $(parentDiv).mouseover(function() {
        $('.sc-left-nav').show();
        $('.sc-right-nav').show();
        $('.sc-toolbar').show();
    });
	$(parentDiv).on('swipeleft',function() {
		var lastImg = slides.length - 1;
		var lastText = slides[lastImg].text.length - 1
		if (imgPosition != lastImg || textPosition != lastText) {
			moveForward();
		}
	});
	$(parentDiv).on('swiperight',function() {
		if (imgPosition != 0 || textPosition != 0) {
			moveBackward();
		}
	});
	

    if (type == "fullscreen") {
        $(document).keydown(function(e){
            if (e.keyCode == 37 && fullscreen) { 
                if (imgPosition != 0 || textPosition != 0) {
                    moveBackward();
                }
                return false;
            }
            if (e.keyCode == 39 && fullscreen) { 
                var lastImg = slides.length - 1;
                var lastText = slides[lastImg].text.length - 1
                if (imgPosition != lastImg || textPosition != lastText) {
                    moveForward();
                }
                return false;
            }
                    if (e.keyCode == 27 && fullscreen) {
                            closeWindow();
                            return false;
                    }
        });
		$(parentDiv).on('swipeup',function() {
			closeWindow();
		});
		$(parentDiv).on('swipedown',function() {
			closeWindow();
		});
		/*
		$( window ).on( "orientationchange", function( event ) {
			alert('test1');
			//some browsers will change scroll permission when orientation change
		    if (fullscreen) {
				window.scrollTo(0, 0);
				alert('test');
			}
		});
		*/
    }
    
    function ifProp(obj, property, alt) {
        if ( obj.hasOwnProperty(property) ) {
            return obj[property];
        } else {
            return alt;
        }
    }
    
    function getTextFormatting(slide) {
        var myobj = {};
        if (!slide.hasOwnProperty("textFormatting")) {
            slide.textFormatting = {}
        }
        myobj.color = ifProp(slide.textFormatting, "color", "white");
        myobj.top = ifProp(slide.textFormatting, "top", "80%");
        myobj.fontSize = ifProp(slide.textFormatting, "fontSize", "20px");
		myobj.backgroundColor = ifProp(slide.textFormatting, "backgroundColor", "transparent");
		myobj.opacity = ifProp(slide.textFormatting, "opacity", "1");
        console.log(myobj);
        return myobj;
    }
	
    function openWindow() {
        $("html, body").animate({ scrollTop: 0 }, "slow");
		$(parentDiv).fadeIn();
        $(parentDiv + ' .sc-image-' + imgPosition).show();
        $(parentDiv + ' .sc-text').css( getTextFormatting(slides[imgPosition]) );
        $(parentDiv + ' .sc-text').html(slides[imgPosition].text[textPosition]);
    }
	
	function closeWindow() {
		$(parentDiv).hide();
		$('html, body').css({
			'overflow': 'auto',
			'height' : 'auto'
		});
		fullscreen = false;
		toggleFullScreen();
	}
    
    function moveForward() {
        //change slides
        position++;
        if (textPosition < slides[imgPosition].text.length - 1) {
            textPosition++;
            $('.sc-text').fadeOut(200, function() {
                $('.sc-text').html(slides[imgPosition].text[textPosition]);
                $('.sc-text').fadeIn(200);
            });
        } else {
            var lastImgPosition = imgPosition;
            imgPosition++;
            textPosition = 0;
            $('.sc-text').fadeOut(200);
            $('.sc-image-' + lastImgPosition).fadeOut(1000);
            if (slides[imgPosition].hasOwnProperty('img')) {
                $('.sc-image-' + imgPosition).fadeIn(1000, function() {
                    $('.sc-text').html(slides[imgPosition].text[textPosition]);
                    $('.sc-text').css( getTextFormatting(slides[imgPosition]) );
                    $('.sc-text').fadeIn(200);
                });
            } else {
                setTimeout(function() {
                    $('.sc-text').html(slides[imgPosition].text[textPosition]);
                    $('.sc-text').css( getTextFormatting(slides[imgPosition]) );
                    $('.sc-text').fadeIn(200);
                }, 1000);
            }
        }
        //update context
        $('.sc-back').css({visibility : 'visible'});
        if (imgPosition == slides.length - 1 && textPosition == slides[imgPosition].text.length - 1) {
            $('.sc-forward').css({visibility : 'hidden'});
        }
        $('.sc-position').text(position);
    }
    
    function moveBackward() {
        //change slides
        position--;
        if (textPosition != 0) {
            textPosition--;
            $('.sc-text').fadeOut(200, function() {
                $('.sc-text').html(slides[imgPosition].text[textPosition]);
                $('.sc-text').fadeIn(200);
            });
        } else {
            var lastImgPosition = imgPosition;
            imgPosition--;
            textPosition = slides[imgPosition].text.length - 1;
            $('.sc-text').fadeOut(200);
            $('.sc-image-' + lastImgPosition).fadeOut(1000);
            if (slides[imgPosition].hasOwnProperty('img')) {
                $('.sc-image-' + imgPosition).fadeIn(1000, function() {
                    $('.sc-text').html(slides[imgPosition].text[textPosition]);
                    $('.sc-text').css( getTextFormatting(slides[imgPosition]) );
                    $('.sc-text').fadeIn(200);
                });
            } else {
                setTimeout(function() {
                    $('.sc-text').html(slides[imgPosition].text[textPosition]);
                    $('.sc-text').css( getTextFormatting(slides[imgPosition]) );
                    $('.sc-text').fadeIn(200);
                }, 1000);
            }
        }
        //update context
        $('.sc-forward').css({visibility : 'visible'});
        if (imgPosition == 0 && textPosition == 0) {
            $('.sc-back').css({visibility : 'hidden'});
        }
        $('.sc-position').text(position);
    }
    
    
};




