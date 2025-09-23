  // =============================
  // detalle.js
  // =============================

  // 1. Simulación de productos (puedes venir de un JSON o API)


    let productos = [];
    let colorchoose = "";
    let capacidadchoose = "";
    let precioCurrent = "";
    let precioCurrentOld = "";
    // URL pública donde se aloja el archivo CSV (puedes cambiarla si es necesario)
    const urlCSV = "./catalogo.csv";
    // 1) Función para cargar productos desde CSV (async)
    // -----------------------------------------------
    async function cargarProductos() {
      const response = await fetch(urlCSV);
      const csvText = await response.text();

      // Usamos PapaParse para parsear el CSV
      const { data } = Papa.parse(csvText, {
        header: true,        // Usa la primera fila como nombres de columna
        skipEmptyLines: true, // Ignora líneas vacías
    dynamicTyping: true,
    transformHeader: h => h.trim(),
    quoteChar: '"',
    delimiter: ';'
      });

      // Convertimos cada fila del CSV a un objeto de producto
      return data.map(row => ({
        id: parseInt(row.id),
        nombre: row.nombre,
        precio: row.precio,
        precioold: row.precioold,
        descripcion: row.descripcion,
        colores: row.colores,
        capacidad: row.capacidad,
        marca: row.marca?.trim(),  // Eliminamos espacios en blanco
        img: row.img,
        stock: parseFloat(row.stock)
      }));
    }


    function aplicardetalles() {
        // 2. Obtener el parámetro `id` de la URL
  // Ejemplo: producto.html?id=2
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id")); // Lo convierte a número

  // 3. Buscar el producto correspondiente en el array
  const producto = productos.find(p => p.id === productId);
  console.log("productos",productos)
  console.log("producto",producto)

  // 3️⃣ Renderizar el detalle en la página
  const contenedor = document.getElementById("detalle-producto");

  // 4. Referencias al HTML donde mostraremos datos
  const img = document.querySelector("#producto-img");
  const nombre = document.querySelector("#producto-nombre");
  const precio = document.querySelector("#producto-precio");
  const precioold = document.querySelector("#producto-precioold");
  const descripcion = document.querySelector("#producto-descripcion");
  const coloresContainer = document.querySelector("#producto-colores");
  let dispStock =  'Disponible';
  if (producto.stock <= 0){
    dispStock = 'Agotado'
  }
  console.log(dispStock);
  let claseEstado = '';

if (dispStock.toLowerCase() === 'disponible') {
  claseEstado = 'badge--disponible';
} else if (dispStock.toLowerCase() === 'agotado') {
  claseEstado = 'badge--agotado';
}
  // 5. Renderizar la información si el producto existe
  if (producto) {


    contenedor.innerHTML = `
        <!-- Columna izquierda: Imagen -->
      <div class="prod_select__image">
        <img src="./img/${producto.img}" alt="Imagen producto">
      </div>
      <div class="prod_select__info">
        
        <!-- Etiqueta de oferta -->
         <div class="prod_select__headers">
                <span class="badge ${claseEstado}">${dispStock}</span>
        
        <!-- Marca -->
        <p class="brand">Apple</p>
      </div>

        
        <!-- Nombre del prod_selecto -->
        <h1 class="title">${producto.nombre}</h1>
        
        <!-- Precio -->
        <div class="price">
          <span class="price__current">S/. ${precioCurrent}</span>
          <span class="price__old">S/. ${producto.precioold}</span>
          <span class="price__discount">${producto.stock} uds disp</span>
        </div>
        
        <!-- Rating -- <p class="rating">⭐ 4.8 (363)</p> >
        
        
        <!-- Botón principal -->
        <button id="btn-comprar" class="btn btn--primary">Compra ahora</button>

      <!-- QUIERO QUE ESTO SEA DINAMICO -->
      <!-- Selector de color -->
      <div class="section">
        <h3>Select Color</h3>
        <div class="colors" id="producto-colores">
        </div>
      </div>
      
      <!-- Selector de almacenamiento -->
      <div class="section" id="seccion-capacidad">
        <h3>Select Storage</h3>
        <div class="storage" id="producto-storage">
        </div>
      </div>

        
      </div>
    `;

const btnComprar = document.getElementById("btn-comprar");

btnComprar.addEventListener("click", () => {
  contactarProducto(producto.nombre, producto.marca, precioCurrent, colorchoose, capacidadchoose);
});


 // Rellenar colores dinámicamente
  const coloresContainer = document.querySelector("#producto-colores");
// Mapear colores en texto a clases de color existentes
const colorClassMap = {
  "Rojo": "red",
  "Negro": "black",
  "Blanco": "white",
  "Azul": "blue",
  "Verde": "green",
  "Rosado": "pink",
  "Celeste": "skyblue",
  "Dorado": "gold",
  "Morado": "purple",
  "Azul Sierra": "sierra-blue",         // Equivalente a "Sierra Blue"
  "Titanio Natural": "natural-titanium",
  "Desierto": "desert"
};

console.log(producto.colores);
const colores = producto.colores.split(",").map(c => c.trim());

colores.forEach(color => {
  const btn = document.createElement("button");
  const colorKey = colorClassMap[color] || ""; // fallback vacío si no está mapeado
  btn.classList.add("color");
  if (colorKey) btn.classList.add(`color--${colorKey}`);

  btn.setAttribute("title", color); // Muestra el nombre al pasar el mouse

  // Evento para seleccionar color
  btn.addEventListener("click", () => {
    document.querySelectorAll(".color").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    colorchoose=color;
    console.log("color activado",colorchoose);
  });

  coloresContainer.appendChild(btn);
});


  const storageSection = document.querySelector("#seccion-capacidad");
  const storageContainer = document.querySelector("#producto-storage");
if (producto.capacidad && producto.capacidad.length > 0) {
  const capacidad = producto.capacidad.split(",").map(c => c.trim());
  const precios = String(producto.precio).split(",").map(p => p.trim());
  const preciosOld = String(producto.precioold).split(",").map(p => p.trim());
      precioCurrent = precios[0] || "";
      precioCurrentOld = preciosOld[0] || "";
            document.querySelector(".price__current").textContent = `S/. ${precioCurrent}`;
      document.querySelector(".price__old").textContent = `S/. ${precioCurrentOld}`;
console.log('PRRUEBA STRING PRECIO', precios);
  capacidad.forEach((cap,index) => {
    const btn = document.createElement("button");
    btn.textContent = cap;
    btn.classList.add("storage__option");
    


    btn.addEventListener("click", () => {
      document.querySelectorAll(".storage__option").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      capacidadchoose=cap;
      console.log('Alacenamiento escogido', capacidadchoose);
      
      // 🔥 Actualizar precios dinámicamente
      precioCurrent = precios[index] || "";
      precioCurrentOld = preciosOld[index] || "";
      console.log('Precio actual',precioCurrent);
      document.querySelector(".price__current").textContent = `S/. ${precioCurrent}`;
      document.querySelector(".price__old").textContent = `S/. ${precioCurrentOld}`;

    });

    storageContainer.appendChild(btn);
  });
} else {
  storageSection.style.display = "none";
  console.log("entroaqui2")
}

  } else {
    // Si no encuentra producto, mostramos mensaje de error
    nombre.textContent = "Producto no encontrado";
  }
    



    }

  function contactarProducto(nombre, marca, precioCurrent, colorchoose ,capacidadchoose ) {
  const numero = "51978581770";
  const mensaje = `Hola, estoy interesado en el producto:
📱 *${nombre}*
🏷️ Marca: *${marca}*
💵 Precio: S/.${precioCurrent}
🎨 Color: *${colorchoose || 'Sin seleccionar'}*
 Almacenamietno: *${capacidadchoose || 'Sin seleccionar'}*`;


  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
  }
      async function startapp() {
      productos =await cargarProductos();
      aplicardetalles();
      console.log("productos startapp",productos);
      
    }
    startapp();

