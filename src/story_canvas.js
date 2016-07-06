

var sc = {
	canvases: []
};

sc.createStoryCanvas = function (storyData, storyName, embed) {
	console.log('creating '+storyName);
	embed = embed || false;
	$('body').append('<div style="display:none;" id="sc-templates"></div>');
	$('#sc-templates').load('templates.html', function() {
		completeStoryData = sc.setDefaults(storyData);
		canvas = {
			slides:					completeStoryData.slides,
			globalSettings:			completeStoryData.globalSettings,
			name:					storyName,
			canvasDiv:				'.'+storyName,
			embeddedDiv:			'#'+storyName+'-embedded',
			fullWindowDiv:			'#'+storyName+'-full-window',
			currentImagePosition: 	0,								//imgPosition
			currentTextPosition: 	0,								//textPosition
			currentSlidePosition: 	1,								//position
			slideCount:				completeStoryData.slideCount,
			fullWindowShowing: 		false,							//fullscreen
			imageZoomed: 			false,	
			toolsHidden:			false,
		}
		if (embed) {
	        sc.buildCanvasHTML(canvas, 'embedded');
	        sc.buildStoryHTML(canvas, 'embedded');
	        sc.attachEmbeddedEvents(canvas, 'embedded');
		}
		sc.buildCanvasHTML(canvas, 'fullWindow');
		sc.buildStoryHTML(canvas, 'fullWindow');
		sc.attachFullWindowEvents(canvas, 'fullWindow');
		
		sc.attachGlobalCanvasEvents(canvas);
		if (is_touch_device()) {
			sc.attachHammerEvents(canvas);
		}
		sc.canvases.push(canvas);									//last action
	});
}	

	/*
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
    */


/*
 * takes a story data object and fills in all default values
 */
sc.setDefaults = function (sd) {
	var sd2 = {};
	sd2.globalSettings = ifProp(sd, 'globalSettings', {});
	sd2.globalSettings.backgroundColor = ifProp(sd2.globalSettings, 'backgroundColor', '#cc3300');
	sd2.globalSettings.toolbarColor = ifProp(sd2.globalSettings, 'toolbarColor', '#661a00');
	sd2.globalSettings.emphasisColor = ifProp(sd2.globalSettings, 'emphasisColor', '#fff');
	sd2.globalSettings.fullScreenOption = ifProp(sd2.globalSettings, 'fullScreenOption', true);
	sd2.globalSettings.zoomOption = ifProp(sd2.globalSettings, 'zoomOption', true);
	sd2.slides = sd.slides;
	sd2.slideCount = 0;
	for(i=0; i<sd2.slides.length; i++) {
		sd2.slides[i].text = ifProp(sd2.slides[i], 'text', ['']);
		var tf = ifProp(sd2.slides[i], 'textFormatting', {});
		tf.fontSize = ifProp(tf, 'fontSize','20px');
		tf.color = ifProp(tf, 'color','#FFF');
		tf.backgroundColor = ifProp(tf, 'backgroundColor','transparent');
		tf.opacity = ifProp(tf, 'opacity', 1);
		tf.overlay = ifProp(tf, 'overlay', false);
		tf.transform = ifProp(tf, 'transform', 'none');
		if(tf.overlay) {
			tf.verticalCenter = ifProp(tf, 'verticalCenter', false);
			tf.top = ifProp(tf, 'top', '70%');
			tf.bottom = 'auto';
			if (tf.verticalCenter) {
				tf.top = '50%';
				tf.transform = 'translate(0, -50%)'
			}
		} else {
			tf.top = 'auto';
			tf.bottom = 0;
		}
		sd2.slides[i].textFormatting = tf;
		sd2.slideCount = sd2.slideCount + sd2.slides[i].text.length;
	}
	return sd2;
}

sc.buildCanvasHTML = function (canvas, canvasType) {
	console.log('building '+canvasType+' html for '+canvas.name);
	var leftNav = '';
	var rightNav = '';
	var fullscreenTool = '';
	var expandContractTool = '';
	var tapForwardZone = '';
    var tapBackwardZone = '';
    var zoomTool = '';
    var unzoomTool = '';
    //attach left and right nav controls for non-touch
    if ( !is_touch_device() ) {
        leftNav = sc.templateEngine('left-nav-template');
        rightNav = sc.templateEngine('right-nav-template');
    //attach tap controls for touch
    } else {
        tapForwardZone = sc.templateEngine('tap-forward-zone-template');
        tapBackwardZone = '';	//no tap-backward-zone in this version
    }
    if (canvasType == "fullWindow") {
        var parentDiv = canvas.fullWindowDiv;
        $('body').append( sc.templateEngine('blackout-template') );
        $('body').append( sc.templateEngine('sc-container-template', {
        	canvasName: canvas.name
        }));
        if (!is_touch_device()) {
        	fullscreenTool = sc.templateEngine('fullscreen-tool-template');
        }
        var expandContractTool = sc.templateEngine('contract-tool-template');
    } else {
        var parentDiv = canvas.embeddedDiv;
        $(parentDiv).parent().css({position:'relative'});
        $(parentDiv).addClass(canvas.name);
        $(parentDiv).addClass('sc-embedded');
        var expandContractTool = sc.templateEngine('expand-tool-template',{
        	canvasName: canvas.name
        });
    }
    $(parentDiv).html(sc.templateEngine('story-canvas-template',{
    	tapForwardZone: tapForwardZone,
    	tapBackwardZone: tapBackwardZone,
    	fullscreenTool: fullscreenTool,
    	expandContractTool: expandContractTool,
    	slideCount: canvas.slideCount,
    	leftNav: leftNav,
    	rightNav: rightNav
    }));
}

sc.buildStoryHTML = function (canvas, canvasType) {
	console.log('building '+canvasType+' css for '+canvas.name);
	if (canvasType == "fullWindow") {
        var parentDiv = canvas.fullWindowDiv;
	} else {
		var parentDiv = canvas.embeddedDiv;
	}
	for (var i=0; i < canvas.slides.length; i++) {
        if (canvas.slides[i].img) { 
            $(parentDiv+' .story-canvas').append('<div class="sc-image-box sc-image-box-' +i + '"></div>');
            $(parentDiv+' .sc-image-box-'+i).append('<img src="' + canvas.slides[i].img + '" alt="' + canvas.slides[i].alt + '" class="sc-image sc-image-' + i + '" />');
        }
        for (var j=0; j < canvas.slides[i].text.length; j++) {
            var txtClass = 'sc-image-' + i + '-text-' + j;
            $(parentDiv+' .story-canvas').append('<div " class="sc-text ' + txtClass + '" />');
            $(parentDiv+' .'+txtClass).css( getTextFormatting(canvas.slides[i], canvasType) );
            $(parentDiv+' .'+txtClass).html(canvas.slides[i].text[j]);
        }
        $(parentDiv+' .sc-image-box-'+i).css( getImageBoxFormatting(canvas.slides[i], canvasType, i, j) );
        //$(parentDiv+' .sc-image-'+i).css( getImageFormatting(parentDiv, i) );
    }
	sc.showSlide(canvas);
}

sc.attachGlobalCanvasEvents = function (canvas) {
	console.log('building global canvas events for '+canvas.name);
	
	$('.' + canvas.name + '-open').click(function() {
        sc.openFullWindow(canvas.name);
        return false;
    });
	
	$('.sc-go-fullscreen').click(function() {
        toggleFullScreen();
    });
	
	//$(window).scroll(function() {
		//if (canvas.fullWindowShowing) {
		//	sc.closeFullWindow(canvas.name);
		//}
    //});
	
	$(canvas.canvasDiv+' .sc-forward').click(function() {
        sc.moveForward(canvas);
        return false;
    });
    
    $(canvas.canvasDiv+' .sc-back').click(function() {
        sc.moveBackward(canvas);
        return false;
    });
    
    $(canvas.canvasDiv+' .sc-restart').click(function() {
        sc.hideSlide(canvas);
        canvas.currentTextPosition = 0;
        canvas.currentImagePosition = 0;
        canvas.currentSlidePosition = 1;
        sc.showSlide(canvas);
        return false;
    });
    
    if (!is_touch_device()) {
    	
        $(canvas.canvasDiv).mouseout(function() {
            if (canvas.currentSlidePosition != 1) {
                sc.hideTools(canvas);
            }
        });

        $(canvas.canvasDiv).mouseover(function() {
            sc.showTools(canvas);
        });
        
        $(document).keydown(function(e){
            if (e.keyCode == 37) { 		// left arrow
                if (canvas.currentSlidePosition != 1) {
                	sc.moveBackward(canvas);
                	return false;
                }
                
            }
            if (e.keyCode == 39) { 		// right arrow
                if (canvas.currentSlidePosition != canvas.slideCount) {
                	sc.moveForward(canvas);
                	return false;
                }
                
            }
            if (e.keyCode == 27) {		// escape key
            	if (canvas.fullWindowShowing) {
	            	sc.closeFullWindow(canvas.name);
	                return false;
            	}
            }
        });
        
    }
}


sc.attachEmbeddedEvents = function (canvas) {
	console.log('building embedded events for '+canvas.name);
	
	$(canvas.embeddedDiv+' .sc-zoom').click(function() {
    	sc.zoom(canvas, canvas.embeddedDiv);
    });

    $(canvas.embeddedDiv+' .sc-unzoom').click(function() {
    	sc.unzoom(canvas, canvas.embeddedDiv);
    });
    
    if (!is_touch_device()) {
    
	    var isDragging = false;
	    $(canvas.embeddedDiv + ' .sc-image')
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
	        	if (canvas.imageZoomed) {
	        		sc.unzoom(canvas, canvas.embeddedDiv);
	        	} else {
	        		sc.zoom(canvas, canvas.embeddedDiv);
	        	}
	        }
	    });
	    
    } else {
    	
		
    	
    }
    
    
}


sc.attachFullWindowEvents = function (canvas) {
	console.log('building full window events for '+canvas.name);
	$(canvas.fullWindowDiv+' .sc-close').click(function() {
        sc.closeFullWindow(canvas.name);
        return false;
    });
	
	$(canvas.fullWindowDiv+' .sc-zoom').click(function() {
    	sc.zoom(canvas, canvas.fullWindowDiv)
    });

    $(canvas.fullWindowDiv+' .sc-unzoom').click(function() {
    	sc.unzoom(canvas, canvas.fullWindowDiv);
    });
    
    if (!is_touch_device()) {
        
	    var isDragging = false;
	    $(canvas.fullWindowDiv + ' .sc-image')
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
	        	if (canvas.imageZoomed) {
	        		sc.unzoom(canvas, canvas.fullWindowDiv);
	        	} else {
	        		sc.zoom(canvas, canvas.fullWindowDiv);
	        	}
	        }
	    });
	    
	    
	    
    } 
    
}

sc.attachHammerEvents = function(canvas) {
	
	var fullWindowTapForward = $(canvas.fullWindowDiv+' .sc-tap-forward-zone').get(0);
	var mc = new Hammer.Manager(fullWindowTapForward);

	var singleTap = new Hammer.Tap({ event: 'singletap' });
	var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2, threshold: 5, posThreshold: 35, interval: 400 });
	var swipeleft = new Hammer.Swipe({event: 'swipeleft', direction: Hammer.DIRECTION_LEFT});
	var swiperight = new Hammer.Swipe({event: 'swiperight', direction: Hammer.DIRECTION_RIGHT});
	var swipeup = new Hammer.Swipe({event: 'swipeup', direction: Hammer.DIRECTION_UP});
	var swipedown = new Hammer.Swipe({event: 'swipedown', direction: Hammer.DIRECTION_DOWN});
	
	doubleTap.recognizeWith(singleTap);
	singleTap.requireFailure(doubleTap);
	mc.add([doubleTap, singleTap, swipeleft, swiperight, swipeup, swipedown]);

	
	mc.on("singletap", function(ev) {
		if (canvas.toolsHidden) {
			sc.showTools(canvas);
		} else {
			sc.hideTools(canvas);
		}
	});
	mc.on("doubletap", function(ev) {
    	sc.zoom(canvas, canvas.fullWindowDiv);
	});
	mc.on("swipeleft", function(ev) {
		sc.moveForward(canvas);
	});
	mc.on("swiperight", function(ev) {
		sc.moveBackward(canvas);
	});
	mc.on("swipeup swipedown", function(ev) {
		if (canvas.toolsHidden) {
			sc.showTools(canvas);
		} else {
			sc.hideTools(canvas);
		}
	});
	
	
	var embeddedTapForward = $(canvas.embeddedDiv+' .sc-tap-forward-zone').get(0);
	var mc1 = new Hammer.Manager(embeddedTapForward);
	
	var singleTap1 = new Hammer.Tap({ event: 'singletap' });
	var doubleTap1 = new Hammer.Tap({event: 'doubletap', taps: 2, threshold: 5, posThreshold: 35, interval: 400 });
	var swipeleft1 = new Hammer.Swipe({event: 'swipeleft', direction: Hammer.DIRECTION_LEFT});
	var swiperight1 = new Hammer.Swipe({event: 'swiperight', direction: Hammer.DIRECTION_RIGHT});
	
	doubleTap1.recognizeWith(singleTap1);
	singleTap1.requireFailure(doubleTap1);
	
	mc1.add([doubleTap1, singleTap1, swipeleft1, swiperight1]);
	
	mc1.on("singletap", function(ev) {
		if (canvas.toolsHidden) {
			sc.showTools(canvas);
		} else {
			sc.hideTools(canvas);
		}
	});
	mc1.on("doubletap", function(ev) {
    	sc.zoom(canvas, canvas.embeddedDiv);
	});
	mc1.on("swipeleft", function(ev) {
		sc.moveForward(canvas);
	});
	mc1.on("swiperight", function(ev) {
		sc.moveBackward(canvas);
	});
	
	
	var fullWindowImages = $(canvas.fullWindowDiv+' .sc-image').get();
	
	for (i=0; i<fullWindowImages.length; i++) {
    	var mc3 = new Hammer.Manager(fullWindowImages[i]);
    	mc3.add(new Hammer.Tap({event: 'doubletap', taps: 2, threshold: 5, posThreshold: 35, interval: 400 }));
    	mc3.on("doubletap", function(ev) {
    		sc.unzoom(canvas, canvas.fullWindowDiv);
    	});
	}
	
	var embeddedImages = $(canvas.embeddedDiv+' .sc-image').get();
	
	for (i=0; i<embeddedImages.length; i++) {
    	var mc4 = new Hammer.Manager(embeddedImages[i]);
    	mc4.add(new Hammer.Tap({event: 'doubletap', taps: 2, threshold: 5, posThreshold: 35, interval: 400 }));
    	mc4.on("doubletap", function(ev) {
    		sc.unzoom(canvas, canvas.embeddedDiv);
    	});
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




