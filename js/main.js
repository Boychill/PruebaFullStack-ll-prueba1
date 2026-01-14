// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    actualizarContadorCarrito();
    verificarSesion();
});

const datosIniciales = [
    { id: 1, nombre: "Camiseta Básica", categoria: "ropa", precio: 15, stock: 20, img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRIOkNfOorO5EIgPqJrORB_tH86bdtp6gyTUtXEvbnUIyejfENAWMdo2prDWG80zFtdrPE2QfB7Ufluax5HpRdKc2xIvvxnfztEtWUSdb4pws4lmostBPrGbg&usqp=CAc" },
    { id: 2, nombre: "Auriculares BT", categoria: "tecnologia", precio: 50, stock: 10, img: "data:image/webp;base64,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" },
    { id: 3, nombre: "Reloj Inteligente", categoria: "accesorios", precio: 100, stock: 5, img: "data:image/webp;base64,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" }
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