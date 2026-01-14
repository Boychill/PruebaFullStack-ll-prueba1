// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    actualizarContadorCarrito();
    verificarSesion();
});

const datosIniciales = [
    { id: 1, nombre: "Camiseta Básica", categoria: "ropa", precio: 15, stock: 20, img: "https://via.placeholder.com/200?text=Camiseta" },
    { id: 2, nombre: "Auriculares BT", categoria: "tecnologia", precio: 50, stock: 10, img: "data:image/webp;base64,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" },
    { id: 3, nombre: "Reloj Inteligente", categoria: "accesorios", precio: 100, stock: 5, img: "https://via.placeholder.com/200?text=Reloj" }
];

function cargarProductos(filtro = 'todos') {
    let productos = JSON.parse(localStorage.getItem('productos'));
    
    if (!productos || productos.length === 0) {
        localStorage.setItem('productos', JSON.stringify(datosIniciales));
        productos = datosIniciales;
    }

    const contenedor = document.getElementById('contenedor-productos');
    if(!contenedor) return;
    contenedor.innerHTML = '';

    const busqueda = document.getElementById('input-busqueda') ? document.getElementById('input-busqueda').value.toLowerCase() : '';
    let hayProductos = false;

    productos.forEach((p, index) => {
        if ((filtro === 'todos' || p.categoria === filtro) && p.nombre.toLowerCase().includes(busqueda)) {
            hayProductos = true;
            contenedor.innerHTML += `
                <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col">
                    <img src="${p.img}" class="h-48 w-full object-cover" onerror="this.src='https://via.placeholder.com/200'">
                    <div class="p-4 flex flex-col flex-1">
                        <h3 class="font-bold text-lg">${p.nombre}</h3>
                        <p class="text-gray-500 capitalize text-sm mb-2">${p.categoria}</p>
                        <div class="mt-auto flex justify-between items-center">
                            <span class="text-blue-600 font-bold text-xl">$${p.precio}</span>
                            <a href="producto.html?id=${p.id}" class="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">Ver</a>
                        </div>
                        <button onclick="agregarAlCarrito(${index})" class="mt-3 w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700">Añadir</button>
                    </div>
                </div>`;
        }
    });

    if (!hayProductos) contenedor.innerHTML = `<p class="col-span-full text-center text-gray-500 py-10">No se encontraron productos.</p>`;
}

function filtrar(cat) { cargarProductos(cat); }
document.getElementById('input-busqueda')?.addEventListener('input', () => cargarProductos());

function agregarAlCarrito(index) {
    const productos = JSON.parse(localStorage.getItem('productos'));
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(productos[index]);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    
    // Usamos la notificación bonita
    mostrarNotificacion("Producto añadido al carrito", "exito");
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const counter = document.getElementById('cart-count');
    if(counter) counter.innerText = carrito.length;
}

function verificarSesion() {
    const user = JSON.parse(localStorage.getItem('usuarioSesion'));
    const authButtons = document.getElementById('auth-buttons');
    const alertaAdmin = document.getElementById('alerta-admin');

    if (user && authButtons) {
        if(user.role === 'admin' && alertaAdmin) alertaAdmin.classList.remove('hidden');
        authButtons.innerHTML = `
            <a href="${user.role === 'admin' ? 'gestion_inventario.html' : 'perfil.html'}" class="font-bold text-blue-700 mr-2">Hola, ${user.nombre}</a>
            <button onclick="cerrarSesion()" class="text-sm text-red-500 hover:underline">Salir</button>
        `;
    }
}

function cerrarSesion() {
    localStorage.removeItem('usuarioSesion');
    window.location.href = 'index.html';
}