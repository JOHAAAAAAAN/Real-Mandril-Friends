/* app.js */
function cargarDatos(filtro) {
    const tbody = document.getElementById("tabla-body");
    const titulo = document.getElementById("titulo-pagina");
    tbody.innerHTML = ""; // Limpiar tabla

    // Actualizar título
    if (filtro === 'anual') titulo.innerText = "🏆 Tabla Anual Global";
    else titulo.innerText = "📅 Estadísticas Mes " + filtro;

    // 1. Filtrar los partidos según el mes o todos si es anual
    let partidosFiltrados = dataPartidos;
    if (filtro !== 'anual') {
        partidosFiltrados = dataPartidos.filter(p => p.mes === filtro);
    }

    // 2. Calcular estadísticas por jugador
    let stats = jugadores.map(nombre => {
        let misPartidos = partidosFiltrados.filter(p => p.jugador === nombre);
        let victorias = misPartidos.filter(p => p.resultado === 'V').length;
        let derrotas = misPartidos.filter(p => p.resultado === 'D').length;
        let goles = misPartidos.reduce((acc, curr) => acc + curr.goles, 0); // Sumar goles
        let jugados = victorias + derrotas;
        let winRate = jugados > 0 ? Math.round((victorias / jugados) * 100) : 0;

        return { nombre, victorias, derrotas, goles, jugados, winRate };
    });

    // 3. Ordenar: Primero por % WinRate, luego por Victorias
    stats.sort((a, b) => b.winRate - a.winRate || b.victorias - a.victorias);

    // 4. Dibujar en la tabla
    stats.forEach((jugador, index) => {
        let colorBadge = jugador.winRate >= 80 ? '#00e676' : (jugador.winRate >= 50 ? '#ffea00' : '#ff1744');
        
        let fila = `
            <tr>
                <td class="${index === 0 ? 'gold' : ''}">#${index + 1}</td>
                <td style="font-weight:bold; color:white;">${jugador.nombre} ${index === 0 ? '👑' : ''}</td>
                <td>${jugador.victorias} / ${jugador.derrotas}</td>
                <td><span class="badge" style="background-color:${colorBadge}">${jugador.winRate}%</span></td>
                <td>${jugador.goles}</td>
                <td>${jugador.jugados}</td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

// Cargar la tabla anual al iniciar
cargarDatos('anual');