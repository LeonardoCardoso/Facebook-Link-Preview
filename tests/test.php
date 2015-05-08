<?php

$_POST["text"] = "This is a test > lab.leocardz.com/facebook-link-preview-php--jquery/";
$_POST["imagequantity"] = -1;

include ("../php/textCrawler.php");

$expectedResult = file_get_contents("result.txt");

ob_start();
var_dump($expectedResult === $answer);
$check = ob_get_clean();

if(strpos($check, "false") !== false) {
    exit(1);
}