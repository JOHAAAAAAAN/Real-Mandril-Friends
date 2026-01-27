/* app.js ACTUALIZADO */

const nombresMeses = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// 1. Lógica para generar el menú lateral automáticamente
function renderizarMenu() {
    const contenedor = document.getElementById("menu-meses");
    const fechaHoy = new Date();
    const mesActual = fechaHoy.getMonth() + 1; // getMonth() devuelve 0-11, sumamos 1

    let html = "";
    // Creamos botones solo hasta el mes actual
    for (let i = 1; i <= mesActual; i++) {
        html += `<button onclick="cargarDatos(${i})">${nombresMeses[i]}</button>`;
    }
    contenedor.innerHTML = html;
}

// 2. Función auxiliar para calcular rachas
function calcularRacha(nombreJugador, partidos) {
    // Filtramos partidos del jugador
    let misPartidos = partidos.filter(p => p.jugador === nombreJugador);
    
    // Si no ha jugado, no hay racha
    if (misPartidos.length === 0) return "-";

    // Tomamos el último resultado
    let ultimoResultado = misPartidos[misPartidos.length - 1].resultado;
    let contador = 0;

    // Recorremos de atrás hacia adelante para ver cuántos iguales seguidos tiene
    for (let i = misPartidos.length - 1; i >= 0; i--) {
        if (misPartidos[i].resultado === ultimoResultado) {
            contador++;
        } else {
            break; // Se rompió la racha
        }
    }

    // Devolvemos el ícono correspondiente
    let icono = ultimoResultado === "V" ? "🔥" : "❄️";
    return icono.repeat(contador);
}

// 3. Función Principal
function cargarDatos(filtro) {
    const tbody = document.getElementById("tabla-body");
    const titulo = document.getElementById("titulo-pagina");
    tbody.innerHTML = "";

    // Actualizar título y botones activos
    document.querySelectorAll('.sidebar button').forEach(b => b.classList.remove('active'));
    
    if (filtro === 'anual') {
        titulo.innerText = "🏆 Tabla Anual Global";
        document.getElementById('btn-anual').classList.add('active');
    } else {
        titulo.innerText = "📅 Estadísticas de " + nombresMeses[filtro];
        // Buscamos el botón del mes para activarlo visualmente (opcional)
    }

    // Filtrar partidos
    let partidosFiltrados = dataPartidos;
    if (filtro !== 'anual') {
        partidosFiltrados = dataPartidos.filter(p => p.mes === filtro);
    }

    // Calcular estadísticas
    let stats = jugadores.map(nombre => {
        let misPartidos = partidosFiltrados.filter(p => p.jugador === nombre);
        let victorias = misPartidos.filter(p => p.resultado === 'V').length;
        let derrotas = misPartidos.filter(p => p.resultado === 'D').length;
        let goles = misPartidos.reduce((acc, curr) => acc + curr.goles, 0);
        let jugados = victorias + derrotas;
        let winRate = jugados > 0 ? Math.round((victorias / jugados) * 100) : 0;
        
        // Calculamos racha enviando TODOS los partidos (para que la racha no se corte al cambiar de mes)
        // Ojo: Si quieres racha solo del mes, envía 'misPartidos'. Si quieres racha histórica, envía los globales.
        // Aquí usaremos la racha dentro del filtro seleccionado:
        let racha = calcularRacha(nombre, misPartidos);

        return { nombre, victorias, derrotas, goles, jugados, winRate, racha };
    });

    // Ordenar
    stats.sort((a, b) => b.winRate - a.winRate || b.victorias - a.victorias);

    // Dibujar Tabla
    stats.forEach((jugador, index) => {
        let colorBadge = jugador.winRate >= 80 ? '#00e676' : (jugador.winRate >= 50 ? '#ffea00' : '#ff1744');
        
        let fila = `
            <tr>
                <td class="${index === 0 ? 'gold' : ''}">#${index + 1}</td>
                <td style="font-weight:bold; color:white;">${jugador.nombre} ${index === 0 ? '👑' : ''}</td>
                <td>${jugador.victorias} / ${jugador.derrotas}</td>
                <td><span class="badge" style="background-color:${colorBadge}">${jugador.winRate}%</span></td>
                <td>${jugador.goles}</td>
                <td>${jugador.racha}</td>
                <td>${jugador.jugados}</td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

// Inicializar
renderizarMenu();     // Crea los botones de los meses disponibles
cargarDatos('anual'); // Carga la tabla