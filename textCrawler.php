<?php
/* 
* Copyright (c) 2012 Leonardo Cardoso (http://leocardz.com)
* Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
* and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
*
* Version: 0.2.17
* 
*/

	header("Content-Type: text/html; charset=utf-8", true);
	error_reporting(false);
	
	$urlOpen = false;
	if (!ini_get('allow_url_fopen')) {
		$urlOpen = true;
		ini_set('allow_url_fopen', 1);
	}
	
	$text = $_GET["text"];
	$text = " ".str_replace("\n", " ", $text);
	$urlRegex = "/(https?\:\/\/|\s)[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})(\/+[a-z0-9_.\:\;-]*)*(\?[\&\%\|\+a-z0-9_=,\.\:\;-]*)?([\&\%\|\+&a-z0-9_=,\:\;\.-]*)([\!\#\/\&\%\|\+a-z0-9_=,\:\;\.-]*)}*/i";
	
	function getPage($url, $referer, $timeout, $header = ""){
		// php5-curl must be installed and enabled
		
		/*
		if(!isset($timeout))
		$timeout = 30;
		$curl = curl_init();
		if(strstr($referer,"://")){
			curl_setopt ($curl, CURLOPT_REFERER, $referer);
		}
		curl_setopt ($curl, CURLOPT_URL, $url);
		curl_setopt ($curl, CURLOPT_TIMEOUT, $timeout);
		curl_setopt ($curl, CURLOPT_USERAGENT, sprintf("Mozilla/%d.0",rand(4,5)));
		curl_setopt ($curl, CURLOPT_HEADER, (int)$header);
		curl_setopt ($curl, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt ($curl, CURLOPT_SSL_VERIFYPEER, 0);
		$html = curl_exec ($curl);
		curl_close ($curl);
		return $html;
		*/
		$res = array();
		$options = array( 
			CURLOPT_RETURNTRANSFER => true,     // return web page 
			CURLOPT_HEADER         => false,    // do not return headers 
			CURLOPT_FOLLOWLOCATION => true,     // follow redirects 
			CURLOPT_USERAGENT      => "spider", // who am i 
			CURLOPT_AUTOREFERER    => true,     // set referer on redirect 
			CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect 
			CURLOPT_TIMEOUT        => 120,      // timeout on response 
			CURLOPT_MAXREDIRS      => 10,       // stop after 10 redirects 
		); 
		$ch      = curl_init( $url ); 
		curl_setopt_array( $ch, $options ); 
		$content = curl_exec( $ch ); 
		$err     = curl_errno( $ch ); 
		$errmsg  = curl_error( $ch ); 
		$header  = curl_getinfo( $ch ); 
		curl_close( $ch ); 

		$res['content'] = $content;     
		$res['url'] = $header['url'];
		return $res; 
	}
	
	function getTagContent($tag, $string){
		preg_match_all("/<$tag(.*?)>(.*?)<\/$tag>/i", $string, $matches);
		$content = "";
		for($i = 0; $i < count($matches[0]); $i++){
			$currentMatch = strip_tags($matches[0][$i]);
			if(strlen($currentMatch) >= 120){
				$content = $currentMatch;
				break;
			}
		}
		if($content == ""){
			preg_match("/<$tag(.*?)>(.*?)<\/$tag>/i", $string, $matches);
			$content = $matches[0];
		}		
		return str_replace("&nbsp;", "", $content);
	}
	
	function getOpenGraphicContent($property, $text){
		$content = "";
		if(preg_match('/<meta(.*?)property="'.$property.'"(.*?)content="(.+?)"(.*?)(\/)?>/', $text, $matching)){
			$content = $matching[3];
		}
		else if(preg_match('/<meta(.*?)content="(.+?)"(.*?)property="'.$property.'"(.*?)(\/)?>/', $text, $matching)){
			$content = $matching[2];
		}
		else if(preg_match("/<meta(.*?)property='$property'(.*?)content='(.+?)'(.*?)(\/)?>/", $text, $matching)){
			$content = $matching[3];
		}
		else if(preg_match("/<meta(.*?)content='(.+?)'(.*?)property='$property'(.*?)(\/)?>/", $text, $matching)){
			$content = $matching[2];
		}
		return $content;
	}
	
	function mediaYoutube($url){
		$media = array();
		if(preg_match("/(.*?)v=(.*?)($|&)/i", $url, $matching)){
			$vid = $matching[2]; 
			array_push($media, "http://i2.ytimg.com/vi/$vid/hqdefault.jpg");
			array_push($media, '<iframe id="'.date("YmdHis").$vid.'" style="display: none; margin-bottom: 5px;" width="499" height="368" src="http://www.youtube.com/embed/'.$vid.'" frameborder="0" allowfullscreen></iframe>');
		}
		else{
			array_push($media, "", "");
		}
		return $media;
	}
	
	function mediaVimeo($url){
		$url = str_replace("https://", "", $url);
		$url = str_replace("http://", "", $url);
		$breakUrl = explode("/", $url);
		$media = array();
		if($breakUrl[1] != ""){
			$imgId = $breakUrl[1];
			$hash = unserialize(file_get_contents("http://vimeo.com/api/v2/video/$imgId.php"));
			array_push($media, $hash[0]['thumbnail_large']); 
			array_push($media, '<iframe id="'.date("YmdHis").$imgId.'" style="display: none; margin-bottom: 5px;" width="500" height="281" src="http://player.vimeo.com/video/'.$imgId.'" width="654" height="368" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen ></iframe>');
		}
		else{
			array_push($media, "", "");
		}
		return $media;
	}
	
	function cannonicalLink($imgSrc, $referer){
		if(strpos($imgSrc, "//") === 0) $imgSrc = "http:".$imgSrc;
		else if(strpos($imgSrc, "/") === 0) $imgSrc = "http://".cannonicalPage($referer).$imgSrc;
		else $imgSrc = "http://".cannonicalPage($referer).'/'.$imgSrc;
		return $imgSrc;
	}
	
	function cannonicalImgSrc($imgSrc){
		$imgSrc = str_replace("../", "", $imgSrc);
		$imgSrc = str_replace("./", "", $imgSrc);
		$imgSrc = str_replace(" ", "%20", $imgSrc);
		return $imgSrc;
	}
	
	function cannonicalRefererPage($url){
		$cannonical = "";
		$barCounter = 0;
		for($i = 0; $i < strlen($url); $i++){
			if($url[$i] != "/"){
				$cannonical .= $url[$i];
			}
			else{
				$cannonical .= $url[$i];
				$barCounter++;
			} 
			if($barCounter == 3){
				break;
			}
		}
		return $cannonical;
	}
	
	function cannonicalPage($url){
		$cannonical = "";
		if(strpos($url, "http://") !== false) $url = substr($url, 7);
		else if(strpos($url, "https://") !== false) $url = substr($url, 8);
		for($i = 0; $i < strlen($url); $i++){
			if($url[$i] != "/") $cannonical .= $url[$i];
			else break;
		}
		return $cannonical;
	}
	
	function getImageUrl($pathCounter, $url){
		$src = "";
		if($pathCounter > 0){
			$urlBreaker = explode('/', $url);
			for($j = 0; $j < $pathCounter + 1; $j++){
				$src .= $urlBreaker[$j].'/';
			}
		}
		else{
			$src = $url;
		}
		return $src;
	}
	
	function joinAll($matching, $number, $url, $content){
		for($i = 0; $i < count($matching[$number]); $i++){
			$imgSrc =  $matching[$number][$i].$matching[$number + 1][$i];
			$src = "";
			$pathCounter = substr_count($imgSrc, "../");
			if(!preg_match("/https?\:\/\//i", $imgSrc)){
				$src = getImageUrl($pathCounter, cannonicalLink($imgSrc, $url));
			}
			if($src.$imgSrc != $url){
				if($src == "") array_push($content, $src.$imgSrc);
				else array_push($content, $src);
			}
		}
		return $content;
	}
	
	function getImages($text, $url){
		$content = array();
		if(preg_match_all("/<img(.*?)src=(\"|\')(.+?)(gif|jpg|png|bmp)(\"|\')(.*?)(\/)?>(<\/img>)?/", $text, $matching)){
			for($i = 0; $i < count($matching[0]); $i++){
				$src = "";
				$pathCounter = substr_count($matching[0][$i], "../");
				preg_match('/src=(\"|\')(.+?)(\"|\')/i', $matching[0][$i], $imgSrc);
				$imgSrc = cannonicalImgSrc($imgSrc[2]);
				if(!preg_match("/https?\:\/\//i", $imgSrc)){
					$src = getImageUrl($pathCounter, cannonicalLink($imgSrc, $url));
				}
				if($src.$imgSrc != $url){
					if($src == "") array_push($content, $src.$imgSrc);
					else array_push($content, $src);
				}
			}
		}
		if(preg_match_all("/<link(.*?)rel=(\"|\')(.*?)icon(.*?)(\"|\')(.*?)href=(\"|\')(.+?)(gif|jpg|png|bmp|ico)(\"|\')(.*?)(\/)?>(<\/link>)?/", $text, $matching)){
			$content = joinAll($matching, 8, $url, $content);
		}
		else if(preg_match_all("/<link(.*?)href=(\"|\')(.+?)(gif|jpg|png|bmp|ico)(\"|\')(.*?)rel=(\"|\')(.*?)icon(.*?)(\"|\')(.*?)(\/)?>(<\/link>)?/", $text, $matching)){
			$content = joinAll($matching, 3, $url, $content);
		}
		if(preg_match_all("/<meta(.*?)itemprop=(\"|\')image(\"|\')(.*?)content=(\"|\')(.+?)(gif|jpg|png|bmp|ico)(\"|\')(.*?)(\/)?>(<\/meta>)?/", $text, $matching)){
			$content = joinAll($matching, 6, $url, $content);
		}
		else if(preg_match_all("/<meta(.*?)content=(\"|\')(.+?)(gif|jpg|png|bmp|ico)(\"|\')(.*?)itemprop=(\"|\')image(\"|\')(.*?)(\/)?>(<\/meta>)?/", $text, $matching)){
			$content = joinAll($matching, 3, $url, $content);
		}
		$content = array_unique($content);
		$content = array_values($content);
		$images = "";
		for($i = 0; $i < count($content); $i++){
			$size = getimagesize($content[$i]);
			if($size[0] > 100 && $size[1] > 15)  $images .= $content[$i]."|";
		}
		return substr($images, 0, -1);
	}
	
	function crawCode($text){
		$content = "";
		$contentSpan = "";
		$contentParagraph = "";
		$contentSpan = getTagContent("span", $text);
		$contentParagraph = getTagContent("p", $text);
		$contentDiv = getTagContent("div", $text);
		$content = $contentSpan;
		if(strlen($contentParagraph) > strlen($contentSpan) && strlen($contentParagraph) >= strlen($contentDiv)) $content = $contentParagraph;
		else if(strlen($contentParagraph) > strlen($contentSpan) && strlen($contentParagraph) < strlen($contentDiv)) $content = $contentDiv;
		else $content = $contentParagraph;
		return $content;
	}

	function getMetaTags($contents){
	    $result = false;

	    if (isset($contents))
	    {
		$metaTags = null;
		
		preg_match('/<title>([^>]*)<\/title>/si', $contents, $match );
		
		preg_match_all('/<[\s]*meta[\s]*name="?' . '([^>"]*)"?[\s]*' . 'content="?([^>"]*)"?[\s]*[\/]?[\s]*>/si', $contents, $match);
		
		if (isset($match) && is_array($match) && count($match) == 3)
		{
		    $originals = $match[0];
		    $names = $match[1];
		    $values = $match[2];
		    
		    if (count($originals) == count($names) && count($names) == count($values))
		    {
		        $metaTags = array();
		        
		        for ($i=0, $limiti=count($names); $i < $limiti; $i++)
		        {
		            $metaTags[$names[$i]] = array (
		                'html' => htmlentities($originals[$i]),
		                'value' => $values[$i]
		            );
		        }
		    }
		}
		
		$result = $metaTags;
	    }
	    
	    return $result;
	}
	
	if(preg_match($urlRegex, $text, $match)){
		$raw = "";
		$title = "";
		$images = "";
		$description = "";
		$videoIframe = "";
		$titleAnalysis = "";
		$video = "no";
		if(strpos($match[0], " ") === 0) $match[0] = "http://".substr($match[0], 1);
		$finalUrl = $match[0];
		$pageUrl = str_replace("https://", "http://", $finalUrl);
		$urlData = getPage($pageUrl);
		if(!$urlData["content"] && strpos($pageUrl, "//www.") === false){
			if(strpos($pageUrl, "http://") !== false) $pageUrl = str_replace("http://", "http://www.", $pageUrl);
			elseif(strpos($pageUrl, "https://") !== false) $pageUrl = str_replace("https://", "https://www.", $pageUrl);
	
			$urlData = getPage($pageUrl);
		}

		$pageUrl = $finalUrl = $urlData["url"];
		$raw = $urlData["content"];
		
		$metaTags = getMetaTags($raw);
		
		foreach($metaTags as $metaTag){
			if(strpos($metaTag["html"], "title") !== false){
				$title = $metaTag["value"];
			}
			else{
				$title = getOpenGraphicContent("og:title", $raw);
				if($title == ""){
					if(preg_match("/<title(.*?)>(.*?)<\/title>/i", str_replace("\n", " ", $raw), $matching)) $title = $matching[2];
					$titleAnalysis = " ".strtolower($title);
					if($title == "" || (strpos($titleAnalysis, "404") !== false && strpos($titleAnalysis, "not found") !== false && strpos($titleAnalysis, "error") !== false)) $title = $match[0];
					if(strpos($titleAnalysis, "navegador incomp") !== false || strpos($titleAnalysis, "browser not compatible") !== false) $title = "Facebook";
				}
			}

			if($description == ""){
				$description = getOpenGraphicContent("og:description", $raw);
				if($description == ""){
					if(strpos($metaTag["html"], "description") !== false){
						$description = $metaTag["value"];
						$descriptionUnderstood = true;
					}
					else{
						$description = crawCode($raw);
					}
				}
			}
		}

		if(($descriptionUnderstood == false && strlen($title) > strlen($description) && !preg_match($urlRegex, $description) && $description != "" && !preg_match('/[A-Z]/', $description)) || $title == $description){
			$title = $description;
			$description = crawCode($raw);
		}
		$images = getOpenGraphicContent("og:image", $raw);
		$media = array();
		
		if(strpos($pageUrl, "youtube.com") !== false){
			$media = mediaYoutube($pageUrl);
			$images = $media[0];
			$videoIframe = $media[1];
		}
		else if(strpos($pageUrl, "vimeo.com") !== false){
			$media = mediaVimeo($pageUrl);
			$images = $media[0];
			$videoIframe = $media[1];
		}
		if($images == ""){
			$images = getImages($raw, $pageUrl);
		}
		if($media != null && $media[0] != "" && $media[1] != "") $video = "yes";
		
		$title = trim(str_replace("\n", " ", str_replace("\t", " ", preg_replace("/\s+/", " ", $title))));
		$pageUrl = trim(str_replace("\n", " ", str_replace("\t", " ",  preg_replace("/\s+/", " ", $pageUrl))));
		$description = trim(str_replace("\n", " ", str_replace("\t", " ",  preg_replace("/\s+/", " ", $description))));
		
		$finalLink = explode("&", $finalUrl);
		$finalLink = $finalLink[0];
		
		$description = preg_replace("/<script(.*?)>(.*?)<\/script>/i", "", $description);
		
		$answer = array(
			"title" => $title,
			"titleEsc" => $title,
			"url" => $finalLink,
			"pageUrl" => $finalUrl,
			"cannonicalUrl" => cannonicalPage($pageUrl),
			"description" => strip_tags($description),
			"descriptionEsc" => strip_tags($description),
			"images" => $images,
			"video" => $video,
			"videoIframe" => $videoIframe
		);
		
		echo json_encode($answer);
		
	}
	
	if($urlOpen == true){
		ini_set('allow_url_fopen', 0);
	}

?>

