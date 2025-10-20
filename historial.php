<?php
require_once "db.php";

header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] === "GET") {

    //Devolvemos los registros de la tabla historial
    try {
        $stmt = $conn->query("SELECT termino, contador, fecha FROM historial ORDER BY fecha DESC");
        $historial = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($historial);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
}
?>