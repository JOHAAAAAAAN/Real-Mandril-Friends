/* app.js COMPLETO */

const nombresMeses = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// 1. Generar menú lateral (Solo hasta el mes actual)
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

// 2. Calcular Racha (Fuegos o Copos de nieve)
function calcularRacha(nombreJugador, partidos) {
    let misPartidos = partidos.filter(p => p.jugador === nombreJugador);
    if (misPartidos.length === 0) return "-";

    let ultimoResultado = misPartidos[misPartidos.length - 1].resultado;
    let contador = 0;

    // Contamos hacia atrás cuántos iguales hay
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

// 3. Función Principal: Cargar Datos y Dibujar Tabla
function cargarDatos(filtro) {
    const tbody = document.getElementById("tabla-body");
    const titulo = document.getElementById("titulo-pagina");
    const headerRacha = document.getElementById("header-racha");
    
    tbody.innerHTML = "";
    
    // Limpiar botones activos
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    // --- DICCIONARIO DE FOTOS ---
    // Asegúrate de subir archivos con estos nombres exactos a GitHub
    const fotos = {
        "Isra": "foto1.jpg",
        "Mois": "foto2.jpg",
        "Seba": "foto3.jpg"
    };
    // ----------------------------

    // Configuración Visual (Anual vs Mensual)
    if (filtro === 'anual') {
        titulo.innerText = "🏆 Tabla Anual Global";
        document.getElementById('btn-anual').classList.add('active');
        
        // Ocultar columna Racha en Anual
        if(headerRacha) headerRacha.style.display = "none";
        
    } else {
        titulo.innerText = "📅 Estadísticas de " + nombresMeses[filtro];
        
        // Activar botón del mes correspondiente
        let botones = document.querySelectorAll('#menu-meses button');
        if(botones[filtro - 1]) botones[filtro - 1].classList.add('active');

        // Mostrar columna Racha en Mes
        if(headerRacha) headerRacha.style.display = "";
    }

    // Filtrar partidos
    let partidosFiltrados = dataPartidos;
    if (filtro !== 'anual') {
        partidosFiltrados = dataPartidos.filter(p => p.mes === filtro);
    }

    // Calcular Estadísticas
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

    // Ordenar: Mayor WinRate primero, desempate por Victorias
    stats.sort((a, b) => b.winRate - a.winRate || b.victorias - a.victorias);

    // Dibujar Filas
    stats.forEach((jugador, index) => {
        // Lógica de Colores solicitada
        let colorBadge;
        if (jugador.winRate > 90) colorBadge = '#00e676';      // Verde (>90%)
        else if (jugador.winRate >= 70) colorBadge = '#2979ff'; // Azul (70-89%)
        else if (jugador.winRate >= 60) colorBadge = '#ffea00'; // Naranja (60-69%)
        else if (jugador.winRate >= 50) colorBadge = '#ff9100'; // Amarillo (50-59%)
        else colorBadge = '#ff1744';                            // Rojo (<50%)
        
        // Celda Racha (vacía si es anual)
        let celdaRacha = filtro !== 'anual' ? `<td>${jugador.racha}</td>` : '';
        
        // Foto de perfil
        let fotoPerfil = fotos[jugador.nombre] || "https://via.placeholder.com/35";

        let fila = `
            <tr>
                <td class="${index === 0 ? 'gold' : ''}">#${index + 1}</td>
                
                <td class="player-cell">
                    <img src="${fotoPerfil}" class="avatar" alt="foto">
                    <span class="player-name">${jugador.nombre} ${index === 0 ? '👑' : ''}</span>
                </td>

                <td>${jugador.victorias} / ${jugador.derrotas}</td>
                <td><span class="badge" style="background-color:${colorBadge}">${jugador.winRate}%</span></td>
                <td>${jugador.goles}</td>
                ${celdaRacha}
                <td>${jugador.jugados}</td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

// INICIO AUTOMÁTICO
renderizarMenu();

// Detectar mes actual y cargar
const fechaHoy = new Date();
const mesActualInicial = fechaHoy.getMonth() + 1; 
cargarDatos(mesActualInicial);