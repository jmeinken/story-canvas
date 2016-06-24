
var imgPosition = 0;
var textPosition = 0;
var position = 1;
var fullscreen = false;
var tryFullScreen = false;


function moveBackward(parentDiv, slides) {
    //change slides
    position--;
    if (textPosition != 0) {
        hideSlide(imgPosition,textPosition, true);
        textPosition--;
        showSlide(imgPosition,textPosition, parentDiv, slides);
    } else {
        hideSlide(imgPosition,textPosition, false);
        imgPosition--;
        textPosition = slides[imgPosition].text.length - 1;
        showSlide(imgPosition,textPosition, parentDiv, slides);
    }
    //update context
    $('.sc-forward').css({visibility : 'visible'});
    if (imgPosition == 0 && textPosition == 0) {
        $('.sc-back').css({visibility : 'hidden'});
    }
    $('.sc-position').text(position);
}

function moveForward(parentDiv, slides) {
    //change slides
    position++;
    if (textPosition < slides[imgPosition].text.length - 1) {
        hideSlide(imgPosition,textPosition, true);
        textPosition++;
        showSlide(imgPosition,textPosition, parentDiv, slides);
    } else {
        hideSlide(imgPosition,textPosition, false);
        var lastImgPosition = imgPosition;
        imgPosition++;
        textPosition = 0;
        showSlide(imgPosition,textPosition, parentDiv, slides);
    }
    //update context
    $('.sc-back').css({visibility : 'visible'});
    if (imgPosition == slides.length - 1 && textPosition == slides[imgPosition].text.length - 1) {
        $('.sc-forward').css({visibility : 'hidden'});
    }
    $('.sc-position').text(position);
}

function closeFullScreen(parentDiv) {
    $(parentDiv).hide();
    $('html, body').css({
        'overflow': 'auto',
        'height' : 'auto'
    });
    $('body').unbind();
    fullscreen = false;
    if (tryFullScreen) {
        endFullScreen();
    }
}

function openFullScreen(parentDiv) {
    $('html, body').css({
        'overflow': 'hidden',
        'height' : 'auto',
    });
    window.scrollTo(0, 0);
    $(parentDiv).fadeIn();
    $('body').on('swipeup',function() {
        closeFullScreen(parentDiv);
    });
    $('body').on('swipedown',function() {
        closeFullScreen(parentDiv);
    });
    if (tryFullScreen) {
        startFullScreen();
    }
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
        $('.'+imgClass).stop().fadeIn(1000, function() {
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

function hideSlide(slideNumber, textNumber, repeat, speed) {
    var textClass = "sc-image-" + slideNumber + '-text-' + textNumber;
    if (!repeat) {
        $('.sc-image-' + slideNumber).stop().fadeOut(200);
    }
    $('.'+textClass).stop().fadeOut(200);
}


    
function getTextFormatting(slide) {
    var myobj = {};
    if (!slide.hasOwnProperty("textFormatting")) {
        slide.textFormatting = {};
    }
    overlay = ifProp(slide.textFormatting, "overlay", true);
    center = ifProp(slide.textFormatting, "center", false);
    if (overlay && center) {
        myobj.top = '50%';
        myobj.bottom = 'auto'
        myobj.transform = 'translate(0, -50%)';
    } else if (overlay) {
        myobj.top = ifProp(slide.textFormatting, "top", "80%");
        myobj.bottom = 'auto';
        myobj.transform = 'none';
    } else {
        myobj.top = 'auto';
        myobj.bottom = 0;
        myobj.transform = 'none';
    }
    myobj.color = ifProp(slide.textFormatting, "color", "white");
    myobj.fontSize = ifProp(slide.textFormatting, "fontSize", "20px");
    myobj.backgroundColor = ifProp(slide.textFormatting, "backgroundColor", "transparent");
    myobj.opacity = ifProp(slide.textFormatting, "opacity", "1");
    console.log(myobj);
    return myobj;
}

function getImageFormatting(slide) {
    var myobj = {};
    if (!slide.hasOwnProperty("textFormatting")) {
        slide.textFormatting = {};
    }
    overlay = ifProp(slide.textFormatting, "overlay", true);
    if (overlay) {
        myobj.maxHeight = "100%";
    } else {
        myobj.maxHeight = "50%";
    }
    return myobj;
}

    


