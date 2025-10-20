<?php
// Datos de conexión
$host = "localhost";      
$user = "root";           
$pass = "";               
$dbname = "buscador_wiki"; 

try {
  // Conexión usando PDO
  $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  die("Error de conexión: " . $e->getMessage());
}
?>
