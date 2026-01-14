// js/admin.js

// --- 1. LÓGICA DE NAVEGACIÓN (Tabs) ---
function toggleAdminMenu() {
    document.getElementById('admin-dropdown').classList.toggle('hidden');
}

function cambiarVista(vista) {
    document.getElementById('admin-dropdown').classList.add('hidden');
    if (vista === 'inventario') {
        document.getElementById('vista-inventario').classList.remove('hidden');
        document.getElementById('vista-pedidos').classList.add('hidden');
    } else {
        document.getElementById('vista-inventario').classList.add('hidden');
        document.getElementById('vista-pedidos').classList.remove('hidden');
        renderizarPedidos();
    }
}

// --- 2. GESTIÓN DE INVENTARIO (CRUD) ---
let productos = JSON.parse(localStorage.getItem('productos')) || [];

// Renderizar tabla de productos
function renderizarTabla() {
    const tbody = document.getElementById('tabla-admin-body');
    if(!tbody) return;
    
    tbody.innerHTML = ""; // Limpiar tabla
    
    if(productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-gray-500">No hay productos en inventario.</td></tr>';
        return;
    }

    productos.forEach(p => {
        tbody.innerHTML += `
            <tr class="border-b hover:bg-gray-50 transition">
                <td class="p-4">
                    <img src="${p.img}" class="w-12 h-12 object-cover rounded border" onerror="this.src='https://via.placeholder.com/50'">
                </td>
                <td class="p-4">
                    <p class="font-bold text-gray-800">${p.nombre}</p>
                    <span class="text-xs text-gray-500 uppercase">${p.categoria}</span>
                </td>
                <td class="p-4 font-mono">$${p.precio}</td>
                <td class="p-4">
                    <span class="${p.stock < 5 ? 'text-red-600 font-bold' : 'text-gray-800'}">${p.stock}</span>
                </td>
                <td class="p-4">
                    <button onclick="prepararEdicion(${p.id})" class="text-blue-600 hover:text-blue-800 mr-3 font-medium">✏️ Editar</button>
                    <button onclick="eliminarProducto(${p.id})" class="text-red-500 hover:text-red-700 font-medium">🗑️ Borrar</button>
                </td>
            </tr>`;
    });
}

// Guardar o Actualizar Producto
function guardarProducto(e) {
    e.preventDefault();

    // Referencias al DOM
    const idInput = document.getElementById('prod-id');
    const nombreInput = document.getElementById('prod-nombre');
    const precioInput = document.getElementById('prod-precio');
    const stockInput = document.getElementById('prod-stock');
    const catInput = document.getElementById('prod-categoria');
    const urlInput = document.getElementById('prod-url');
    const btnGuardar = document.querySelector('#form-producto button[type="submit"]');

    // Valores
    const nombre = nombreInput.value.trim();
    const precio = parseFloat(precioInput.value);
    const stock = parseInt(stockInput.value);
    const id = idInput.value;

    // --- VALIDACIONES CON FEEDBACK VISUAL ---
    if(!nombre) { 
        marcarErrorInput('prod-nombre'); 
        return mostrarNotificacion("El nombre es obligatorio", "error"); 
    }
    if(isNaN(precio) || precio <= 0) { 
        marcarErrorInput('prod-precio'); 
        return mostrarNotificacion("Ingresa un precio válido", "error"); 
    }
    if(isNaN(stock) || stock < 0) { 
        marcarErrorInput('prod-stock'); 
        return mostrarNotificacion("El stock no puede ser negativo", "error"); 
    }

    // Objeto Producto
    const nuevoProducto = {
        id: id ? parseInt(id) : Date.now(), // Si hay ID es edición, si no, timestamp
        nombre: nombre,
        categoria: catInput.value,
        precio: precio,
        stock: stock,
        img: urlInput.value.trim() || "https://via.placeholder.com/200?text=Sin+Imagen"
    };

    if (id) {
        // MODO EDICIÓN
        const index = productos.findIndex(p => p.id == id);
        if(index !== -1) {
            productos[index] = nuevoProducto;
            mostrarNotificacion(`Producto "${nombre}" actualizado correctamente`, "exito");
        }
    } else {
        // MODO CREACIÓN
        productos.push(nuevoProducto);
        mostrarNotificacion(`Producto "${nombre}" agregado al inventario`, "exito");
    }

    // Guardar en LS y actualizar vista
    localStorage.setItem('productos', JSON.stringify(productos));
    renderizarTabla();
    
    // Limpiar formulario y resetear estado del botón
    document.getElementById('form-producto').reset();
    idInput.value = ''; // Limpiar ID oculto
    btnGuardar.innerText = "Guardar Producto"; // Volver texto original
    btnGuardar.classList.remove('bg-yellow-600', 'hover:bg-yellow-700');
    btnGuardar.classList.add('bg-green-600', 'hover:bg-green-700');
}

// Preparar formulario para editar
function prepararEdicion(id) {
    const p = productos.find(p => p.id === id);
    if(!p) return;

    // Llenar inputs
    document.getElementById('prod-id').value = p.id;
    document.getElementById('prod-nombre').value = p.nombre;
    document.getElementById('prod-categoria').value = p.categoria;
    document.getElementById('prod-precio').value = p.precio;
    document.getElementById('prod-stock').value = p.stock;
    document.getElementById('prod-url').value = p.img;

    // Cambiar apariencia del botón para indicar edición
    const btn = document.querySelector('#form-producto button[type="submit"]');
    btn.innerText = "Actualizar Cambios";
    btn.classList.remove('bg-green-600', 'hover:bg-green-700');
    btn.classList.add('bg-yellow-600', 'hover:bg-yellow-700');

    // Scroll suave hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
    mostrarNotificacion("Modo edición activado", "exito");
}

// Eliminar producto
function eliminarProducto(id) {
    if(confirm("¿Estás seguro de que deseas eliminar este producto permanentemente?")) {
        productos = productos.filter(p => p.id !== id);
        localStorage.setItem('productos', JSON.stringify(productos));
        renderizarTabla();
        mostrarNotificacion("Producto eliminado correctamente", "exito");
    }
}


// --- 3. GESTIÓN DE PEDIDOS ---
function renderizarPedidos() {
    const lista = document.getElementById('lista-pedidos-admin');
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    lista.innerHTML = "";
    
    if(pedidos.length === 0) {
        lista.innerHTML = "<tr><td colspan='6' class='p-8 text-center text-gray-500'>No hay pedidos registrados aún.</td></tr>";
        return;
    }

    pedidos.slice().reverse().forEach(p => {
        const color = p.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-green-100 text-green-800 border-green-200';
        lista.innerHTML += `
            <tr class="border-b hover:bg-gray-50 transition">
                <td class="p-4 text-xs font-mono text-gray-500">#${p.id}</td>
                <td class="p-4 font-medium">${p.usuarioEmail}</td>
                <td class="p-4 text-sm text-gray-600">${p.fecha}</td>
                <td class="p-4 font-bold text-green-600">$${p.total}</td>
                <td class="p-4">
                    <button onclick="cambiarEstadoPedido(${p.id})" class="px-3 py-1 rounded-full text-xs font-bold border ${color} hover:opacity-80 transition shadow-sm">
                        ${p.estado} ↻
                    </button>
                </td>
                <td class="p-4">
                    <button onclick="verDetallePedido(${p.id})" class="text-blue-600 hover:text-blue-800 text-sm font-semibold underline">
                        Ver Items
                    </button>
                </td>
            </tr>`;
    });
}

function cambiarEstadoPedido(id) {
    let pedidos = JSON.parse(localStorage.getItem('pedidos'));
    const idx = pedidos.findIndex(p => p.id === id);
    
    if(idx !== -1) {
        const nuevoEstado = pedidos[idx].estado === 'Pendiente' ? 'Enviado' : 'Pendiente';
        pedidos[idx].estado = nuevoEstado;
        
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
        renderizarPedidos();
        
        // Notificación de cambio de estado
        if(nuevoEstado === 'Enviado') {
            mostrarNotificacion(`Pedido #${id} marcado como ENVIADO`, "exito");
        } else {
            mostrarNotificacion(`Pedido #${id} revertido a PENDIENTE`, "error"); // Uso 'error' solo para diferenciar el color (rojo/amarillo)
        }
    }
}

function verDetallePedido(id) {
    const p = JSON.parse(localStorage.getItem('pedidos')).find(p => p.id === id);
    if(!p) return;
    
    let msg = `🛒 Pedido de ${p.usuarioEmail}\n------------------------\n`;
    p.items.forEach(i => msg += `• ${i.nombre} - $${i.precio}\n`);
    msg += `\n💰 TOTAL: $${p.total}`;
    
    alert(msg); // Aquí mantenemos alert porque es informativo rápido, o podrías hacer un modal si prefieres.
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    renderizarTabla();
    // No renderizamos pedidos al inicio para ahorrar recursos, solo cuando cambia la vista
});