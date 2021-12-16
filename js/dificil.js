const elementos = document.getElementsByTagName("td"); // -> Devuelve lista de todos los <td></td>
const tabla = document.getElementById("tablero"); // -> Devuelve el elemento cuyo id es tablero
const filas=tabla.rows.length;
const columnas=tabla.rows[0].cells.length;


let bloqueado = false;
let ultimoSeleccionado;

// Itera las filas
for (let i = 0; i < tabla.rows.length; i++) {
  const fila = tabla.rows[i]; // i (num fila) -> fila (elemento en si)

  for (let j = 0; j < fila.cells.length; j++) {
    const casilla = fila.cells[j];

    // i -> (num fila)
    // j -> (num columna)
    // casilla -> (td)
    
        // asignamos onclick a la casilla
    casilla.onclick = () => {

      // Si el juego no ha finalizado y la casilla seleccionada no está iluminada
      if (bloqueado == false && !casilla.classList.contains("iluminado")) {
        // Solo se ejecuta si no hay ganador

        casilla.innerHTML = `<h1>${casilla.getAttribute("pareja")}</h1>`; // Si usamos este tipo de comillas (` `), podemos combinar texto y variables (con ${})
        casilla.classList.add("iluminado"); // Interruptor de clases

        // El primero que se selecciona
        if (!ultimoSeleccionado) {
          ultimoSeleccionado = casilla;
        }

        // Parejas NO coinciden
        else if (ultimoSeleccionado.getAttribute("pareja") != casilla.getAttribute("pareja")) {
          
          // Bloqueamos el click
          bloqueado = true;

          // Esperamos 1 segundo
          setTimeout(() => {
            // Apagamos la original (y ocultamos el texto)
            ultimoSeleccionado.innerHTML = "";
            ultimoSeleccionado.classList.remove("iluminado");

            // Eliminamos la última seleccionada
            ultimoSeleccionado = undefined; // En javascript moderno no se suele usar null

            // Apagamos la seleccionada
            casilla.innerHTML = "";
            casilla.classList.remove("iluminado");

            // Reactivamos el click
            bloqueado = false;

          }, 1000);
        }

        // Parejas coinciden
        else {
          ultimoSeleccionado = undefined;
        }

        comprobarGanador();
      }
    };
  }
}

for (let index = 0; index < (filas * columnas) / 2; index++) { // Hay tantas parejas como (filas*columnas)/2
  generarPareja(index);  
}

// Generamos las parejas (recibe el id de la pareja) 
function generarPareja(id) {
  let generados = 0;

  // Como son parejas, hacemos 2
  while (generados < 2) {
    const fila = getRandomArbitrary(0, tabla.rows.length);
    const columna = getRandomArbitrary(0, tabla.rows[0].cells.length);

    // Evitamos duplicados
    if (tabla.rows[fila].cells[columna].getAttribute("pareja") == null) {
      tabla.rows[fila].cells[columna].setAttribute("pareja", `${id}`);
      generados++;
    }
  }
}


// Retorna un número aleatorio entre min (incluido) y max (incluido)
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * max) - min;
}

// Comprueba si hay ganador
function comprobarGanador() {

  // For of -> Para cada "casilla" del array de elementos
  for (const casilla of elementos) {
    const iluminado = casilla.classList.contains("iluminado"); // Contiene la class=iluminado? -> True / False

    if(iluminado == false) {
      return; // Paramos la ejecución de la función
    }
  }

  // Solo llega si no ha saltado el return -> Todas están iluminadas
  alert("has ganado");
  bloqueado = true;
}

niveles.onsubmit = (event) => {
  event.preventDefault(); // No recarga la página
  const nivel = document.querySelector('input[name="nivel"]:checked').value; // Nos devuelve el valor del nivel seleccionado (F M S)

  if(nivel == "F") {
    window.location = "facil.html";
  } else if(nivel == "M") {
    window.location = "medio.html";
  } else if(nivel == "D") {
    window.location = "dificil.html";
  } else if(nivel == "P") {
    // Tener en cuenta lo que ha puesto el usuario (filas, columnas, luces)
    
    const data = new FormData(event.target); // Habilita getters y setters para el formulario
    
    const filas = data.get("filas");
    const columnas = data.get("columnas");
    const luces = data.get("luces");

    const url = new URL("/personalizado.html", window.location.origin); // personalizado.html

    url.searchParams.append("filas", filas); // personalizado.html?filas=3
    url.searchParams.append("columnas", columnas);
    url.searchParams.append("luces", luces);

    window.location = url.toString();
    
  }
}