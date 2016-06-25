



	

function createStoryCanvas(storyData, storyName, embed) {
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
            if ( storyData.globalSettings.hasOwnProperty("tryFullScreen") ) {
                tryFullScreen = storyData.globalSettings.tryFullScreen;
            }
        }
}


function makeCanvas(storyData, storyName, type) {
    
    /*
     * CREATE HTML ELEMENTS FOR STORY CANVAS
     */
    var slides = storyData.slides;
    var slideCount = 0;
    for (var i=0; i < slides.length; i++) {
        for (var j=0; j<slides[i].text.length; j++) {
            slideCount++;
        }
    }
    var leftNav = '';
    var rightNav = '';
    var tapForwardZone = '';
    var tapBackwardZone = '';
    if ( !is_touch_device() ) {
        leftNav = '<div class="sc-left-nav"><a href="#" class="sc-back"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i></a></div>';
        rightNav = '<div class="sc-right-nav"><a href="#" class="sc-forward"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a></div>';
    } else {
        tapForwardZone = '<div class="sc-tap-forward-zone"></div>';
        tapBackwardZone = '<div class="sc-tap-backward-zone"></div>';
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
    $(parentDiv).html(
        '<div class="story-canvas"></div>' +
        tapForwardZone +
        tapBackwardZone +
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
        rightNav
    );
	
    
    for (var i=0; i < slides.length; i++) {
        if (slides[i].img) { 
            $(parentDiv+' .story-canvas').append('<div class="sc-image-box sc-image-box-' +i + '"></div>');
            $(parentDiv+' .story-canvas .sc-image-box-'+i).append('<img src="' + slides[i].img + '" alt="' + slides[i].alt + '" class="sc-image-' + i + '" />');
        }
        if (slides[i].text) { 
            
            for (var j=0; j < slides[i].text.length; j++) {
                var txtClass = 'sc-image-' + i + '-text-' + j;
                $(parentDiv+' .story-canvas').append('<div " class="sc-text ' + txtClass + '" />');
                $(parentDiv+' .'+txtClass).css( getTextFormatting(slides[i], type) );
                $(parentDiv+' .'+txtClass).html(slides[i].text[j]);
            }
            $(parentDiv+' .sc-image-box-'+i).css( getImageFormatting(slides[i], type, i, j) );
        }
    }
    
    configureWindow(slides, parentDiv);

    /*
     * ATTACH EVENTS FOR FULLSCREEN STORY CANVAS
     */
    if (type == "fullscreen") {
        
        $('.' + storyName + '-open').click(function() {
            openFullScreen(parentDiv);
            fullscreen = true;
            return false;
        });
        
        $('.sc-close').click(function() {
            closeFullScreen(parentDiv);
            return false;
        });
        
        $(document).keydown(function(e){
            if (e.keyCode == 37 && fullscreen) { 
                if (imgPosition != 0 || textPosition != 0) {
                    moveBackward(parentDiv, slides);
                }
                return false;
            }
            if (e.keyCode == 39 && fullscreen) { 
                var lastImg = slides.length - 1;
                var lastText = slides[lastImg].text.length - 1
                if (imgPosition != lastImg || textPosition != lastText) {
                    moveForward(parentDiv, slides);
                }
                return false;
            }
            if (e.keyCode == 27 && fullscreen) {
                closeFullScreen(parentDiv);
                return false;
            }
        });

        $( window ).on( "orientationchange", function( event ) {
            //some browsers will change scroll permission when orientation change
            setTimeout( function() {
                for (var i=0; i < slides.length; i++) {
                    if (slides[i].text) { 
                        for (var j=0; j < slides[i].text.length; j++) {
                            var txtClass = 'sc-image-' + i + '-text-' + j;
                           $('.sc-container .'+txtClass).css( getTextFormatting(slides[i], 'fullscreen') );
                        }
                        $('.sc-container .sc-image-box-'+i).css( getImageFormatting(slides[i], 'fullscreen', i, j) );
                    }
                }
                window.scrollBy(0,-100);
            }, 1000);
            if (fullscreen) {
                //alert(parentDiv);
                //closeFullScreen(parentDiv);
                //openFullScreen(parentDiv);
                //$(window).scrollTop();
                //$('html').scrollTop();
                //$('body').scrollTop();
                //$('.ui-page-active').scrollTop();
                //$(parentDiv).scrollTop();
                //$('.story-canvas').scrollTop();
                //window.scrollTo(0, 5);
                //configureWindow(slides, parentDiv);
                window.scrollBy(0,-100);
            }
        });
        
    }

    /*
     * ATTACH EVENTS FOR STORY CANVAS (BOTH FULL SCREEN AND EMBEDDED
     */
    $(parentDiv+' .sc-forward').click(function() {
        moveForward(parentDiv, slides);
        return false;
    });
    
    $(parentDiv+' .sc-back').click(function() {
        moveBackward(parentDiv, slides);
        return false;
    });

    $(parentDiv+' .sc-restart').click(function() {
        hideSlide(imgPosition,textPosition, false);
        textPosition = 0;
        imgPosition = 0;
        position = 1;
        $('.sc-back').css({visibility: 'hidden'});
        $('.sc-forward').css({visibility: 'visible'});
	$('.sc-position').text(position);
        showSlide(imgPosition,textPosition, parentDiv, slides);
        return false;
    });
    
    if (!is_touch_device()) {
        $(parentDiv).mouseout(function() {
            if (imgPosition != 0 || textPosition != 0) {
                $('.sc-left-nav').hide();
                $('.sc-right-nav').hide();
                $('.sc-toolbar').hide();
                $('.story-canvas').stop().animate({top : 0}, 1000);
            }
        });

        $(parentDiv).mouseover(function() {
            $('.sc-left-nav').show();
            $('.sc-right-nav').show();
            $('.sc-toolbar').show();
            $('.story-canvas').stop().css({top : '34px'});
        });
    } else {
    
        $(parentDiv+' .sc-tap-forward-zone').on('swipeleft',function() {
            var lastImg = slides.length - 1;
            var lastText = slides[lastImg].text.length - 1
            if (imgPosition != lastImg || textPosition != lastText) {
                moveForward(parentDiv, slides);
            }
        });
        $(parentDiv+' .sc-tap-forward-zone').on('swiperight',function() {
            if (imgPosition != 0 || textPosition != 0) {
                moveBackward(parentDiv, slides);
            }
        });
        $(parentDiv+' .sc-tap-forward-zone').on('tap',function() {
            var lastImg = slides.length - 1;
            var lastText = slides[lastImg].text.length - 1
            if (imgPosition != lastImg || textPosition != lastText) {
                moveForward(parentDiv, slides);
            }
        });
        $(parentDiv+' .sc-tap-backward-zone').on('tap',function() {
            if (imgPosition != 0 || textPosition != 0) {
                moveBackward(parentDiv, slides);
            }
        });
   }
   
};




