// js/auth.js

function toggleAuth() {
    document.getElementById('login-section').classList.toggle('hidden');
    document.getElementById('register-section').classList.toggle('hidden');
    document.querySelector('#login-section form').reset();
    document.querySelector('#register-section form').reset();
}

function manejarRegistro(e) {
    e.preventDefault();
    const nombreInput = document.getElementById('reg-nombre');
    const emailInput = document.getElementById('reg-email');
    const passInput = document.getElementById('reg-pass');

    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trim();
    const pass = passInput.value.trim();
    
    // Forzamos rol cliente
    const role = 'client';

    // Validaciones
    if(!nombre) { marcarErrorInput('reg-nombre'); return mostrarNotificacion("Falta el nombre", "error"); }
    if(!email) { marcarErrorInput('reg-email'); return mostrarNotificacion("Falta el correo", "error"); }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) { marcarErrorInput('reg-email'); return mostrarNotificacion("Correo inválido", "error"); }
    if(!pass) { marcarErrorInput('reg-pass'); return mostrarNotificacion("Falta contraseña", "error"); }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    if (usuarios.find(u => u.email === email)) {
        marcarErrorInput('reg-email');
        return mostrarNotificacion("El correo ya está registrado", "error");
    }

    usuarios.push({ nombre, email, pass, role });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    mostrarNotificacion("¡Cuenta creada! Inicia sesión.", "exito");
    toggleAuth();
}

function manejarLogin(e) {
    e.preventDefault();
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-pass');
    
    const email = emailInput.value.trim();
    const pass = passInput.value.trim();

    if(!email) { marcarErrorInput('login-email'); return mostrarNotificacion("Ingresa tu correo", "error"); }
    if(!pass) { marcarErrorInput('login-pass'); return mostrarNotificacion("Ingresa tu contraseña", "error"); }

    // Admin Hardcodeado
    if(email === 'admin@tienda.com' && pass === 'admin123') {
        const admin = { nombre: 'Super Admin', email, role: 'admin' };
        localStorage.setItem('usuarioSesion', JSON.stringify(admin));
        mostrarNotificacion("Bienvenido Admin", "exito");
        setTimeout(() => window.location.href = '../index.html', 1000);
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const user = usuarios.find(u => u.email === email && u.pass === pass);

    if (user) {
        localStorage.setItem('usuarioSesion', JSON.stringify(user));
        mostrarNotificacion(`Bienvenido, ${user.nombre}`, "exito");
        setTimeout(() => window.location.href = '../index.html', 1000);
    } else {
        marcarErrorInput('login-pass');
        mostrarNotificacion("Credenciales incorrectas", "error");
    }
}