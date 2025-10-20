<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Buscador Wikipedia</title>

  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    crossorigin="anonymous" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />

  <!-- CSS personalizado -->
  <link rel="stylesheet" href="style.css">
</head>

<body class="bg-light d-flex flex-column min-vh-100">

  <header class="text-black text-center p-4">
    <h1 class="h3">Buscador Wikipedia</h1>
  </header>

  <main class="container flex-grow-1 p-5">
    <!-- Seccion de búsqueda -->
    <section id="buscador" class="mb-5">
      <form class="row g-2 align-items-stretch">
        <div class="col-12 col-md-7 col-lg-8">
          <input type="text" id="termino" class="form-control form-control-lg"
            placeholder="Escribe un término para buscar..." required>
        </div>

        <div class="col-6 col-md-3 col-lg-2 d-grid">
          <button id="btnBuscar" type="button" class="btn btn-success btn-lg w-100">
            Buscar
          </button>
        </div>

        <div class="col-6 col-md-2 col-lg-2 d-grid">
          <button id="btnLimpiar" type="button" class="btn btn-outline-secondary btn-lg w-100">
            Limpiar
          </button>
        </div>
      </form>
    </section>



    <!-- Seccion de resultados -->
    <section id="resultados" class="mb-5">
      <h2 class="h5 border-bottom pb-2 mb-3">Resultados</h2>
      <div id="lista-resultados" class="list-group shadow-sm"></div>
    </section>

    <!-- Seccion de historial -->
    <section id="historial" class="mb-5">
      <h2 class="h5 border-bottom pb-2 mb-3">Historial de búsquedas</h2>
      <div class="table-responsive">
        <table class="table table-striped table-hover" id="tabla-historial">
          <thead class="table-light">
            <tr>
              <th scope="col" data-col="termino">Término <i class="bi bi-arrow-down-up"></i></th>
              <th scope="col" data-col="contador">Veces buscado <i class="bi bi-arrow-down-up"></i></th>
              <th scope="col" data-col="fecha">Última búsqueda <i class="bi bi-arrow-down-up"></i></th>
            </tr>
          </thead>

          <tbody></tbody>
        </table>
      </div>
    </section>

  </main>

  <footer class="bg-white text-center text-muted py-3 border-top mt-auto">
    <p class="mb-0">Prueba técnica - Audax - 2025</p>
  </footer>

  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
    crossorigin="anonymous"></script>

  <!-- JS -->
  <script src="script.js"></script>
</body>

</html>