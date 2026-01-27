/* app.js ACTUALIZADO */

const nombresMeses = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function renderizarMenu() {
    const contenedor = document.getElementById("menu-meses");
    const fechaHoy = new Date();
    const mesActual = fechaHoy.getMonth() + 1; 

    let html = "";
    // Ahora generamos botones con la clase 'nav-btn' y el ícono
    for (let i = 1; i <= mesActual; i++) {
        html += `<button onclick="cargarDatos(${i})" class="nav-btn">📅 ${nombresMeses[i]}</button>`;
    }
    contenedor.innerHTML = html;
}

function calcularRacha(nombreJugador, partidos) {
    let misPartidos = partidos.filter(p => p.jugador === nombreJugador);
    if (misPartidos.length === 0) return "-";

    let ultimoResultado = misPartidos[misPartidos.length - 1].resultado;
    let contador = 0;

    for (let i = misPartidos.length - 1; i >= 0; i--) {
        if (misPartidos[i].resultado === ultimoResultado) {
            contador++;
        } else {
            break; 
        }
    }

    let icono = ultimoResultado === "V" ? "🔥" : "❄️";
    return icono.repeat(contador);
}

function cargarDatos(filtro) {
    const tbody = document.getElementById("tabla-body");
    const titulo = document.getElementById("titulo-pagina");
    tbody.innerHTML = "";

    // Reseteamos la clase 'active' de todos los botones
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    // Identificamos qué botón activar
    if (filtro === 'anual') {
        titulo.innerText = "🏆 Tabla Anual Global";
        document.getElementById('btn-anual').classList.add('active');
    } else {
        titulo.innerText = "📅 Estadísticas de " + nombresMeses[filtro];
        // Buscamos el botón que contenga el texto del mes para activarlo
        // (Un pequeño truco para no usar IDs complejos)
        let botones = document.querySelectorAll('#menu-meses button');
        if(botones[filtro - 1]) botones[filtro - 1].classList.add('active');
    }

    let partidosFiltrados = dataPartidos;
    if (filtro !== 'anual') {
        partidosFiltrados = dataPartidos.filter(p => p.mes === filtro);
    }

    let stats = jugadores.map(nombre => {
        let misPartidos = partidosFiltrados.filter(p => p.jugador === nombre);
        let victorias = misPartidos.filter(p => p.resultado === 'V').length;
        let derrotas = misPartidos.filter(p => p.resultado === 'D').length;
        let goles = misPartidos.reduce((acc, curr) => acc + curr.goles, 0);
        let jugados = victorias + derrotas;
        let winRate = jugados > 0 ? Math.round((victorias / jugados) * 100) : 0;
        let racha = calcularRacha(nombre, misPartidos);

        return { nombre, victorias, derrotas, goles, jugados, winRate, racha };
    });

    stats.sort((a, b) => b.winRate - a.winRate || b.victorias - a.victorias);

    stats.forEach((jugador, index) => {
        let colorBadge = jugador.winRate >= 80 ? '#00e676' : (jugador.winRate >= 50 ? '#ffea00' : '#ff1744');
        
        let fila = `
            <tr>
                <td class="${index === 0 ? 'gold' : ''}">#${index + 1}</td>
                <td class="player-name">${jugador.nombre} ${index === 0 ? '👑' : ''}</td>
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

renderizarMenu();     
cargarDatos('anual');