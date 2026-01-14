/**
 * ============================================
 * VARIABLES GLOBALES
 * ============================================
 * Estas variables almacenan el estado de la aplicación
 */

// Array que contiene todas las tareas creadas por el usuario
let taskList = [];

// Variable booleana que controla si las tareas están visibles u ocultas
let isVisible = false;

// Variable booleana que controla si el menú de filtros está visible u oculto
let isFilterVisible = false;

/**
 * ============================================
 * ELEMENTOS DEL DOM (Document Object Model)
 * ============================================
 * Aquí obtenemos referencias a los elementos HTML usando sus IDs
 * para poder manipularlos con JavaScript
 */

// Botón para mostrar/ocultar las tareas
const btnToogle = document.getElementById("toggleTasks");

// Botón para abrir el modal de agregar nueva tarea
const addBtn = document.getElementById("Add-Task");

// Botón para mostrar/ocultar el menú de filtros por prioridad
const btnFilter = document.getElementById("Priority-filter");

// Icono del ojo que cambia según si las tareas están visibles o no
const eyeIcon = document.getElementById("eyeIcon");

// Texto que indica "Show tasks" o "Hide tasks"
const textVisibility = document.getElementById("Text-visibility");

// Elemento donde se muestran mensajes de error del formulario
const incorrectmsg = document.getElementById("Incorrect");

// Contenedor principal donde se muestran todas las tarjetas de tareas
const container = document.getElementById("Taskcontainer");

// Menú desplegable con las opciones de filtrado (High, Medium, Low, All)
const menuFilter = document.getElementById("FilterMenu");

// Sección del modal (ventana emergente) para crear/editar tareas
const taskSection = document.getElementById("Modal-Wrapper");

/**
 * ============================================
 * FUNCIÓN: testForm()
 * ============================================
 * Esta función valida que el formulario de tareas tenga todos los campos completos
 * antes de permitir crear una nueva tarea.
 * 
 * @returns {boolean} - Retorna true si el formulario es válido, false si está vacío
 */
function testForm() {
    // Obtenemos los valores de los campos del formulario
    // .trim() elimina espacios en blanco al inicio y final del texto
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const priority = document.getElementById("priority").value;

    // Validamos que ningún campo esté vacío
    if (title === "" || description === "" || priority === "") {
        // Si hay campos vacíos, mostramos un mensaje de error
        if(incorrectmsg){
            // Cambiamos el color del mensaje a rojo para indicar error
            incorrectmsg.style.color = "red";
            incorrectmsg.textContent = "You can't the form empty"

            // setTimeout permite ejecutar código después de un tiempo determinado
            // Aquí limpiamos el mensaje después de 2 segundos (2000 milisegundos)
            setTimeout(() => {
                incorrectmsg.textContent = "";
            },2000)

            // Reseteamos el formulario para limpiar todos los campos
            document.getElementById("formTask").reset();
        }
        // Retornamos false porque el formulario no es válido
        return false;
    }

    // Si todos los campos están completos, retornamos true
    return true;
}



/**
 * ============================================
 * FUNCIÓN: loadTask()
 * ============================================
 * Esta función carga las tareas guardadas desde el almacenamiento local del navegador
 * (localStorage) cuando se carga la página.
 * 
 * localStorage es una característica del navegador que permite guardar datos
 * en el dispositivo del usuario de forma persistente (aunque se cierre el navegador).
 */
function loadTask(){
    // Obtenemos las tareas guardadas del localStorage con la clave "Current_Tasks"
    const saved = localStorage.getItem("Current_Tasks")
    
    // Si hay tareas guardadas (saved no es null ni undefined)
    if(saved){
        // JSON.parse() convierte el texto JSON guardado de vuelta a un array de objetos
        // y lo asignamos a nuestra variable taskList
        taskList = JSON.parse(saved)
        
        // Renderizamos (dibujamos) las tareas en la pantalla
        renderTasks();
    }
};

/**
 * ============================================
 * FUNCIÓN: saveTasks()
 * ============================================
 * Esta función guarda el array de tareas en el almacenamiento local del navegador.
 * Se llama cada vez que se crea, modifica o elimina una tarea.
 */
function saveTasks(){
    // JSON.stringify() convierte el array de tareas a formato texto (JSON)
    // para poder guardarlo en localStorage (que solo acepta texto)
    localStorage.setItem("Current_Tasks" , JSON.stringify(taskList));
    
    // Mostramos un mensaje en la consola del navegador para confirmar que se guardó
    console.log("synchronization complete");
}

/**
 * ============================================
 * FUNCIÓN: renderTasks()
 * ============================================
 * Esta función limpia el contenedor de tareas y vuelve a dibujar todas las tareas
 * desde el array taskList. Se usa cada vez que hay cambios en las tareas.
 */
function renderTasks(){
    // Limpiamos todo el contenido HTML del contenedor
    // innerHTML = "" significa "vaciar completamente"
    container.innerHTML = "";
    
    // forEach es un método de arrays que ejecuta una función para cada elemento
    // task = cada tarea individual del array
    // index = la posición de la tarea en el array (0, 1, 2, 3...)
    taskList.forEach((task, index) => {
        // Llamamos a taskUI() para crear y mostrar cada tarjeta de tarea
        taskUI(task, index)
    });
}

/**
 * ============================================
 * CONFIGURACIÓN DEL BOTÓN "AGREGAR TAREA"
 * ============================================
 * Aquí configuramos qué pasa cuando el usuario hace clic en el botón "Add note"
 */

// Verificamos que el botón existe antes de agregarle funcionalidad
if(addBtn){

    // Creamos una función que muestra el modal (ventana emergente) para crear tareas
    // Esta es una "arrow function" (función flecha) - una forma moderna de escribir funciones
    const toggleTask = () => {
        if(taskSection){
            // Cambiamos el estilo display a "flex" para que el modal sea visible
            // (por defecto está oculto con display: none en CSS)
            taskSection.style.display = "flex" ;
        }
    };

    // addEventListener "escucha" cuando el usuario hace clic en el botón
    // Cuando pasa el clic, ejecuta la función toggleTask
    addBtn.addEventListener("click", toggleTask)
}

/**
 * ============================================
 * FUNCIÓN: closeModal()
 * ============================================
 * Esta función cierra el modal (ventana emergente) de crear/editar tareas
 * cambiando su estilo para ocultarlo.
 */
function closeModal(){
    // Ocultamos el modal cambiando display a "none"
    taskSection.style.display = "none";
}

/**
 * ============================================
 * FUNCIÓN: addTask(event)
 * ============================================
 * Esta es la función principal que se ejecuta cuando el usuario envía el formulario
 * para crear una nueva tarea. Crea un objeto tarea y lo agrega al array taskList.
 * 
 * @param {Event} event - El evento del formulario (para prevenir el comportamiento por defecto)
 */
function addTask(event) {
    // preventDefault() evita que el formulario se envíe de forma tradicional
    // (lo que recargaría la página). Queremos manejar todo con JavaScript.
    if(event) event.preventDefault();

    // Validamos el formulario antes de continuar
    if (!testForm()) {
        // Si el formulario está vacío, mostramos advertencia en consola y salimos
        console.warn("Form is empty or invalid");
        return;
    }

    // Creamos un objeto "tarea" con los datos del formulario
    const task ={
        id: Date.now(),  // Date.now() devuelve un número único (milisegundos desde 1970)
                        // lo usamos como ID único para identificar cada tarea
        title: document.getElementById("title").value,  // Título de la tarea
        description: document.getElementById("description").value,  // Descripción
        priority: document.getElementById("priority").value  // Prioridad (High, Medium, Low)
    };

    // Agregamos la nueva tarea al final del array usando push()
    taskList.push(task);
    
    // Guardamos las tareas en localStorage para que persistan
    saveTasks()
    
    // Volvemos a dibujar todas las tareas en pantalla
    renderTasks()
    
    // Mostramos el array completo en la consola (útil para debugging)
    console.log(taskList);

    // Actualizamos el texto del botón de visibilidad
    textVisibility.textContent = "Hide tasks";
    
    // Creamos la interfaz visual de la tarea (aunque ya se hizo en renderTasks)
    taskUI(task);

    // Aplicamos el filtro "All" para mostrar todas las tareas
    sort("All");

    // Cerramos el modal
    closeModal();
    
    // Aseguramos que el modal esté oculto (redundante pero seguro)
    taskSection.style.display = "none";
    
    // Limpiamos el formulario para que esté listo para la próxima tarea
    document.getElementById("formTask").reset();
    
    return false;
}

/**
 * ============================================
 * FUNCIÓN: taskUI(task, index)
 * ============================================
 * Esta función crea la interfaz visual (UI) de una tarea. Toma los datos de una tarea
 * y crea el HTML necesario para mostrarla en pantalla como una tarjeta.
 * 
 * @param {Object} task - El objeto tarea con id, title, description, priority
 * @param {number} index - La posición de la tarea en el array taskList
 */
function taskUI(task, index) {
    // Obtenemos el contenedor donde se mostrarán las tarjetas
    const container = document.getElementById("Taskcontainer");
    
    // createElement crea un nuevo elemento HTML (en este caso un <div>)
    const card = document.createElement("div");
    
    // className asigna clases CSS al elemento
    // "col-12 col-md-6 col-lg-3" son clases de Bootstrap para hacer el diseño responsive
    // "task-col" es una clase personalizada
    card.className = "col-12 col-md-6 col-lg-3 task-col";
    
    // dataset permite guardar datos personalizados en el elemento HTML
    // Guardamos la prioridad para poder filtrar después
    card.dataset.priority = task.priority;

    // innerHTML establece el contenido HTML del elemento
    // Usamos template literals (backticks `) para crear HTML dinámico
    // ${variable} inserta el valor de la variable dentro del texto
    card.innerHTML = `
        <article class="task-card">
            <h3 class="fw-bold border-bottom pb-2">${task.title}</h3>
            <p class="flex-grow-1 small text-muted">${task.description}</p>
            <span class="priority-tag priority-${task.priority}">${task.priority}</span>
            <div class="mt-2">
                <label for="status-${task.id}" class="small fw-bold">Status:</label>
                <select id="status-${task.id}" class="form-select py-3 form-select-sm mt-1 dataFormTask">
                    <option value='pending'>Pending</option>
                    <option value='process'>In process</option>
                    <option value='complete'>Complete</option>
                </select>
                <button class="mt-3 btn btn-add" onclick="deleteTask(${index})"><i class="bi bi-trash me-1"></i>Delete</button>
            </div>
        </article>
    `;

    // querySelector busca un elemento dentro del card usando un selector CSS
    // Encontramos el <select> de estado
    const taskValue = card.querySelector(".dataFormTask")
    
    // Agregamos un "escuchador" de eventos para cuando cambie el estado
    taskValue.addEventListener("change", (e) =>{
        // Si el usuario selecciona "complete" (completada)
        if(e.target.value === 'complete'){

            // Aplicamos animación de desvanecimiento antes de eliminar
            // opacity cambia la transparencia (0 = invisible)
            card.style.opacity = "0";
            // transform scale hace que el elemento se encoja (0.9 = 90% del tamaño)
            card.style.transform = "scale(0.9)";
            // transition hace que los cambios sean suaves (animación de 0.3 segundos)
            card.style.transition = "0.3s all ease-in-out";

            // Esperamos 200 milisegundos para que la animación se vea
            // y luego eliminamos la tarea
            setTimeout(() =>{
                deleteTask(index);
            }, 200)
            
        }
    });

    // appendChild agrega el card (tarjeta) al contenedor
    // Esto hace que aparezca en la pantalla
    container.appendChild(card);
}

/**
 * ============================================
 * FUNCIÓN: deleteTask(index)
 * ============================================
 * Esta función elimina una tarea del array taskList y actualiza la pantalla.
 * 
 * @param {number} index - La posición de la tarea en el array que queremos eliminar
 */
function deleteTask(index){
    // splice() elimina elementos de un array
    // splice(index, 1) significa: "desde la posición index, elimina 1 elemento"
    taskList.splice(index, 1);
    
    // Guardamos los cambios en localStorage
    saveTasks();
    
    // Volvemos a dibujar todas las tareas (ahora sin la eliminada)
    renderTasks();
}

/**
 * ============================================
 * FUNCIÓN: toggleTasks()
 * ============================================
 * Esta función alterna (toggle) la visibilidad de las tareas.
 * Si están visibles, las oculta. Si están ocultas, las muestra.
 * También actualiza el icono del ojo y el texto del botón.
 */
function toggleTasks() {
    // ! cambia el valor booleano al opuesto (true → false, false → true)
    isVisible = !isVisible;

    // Si las tareas están visibles (después de cambiar el estado)
    if (isVisible) {
        // Cambiamos el texto a "Hide tasks" (Ocultar tareas)
        textVisibility.textContent = "Hide tasks";
        // Agregamos la clase "active" al botón para cambiar su estilo
        btnToogle.classList.add("active");
        // Cambiamos el icono a "ojo tachado" (eye-slash)
        eyeIcon.className = "bi bi-eye-slash me-2";
        // OCULTAMOS el contenedor de tareas
        container.style.display = "none";
    } else {
        // Si las tareas están ocultas, hacemos lo opuesto
        textVisibility.textContent = "Show tasks";
        // Removemos la clase "active"
        btnToogle.classList.remove("active");
        // Cambiamos el icono a "ojo normal" (eye)
        eyeIcon.className = "bi bi-eye me-2";
        // MOSTRAMOS el contenedor de tareas (display: flex)
        container.style.display = "flex";
    }
}

// Configuramos el evento click en el botón de toggle
if (btnToogle) {
    btnToogle.addEventListener("click", toggleTasks);
}

/**
 * ============================================
 * FUNCIÓN: filterWiew()
 * ============================================
 * Esta función muestra u oculta el menú desplegable de filtros por prioridad.
 */
function filterWiew() {
    // Alternamos el estado de visibilidad del menú
    isFilterVisible = !isFilterVisible;

    // Si el menú debe estar visible
    if (isFilterVisible) {
        if (btnFilter) btnFilter.classList.add("active");
        // Mostramos el menú cambiando display a "block"
        if (menuFilter) menuFilter.style.display = "block";
    } else {
        // Si el menú debe estar oculto
        if (btnFilter) btnFilter.classList.remove("active");
        // Ocultamos el menú
        if (menuFilter) menuFilter.style.display = "none";
    }
}

// Configuramos el evento click en el botón de filtros
if (btnFilter) {
    btnFilter.addEventListener("click", (e) => {
        // stopPropagation() evita que el evento se propague a otros elementos
        // (sin esto, el click también cerraría el menú inmediatamente)
        e.stopPropagation();
        // Llamamos a la función que muestra/oculta el menú
        filterWiew();
    });
}

/**
 * ============================================
 * CERRAR MENÚ DE FILTROS AL HACER CLIC FUERA
 * ============================================
 * Esta parte del código cierra el menú de filtros cuando el usuario hace clic
 * en cualquier parte de la página fuera del menú (comportamiento común en UIs).
 */
document.addEventListener("click", () => {
    // Si el menú está visible
    if (isFilterVisible) {
        // Lo cerramos cambiando el estado
        isFilterVisible = false;
        if (menuFilter) menuFilter.style.display = "none";
        if (btnFilter) btnFilter.classList.remove("active");
    }
});

/**
 * ============================================
 * FUNCIÓN: sort(selection)
 * ============================================
 * Esta función filtra las tareas según la prioridad seleccionada.
 * Muestra solo las tareas que coinciden con el filtro seleccionado.
 * 
 * @param {string} selection - La prioridad seleccionada ("High", "Medium", "Low", o "All")
 */
function sort(selection) {
    // Primero renderizamos todas las tareas (para asegurarnos de que estén todas en pantalla)
    renderTasks();
    
    // querySelectorAll obtiene TODOS los elementos con la clase "task-col"
    // (todas las tarjetas de tareas)
    const allCards = document.querySelectorAll(".task-col");
    
    // Obtenemos el elemento donde se muestra el texto del filtro activo
    const displayLabel = document.getElementById("selectedFilter");
    
    // Recorremos cada tarjeta de tarea
    allCards.forEach(card => {
        // Obtenemos la prioridad guardada en el atributo data-priority
        const cardPriority = card.dataset.priority;
        
        // Si el filtro es "All" (mostrar todas) O la prioridad coincide con el filtro
        if (selection === "All" || cardPriority === selection) {
            // Mostramos la tarjeta (display vacío = valor por defecto, visible)
            card.style.display = "";
        } else {
            // Si no coincide, ocultamos la tarjeta
            card.style.display = "none";
        }
    });
    
    // Actualizamos el texto del botón de filtros
    if (displayLabel) {
        // Operador ternario: condición ? valorSiVerdadero : valorSiFalso
        // Si selection es "All", mostramos "Filter", sino mostramos la prioridad
        displayLabel.textContent = selection === "All" ? "Filter" : selection;
    }
}   

/**
 * ============================================
 * CARGA INICIAL DE TAREAS
 * ============================================
 * Cuando la página termina de cargar completamente, ejecutamos loadTask()
 * para cargar las tareas guardadas desde localStorage.
 */
window.onload = loadTask;