<?php
$host = "localhost";
$user = "root";
$pass = "";

try {
  $conn = new PDO("mysql:host=$host;charset=utf8", $user, $pass);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // Crear la base de datos si no existe
  $conn->exec("CREATE DATABASE IF NOT EXISTS buscador_wiki CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci");
  $conn->exec("USE buscador_wiki");

  // Crear la tabla historial
  $conn->exec("
    CREATE TABLE IF NOT EXISTS historial (
      id INT AUTO_INCREMENT PRIMARY KEY,
      termino VARCHAR(255) NOT NULL UNIQUE,
      contador INT DEFAULT 1,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  ");

  echo "Base de datos y tabla creadas correctamente ";
} catch (PDOException $e) {
  echo "Error: " . $e->getMessage();
}
?>
