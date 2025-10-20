# Buscador Wikipedia — Prueba Técnica Audax


##  Instrucciones de instalación y ejecución

1. Clona este repositorio o descárgalo:
   ```bash
   git clone https://github.com/Nayden4/buscador-wikipedia-audax.git
   cd audax_prueba_técnica
   ```

2. Copia la carpeta en tu entorno local (por ejemplo `htdocs` de XAMPP).

3. Asegúrate de tener MySQL o SQLite configurado y actualiza tus credenciales en `db.php`:
   ```php
   $conn = new PDO("mysql:host=localhost;dbname=audax;charset=utf8", "root", "");
   ```

4. Ejecuta `init_db.php` en el navegador para crear la tabla.

5. Abre `http://localhost/index.php` en tu navegador.

---


##  Ejemplo de uso

1. Escribe un término en el buscador (por ejemplo, `energía solar`).  
2. Se mostrarán resultados de Wikipedia en la misma página.  
3. La búsqueda se guardará en la base de datos.  
4. El historial mostrará el número de veces que se ha buscado cada término.  
5. Puedes ordenar la tabla por nombre, contador o fecha.


