Facebook-Like Link Preview (no longer maintained)
==========================

<b>
Disclaimer: I will no longer maintain this project because it's an old code and hard to maintain, but I'm exporting this logic
to Angularjs and Bootstrap. I believe this a great solution for an easy comprehension of the code and will allow the project
to evolve even further. You can found this new project here >> https://github.com/LeonardoCardoso/Link-Preview
</b>


[![Build Status](https://travis-ci.org/LeonardoCardoso/Facebook-Link-Preview.svg)](https://travis-ci.org/LeonardoCardoso/Facebook-Link-Preview)

Developed by <a href='https://github.com/LeonardoCardoso' target='_blank'>@LeonardoCardoso</a>. 

## How this works

The algorithm keeps tracking what you are typing in the status field and through regular expressions identifies a url. Thereafter, the text is in the field is passed to PHP that does all the work to analyze all the source code of the url found. If you enter more than one url, it will consider that the first one is the more relevant and it will create a preview.
Once the source code of the url is obtained, regular expressions begin to seek out and capture relevant information on it. This information is basically the title page, the images contained therein, and a brief description of the content covered in the page.

For mode details, visit http://lab.leocardz.com/facebook-link-preview-php--jquery/

![Link Preview](http://i.imgur.com/XqaYUvI.png)

=======

## HTTP Server

- Apache (must support mod_php)


## How to add it to your project

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

4 &bull; Database

To custom your database configurations, you just need to change the following values in [php/classes/Database.php](https://github.com/LeonardoCardoso/Facebook-Link-Preview/blob/master/php/classes/Database.php)

		$host = "localhost";
        $user = "";
        $password = "";
        $database = "linkpreview";
        
Make sure your columns are the same as those ones in [linkpreview.sql](https://github.com/LeonardoCardoso/Facebook-Link-Preview/blob/master/linkpreview.sql).        


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
Make sure the library <b>php5-curl</b> is installed and enabled on the server, either locally or remotely. 

- Linux
```bash
$ sudo apt-get install php5-curl
$ sudo service apache2 restart
```
- Mac (via [macports](https://www.macports.org/))
```bash
$ sudo port install php5-curl 
$ sudo apachectl restart
```


Contact
=================================
Contact me either by Twitter [@leocardz](https://twitter.com/leocardz) or emailing me to [contact@leocardz.com](mailto:contact@leocardz.com).


License
=================================

	Copyright (c) 2014 Leonardo Cardoso (http://leocardz.com)
	Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
	and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
