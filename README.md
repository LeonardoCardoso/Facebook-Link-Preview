Facebook-Like Link Preview
==========================

The algorithm keeps tracking what you are typing in the status field and through regular expressions identifies a url. Thereafter, the text is in the field is passed to PHP that does all the work to analyze all the source code of the url found. If you enter more than one url, it will consider that the first one is the more relevant and it will create a preview.
Once the source code of the url is obtained, regular expressions begin to seek out and capture relevant informations on it. These informations is basically the title page, the images contained therein, and a brief description of the content covered in the page.

For more details, visit http://lab.leocardz.com/facebook-link-preview-php--jquery/

![Link Preview](http://leocardz.com/util/assets/images/posts/facebook-link-preview-php--jquery/linkPreviewImageTimeLapse.png)


## How to added to your project

1 &bull; Scripts

```html
	<script src='http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js'></script>

	<script src='js/linkPreview.js' ></script>

 	<!-- 
		If you are saving and fetching results from database using FLP,
		you can customize the layout on this script
	-->
	<script src='js/linkPreviewRetrieve.js' ></script>
```


2 &bull; Stylesheets

```html
	<!-- 
		This stylesheet is provides the layout of Facebook's former textarea. 
		You can totally customize this!
	-->
	<link rel="stylesheet" type="text/css" href="css/linkPreview.css" />
```

3 &bull; Configuration

Just create your own textarea (or multiple textareas) and bind it to jQuery like this:

```html
	<script>
		$(document).ready(function() {
			$('#lp1').linkPreview();

			// changing placeholder
			$('#lp2').linkPreview({placeholder: "Second Field"});
			
			// bind to a tag the results brought from database
			$('#retrieveFromDatabase').linkPreviewRetrieve();
		});
	</script>
```

## Result Format

```json
	{  
	   "title":"title",
	   "url":"original url",
	   "pageUrl":"page url",
	   "canonicalUrl":"cannonical url",
	   "description":"description",
	   "images": "img1|img2|...",
	   "video":"yes|no",
	   "videoIframe":"video iframe if it is video"
	}
```



## Parameters

|     option    |    default value    | possible values |                  function                  |
|:-------------:|:-------------------:|:---------------:|:------------------------------------------:|
| imageQuantity |          -1         |   any integer   | set the max amount of images to be brought (-1 for illimited) |
|  placeholder  | What's in your mind |    any string   |       set the placeholder of textarea      |



## Important
Make sure the library php5-curl is installed and enabled on the server whether local or at webspace. 



Contact
=================================
If you are using this lib, let me know contacting me at contact@leocardz.com then I add your app here in a list


License
=================================

	Copyright (c) 2014 Leonardo Cardoso (http://leocardz.com)
	Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
	and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
