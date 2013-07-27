<?php
/*
 * Copyright (c) 2012 Leonardo Cardoso (http://leocardz.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 0.3.1
 *
 */
error_reporting(false);
$text = $_GET["text"];
$description = $_GET["description"];
$text = " " . str_replace("\n", " ", $text);
$description = " " . str_replace("\n", " ", $description);

$urlRegex = "/(https?\:\/\/|\s)[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})(\/+[a-z0-9_.\:\;-]*)*(\?[\&\%\|\+a-z0-9_=,\.\:\;-]*)?([\&\%\|\+&a-z0-9_=,\:\;\.-]*)([\!\#\/\&\%\|\+a-z0-9_=,\:\;\.-]*)}*/i";
$currentUrl = "";

if (preg_match_all($urlRegex, $text, $matches)) {
	for ($i = 0; $i < count($matches[0]); $i++) {
		$currentUrl = $matches[0][$i];
		if ($currentUrl[0] == " ")
			$currentUrl = "http://" . substr($currentUrl, 1);
		$text = str_replace($matches[0][$i], "<a href='" . $currentUrl . "' target='_blank'>" . $matches[0][$i] . "</a>", $text);
	}
}

if (preg_match_all($urlRegex, $description, $matches)) {
	$matches[0] = array_unique($matches[0]);
	$matches[0] = array_values($matches[0]);
	for ($i = 0; $i < count($matches[0]); $i++) {
		$currentUrl = $matches[0][$i];
		if ($currentUrl[0] == " ")
			$currentUrl = "http://" . substr($currentUrl, 1);
		$description = str_replace($matches[0][$i], "<a href='" . $currentUrl . "' target='_blank' >" . $matches[0][$i] . "</a>", $description);
	}
}

$answer = array("urls" => $text, "description" => $description);

echo json_encode($answer);
?>
