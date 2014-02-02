<?php
/**
 * Created by JetBrains PhpStorm.
 * User: leonardo
 * Date: 01/02/14
 * Time: 20:28
 * To change this template use File | Settings | File Templates.
 */

/**
 * This class is only to hightlight the urls.
 * So, it has nothing bound directly to LinkPreview class
 */

include_once "Regex.php";

class HighLight {

    static function url($text){
        $text = " " . str_replace("\n", " ", $text);
        if (preg_match_all(Regex::$urlRegex, $text, $matches)) {
            for ($i = 0; $i < count($matches[0]); $i++) {
                $currentUrl = $matches[0][$i];
                if ($currentUrl[0] == " ")
                    $currentUrl = "http://" . substr($currentUrl, 1);
                $text = str_replace($matches[0][$i], "<a href='" . $currentUrl . "' target='_blank'>" . $matches[0][$i] . "</a>", $text);
            }
        }
        return $text;
    }

}