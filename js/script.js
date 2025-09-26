// ===================================================================
// script.js - Código completo comentado línea por línea 
// ===================================================================

// Esperamos a que el DOM esté completamente cargado antes de ejecutar cualquier lógica JS
document.addEventListener('DOMContentLoaded', () => {
  console.log('[APP] DOM cargado - inicializando script');

  try {
    console.log('[PRODUCTS] Inicializando lógica de productos');

    // Variables globales para mantener estado
    let productos = [];     // Lista completa de productos cargados desde el CSV
    let currentList = [];   // Lista que se está mostrando actualmente (filtrada/ordenada)
    let primerPrecio = '';
    let permitirActualizarURL = false; // No actualiza al inicio
    

    const vengoDesdeOtraPagina = document.referrer && !document.referrer.includes(window.location.pathname);
    // URL pública donde se aloja el archivo CSV (puedes cambiarla si es necesario)
    const urlIMG = "https://productos-fullapplestore.s3.us-east-1.amazonaws.com/";
    // -----------------------------------------------
    const urlCSV = `${window.location.origin}/catalogo.csv`;
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
    precio: row.precio,
    precioold: row.precioold,
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
    const inputSearch = document.querySelector(".filter__searchInput");

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
        let primerPrecio = prod.precio;

        // Convertimos a string para poder hacer split()
        const precios = String(prod.precio).split(',').map(p => p.trim());

        if (precios.length > 1) {
          primerPrecio = parseFloat(precios[0]);
          console.log(primerPrecio, 'ayuda');
        }
        
        const html = `
          <article class="card"> 

            <img class="card__img" src="./img/${prod.img}" alt="${prod.nombre}" />
            <div class="card__content">
            <h3 class="card__title">${prod.nombre}</h3>
            <p class="card__price">S/.<strong>${parseFloat(primerPrecio).toFixed(2)}</strong></p>
            <a href="Prod_seleccionado.html?id=${prod.id}" class="card__cta">Compra ahora</a>
            <div>
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



  // ❌ No limpiamos la URL si venimos desde otra página
    if (permitirActualizarURL) {
    const params = new URLSearchParams(window.location.search);
    params.delete('marca'); // Limpiamos marcas anteriores
    marcasSeleccionadas.forEach(marca => params.append('marca', marca));
    const nuevaUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', nuevaUrl);
  }

      // 🔄 Actualizamos los parámetros de la URL sin recargar
     /* const params = new URLSearchParams(window.location.search);
      params.delete('marca'); // Limpiamos antes de añadir
      

      marcasSeleccionadas.forEach(marca => params.append('marca', marca));
      const nuevaUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', nuevaUrl);*/

      // Filtramos productos por marca
      let filtrados = productos;
      if (marcasSeleccionadas.length > 0) {
        productos.forEach(p => console.log(`[DEBUG marca que tiene] '${p.marca}'`));
        filtrados = productos.filter(p => marcasSeleccionadas.includes(p.marca?.trim()));
      }

        // 2) Filtro por texto del buscador
  const texto = inputSearch ? inputSearch.value.toLowerCase() : "";
  if (texto) {
    filtrados = filtrados.filter(p =>
      p.nombre.toLowerCase().includes(texto) ||
      p.marca?.toLowerCase().includes(texto) ||
      p.descripcion?.toLowerCase().includes(texto)
    );
  }



        // 3) Orden
      // Aplicamos orden si está seleccionado
      const orden = selectOrden ? selectOrden.value : null;
      const obtenerPrimerPrecio = (item) => parseFloat(String(item.precio).split(',')[0].trim());

      if (orden === 'price-asc') {
        filtrados = filtrados.slice().sort((a, b) => obtenerPrimerPrecio(a) - obtenerPrimerPrecio(b));
        console.log(filtrados);
      } else if (orden === 'price-desc') {
        filtrados = filtrados.slice().sort((a, b) => obtenerPrimerPrecio(b) - obtenerPrimerPrecio(a));
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
      selectOrden.addEventListener('change', aplicarFiltros);
      console.log('[PRODUCTS] listener añadido al select de orden');
    }
     if (inputSearch) {
    inputSearch.addEventListener("input", aplicarFiltros);
  }
    // -----------------------------------------------
    // 6) Función principal que inicia todo
    // -----------------------------------------------
async function iniciarApp() {
  productos = await cargarProductos();        // Cargamos productos desde CSV
  currentList = [...productos];               // Copiamos lista
  contarProductos(productos);                 // Generamos checkboxes dinámicamente

  // Esperamos un tick para asegurarnos que los checkboxes ya están en el DOM
  setTimeout(() => {
    const nuevosCheckboxes = document.querySelectorAll(".filter__option input");

    // Si hay marcas en la URL, marcamos esos checkboxes
    if (marcasURL.length > 0) {
      nuevosCheckboxes.forEach(chk => {
        const span = chk.nextElementSibling;
        if (span && marcasURL.includes(span.textContent.trim())) {
          chk.checked = true;
        }
      });
    }
    permitirActualizarURL = true;

    // ✅ Ahora aplicamos los filtros (una sola vez)
    aplicarFiltros();
  }, 0);
}

    // Iniciamos la app
    iniciarApp();

  } catch (err) {
    console.error('[PRODUCTS] error en la lógica de productos:', err);
  }
});
