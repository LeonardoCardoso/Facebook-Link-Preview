<?php
/**
 * Copyright (c) 2014 Leonardo Cardoso (http://leocardz.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.0
 */

class Regex {

    public static $urlRegex = "/(https?\:\/\/|\s)[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})(\/+[a-z0-9_.\:\;-]*)*(\?[\&\%\|\+a-z0-9_=,\.\:\;-]*)?([\&\%\|\+&a-z0-9_=,\:\;\.-]*)([\!\#\/\&\%\|\+a-z0-9_=,\:\;\.-]*)}*/i";
    public static $imageRegex = "/<img(.*?)src=(\"|\')(.+?)(gif|jpg|png|bmp)(.*?)(\"|\')(.*?)(\/)?>(<\/img>)?/";
    public static $imagePrefixRegex = "/\.(jpg|png|gif|bmp)$/i";
    public static $srcRegex = '/src=(\"|\')(.+?)(\"|\')/i';
    public static $httpRegex = "/https?\:\/\//i";
    public static $contentRegex1 = '/content="(.*?)"/i';
    public static $contentRegex2 = "/content='(.*?)'/i";
    public static $metaRegex= '/<meta(.*?)>/i';
    public static $titleRegex= "/<title(.*?)>(.*?)<\/title>/i";
    public static $scriptRegex= "/<script(.*?)>(.*?)<\/script>/i";

}
