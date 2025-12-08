// Variable para almacenar los productos cargados desde JSON
let productos = [];
// Función para cargar productos desde JSON
async function cargarProductos() {
    try {
        const response = await fetch('data/perfumes.json');
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        const data = await response.json();
        productos = data.perfumes;
        return productos;
    } catch (error) {
        console.error('Error cargando productos:', error);
        // Fallback con algunos productos básicos si falla la carga
        productos = [
            {
                id: 1,
                nombre: "Bleu de Chanel",
                marca: "Chanel",
                categoria: "hombre",
                precio: 2850.00,
                descripcion: "Un aromático-amaderado de carácter decidido",
                imagen: "https://via.placeholder.com/300x300?text=Perfume",
                stock: 25,
                ml: "100ml"
            }
        ];
        return productos;
    }
}

// Función para obtener todos los productos
function obtenerProductos() {
    return productos;
}

// Función para filtrar productos por categoría
function filtrarPorCategoria(categoria) {
    if (categoria === 'todos') {
        return productos;
    }
    return productos.filter(producto => producto.categoria === categoria);
}

// Función para filtrar por marca
function filtrarPorMarca(marca) {
    if (!marca || marca === 'todas') {
        return productos;
    }
    return productos.filter(producto => 
        producto.marca.toLowerCase() === marca.toLowerCase()
    );
}

// Función para filtrar por categoría y marca
function filtrarPorCategoriaYMarca(categoria, marca) {
    let productosFiltrados = productos;
    
    if (categoria && categoria !== 'todos') {
        productosFiltrados = productosFiltrados.filter(producto => 
            producto.categoria === categoria
        );
    }
    
    if (marca && marca !== 'todas') {
        productosFiltrados = productosFiltrados.filter(producto => 
            producto.marca.toLowerCase() === marca.toLowerCase()
        );
    }
    
    return productosFiltrados;
}

// Función para buscar productos
function buscarProductos(termino) {
    const terminoLower = termino.toLowerCase();
    return productos.filter(producto => 
        producto.nombre.toLowerCase().includes(terminoLower) ||
        producto.marca.toLowerCase().includes(terminoLower) ||
        producto.descripcion.toLowerCase().includes(terminoLower)
    );
}

// Función para obtener producto por ID
function obtenerProductoPorId(id) {
    return productos.find(producto => producto.id === parseInt(id));
}

// Función para renderizar productos
function renderizarProductos(productosArray) {
    const contenedorProductos = document.getElementById('productos-container');
    const loadingElement = document.getElementById('loading-productos');
    
    if (!contenedorProductos) return;

    // Ocultar mensaje de carga
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }

    contenedorProductos.innerHTML = '';

    if (productosArray.length === 0) {
        contenedorProductos.innerHTML = '<div class="col-12 text-center"><h4>No se encontraron productos</h4></div>';
        return;
    }

    productosArray.forEach(producto => {
        const productoHTML = `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="card h-100 producto-card">
                    <img src="${producto.imagen}" class="card-img-top producto-imagen" alt="${producto.nombre}" loading="lazy">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="text-muted mb-1">${producto.marca}</p>
                        <p class="card-text small">${producto.descripcion}</p>
                        <div class="mt-auto">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="h5 mb-0 text-primary">$${producto.precio.toFixed(2)} MXN</span>
                                <small class="text-muted">${producto.ml}</small>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-success">Stock: ${producto.stock}</small>
                                <button class="btn btn-primary btn-sm" onclick="agregarAlCarrito(${producto.id})">
                                    <i class="fas fa-cart-plus"></i> Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        contenedorProductos.innerHTML += productoHTML;
    });
}

// Carrito de compras
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para agregar al carrito
function agregarAlCarrito(idProducto) {
    const producto = obtenerProductoPorId(idProducto);
    if (!producto) return;

    const itemExistente = carrito.find(item => item.id === idProducto);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    
    // Mostrar notificación
    mostrarNotificacion(`${producto.nombre} agregado al carrito`);
}

// Función para actualizar contador del carrito
function actualizarContadorCarrito() {
    const contador = document.getElementById('carrito-contador');
    if (contador) {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contador.textContent = totalItems;
    }
}

// Función para mostrar notificación
function mostrarNotificacion(mensaje) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'alert alert-success position-fixed';
    notificacion.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notificacion.innerHTML = `
        <i class="fas fa-check-circle"></i> ${mensaje}
        <button type="button" class="btn-close float-end" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(notificacion);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        if (notificacion.parentElement) {
            notificacion.remove();
        }
    }, 3000);
}

// Event listeners cuando carga la página
document.addEventListener('DOMContentLoaded', async function() {
    // Cargar productos desde JSON
    await cargarProductos();
    
    // Renderizar productos iniciales
    renderizarProductos(obtenerProductos());
    
    // Actualizar contador del carrito
    actualizarContadorCarrito();
    
    // Filtros de categoría
    const filtroTodos = document.getElementById('filtro-todos');
    const filtroMujer = document.getElementById('filtro-mujer');
    const filtroHombre = document.getElementById('filtro-hombre');
    const filtroUnisex = document.getElementById('filtro-unisex');
    const filtroNinos = document.getElementById('filtro-ninos');
    
    if (filtroTodos) {
        filtroTodos.addEventListener('click', function() {
            setActiveFilter(this);
            renderizarProductos(filtrarPorCategoria('todos'));
        });
    }
    if (filtroMujer) {
        filtroMujer.addEventListener('click', function() {
            setActiveFilter(this);
            renderizarProductos(filtrarPorCategoria('mujer'));
        });
    }
    if (filtroHombre) {
        filtroHombre.addEventListener('click', function() {
            setActiveFilter(this);
            renderizarProductos(filtrarPorCategoria('hombre'));
        });
    }
    if (filtroUnisex) {
        filtroUnisex.addEventListener('click', function() {
            setActiveFilter(this);
            renderizarProductos(filtrarPorCategoria('unisex'));
        });
    }
    if (filtroNinos) {
        filtroNinos.addEventListener('click', function() {
            setActiveFilter(this);
            renderizarProductos(filtrarPorCategoria('niños'));
        });
    }
    
    // Barra de búsqueda
    const barraBusqueda = document.getElementById('barra-busqueda');
    if (barraBusqueda) {
        barraBusqueda.addEventListener('input', function() {
            const termino = this.value.trim();
            if (termino === '') {
                renderizarProductos(obtenerProductos());
            } else {
                renderizarProductos(buscarProductos(termino));
            }
        });
    }
});

// Función para activar filtro seleccionado
function setActiveFilter(selectedButton) {
    // Remover clase active de todos los botones
    document.querySelectorAll('.btn-outline-primary').forEach(btn => {
        btn.classList.remove('active');
    });
    // Agregar clase active al botón seleccionado
    selectedButton.classList.add('active');
}