/* app.js ACTUALIZADO */

const nombresMeses = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function renderizarMenu() {
    const contenedor = document.getElementById("menu-meses");
    const fechaHoy = new Date();
    const mesActual = fechaHoy.getMonth() + 1; 

    let html = "";
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
    const headerRacha = document.getElementById("header-racha"); // Referencia al encabezado
    
    tbody.innerHTML = "";
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    // Configuración según si es ANUAL o MENSUAL
    if (filtro === 'anual') {
        titulo.innerText = "🏆 Tabla Anual Global";
        document.getElementById('btn-anual').classList.add('active');
        
        // OCULTAR columna de Racha en la anual
        if(headerRacha) headerRacha.style.display = "none";
        
    } else {
        titulo.innerText = "📅 Estadísticas de " + nombresMeses[filtro];
        let botones = document.querySelectorAll('#menu-meses button');
        if(botones[filtro - 1]) botones[filtro - 1].classList.add('active');

        // MOSTRAR columna de Racha en mensual
        if(headerRacha) headerRacha.style.display = ""; // "" vuelve al valor por defecto (visible)
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
        
        // Calculamos racha siempre, pero solo la mostraremos si no es anual
        let racha = calcularRacha(nombre, misPartidos);

        return { nombre, victorias, derrotas, goles, jugados, winRate, racha };
    });

    stats.sort((a, b) => b.winRate - a.winRate || b.victorias - a.victorias);

    stats.forEach((jugador, index) => {
        // LÓGICA DE COLORES NUEVA
        let colorBadge;
        if (jugador.winRate > 90) {
            colorBadge = '#00e676'; // Verde (Mayor a 90%)
        } else if (jugador.winRate >= 70) {
            colorBadge = '#2979ff'; // Azul (70% - 89%)
        } else if (jugador.winRate >= 60) {
            colorBadge = '#ff9100'; // Naranja (60% - 69%)
        } else if (jugador.winRate >= 50) {
            colorBadge = '#ffea00'; // Amarillo (50% - 59%)
        } else {
            colorBadge = '#ff1744'; // Rojo (Menos de 50%)
        }
        
        // Construimos la celda de racha SOLO si no es anual
        let celdaRacha = filtro !== 'anual' ? `<td>${jugador.racha}</td>` : '';

        let fila = `
            <tr>
                <td class="${index === 0 ? 'gold' : ''}">#${index + 1}</td>
                <td class="player-name">${jugador.nombre} ${index === 0 ? '👑' : ''}</td>
                <td>${jugador.victorias} / ${jugador.derrotas}</td>
                <td><span class="badge" style="background-color:${colorBadge}">${jugador.winRate}%</span></td>
                <td>${jugador.goles}</td>
                ${celdaRacha} <td>${jugador.jugados}</td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

// INICIALIZACIÓN
renderizarMenu();

// Lógica para abrir el MES ACTUAL por defecto
const fechaHoy = new Date();
const mesActualInicial = fechaHoy.getMonth() + 1; // Enero = 1
cargarDatos(mesActualInicial);