



	

function createStoryCanvas(storyData, storyName, embed) {
	embed = embed || false;
	if ( storyData.globalSettings.hasOwnProperty("tryFullScreen") ) {
        tryFullScreen = storyData.globalSettings.tryFullScreen;
    }
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
                backgroundColor = color;
                
            }
            if ( storyData.globalSettings.hasOwnProperty("toolbarColor") ) {
                color = storyData.globalSettings.toolbarColor;
                $('.sc-left-nav a').css({color: color});
                $('.sc-right-nav a').css({color: color});
                $('.sc-toolbar').css({backgroundColor: color});
                toolbarColor = color;
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
    var fsTool = '';
    var closeTool = '';
    var tapForwardZone = '';
    var tapBackwardZone = '';
    if ( !is_touch_device() ) {
        leftNav = '<div class="sc-left-nav"><a href="#" class="sc-back" title="back"><i class="fa fa-chevron-circle-left" aria-hidden="true"></i></a></div>';
        rightNav = '<div class="sc-right-nav"><a href="#" class="sc-forward" title="forward"><i class="fa fa-chevron-circle-right" aria-hidden="true"></i></a></div>';
    } else {
        tapForwardZone = '<div class="sc-tap-forward-zone"></div>';
        tapBackwardZone = '<div class="sc-tap-backward-zone"></div>';
    }
    if (type == "fullscreen") {
        var parentDiv = "#" + storyName + "-fullscreen";
        $('body').append('<div id="blackout">&nbsp;</div>');
        $('body').append('<div id="' + storyName + '-fullscreen" class="sc-container ' + storyName + '"></div>');
        if (!is_touch_device()) {
        	fsTool = '<a href="#" class="sc-go-fullscreen" title="fullscreen mode"><i class="fa fa-arrows-alt" aria-hidden="true"></i></a>&nbsp;&nbsp;&nbsp;';
        }
        var closeTool = '<a href="#" class="sc-close" title="close window"><i class="fa fa-times" aria-hidden="true"></i></a>';
    } else {
        var parentDiv = "#" + storyName + "-container";
        $(parentDiv).addClass(storyName);
        $(parentDiv).addClass('sc-embedded');
        var closeTool = '<a href="#" class="' + storyName + '-open" title="expand"><i class="fa fa-expand" aria-hidden="true"></i></a>';
    }
    $(parentDiv).html(
        '<div class="story-canvas"></div>' +
        tapForwardZone +
        tapBackwardZone +
        '<div class="sc-toolbar">' +
            '<div class="sc-toolbar-right">' +
            	fsTool +
	        	'<a href="#" class="sc-zoom" title="zoom image"><i class="fa fa-search-plus" aria-hidden="true"></i></a>' +
	        	'<a href="#" class="sc-unzoom" title="unzoom"><i class="fa fa-search-minus" aria-hidden="true"></i></a>' +
	        	'&nbsp;&nbsp;&nbsp;' +
                closeTool +
            '</div>' +
            '<div class="sc-toolbar-left">' +
                '<a href="#" class="sc-restart" title="start over"><i class="fa fa-fast-backward" aria-hidden="true"></i></a>' +
			    '&nbsp;&nbsp;&nbsp;' +
                '<span class="sc-position">1</span>/' + slideCount +
            '</div>' +
        '</div>' +
        leftNav +
        rightNav
    );
	
    
    for (var i=0; i < slides.length; i++) {
        if (slides[i].img) { 
            $(parentDiv+' .story-canvas').append('<div class="sc-image-box sc-image-box-' +i + '"></div>');
            $(parentDiv+' .story-canvas .sc-image-box-'+i).append('<img src="' + slides[i].img + '" alt="' + slides[i].alt + '" class="sc-image sc-image-' + i + '" />');
        }
        if (slides[i].text) { 
            
            for (var j=0; j < slides[i].text.length; j++) {
                var txtClass = 'sc-image-' + i + '-text-' + j;
                $(parentDiv+' .story-canvas').append('<div " class="sc-text ' + txtClass + '" />');
                $(parentDiv+' .'+txtClass).css( getTextFormatting(slides[i], type) );
                $(parentDiv+' .'+txtClass).html(slides[i].text[j]);
            }
            $(parentDiv+' .sc-image-box-'+i).css( getImageBoxFormatting(slides[i], type, i, j) );
            //$(parentDiv+' .sc-image-'+i).css( getImageFormatting(parentDiv, i) );
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
        
        $('.sc-go-fullscreen').click(function() {
        	if (tryFullScreen) {
                toggleFullScreen();
            }
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
                //for (var i=0; i < slides.length; i++) {
                //    if (slides[i].text) { 
                //        for (var j=0; j < slides[i].text.length; j++) {
                //            var txtClass = 'sc-image-' + i + '-text-' + j;
                //           $('.sc-container .'+txtClass).css( getTextFormatting(slides[i], 'fullscreen') );
                //        }
                //        $('.sc-container .sc-image-box-'+i).css( getImageFormatting(slides[i], 'fullscreen', i, j) );
                //    }
                //}
                if (fullscreen && event.orientation == 'portrait') {
                    window.scrollBy(0,-100);
                }
            }, 500);
            //if (fullscreen) {
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
            //    window.scrollBy(0,-100);
            //}
        });
        
    }

    /*
     * ATTACH EVENTS FOR STORY CANVAS (BOTH FULL SCREEN AND EMBEDDED)
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
        hideSlide(parentDiv, imgPosition,textPosition, false);
        textPosition = 0;
        imgPosition = 0;
        position = 1;
        $('.sc-back').css({visibility: 'hidden'});
        $('.sc-forward').css({visibility: 'visible'});
        $('.sc-position').text(position);
        $('.sc-restart').css({color : backgroundColor});
        showSlide(imgPosition,textPosition, parentDiv, slides);
        return false;
    });
    
    $(parentDiv+' .sc-zoom').click(function() {
    	zoom(parentDiv, imgPosition)
    });
    
    $(parentDiv+' .sc-unzoom').click(function() {
    	unzoom(parentDiv, imgPosition);
    });
    
    
    
    
    
    
    
    
    /*
    function bindZoomFeaturesOld() {
    	$(parentDiv+' .sc-zoom').click(function() {
            $(parentDiv+' .sc-image-'+imgPosition)
                .css({height: height, width: width})
                .css({maxWidth: 'none', maxHeight: 'none', zIndex: 5000, transform:'none', top: '0', left: '0'})
                .draggable();
            $(parentDiv+' .sc-zoom').replaceWith('<a href="#" class="sc-unzoom"><i class="fa fa-search-minus" aria-hidden="true"></i></a>');
            bindZoomFeatures();
        });
        $(parentDiv+' .sc-unzoom').click(function() {
            $(parentDiv+' .sc-image-'+imgPosition)
            	.draggable( "destroy" )
                .css({maxWidth: '100%', maxHeight: '100%', zIndex: 1000, top: '50%', left: '50%', transform:'translate(-50%, -50%)'})
                .css({width: 'auto', height: 'auto'});
            $(parentDiv+' .sc-unzoom').replaceWith('<a href="#" class="sc-zoom"><i class="fa fa-search-plus" aria-hidden="true"></i></a>');
            bindZoomFeatures();
        });
    }
    
    function bindZoomFeatures(parentDiv, imgPosition) {
    	$(parentDiv+' .sc-zoom').unbind().click(function() {
    		img = $(parentDiv+' .sc-image-'+imgPosition).get( 0 );
    		imgBox = $(parentDiv+' .sc-image-box-'+imgPosition).get( 0 );
    		height = img.naturalHeight;
    		width = img.naturalWidth;
    		boxHeight = imgBox.naturalHeight;
    		boxWidth = imgBox.naturalWidth;
            $(parentDiv+' .sc-image-'+imgPosition).draggable()
                .css({maxWidth: 'none', maxHeight: 'none', width: width, height: height});
            $(parentDiv+' .sc-zoom').replaceWith('<a href="#" class="sc-unzoom"><i class="fa fa-search-minus" aria-hidden="true"></i></a>');
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
    //bindZoomFeatures(parentDiv, imgPosition);
    
    
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
        
        //$(parentDiv + ' .sc-image').click(function() {
        //	if (imgZoomed) {
        //		unzoom(parentDiv, imgPosition);
        //	} else {
        //		zoom(parentDiv, imgPosition);
        //	}
        //	
        //});
        
        
        $(parentDiv + ' .sc-image').css({cursor: 'zoom-in'});
        var isDragging = false;
        $(parentDiv + ' .sc-image')
        .mousedown(function() {
            isDragging = false;
        })
        .mousemove(function() {
            isDragging = true;
         })
        .mouseup(function() {
            var wasDragging = isDragging;
            isDragging = false;
            if (!wasDragging) {
            	if (imgZoomed) {
            		unzoom(parentDiv, imgPosition);
            	} else {
            		zoom(parentDiv, imgPosition);
            	}
            }
        });
        
        
        
    } else {
    
    	/*
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
        */
        /*
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
        $(parentDiv+' .sc-tap-forward-zone').dblclick(function() {
        	alert("ok");
        });
        */
    	
    	$(parentDiv+' .sc-tap-backward-zone').on('tap',function() {
            if (imgPosition != 0 || textPosition != 0) {
                moveBackward(parentDiv, slides);
            }
        });
    	$(parentDiv+' .sc-image').on("touchstart",function(e){
            if(!tapped){ //if tap is not set, set up single tap
              tapped=setTimeout(function(){
                  tapped=null;
                //insert things you want to do when single tapped
              },300);   //wait 300ms then run single click code
            } else {    //tapped within 300ms of last tap. double tap
              clearTimeout(tapped); //stop single tap callback
              tapped=null
              //insert things you want to do when double tapped
              if (imgZoomed) {
	          		unzoom(parentDiv, imgPosition);
	          	} else {
	          		zoom(parentDiv, imgPosition);
	          	}
            }
            //e.preventDefault()
        });
        
        var tapped=false
        $(parentDiv+' .sc-tap-forward-zone').on("touchstart",function(e){
            if(!tapped){ //if tap is not set, set up single tap
              tapped=setTimeout(function(){
                  tapped=null;
                //insert things you want to do when single tapped
                  var lastImg = slides.length - 1;
                  var lastText = slides[lastImg].text.length - 1
                  if (imgPosition != lastImg || textPosition != lastText) {
                      moveForward(parentDiv, slides);
                  }
              },300);   //wait 300ms then run single click code
            } else {    //tapped within 300ms of last tap. double tap
              clearTimeout(tapped); //stop single tap callback
              tapped=null
              //insert things you want to do when double tapped
              if (imgZoomed) {
	          		unzoom(parentDiv, imgPosition);
	          	} else {
	          		zoom(parentDiv, imgPosition);
	          	}
            }
            //e.preventDefault()
        });
        
   }
   
};




