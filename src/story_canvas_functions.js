
var imgPosition = 0;
var textPosition = 0;
var position = 1;
var fullscreen = false;


function moveBackward(slides) {
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

function moveForward(slides) {
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
    $(parentDiv + ' .sc-text').css( getTextFormatting(slides[imgPosition]) );
    $(parentDiv + ' .sc-text').html(slides[imgPosition].text[textPosition]);
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

    


