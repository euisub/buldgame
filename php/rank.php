<?php
    try {
        $conn = new PDO('mysql:host=localhost;dbname=buldgame', 'buldgame', 'sec1286!!');
        $query = "select count(*) from rank";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($row);

    } catch (PDOException $e) {
        echo $e->getMessage();
    }