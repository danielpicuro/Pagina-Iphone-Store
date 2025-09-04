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
}); // Fin del event listener DOMContentLoaded