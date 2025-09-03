// ===================================================================
// script.js - Código completo comentado línea por línea (para novicios)
// ===================================================================

// Escuchamos DOMContentLoaded para ejecutar el código cuando el HTML ya esté listo.
document.addEventListener('DOMContentLoaded', () => { // Espera a que el DOM esté cargado
  console.log('[APP] DOM cargado - inicializando script'); // Log inicial para saber que el archivo se ejecutó

  /* =========================================================
     PARTE A: Carousel (si existe en la página) - inicialización segura
     ========================================================= */
  try { // Empezamos un bloque try para que cualquier error aquí no rompa el resto del script
    let currentSlide = 0; // Índice del slide actualmente visible

    const slides = document.querySelectorAll('.hero-slide-content'); // Selecciona todos los slides (NodeList)
    const track = document.querySelector('.hero-slides'); // Contenedor "track" que se mueve con transform
    const dotsContainer = document.querySelector('.carousel-dots'); // Contenedor donde iremos poniendo los puntitos

    console.log('[CAROUSEL] slides encontrados:', slides.length, 'track encontrado:', !!track, 'dotsContainer encontrado:', !!dotsContainer);
    // Si no hay slides o no existe el track o los dots, no inicializamos el carousel (evita errores)
    if (slides.length > 0 && track && dotsContainer) { // Solo continuar si existe lo necesario
      // Creamos los puntitos (indicadores) dinámicamente, uno por cada slide
      slides.forEach((_, index) => { // Recorremos la lista de slides
        const dot = document.createElement('span'); // Creamos un span para el puntito
        dot.classList.add('dot'); // Le añadimos la clase 'dot' para estilo
        if (index === 0) dot.classList.add('active'); // Marcamos el primer puntito como activo
        dot.addEventListener('click', () => { // Añadimos evento para ir al slide cuando el puntito se clickee
          goToSlide(index); // Llama a la función que mostrará el slide indicado
        });
        dotsContainer.appendChild(dot); // Insertamos el puntito en el contenedor
      });

      const dots = dotsContainer.querySelectorAll('.dot'); // Recolectamos los puntitos que acabamos de crear

      // Función que muestra (mueve) el slide en función de su índice
      function showSlide(index) { // Mueve el track y actualiza los puntitos
        if (!track) return; // Seguridad: si track desaparece, salimos
        track.style.transform = `translateX(-${index * 100}%)`; // Mueve el track usando CSS transform
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index)); // Marca el puntito activo
        console.log('[CAROUSEL] mostrando slide', index); // Log para ver qué slide se mostró
      }

      // Función para cambiar al slide indicado y actualizar índice actual
      function goToSlide(index) {
        currentSlide = index; // Actualiza el índice actual
        showSlide(currentSlide); // Muestra el slide
      }

      // Función que avanza al siguiente slide (y hace loop al final)
      function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length; // Incrementa y vuelve a 0 si llega al final
        showSlide(currentSlide); // Muestra el nuevo slide
      }

      showSlide(currentSlide); // Muestra el primer slide al iniciar
      const carouselInterval = setInterval(nextSlide, 3000); // Autoplay: cambia cada 3 segundos
      console.log('[CAROUSEL] inicializado con autoplay (3s)'); // Log que confirma inicialización
    } else {
      console.log('[CAROUSEL] omitida inicialización (no se detectaron elementos necesarios)'); // Si no hay hero, avisamos y continuamos
    }
  } catch (err) { // Capturamos errores del bloque carousel para no detener todo el script
    console.error('[CAROUSEL] error durante la inicialización:', err); // Mostramos el error en consola
  }

  /* =========================================================
     PARTE B: Productos, filtros y orden
     ========================================================= */
  try { // Nuevo try para la lógica de productos
    console.log('[PRODUCTS] Inicializando lógica de productos'); // Log inicial

    // 1) Datos simulados (esto simula una "BD" local)
    const productos = [ // Array de objetos; cada objeto representa un producto
      { id: 1, nombre: "iPhone 14 Pro", precio: 1437, marca: "Apple smartphone", img: "./img/iphone.jpg" },
      { id: 2, nombre: "Macbook Air M2", precio: 1800, marca: "Macbook", img: "https://placehold.co/360x280" },
      { id: 3, nombre: "AirPods Pro", precio: 250, marca: "Air phones", img: "https://placehold.co/360x280" },
      { id: 4, nombre: "Batería externa", precio: 100, marca: "Battery", img: "https://placehold.co/360x280" },
      { id: 1, nombre: "iPhone 15 Pro", precio: 1600, marca: "Apple smartphone", img: "./img/iphone.jpg" },
      
    ];
    console.log('[PRODUCTS] productos cargados:', productos.length); // Log cantidad de productos

    // 2) Referencias DOM (selectores)
    const contenedor = document.querySelector(".products"); // Contenedor donde renderizaremos las cards
    if (!contenedor) { // Si no existe el contenedor, no podemos continuar
      console.error('[PRODUCTS] No se encontró .products en el DOM. Asegúrate que <div class="products"></div> existe en el HTML.');
      return; // Salimos de la función principal porque no tenemos dónde pintar
    }
    console.log('[PRODUCTS] contenedor .products encontrado'); // Confirmación

    const checkboxes = document.querySelectorAll(".filter__option input"); // Todos los checkboxes de filtros
    console.log('[PRODUCTS] checkboxes encontrados:', checkboxes.length); // Cuántos checkboxes detectamos

    const selectOrden = document.querySelector(".resultsBar__select"); // Selector de orden (puede faltar)
    if (!selectOrden) console.warn('[PRODUCTS] No se encontró .resultsBar__select — el orden no funcionará si falta'); // Advertencia si falta

    // 3) Estado actual (lista que se muestra)
    let currentList = [...productos]; // Estado local: lista actualmente visible (copia inicial de productos)

    // 4) Elemento contador (para actualizar "Selected Products: X")
    const contadorEl = document.querySelector('.resultsBar__title strong'); // Buscamos el <strong> donde mostrar el número
    if (!contadorEl) console.warn('[PRODUCTS] No se encontró <strong> dentro de .resultsBar__title — el contador no se actualizará'); // Advertencia si falta

    // 5) Función para renderizar productos en el DOM (recibe un array)
    function mostrarProductos(lista) {
      currentList = Array.isArray(lista) ? lista.slice() : []; // Guardamos la lista actual (seguridad con slice)
      contenedor.innerHTML = ""; // Limpiamos el contenedor antes de pintar

      // Recorremos la lista y construimos cada card con HTML
      lista.forEach(prod => {
        const html = `
          <article class="card"> 
            <button class="card__fav" aria-label="Añadir a favoritos" title="Añadir a favoritos">
              <svg viewBox="0 0 24 24" class="card__favIcon" aria-hidden="true">
                <path d="M12.1 21.35l-1.1-.96C5.14 15.86 2 12.99 2 9.5 2 7 4 5 6.5 5c1.54 0 3.04.99 3.57 2.36h.86C11.46 5.99 12.96 5 14.5 5 17 5 19 7 19 9.5c0 3.49-3.14 6.36-8.9 10.89l-1.1.96z" fill="none" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </button>
            <img class="card__img" src="${prod.img}" alt="${prod.nombre}" />
            <h3 class="card__title">${prod.nombre}</h3>
            <p class="card__price">S/.<strong>${prod.precio.toFixed(2)}</strong></p>
            <button class="card__cta">Compra ahora</button>
          </article>
        `; // Template string con la estructura de cada tarjeta
        contenedor.insertAdjacentHTML('beforeend', html); // Insertamos la card al final del contenedor
      });

      // Si existe el contador, lo actualizamos con la cantidad de elementos mostrados
      if (contadorEl) {
        contadorEl.textContent = lista.length; // Actualizamos número en el DOM
      }

      console.log('[PRODUCTS] renderizados', lista.length, 'productos'); // Log de confirmación
    }

    // 6) Función que aplica los filtros según checkboxes seleccionados
    function aplicarFiltros() {
      // Obtenemos los textos (nombres) de las marcas que estén seleccionadas
      const marcasSeleccionadas = Array.from(checkboxes)
        .filter(chk => chk.checked) // Solo los checkboxes marcados
        .map(chk => { // Mapeamos a su texto visible (el span junto al input)
          const nameSpan = chk.nextElementSibling; // según tu HTML, nextElementSibling es el <span class="filter__name">
          return nameSpan ? nameSpan.textContent.trim() : ''; // Si no existe, devolvemos cadena vacía
        })
        .filter(Boolean); // Eliminamos cadenas vacías si las hubiera

      console.log('[FILTER] marcas seleccionadas:', marcasSeleccionadas); // Log para depurar

      // Si no hay filtros seleccionados, mostramos todos los productos
      let filtrados = productos;
      if (marcasSeleccionadas.length > 0) { // Si hay marcas, filtramos por coincidencia exacta
        filtrados = productos.filter(p => marcasSeleccionadas.includes(p.marca));
      }

      // Aplicamos orden si hay un valor seleccionado en el select de orden
      const orden = selectOrden ? selectOrden.value : null;
      if (orden === 'price-asc') {
        filtrados = filtrados.slice().sort((a, b) => a.precio - b.precio); // Orden ascendente por precio
      } else if (orden === 'price-desc') {
        filtrados = filtrados.slice().sort((a, b) => b.precio - a.precio); // Orden descendente por precio
      }

      mostrarProductos(filtrados); // Finalmente renderizamos la lista filtrada y ordenada
    }

    // 7) Añadimos event listeners a cada checkbox para que disparen el filtrado al cambiar
    checkboxes.forEach(chk => chk.addEventListener('change', aplicarFiltros)); // Escucha 'change' en cada checkbox
    console.log('[PRODUCTS] listeners añadidos a checkboxes'); // Confirmación

    // 8) Si existe el select de orden, añadimos listener para ordenar lo que esté visible
    if (selectOrden) {
      selectOrden.addEventListener('change', () => { // Al cambiar opción en el select
        const orden = selectOrden.value; // Leemos la opción
        console.log('[ORDER] opción elegida:', orden); // Log para depuración
        let copia = currentList.slice(); // Copiamos currentList (lo que está visible)
        if (orden === 'price-asc') copia.sort((a, b) => a.precio - b.precio); // Orden asc
        else if (orden === 'price-desc') copia.sort((a, b) => b.precio - a.precio); // Orden desc
        mostrarProductos(copia); // Re-render con la lista ordenada
      });
      console.log('[PRODUCTS] listener añadido al select de orden'); // Confirmación
    }

    // 9) Render inicial: mostramos todos los productos al cargar la página
    mostrarProductos(productos); // Llamada inicial para poblar la UI
    console.log('[PRODUCTS] render inicial completado'); // Log final del bloque productos

  } catch (err) { // Si algo falla en la lógica de productos, lo capturamos y mostramos
    console.error('[PRODUCTS] error en la lógica de productos:', err); // Error en consola
  }

}); // Fin del event listener DOMContentLoaded
