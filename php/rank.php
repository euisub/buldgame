<?
    include "lib.php";

    if($_POST["flag"] == "insert"){
        //rank insert
        $name  = mysqli_real_escape_string($connect,$_POST["name"]);
        $score = mysqli_real_escape_string($connect,$_POST["score"]);
        $time  = mysqli_real_escape_string($connect,$_POST["time"]);
        $count = mysqli_real_escape_string($connect,$_POST["count"]);

        $query = "INSERT INTO rank (name,score,time,count) VALUES('$name',$score,$time,$count)";
        $result = mysqli_query($connect, $query);

        if($result === false){ 
            echo "등록 실패 했습니다.";
        }else{
            echo 'Y';
        }       
    } 

    if($_POST["flag"] == "select"){
        //rank insert
        $query = "SELECT  @rownum:=@rownum+1 as row , a.* FROM `rank` a , (SELECT @rownum:=0) TMP order by a.score desc, a.time desc, a.count desc limit 100";
        $result = mysqli_query($connect, $query);

        while($list = $result->fetch_assoc()){
            echo  "<tr>";
            echo  "<td>".$list['row']."</td>";
            echo  "<td>".$list['name']."</td>";
            echo  "<td>".$list['score']."</td>";
            echo  "<td>".$list['time']."</td>";
            echo  "<td>".$list['count']."</td>";
            echo  "</tr>";
        }
    } 

    if($_POST["flag"] == "rankSelect"){
        $score = mysqli_real_escape_string($connect,$_POST["score"]);
        //rank insert
        $query = "SELECT count(*) as count from rank where score >=  $score";
        $result = mysqli_query($connect, $query);

        while($list = $result->fetch_assoc()){
            echo  $list['count'];
        }
    } 