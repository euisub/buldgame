<?php

    header('Content-Type: text/html; charset=utf-8');
    error_reporting(1);
    ini_set("display_errors",1);

    $db_host ="localhost";
    $db_user ="buldgame";
    $db_password ="dmltjq2ek!!";
    $db_name ="buldgame";

    $connect = mysqli_connect($db_host, $db_user, $db_password, $db_name);   

    if( mysqli_connect_error()){
        echo "SQL 접속 실패 !!", "<br>";
        echo "오류원인 : ", mysqli_connect_error();
    }

    function mq($sql)
	{
		global $connect;
        $connect->set_charset("utf8");
		return $connect->query($sql);
	}

    ?>