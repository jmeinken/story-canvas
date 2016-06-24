
var imgPosition = 0;
var textPosition = 0;
var position = 1;
var fullscreen = false;


function moveBackward(slides) {
    //change slides
    position--;
    if (textPosition != 0) {
        hideSlide(imgPosition,textPosition, true);
        textPosition--;
        showSlide(imgPosition,textPosition);
    } else {
        hideSlide(imgPosition,textPosition, false);
        imgPosition--;
        textPosition = slides[imgPosition].text.length - 1;
        showSlide(imgPosition,textPosition);
    }
    //update context
    $('.sc-forward').css({visibility : 'visible'});
    if (imgPosition == 0 && textPosition == 0) {
        $('.sc-back').css({visibility : 'hidden'});
    }
    $('.sc-position').text(position);
}

function moveForward(slides) {
    //change slides
    position++;
    if (textPosition < slides[imgPosition].text.length - 1) {
        hideSlide(imgPosition,textPosition, true);
        textPosition++;
        showSlide(imgPosition,textPosition);
    } else {
        hideSlide(imgPosition,textPosition, false);
        var lastImgPosition = imgPosition;
        imgPosition++;
        textPosition = 0;
        showSlide(imgPosition,textPosition);
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
    endFullScreen();
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
}

 function configureWindow(slides, parentDiv) {
    $(parentDiv + ' .sc-image-' + imgPosition).show();
    $('.sc-text').hide();
    var textClass = "sc-image-" + imgPosition + '-text-' + textPosition;
    $('.'+textClass).fadeIn(200);
}

function showSlide(slideNumber, textNumber, speed) {
    var imgClass = 'sc-image-' + slideNumber
    var textClass = "sc-image-" + slideNumber + '-text-' + textNumber;
    if ( $('.'+imgClass).length ) {
        $('.'+imgClass).stop().fadeIn(1000, function() {
            $('.'+textClass).stop().fadeIn(200);
        });
    } else {
        $('.'+textClass).stop().fadeIn(200);
    }
}

function hideSlide(slideNumber, textNumber, repeat, speed) {
    var textClass = "sc-image-" + slideNumber + '-text-' + textNumber;
    if (!repeat) {
        $('.sc-image-' + slideNumber).stop().fadeOut(400);
    }
    $('.'+textClass).stop().fadeOut(500);
}


    
function getTextFormatting(slide) {
    var myobj = {};
    if (!slide.hasOwnProperty("textFormatting")) {
        slide.textFormatting = {};
    }
    overlay = ifProp(slide.textFormatting, "overlay", true);
    if (overlay) {
        myobj.top = ifProp(slide.textFormatting, "top", "80%");
        myobj.bottom = 'auto';
    } else {
        myobj.top = 'auto';
        myobj.bottom = 0;
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

    


