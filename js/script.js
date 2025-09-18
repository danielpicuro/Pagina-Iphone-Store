// ===================================================================
// script.js - Código completo comentado línea por línea (para novatos)
// ===================================================================

// Esperamos a que el DOM esté completamente cargado antes de ejecutar cualquier lógica JS
document.addEventListener('DOMContentLoaded', () => {
  console.log('[APP] DOM cargado - inicializando script');

  try {
    console.log('[PRODUCTS] Inicializando lógica de productos');

    // Variables globales para mantener estado
    let productos = [];     // Lista completa de productos cargados desde el CSV
    let currentList = [];   // Lista que se está mostrando actualmente (filtrada/ordenada)

    // URL pública donde se aloja el archivo CSV (puedes cambiarla si es necesario)
    const urlIMG = "https://productos-fullapplestore.s3.us-east-1.amazonaws.com/";
    // -----------------------------------------------
    const urlCSV = "./catalogo.csv";
    // 1) Función para cargar productos desde CSV (async)
    // -----------------------------------------------
async function cargarProductos() {
  const response = await fetch(urlCSV);
  const csvText = await response.text();
  
  const { data } = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    transformHeader: h => h.trim(),
    quoteChar: '"',
    delimiter: ';'
  });
  
  data.forEach((row, index) => {
    const keys = Object.keys(row);
    if (keys.length !== 9) {
      console.warn(`[CSV WARNING] Fila ${index + 1} tiene ${keys.length} columnas (esperadas 9)`, row);
    }
    // Log de cada fila: quiero ver todos sus campos
    console.log(`[CSV ROW ${index + 1}]`, {
      id: row.id,
      nombre: row.nombre,
      colores: row.colores,
      capacidad: row.capacidad,
      marca: row.marca,
      img: row.img
    });
  });

  return data.map(row => ({
    id: parseInt(row.id),
    nombre: row.nombre,
    precio: parseFloat(row.precio),
    precioold: parseFloat(row.precioold),
    descripcion: row.descripcion,
    colores: row.colores?.split(',').map(c => c.trim()),
    capacidad: row.capacidad?.split(',').map(c => c.trim()),
    marca: row.marca?.trim(),
    img: row.img,
  }));
}

    // -----------------------------------------------
    // 2.5) Conteo Productos
    // -----------------------------------------------

    const contenedor2 = document.querySelector(".filter__list"); // Contenedor de tarjetas
    if (!contenedor2) {
      console.error('[PRODUCTS] No se encontró .filter__list en el DOM.');
      return; // Si falta, terminamos aquí
    }

    function contarProductos(lista){
      currentList = Array.isArray(lista) ? lista.slice() : [];
      			const conteo_prod = {};
      listaprods = currentList;
      console.log('Conteo1',currentList); 
			for (const cantprod of listaprods) {
			const marca = cantprod.marca;
			conteo_prod[marca] = (conteo_prod[marca] || 0) + 1;
			  }
			 console.log('Conteo2',conteo_prod) 


      const tablaconteo = Object.entries(conteo_prod).map(([marca, cantidad]) => ({
        marca,
        cantidad
      }));
      console.log('Contando tabla',tablaconteo);
        contenedor2.innerHTML = ""; // Limpiamos antes de pintar
      	tablaconteo.forEach(prod => {
				const html = `
			<li><!-- Opción 1 -->
				<label class="filter__option"><!-- Usamos label para que toda la línea sea clicable -->
				  <input type="checkbox" /><!-- Checkbox marcado por defecto (como en tu screenshot) -->
				  <span class="filter__name">${prod.marca}</span><!-- Nombre de la marca -->
				  <span class="filter__count">${prod.cantidad}</span><!-- Cantidad a la derecha -->
				</label>
			</li>
				`  
				  contenedor2.insertAdjacentHTML('beforeend', html);
			  });
    const nuevosCheckboxes = document.querySelectorAll(".filter__option input");
      nuevosCheckboxes.forEach(chk => {
        chk.addEventListener("change", aplicarFiltros);
      });

    }







    // -----------------------------------------------
    // 2) Referencias al DOM
    // -----------------------------------------------
    const contenedor = document.querySelector(".products"); // Contenedor de tarjetas
    if (!contenedor) {
      console.error('[PRODUCTS] No se encontró .products en el DOM.');
      return; // Si falta, terminamos aquí
    }

    const checkboxes = document.querySelectorAll(".filter__option input"); // Checkboxes de filtros
    const selectOrden = document.querySelector(".resultsBar__select");     // Selector de orden
    const contadorEl = document.querySelector('.resultsBar__title strong'); // Contador de productos
    const contadorE2 = document.querySelector('.filter__count');

    // Leer parámetros de URL (para conservar filtros activos)
    const params = new URLSearchParams(window.location.search);
    const marcasURL = params.getAll('marca'); // Recuperamos marcas seleccionadas en la URL

    if (!selectOrden) console.warn('[PRODUCTS] No se encontró .resultsBar__select');
    if (!contadorEl) console.warn('[PRODUCTS] No se encontró <strong> en .resultsBar__title');
    if (!contadorE2) console.warn('[PRODUCTS] No se encontró en .filter__count');

    // -----------------------------------------------
    // 3) Función para renderizar productos en el DOM
    // -----------------------------------------------
    function mostrarProductos(lista) {
      currentList = Array.isArray(lista) ? lista.slice() : [];
      contenedor.innerHTML = ""; // Limpiamos antes de pintar

      lista.forEach(prod => {
        const html = `
          <article class="card"> 
            <button class="card__fav" aria-label="Añadir a favoritos" title="Añadir a favoritos">
              <svg viewBox="0 0 24 24" class="card__favIcon" aria-hidden="true">
                <path d="M12.1 21.35l-1.1-.96C5.14 15.86 2 12.99 2 9.5 
                         2 7 4 5 6.5 5c1.54 0 3.04.99 3.57 2.36h.86
                         C11.46 5.99 12.96 5 14.5 5 17 5 19 7 
                         19 9.5c0 3.49-3.14 6.36-8.9 10.89l-1.1.96z"
                      fill="none" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </button>
            <img class="card__img" src="${prod.img}" alt="${prod.nombre}" />
            <h3 class="card__title">${prod.nombre}</h3>
            <p class="card__price">S/.<strong>${prod.precio.toFixed(2)}</strong></p>
            <a href="Prod_seleccionado.html?id=${prod.id}" class="card__cta">Compra ahora</a>
          </article>
        `;
        contenedor.insertAdjacentHTML('beforeend', html);
      });
            
      if (contadorEl) contadorEl.textContent = lista.length;
      console.log('[DEBUG] Renderizando:', lista.length, 'productos');
    }
    console.log(urlIMG);
    // -----------------------------------------------
    // 4) Función para aplicar filtros
    // -----------------------------------------------
    function aplicarFiltros() {
          const checkboxes = document.querySelectorAll(".filter__option input"); // Checkboxes de filtros
      // Extraemos marcas seleccionadas desde los checkboxes
      const marcasSeleccionadas = Array.from(checkboxes)
        .filter(chk => chk.checked)
        .map(chk => chk.nextElementSibling?.textContent.trim() || '')
        .filter(Boolean);

      console.log('[FILTER] marcas seleccionadas:', marcasSeleccionadas);

      // 🔄 Actualizamos los parámetros de la URL sin recargar
      const params = new URLSearchParams(window.location.search);
      params.delete('marca'); // Limpiamos antes de añadir

      marcasSeleccionadas.forEach(marca => params.append('marca', marca));
      const nuevaUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', nuevaUrl);

      // Filtramos productos por marca
      let filtrados = productos;
      if (marcasSeleccionadas.length > 0) {
        productos.forEach(p => console.log(`[DEBUG marca que tiene] '${p.marca}'`));
        filtrados = productos.filter(p => marcasSeleccionadas.includes(p.marca?.trim()));
      }

      // Aplicamos orden si está seleccionado
      const orden = selectOrden ? selectOrden.value : null;
      if (orden === 'price-asc') {
        filtrados = filtrados.slice().sort((a, b) => a.precio - b.precio);
      } else if (orden === 'price-desc') {
        filtrados = filtrados.slice().sort((a, b) => b.precio - a.precio);
      }

      // Mostramos los productos resultantes
      mostrarProductos(filtrados);

      // Logs para debugging
      console.log('[DEBUG] Productos originales:', productos.length);
      console.log('[DEBUG] Productos filtrados:', filtrados.length);

    }

    // -----------------------------------------------
    // 5) Eventos: checkboxes y orden
    // -----------------------------------------------
    checkboxes.forEach(chk =>
      chk.addEventListener('change', aplicarFiltros)
    );
    console.log('[PRODUCTS] listeners añadidos a checkboxes');

    if (selectOrden) {
      selectOrden.addEventListener('change', () => {
        const orden = selectOrden.value;
        console.log('[ORDER] opción elegida:', orden);
        let copia = currentList.slice();
        if (orden === 'price-asc') copia.sort((a, b) => a.precio - b.precio);
        else if (orden === 'price-desc') copia.sort((a, b) => b.precio - a.precio);
        mostrarProductos(copia);
      });
      console.log('[PRODUCTS] listener añadido al select de orden');
    }

    // -----------------------------------------------
    // 6) Función principal que inicia todo
    // -----------------------------------------------
    async function iniciarApp() {
      productos = await cargarProductos();        // Cargamos CSV
      currentList = [...productos];               // Copiamos lista
      aplicarFiltros();                           // Aplicamos filtros si hay
      mostrarProductos(productos);                // Mostramos todos inicialmente
      contarProductos(productos);  
      // Si se cargó la página con filtros desde la URL, los aplicamos
      if (marcasURL.length > 0) {
        checkboxes.forEach(chk => {
          const span = chk.nextElementSibling;
          if (span && marcasURL.includes(span.textContent.trim())) {
            chk.checked = true;
          }
        });
        aplicarFiltros(); // Aplicamos esos filtros
      }
    }

    // Iniciamos la app
    iniciarApp();

  } catch (err) {
    console.error('[PRODUCTS] error en la lógica de productos:', err);
  }
});
