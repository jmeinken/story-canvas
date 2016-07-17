# Story Canvas

A JavaScript tool that combines your images and text into a slideshow that tells a story.  Story Canvas supports touch events and has a responsive design that adapts to any size screen.

<a href="http://johnmeinken.com/ver4/story-canvas/example.html">**See a Demo**</a>

## Installing

1. Download and unzip the [latest release](https://github.com/jmeinken/story-canvas/archive/release1.0.zip) of Story Canvas.

2. Within the code is a folder called `story-canvas`.  Add that folder and its contents (3 files) to your web project.

## Implementing a Story Canvas on your Web Page

1. *(strongly recommended)* In the `<head>` section of your web page, change the viewport settings for better display on small screens.  Note that this can affect how the entire page looks.

	```html
	<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1">
	```

2. In the `<head>` section of your web page, add jQuery, Font Awesome, and story canvas.  The paths for the story-canvas files may be different depending on where you installed the story-canvas folder.

	```html
	<!-- jQuery  -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
	<!-- FontAwesome -->
	<link type="text/css" rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" media="all" />
	<!-- Story Canvas -->
	<script src="story-canvas/story-canvas.js"></script>
	<link rel="stylesheet" href="story-canvas/story-canvas.css">
	```

3. In the `<head>` section of your web page, create your story.  Note that you can only have one story canvas on a web page.

	```html
	<script type="text/javascript">
	
		// design your story
		var myStory = {
		    slides: [
		        {
		            text: [
		                'Hello World!',
		            ]
		        }
		    ]
		}
		
		$( document ).ready(function() {
			// create a new story canvas using the story you designed above
			// the createStoryCanvas() function takes 3 arguments
			//    1. the object representing your story canvas
			//    2. a name for your story canvas (letters, dashes and underscores allowed)
			//    3. a boolean for whether you want to embed the story canvas in your
			//       web page (if false, only the full-window view will be available)
			sc.createStoryCanvas(myStory, "my-story", true);
		});
	    
	</script>    
	```

4. (optional) Embed your story canvas in the body of your web page.

	```html
	<div style="width:100%;max-width:600px;height:90vh;max-height:400px;">
		<div id="my-story-embedded"></div>
	</div>
	```

5. (optional) Alternately, you can make a link to open the full-window version directly.

	```html
	<a href="#" class="my-story-open">Open My Story</a>
	```

## Designing your Story Canvas

The entire story canvas content and design is created using a JavaScript object.  You will need to be familiar with [JSON syntax](http://www.w3schools.com/json/).  Most of the formatting settings have default values and can be left out altogether.

### Example:

```js
var myStory = {
    globalSettings: {
        backgroundColor: '#cc3300',
        toolbarColor: '#661a00',
        zoomOption: true,
    },
    slides: [
        {
            text: [
                'A screen with only text<br><br><br><span style="font-size:10px;text-align:center;color: yellow;">can apply any formatting</span>',
            ],
            textFormatting: { 
                overlay: true,
                verticalCenter: true,
                fontSize: '30px',
            }
        },
        {
            img: 'img/fox.jpg',
            alt: 'fox',
            text: [
                'Here is the first line of text for the fox image.',
                'And here is the second line of text for the fox image.'
            ],
        },
        {
        	img: 'img/street.jpg',
            text: [
                'The End',
            ],
            textFormatting: { 
                overlay: true,
                verticalCenter: true,
                fontSize: '70px'
            }
        },
    ]
}
```

### Options:

#### `globalSettings` (object)

An object containing settings that affect your entire story canvas

#### `globalSettings.backgroundColor` (string, default='#cc3300')

The CSS color for your story canvas background

#### `globalSettings.toolbarColor` (string, default='#661a00')

The CSS color for your story canvas toolbar

#### `globalSettings.emphasisColor` (string, default='#fff')

The CSS color used when a tool is emphasized in the toolbar.

#### `slides` (array)

**(Required)** An array of image and text content for your story.

#### `slides[].img` (string, no default)

The file path to your image.  Leave out of a slide if you want text only.

#### `slides[].alt` (string, no default)

**(Required if slides[].img is set)** Alternate text for your image.

#### `slides[].text` (array of strings, no default)

A list of text strings to use in your slide.  Each text string will be show separately.  HTML markup for formatting is allowed.  Leave out if you want to show an image without text.

#### `slides[].textFormatting` (object)

An object containing text formatting settings for a particular slide

#### `slides[].textFormatting.fontSize` (string, default="20px")

The CSS font size for your text.

#### `slides[].textFormatting.color` (string, default="#fff")

The CSS color for your text.

#### `slides[].textFormatting.backgroundColor` (string, default="transparent")

The CSS background color for your text.

#### `slides[].textFormatting.opacity` (number, default=1)

The CSS opacity for your text.

#### `slides[].textFormatting.overlay` (boolean, default=false)

If overlay is false, a separate space will be created below the image for your text.  If overlay is true, the image will take the full space and your text will appear on top of your image.

#### `slides[].textFormatting.top` (string, default='70%')

When overlay is true, this will set the distance from the top where the text will start on the canvas.  

#### `slides[].textFormatting.verticalCenter` (boolean, default=false)

When overlay is true, this will center the text vertically in the canvas. When true, the `textFormatting.top` setting will be ignored.


