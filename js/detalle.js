  // =============================
  // detalle.js
  // =============================

  // 1. Simulación de productos (puedes venir de un JSON o API)
  const productos = [
    {
      id: 1,
      nombre: "Apple 13 pro max",
      precio: 1400.00,
      precioold: 1500.00,
      descripcion: "Iphone ligeras y cómodas para correr.",
      colores: ["Rojo", "Negro", "Blanco"],
      capacidad: ["128GB", "256GB"],  
      imagen: "https://via.placeholder.com/400x300"
    },
    {
      id: 2,
      nombre: "Mochila urbana",
      precio: 1500.00,
      precioold: 1500.00,
      descripcion: "Mochila resistente al agua con múltiples compartimentos.",
      colores: ["Azul", "Gris", "Verde"],
      capacidad: ["128GB", "256GB"],
      imagen: "https://via.placeholder.com/400x300"
    }
  ];

  // 2. Obtener el parámetro `id` de la URL
  // Ejemplo: producto.html?id=2
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id")); // Lo convierte a número

  // 3. Buscar el producto correspondiente en el array
  const producto = productos.find(p => p.id === productId);


  // 3️⃣ Renderizar el detalle en la página
  const contenedor = document.getElementById("detalle-producto");

  // 4. Referencias al HTML donde mostraremos datos
  const img = document.querySelector("#producto-img");
  const nombre = document.querySelector("#producto-nombre");
  const precio = document.querySelector("#producto-precio");
  const precioold = document.querySelector("#producto-precioold");
  const descripcion = document.querySelector("#producto-descripcion");
  const coloresContainer = document.querySelector("#producto-colores");

  // 5. Renderizar la información si el producto existe
  if (producto) {


    contenedor.innerHTML = `
        <!-- Columna izquierda: Imagen -->
      <div class="prod_select__image">
        <img src="https://via.placeholder.com/500x500" alt="iPhone 13 Blue 128GB">
      </div>
      <div class="prod_select__info">
        
        <!-- Etiqueta de oferta -->
        <span class="badge">DISPONIBLE</span>
        
        <!-- Marca -->
        <p class="brand">Apple</p>
        
        <!-- Nombre del prod_selecto -->
        <h1 class="title">${producto.nombre}</h1>
        
        <!-- Precio -->
        <div class="price">
          <span class="price__current">S/. ${producto.precio}</span>
          <span class="price__old">S/. ${producto.precioold}</span>
          <span class="price__discount">${producto.dscto}</span>
        </div>
        
        <!-- Rating -->
        <p class="rating">⭐ 4.8 (363)</p>
        
        <!-- Botón principal -->
        <button class="btn btn--primary">Compra ahora</button>
      <!-- QUIERO QUE ESTO SEA DINAMICO -->
      <!-- Selector de color -->
      <div class="section">
        <h3>Select Color</h3>
        <div class="colors" id="producto-colores">
        </div>
      </div>
      
      <!-- Selector de almacenamiento -->
      <div class="section">
        <h3>Select Storage</h3>
        <div class="storage" id="producto-storage">
        </div>
      </div>

        
      </div>
    `;

 // Rellenar colores dinámicamente
  const coloresContainer = document.querySelector("#producto-colores");
// Mapear colores en texto a clases de color existentes
const colorClassMap = {
  "Rojo": "red",
  "Negro": "black",
  "Blanco": "white",
  "Azul": "blue",
  "Verde": "green",
  "Rosado": "pink"
};

producto.colores.forEach(color => {
  const btn = document.createElement("button");
  const colorKey = colorClassMap[color] || ""; // fallback vacío si no está mapeado
  btn.classList.add("color");
  if (colorKey) btn.classList.add(`color--${colorKey}`);

  btn.setAttribute("title", color); // Muestra el nombre al pasar el mouse

  // Evento para seleccionar color
  btn.addEventListener("click", () => {
    document.querySelectorAll(".color").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });

  coloresContainer.appendChild(btn);
});


  const storageSection = document.querySelector("#seccion-capacidad");
  const storageContainer = document.querySelector("#producto-storage");
if (producto.capacidad && producto.capacidad.length > 0) {
  producto.capacidad.forEach(cap => {
    const btn = document.createElement("button");
    btn.textContent = cap;
    btn.classList.add("storage__option");

    btn.addEventListener("click", () => {
      document.querySelectorAll(".storage__option").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });

    storageContainer.appendChild(btn);
  });
} else {
  storageSection.style.display = "none";
}

  } else {
    // Si no encuentra producto, mostramos mensaje de error
    nombre.textContent = "Producto no encontrado";
  }
