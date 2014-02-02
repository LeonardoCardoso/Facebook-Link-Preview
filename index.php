<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>Link Preview - LeoCardz</title>
		<link rel="stylesheet" class="cssStatics" type="text/css" href="css/stylesheet.css" />
		<link rel="stylesheet" class="cssButtons" type="text/css" href="css/linkPreview.css" />
		<script type="text/javascript" src="js/jquery.js" ></script>
		<script type="text/javascript" src="js/linkPreview.js" ></script>
		<script type="text/javascript" src="js/linkPreviewRetrieve.js" ></script>
		<script>
			$(document).ready(function() {
				$('#retrieveFromDatabase').linkPreviewRetrieve();

				$('#lp1').linkPreview();
				$('#lp2').linkPreview({placeholder: "Second Field"});
				// setting max number of images $('.linkPreview').linkPreview({imageQuantity: "put here the number"});
				// e.g. $('.linkPreview').linkPreview({imageQuantity: 15});
			});
		</script>
	</head>
	<body >
		<div class="bar">
			<img src="img/leocardz.png" />
		</div>
		<div class="center">

			<div class="linkPreview" id="lp1"></div>
			<div class="linkPreview" id="lp2"></div>

            <div id="retrieveFromDatabase" ></div>
        </div>
	</body>
</html>
