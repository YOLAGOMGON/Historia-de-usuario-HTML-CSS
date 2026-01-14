/**
 * ============================================
 * ARCHIVO: ux-ui.js
 * ============================================
 * Este archivo maneja toda la lógica de autenticación (login, registro, logout)
 * y la navegación entre páginas según el estado de sesión del usuario.
 */

/**
 * ============================================
 * ELEMENTOS DEL DOM - SECCIONES Y BOTONES
 * ============================================
 * Obtenemos referencias a los elementos HTML de la interfaz de login/registro
 */

// Sección del formulario de inicio de sesión (login)
const loginSection = document.getElementById("Section-Login");

// Sección del formulario de registro (signup)
const signSection = document.getElementById("Section-Singup");

// Botón para cambiar a la vista de login
const btnLogin = document.getElementById("To-login");

// Botón para cambiar a la vista de registro
const btnSign = document.getElementById("To-sing");

// Botón para cerrar sesión (logout)
const logoutBtn = document.getElementById("Log-out");

// Formulario de inicio de sesión
const formLogin = document.getElementById("Login-form");

// Formulario de registro
const formSing = document.getElementById("Sign-form");

// Elemento donde se muestran mensajes en el formulario de registro
const singMessage = document.getElementById("Sing-message");

// Elemento donde se muestran mensajes en el formulario de login
const loginMessage = document.getElementById("Login-message");

/**
 * ============================================
 * VERIFICACIÓN DE RUTA Y SESIÓN
 * ============================================
 * Aquí verificamos en qué página está el usuario y si tiene una sesión activa
 */

// Verificamos si estamos en la página de login (index.html)
// pathname es la ruta de la URL actual
// includes() verifica si la cadena contiene "index.html"
const isAtLogin = window.location.pathname.includes("index.html") || 
                  window.location.pathname === ("/") || 
                  window.location.pathname === "";

// Obtenemos el usuario actual guardado en localStorage
// Si no hay sesión, será null
const currentUser = localStorage.getItem("current_user");

/**
 * ============================================
 * PROTECCIÓN DE RUTAS
 * ============================================
 * Si el usuario ya tiene sesión y está en la página de login,
 * lo redirigimos a la página de tareas.
 */
if (currentUser && isAtLogin) {
    // Cambiamos la URL para ir a la página de tareas
    window.location.href = "tasksort.html";
}

/**
 * Si el usuario NO tiene sesión y está intentando acceder a la página de tareas,
 * lo redirigimos a la página de login (protección de acceso no autorizado).
 */
if (!currentUser && !isAtLogin) {
    window.location.href = "index.html";
}

/**
 * ============================================
 * BASE DE DATOS DE USUARIOS
 * ============================================
 * En una aplicación real, los usuarios estarían en un servidor.
 * Aquí usamos localStorage como "base de datos" local del navegador.
 */

// Obtenemos los usuarios guardados, o si no hay, creamos un array con un usuario de ejemplo
// El operador || significa "si lo de la izquierda es null/undefined, usa lo de la derecha"
let dataBase = JSON.parse(localStorage.getItem("tasksort_users")) || [
    { email : "TaskSort@example.com", password : "12345678", user: "Juan Pablo"}
]

/**
 * ============================================
 * FUNCIÓN: saveData()
 * ============================================
 * Guarda el array de usuarios en localStorage.
 * Se llama cada vez que se registra un nuevo usuario.
 */
const saveData = () => {
    // Convertimos el array a texto JSON y lo guardamos
    localStorage.setItem("tasksort_users" , JSON.stringify(dataBase));
    console.log("synchronization complete");
};

/**
 * ============================================
 * TOGGLE ENTRE LOGIN Y REGISTRO
 * ============================================
 * Configuramos los botones para alternar entre las vistas de login y registro.
 */

// Verificamos que los botones existan antes de configurarlos
if (btnLogin && btnSign){

    // Función que alterna la visibilidad entre las dos secciones
    const toggleAuth = () => {
        if(loginSection && signSection){
            // classList.toggle() agrega la clase si no existe, o la quita si existe
            // "hidden-form" es una clase CSS que oculta el elemento (display: none)
            // Al hacer toggle en ambas, una se muestra y la otra se oculta
            loginSection.classList.toggle("hidden-form");
            signSection.classList.toggle("hidden-form");
        }
    };

    // Cuando se hace clic en "To-login", alternamos las vistas
    btnLogin.addEventListener("click", toggleAuth);
    
    // Cuando se hace clic en "To-sing", alternamos las vistas
    btnSign.addEventListener("click", toggleAuth);

}

/**
 * ============================================
 * MANEJO DEL FORMULARIO DE REGISTRO
 * ============================================
 * Configuramos qué pasa cuando el usuario envía el formulario de registro.
 */

if(formSing){

    // Escuchamos el evento "submit" del formulario (cuando el usuario presiona el botón)
    formSing.addEventListener("submit", (e) =>{
        // Prevenimos el comportamiento por defecto (recargar la página)
        e.preventDefault();

        // Creamos un objeto con los datos del nuevo usuario
        const newUser = {
            email: document.getElementById("Email2").value,      // Email del formulario
            password: document.getElementById("Password1").value, // Contraseña
            user: document.getElementById("User").value           // Nombre de usuario
        };

        // some() verifica si AL MENOS UN elemento del array cumple una condición
        // Aquí verificamos si ya existe un usuario con ese email
        const exist = dataBase.some(user => user.email === newUser.email);

        // Si el email ya está registrado
        if (exist){
            // Mostramos mensaje de error en rojo
            singMessage.style.color = "red";
            singMessage.textContent = "Email loged."

            // Limpiamos el mensaje después de 2 segundos
            setTimeout(() => {
                singMessage.textContent = "";  // Nota: hay un pequeño error aquí, debería ser singMessage
            }, 2000);
        }
        else{
            // Si el email NO existe, registramos al nuevo usuario
            // Agregamos el nuevo usuario al array
            dataBase.push(newUser);
            
            // Guardamos en localStorage
            saveData();
            
            // Mostramos mensaje de éxito en verde
            singMessage.style.color = "green";
            singMessage.textContent = "Account created correctly, you can login";
            
            // Limpiamos el formulario
            formSing.reset();
        }

    });
}

/**
 * ============================================
 * MANEJO DEL FORMULARIO DE LOGIN
 * ============================================
 * Configuramos qué pasa cuando el usuario envía el formulario de inicio de sesión.
 */

if(formLogin){

    // Escuchamos el evento "submit" del formulario de login
    formLogin.addEventListener("submit", (e) =>{
        // Prevenimos el comportamiento por defecto
        e.preventDefault();

        // Obtenemos los valores ingresados por el usuario
        const emailInput = document.getElementById("Email1").value;
        const passwordField = document.getElementById("Password");
        const passwordInput = passwordField.value;

        // find() busca el PRIMER elemento del array que cumple una condición
        // Buscamos un usuario que tenga el mismo email Y la misma contraseña
        const found = dataBase.find(user => user.email === emailInput && user.password === passwordInput);

        // Si encontramos un usuario con esas credenciales
        if (found){
            // Guardamos el usuario actual en localStorage como "sesión activa"
            localStorage.setItem('current_user', JSON.stringify(found));
            
            // Mostramos mensaje de bienvenida en verde
            loginMessage.style.color = "green";
            loginMessage.textContent = `Already, welcome ${found.user}!`;
            
            // Después de 1.5 segundos, redirigimos a la página de tareas
            setTimeout(() =>{
                window.location.href = "tasksort.html";
            },1500);
            
            // Mostramos todos los usuarios en la consola (para debugging)
            console.log("Users:", dataBase);
        }
        else{
            // Si NO encontramos el usuario (email o contraseña incorrectos)
            loginMessage.style.color = "red";
            loginMessage.textContent = "Email or password wrong";

            // Limpiamos el campo de contraseña por seguridad
            passwordField.value = ""

            // Limpiamos el mensaje después de 2 segundos
            setTimeout(() => {
                loginMessage.textContent = "";
            }, 2000);
        }
    });

}

/**
 * ============================================
 * FUNCIONALIDAD DE LOGOUT (CERRAR SESIÓN)
 * ============================================
 * Configuramos el botón de cerrar sesión para que elimine la sesión actual
 * y redirija al usuario a la página de login.
 */

if (logoutBtn){

    // Escuchamos el clic en el botón de logout
    logoutBtn.addEventListener("click", () => {

        // Mostramos un cuadro de confirmación al usuario
        // confirm() muestra un diálogo con "OK" y "Cancelar"
        // Retorna true si el usuario presiona OK, false si presiona Cancelar
        const confirm = window.confirm("Do you want log out?");

        // Si el usuario confirmó (presionó OK)
        if (confirm){
            // Eliminamos el usuario actual del localStorage
            // Esto "cierra la sesión" porque ya no habrá current_user
            localStorage.removeItem("current_user");
            
            // Redirigimos al usuario a la página de login
            window.location.href = "index.html";
        }
        // Si el usuario canceló, no hacemos nada (se queda en la página)
    })
};
