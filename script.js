document.addEventListener("DOMContentLoaded", () => {
  //Elementos del html
  const inputTermino = document.getElementById("termino");
  const btnBuscar = document.getElementById("btnBuscar");
  const zonaResultados = document.getElementById("lista-resultados");

  // Variables para la paginación
  let resultadosTotales = [];
  let indiceActual = 0;
  let btnCargarMas = null;

  btnBuscar.addEventListener("click", async () => {


    //Borrar el contenido
    zonaResultados.innerHTML = "";

    //Reinicar variables para la paginación
    resultadosTotales = [];
    indiceActual = 0;
    btnCargarMas = null;

    //Obtener termino de busqueda
    const termino = inputTermino.value.trim();

    //Comprobar que no este vacio
    if (termino === "") {
      const alerta = document.createElement("div");
      alerta.className = "alert alert-warning";
      alerta.textContent = "Por favor, escribe un término para buscar.";
      zonaResultados.appendChild(alerta);
      return;
    }

    //Mostrar mensaje de carga
    const aviso = document.createElement("div");
    aviso.className = "alert alert-info";
    aviso.textContent = `Buscando resultados para: "${termino}" ...`;
    zonaResultados.appendChild(aviso);

    //Consulta a wikipedia via API
    try {
      const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        termino
      )}&utf8=&format=json&origin=*`;

      const respuesta = await fetch(url);
      const data = await respuesta.json();

      //Borrar el contenido
      zonaResultados.innerHTML = "";

      //Mostrar error si no hay resultados
      if (!data.query.search.length) {
        const sinRes = document.createElement("div");
        sinRes.className = "alert alert-warning";
        sinRes.textContent = "No se encontraron resultados.";
        zonaResultados.appendChild(sinRes);
        return;
      }

      // Guardar la búsqueda en la base de datos 
      fetch("save_search.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ termino }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "ok") {

            //Recargamos la tabla hisotrial
            cargarHistorial();
          } else {
            console.warn("Error al guardar:", data);
          }
        })
        .catch((err) => console.error("Error al enviar al servidor:", err));

      //Mostrar resultados
      resultadosTotales = data.query.search;
      mostrarMasResultados(3);
      crearBotonCargarMas();
    } catch (error) {
      console.error("Error:", error);
      zonaResultados.innerHTML = "";

      const alertaError = document.createElement("div");
      alertaError.className = "alert alert-danger";
      alertaError.textContent =
        "Ocurrió un error al conectar con Wikipedia. Intenta de nuevo.";
      zonaResultados.appendChild(alertaError);
    }
  });

  //Boton para borrar resultados
  const btnLimpiar = document.getElementById("btnLimpiar");

  btnLimpiar.addEventListener("click", () => {
    inputTermino.value = "";
    zonaResultados.innerHTML = "";

    const alerta = document.createElement("div");
    alerta.className = "alert alert-secondary mt-3";
    alerta.textContent = "Los resultados se han limpiado.";
    zonaResultados.appendChild(alerta);

    setTimeout(() => alerta.remove(), 4000);
    inputTermino.focus();
  });

  // Mostrar resultados nuevos
  function mostrarMasResultados(cantidad) {
    // Calcular el limite segun el indice actual
    const limite = indiceActual + cantidad;

    //Crear la lista con la información
    for (
      let i = indiceActual;
      i < limite && i < resultadosTotales.length;
      i++
    ) {
      const item = resultadosTotales[i];
      const enlace = document.createElement("a");
      enlace.href = `https://en.wikipedia.org/wiki/${encodeURIComponent(
        item.title
      )}`;
      enlace.target = "_blank";
      enlace.className = "list-group-item list-group-item-action";
      enlace.innerHTML = `
        <h5 class="mb-1">${item.title}</h5>
        <p class="mb-1">${item.snippet}...</p>
      `;
      // Insertar antes del botón (para mantenerlo al final)
      if (btnCargarMas && zonaResultados.contains(btnCargarMas)) {
        zonaResultados.insertBefore(enlace, btnCargarMas);
      } else {
        zonaResultados.appendChild(enlace);
      }
    }

    //Guardar nuevo indice
    indiceActual = limite;

    actualizarBoton();
  }

  // Crear el botón de cargar mas
  function crearBotonCargarMas() {
    btnCargarMas = document.createElement("button");
    btnCargarMas.id = "btnCargarMas";
    btnCargarMas.className = "btn btn-outline-success mt-3 w-100";
    btnCargarMas.addEventListener("click", () => mostrarMasResultados(3));
    zonaResultados.appendChild(btnCargarMas);
    actualizarBoton();
  }

  // Actualizar texto o eliminar botón si ya no quedan resultados
  function actualizarBoton() {
    if (!btnCargarMas) return;

    //Calculamos cuantos resultados quedan
    const restantes = resultadosTotales.length - indiceActual;
    //Si no quedan eliminamos el boton
    if (restantes <= 0) {
      btnCargarMas.remove();
      btnCargarMas = null;
    } else {
      // Cambiamos texto según los resultados que falten
      const cantidad = Math.min(3, restantes);
      btnCargarMas.textContent = `Cargar ${cantidad} más`;
    }
  }
});

// Historial de busquedas

document.addEventListener("DOMContentLoaded", cargarHistorial);

async function cargarHistorial() {
  try {

    //Consultamos el historial
    const res = await fetch("historial.php");
    const data = await res.json();

    const tbody = document.querySelector("#tabla-historial tbody");

    //Borramos el contenido de la tabla
    tbody.innerHTML = "";


    //Añadimos los registros
    data.forEach((item) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${item.termino}</td>
        <td>${item.contador}</td>
        <td>${item.fecha}</td>
      `;
      tbody.appendChild(fila);
    });

    inicializarOrdenamiento(data);
  } catch (error) {
    console.error("Error cargando historial:", error);
  }
}

// Ordenar tabla
function inicializarOrdenamiento(data) {

    //Obtenemos las cabeceras
  const headers = document.querySelectorAll("#tabla-historial th");
  let ordenActual = { columna: null, asc: true };


  headers.forEach((th) => {
    th.style.cursor = "pointer";
    th.addEventListener("click", () => {
      const col = th.dataset.col;
      const asc = ordenActual.columna === col ? !ordenActual.asc : true;
      ordenActual = { columna: col, asc };

      // Ordenar los datos
      data.sort((a, b) => {
        if (a[col] < b[col]) return asc ? -1 : 1;
        if (a[col] > b[col]) return asc ? 1 : -1;
        return 0;
      });

      // Renderizar filas
      const tbody = document.querySelector("#tabla-historial tbody");
      tbody.innerHTML = "";
      data.forEach((item) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${item.termino}</td>
          <td>${item.contador}</td>
          <td>${item.fecha}</td>
        `;
        tbody.appendChild(fila);
      });

      // Limpiar iconos y estilos
      headers.forEach((h) => {
        h.classList.remove("table-active");
        const icono = h.querySelector("i");
        if (icono) icono.className = "bi bi-arrow-down-up";
      });

      // Marcar la columna activa y cambiar el icono
      th.classList.add("table-active");
      const icono = th.querySelector("i");
      if (icono) {
        icono.className = asc ? "bi bi-arrow-up" : "bi bi-arrow-down";
      }
    });
  });
}

// Placeholder buscador dinamico
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("termino");

  // Frases relacionadas con Audax y el sector energético
  const frases = [
    "Busca Audax",
    "Busca energía solar",
    "Busca energías renovables",
    "Busca autoconsumo eléctrico",
    "Busca sostenibilidad",
    "Busca ahorro energético",
  ];

  let fraseIndex = 0;
  let charIndex = 0;
  let borrando = false;

  const velocidadEscritura = 100; 
  const velocidadBorrado = 50; 
  const pausaEntreFrases = 1200; 

  function animarPlaceholder() {
    const frase = frases[fraseIndex];

    if (!borrando) {
      // Escribiendo
      input.setAttribute("placeholder", frase.substring(0, charIndex++));
      if (charIndex > frase.length) {
        borrando = true;
        setTimeout(animarPlaceholder, pausaEntreFrases);
        return;
      }
    } else {
      // Borrando
      input.setAttribute("placeholder", frase.substring(0, charIndex--));
      if (charIndex === 0) {
        borrando = false;
        fraseIndex = (fraseIndex + 1) % frases.length;
      }
    }

    // Repetir con velocidad distinta según el modo
    setTimeout(
      animarPlaceholder,
      borrando ? velocidadBorrado : velocidadEscritura
    );
  }

  animarPlaceholder();
});
