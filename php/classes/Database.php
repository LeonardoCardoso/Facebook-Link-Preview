<?php
/**
 * Copyright (c) 2014 Leonardo Cardoso (http://leocardz.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.0.0
 */

/** This class is for database connection. It's just an example, neither security is being handled here nor mysql errors that might be occurred. */

include_once "HighLight.php";

class Database{

    static function connect(){

        $host = "localhost";
        $user = "root";
        $password = "";
        $database = "linkpreview";

        if(!($connection = mysql_connect($host, $user, $password)));

        mysql_query("SET character_set_results=utf8", $connection);
        mb_language('uni');
        mb_internal_encoding('UTF-8');

        if(!($db = mysql_select_db($database, $connection)));

        mysql_query("set names 'utf8'", $connection);

        return $connection;
    }

    static function insert($save){
        $conn = Database::connect();

        mysql_query("INSERT INTO `linkpreview`.`linkpreview` (`id`, `text`, `image`, `title`, `canonicalUrl`, `url`, `description`, `iframe`)
                        VALUES (NULL, '".$save["text"]."', '".$save["image"]."', '".$save["title"]."', '".$save["canonicalUrl"]."', '".$save["url"]."', '".$save["description"]."', '".$save["iframe"]."')");

        Database::close($conn);
    }

    static function select(){
        Database::connect();

        $sth = mysql_query("SELECT * FROM `linkpreview` ORDER by id DESC");

        $rows = array();
        while($r = mysql_fetch_assoc($sth)) {

            $r["text"] = HighLight::url($r["text"]);
            $r["description"] = HighLight::url($r["description"]);

            array_push($rows, $r);
        }

        return $rows;
    }

    static function close($conn){
        mysqli_close($conn);
    }



}