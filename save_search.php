<?php
// Incluir la conexión
require_once "db.php";

header("Content-Type: application/json; charset=utf-8");

// Solo aceptar peticiones POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {

  // Obtener el término y normalizar (minúsculas y sin espacios extra)
  $termino = mb_strtolower(trim($_POST["termino"] ?? ""), "UTF-8");

  if ($termino !== "") {
    try {
      // Comprobar si el término ya existe en la base de datos
      $stmt = $conn->prepare("SELECT contador FROM historial WHERE termino = :termino");
      $stmt->bindParam(":termino", $termino, PDO::PARAM_STR);
      $stmt->execute();

      if ($stmt->rowCount() > 0) {
        // Si ya existe incrementamos el contador
        $update = $conn->prepare("UPDATE historial SET contador = contador + 1, fecha = NOW() WHERE termino = :termino");
        $update->bindParam(":termino", $termino, PDO::PARAM_STR);
        $update->execute();
      } else {
        // Si no existe insertamos nuevo término
        $insert = $conn->prepare("INSERT INTO historial (termino, contador) VALUES (:termino, 1)");
        $insert->bindParam(":termino", $termino, PDO::PARAM_STR);
        $insert->execute();
      }

      // Enviar respuesta JSON al frontend
      echo json_encode(["status" => "ok"]);

    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode(["error" => "Error en base de datos: " . $e->getMessage()]);
    }
  } else {
    http_response_code(400);
    echo json_encode(["error" => "Término vacío."]);
  }

} else {
  http_response_code(405);
  echo json_encode(["error" => "Método no permitido"]);
}
?>
