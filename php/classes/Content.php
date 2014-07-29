<?php
/**
 * Copyright (c) 2014 Leonardo Cardoso (http://leocardz.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.0
 */

/** This class handles the content analysis */

include_once "Regex.php";

class Content {

    static function crawlCode($text) {
        $contentSpan = Content::getTagContent("span", $text);
        $contentParagraph = Content::getTagContent("p", $text);
        $contentDiv = Content::getTagContent("div", $text);
        if (strlen($contentParagraph) > strlen($contentSpan) && strlen($contentParagraph) >= strlen($contentDiv))
            $content = $contentParagraph;
        else if (strlen($contentParagraph) > strlen($contentSpan) && strlen($contentParagraph) < strlen($contentDiv))
            $content = $contentDiv;
        else
            $content = $contentParagraph;
        return $content;
    }

    static function isImage($url) {
        if (preg_match(Regex::$imagePrefixRegex, $url))
            return true;
        else
            return false;
    }

    static function getTagContent($tag, $string) {
        $pattern = "/<$tag(.*?)>(.*?)<\/$tag>/i";

        preg_match_all($pattern, $string, $matches);
        $content = "";
        for ($i = 0; $i < count($matches[0]); $i++) {
            $currentMatch = strip_tags($matches[0][$i]);
            if (strlen($currentMatch) >= 120) {
                $content = $currentMatch;
                break;
            }
        }
        if ($content == "") {
            preg_match($pattern, $string, $matches);
            $content = $matches[0];
        }
        return str_replace("&nbsp;", "", $content);
    }

    static function getImages($text, $url, $imageQuantity) {
        $content = array();
        if (preg_match_all(Regex::$imageRegex, $text, $matching)) {

            for ($i = 0; $i < count($matching[0]); $i++) {
                $src = "";
                $pathCounter = substr_count($matching[0][$i], "../");
                preg_match(Regex::$srcRegex, $matching[0][$i], $imgSrc);
                $imgSrc = Url::canonicalImgSrc($imgSrc[2]);
                if (!preg_match(Regex::$httpRegex, $imgSrc)) {
                    $src = Url::getImageUrl($pathCounter, Url::canonicalLink($imgSrc, $url));
                }
                if ($src . $imgSrc != $url) {
                    if ($src == "")
                        array_push($content, $src . $imgSrc);
                    else
                        array_push($content, $src);
                }
            }
        }

        $content = array_unique($content);
        $content = array_values($content);

        $maxImages = $imageQuantity != -1 && $imageQuantity < count($content) ? $imageQuantity : count($content);

        $images = "";
        for ($i = 0; $i < count($content); $i++) {
            $size = getimagesize($content[$i]);
            if ($size[0] > 100 && $size[1] > 15) {// avoids getting very small images
                $images .= $content[$i] . "|";
                $maxImages--;
                if ($maxImages == 0)
                    break;
            }
        }
        return substr($images, 0, -1);
    }

    static function separeMetaTagsContent($raw) {
        preg_match(Regex::$contentRegex1, $raw, $match);
        if(count($match) == 0){
            preg_match(Regex::$contentRegex2, $raw, $match);
        }
        return $match[1];
    }

    static function getMetaTags($contents) {
        $result = false;
        $metaTags = array("url" => "", "title" => "", "description" => "", "image" => "");

        if (isset($contents)) {

            preg_match_all(Regex::$metaRegex, $contents, $match);

            foreach ($match[1] as $value) {

                if ((strpos($value, 'property="og:url"') !== false || strpos($value, "property='og:url'") !== false) || (strpos($value, 'name="url"') !== false || strpos($value, "name='url'") !== false))
                    $metaTags["url"] = Content::separeMetaTagsContent($value);
                else if ((strpos($value, 'property="og:title"') !== false || strpos($value, "property='og:title'") !== false) || (strpos($value, 'name="title"') !== false || strpos($value, "name='title'") !== false))
                    $metaTags["title"] = Content::separeMetaTagsContent($value);
                else if ((strpos($value, 'property="og:description"') !== false || strpos($value, "property='og:description'") !== false) || (strpos($value, 'name="description"') !== false || strpos($value, "name='description'") !== false))
                    $metaTags["description"] = Content::separeMetaTagsContent($value);
                else if ((strpos($value, 'property="og:image"') !== false || strpos($value, "property='og:image'") !== false) || (strpos($value, 'name="image"') !== false || strpos($value, "name='image'") !== false))
                    $metaTags["image"] =  Content::separeMetaTagsContent($value);
            }

            $result = $metaTags;
        }
        return $result;
    }

    static function extendedTrim($content) {
        return trim(str_replace("\n", " ", str_replace("\t", " ", preg_replace("/\s+/", " ", $content))));
    }
}
