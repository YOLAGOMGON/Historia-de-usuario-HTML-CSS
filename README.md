# 📋 TaskSort - Gestor de Tareas con Prioridades

## 📖 Descripción del Proyecto

**TaskSort** es una aplicación web para gestionar tareas personales con sistema de autenticación, prioridades y filtros. Permite a los usuarios crear, organizar, filtrar y completar tareas de manera eficiente.

### ✨ Características Principales

- 🔐 **Sistema de Autenticación**: Login y registro de usuarios
- ✅ **Gestión de Tareas**: Crear, ver y eliminar tareas
- 🎯 **Prioridades**: Alta, Media y Baja
- 🔍 **Filtros**: Filtrar tareas por prioridad
- 💾 **Almacenamiento Local**: Las tareas se guardan en el navegador (localStorage)
- 📱 **Diseño Responsive**: Funciona en móviles, tablets y escritorio

---

## 🗂️ Estructura del Proyecto

```
TaskSort/
│
├── index.html          # Página de Login y Registro
├── tasksort.html       # Página principal de gestión de tareas
├── script.js           # Lógica de gestión de tareas
├── ux-ui.js            # Lógica de autenticación y navegación
├── style.css           # Estilos CSS personalizados
└── README.md           # Este archivo
```

---

## 📚 Archivos del Proyecto y su Función

### 1. `index.html` - Página de Autenticación

**¿Qué hace?**  
Es la página de entrada a la aplicación. Aquí los usuarios pueden iniciar sesión o crear una cuenta nueva.

**Componentes principales:**
- **Formulario de Login**: Para usuarios existentes
- **Formulario de Registro**: Para crear nuevas cuentas
- **Toggle entre vistas**: Cambiar entre login y registro

**¿Cómo funciona?**
1. El usuario ingresa su email y contraseña
2. Al hacer clic en "Sing in", se ejecuta el evento `submit` del formulario
3. `ux-ui.js` intercepta el evento y valida las credenciales
4. Si son correctas, guarda la sesión y redirige a `tasksort.html`
5. Si el usuario ya tiene sesión activa, `ux-ui.js` automáticamente redirige a `tasksort.html`

**Código clave:**
```html
<form id="Login-form">
    <input type="email" id="Email1" required>
    <input type="password" id="Password" required>
    <button type="submit">Sing in</button>
</form>
```

---

### 2. `tasksort.html` - Página Principal de Tareas

**¿Qué hace?**  
Esta es la página donde los usuarios gestionan sus tareas. Solo es accesible si hay una sesión activa.

**Componentes principales:**
- **Barra de navegación**: Logo, filtros, botones de acción
- **Modal de creación**: Ventana emergente para crear nuevas tareas
- **Contenedor de tareas**: Área donde se muestran todas las tarjetas de tareas

**¿Cómo funciona?**
1. `ux-ui.js` verifica si hay sesión activa al cargar
2. Si no hay sesión, redirige a `index.html`
3. `script.js` carga las tareas guardadas desde `localStorage`
4. Las tareas se renderizan como tarjetas visuales
5. El usuario puede crear, filtrar, mostrar/ocultar y eliminar tareas

**Código clave:**
```html
<article id="Taskcontainer" class="row g-4"></article>
<!-- Este contenedor está vacío inicialmente -->
<!-- JavaScript crea las tarjetas dinámicamente aquí -->
```

---

### 3. `script.js` - Lógica de Gestión de Tareas

**¿Qué hace?**  
Maneja toda la funcionalidad relacionada con las tareas: crear, leer, eliminar, filtrar y guardar.

**Funciones principales:**

#### `testForm()` - Validación de Formularios
```javascript
function testForm() {
    const title = document.getElementById("title").value.trim();
    // ... valida que todos los campos estén completos
    return true; // o false
}
```
**Explicación:**  
- Obtiene los valores de los campos del formulario
- `.trim()` elimina espacios en blanco al inicio y final
- Verifica que ningún campo esté vacío
- Muestra mensaje de error si falta algo
- Retorna `true` si es válido, `false` si no

**Conceptos:**
- `document.getElementById()`: Obtiene un elemento HTML por su ID
- `.value`: Obtiene el texto ingresado en un input
- `.trim()`: Método de strings que elimina espacios

---

#### `loadTask()` - Cargar Tareas Guardadas
```javascript
function loadTask(){
    const saved = localStorage.getItem("Current_Tasks")
    if(saved){
        taskList = JSON.parse(saved)
        renderTasks();
    }
};
```
**Explicación:**  
- `localStorage.getItem()` obtiene datos guardados (retorna texto)
- Si hay datos guardados, `JSON.parse()` los convierte de texto a array
- `renderTasks()` dibuja las tareas en pantalla

**Conceptos:**
- **localStorage**: Almacenamiento persistente del navegador
- **JSON**: Formato de texto para representar datos (objetos, arrays)
- **JSON.parse()**: Convierte texto JSON → JavaScript object/array
- **JSON.stringify()**: Convierte JavaScript object/array → texto JSON

---

#### `saveTasks()` - Guardar Tareas
```javascript
function saveTasks(){
    localStorage.setItem("Current_Tasks", JSON.stringify(taskList));
}
```
**Explicación:**  
- `JSON.stringify()` convierte el array de tareas a texto
- `localStorage.setItem()` guarda el texto en el navegador
- Se llama automáticamente cada vez que hay cambios

---

#### `renderTasks()` - Mostrar Tareas en Pantalla
```javascript
function renderTasks(){
    container.innerHTML = "";
    taskList.forEach((task, index) => {
        taskUI(task, index)
    });
}
```
**Explicación:**  
- `innerHTML = ""` limpia el contenedor (borra todas las tarjetas)
- `forEach()` recorre cada tarea del array
- Para cada tarea, llama a `taskUI()` para crear su tarjeta visual

**Conceptos:**
- `innerHTML`: Contenido HTML de un elemento (permite leer y escribir)
- `.forEach()`: Método de arrays que ejecuta una función para cada elemento
- Parámetros de forEach: `(elemento, índice) => { }`

---

#### `addTask(event)` - Crear Nueva Tarea
```javascript
function addTask(event) {
    event.preventDefault(); // Evita recargar la página
    
    if (!testForm()) return; // Valida el formulario
    
    const task = {
        id: Date.now(),
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        priority: document.getElementById("priority").value
    };
    
    taskList.push(task);
    saveTasks();
    renderTasks();
    closeModal();
}
```
**Explicación paso a paso:**

1. **`event.preventDefault()`**:  
   Por defecto, enviar un formulario recarga la página. Esto lo previene.

2. **Validación**:  
   `testForm()` verifica que todos los campos estén completos.

3. **Crear objeto tarea**:  
   ```javascript
   const task = {
       id: Date.now(),        // ID único (milisegundos desde 1970)
       title: "...",          // Título de la tarea
       description: "...",    // Descripción
       priority: "High"       // Prioridad (High/Medium/Low)
   };
   ```
   - `Date.now()`: Número único basado en la fecha/hora actual
   - Los objetos JavaScript usan `{}` y propiedades separadas por comas

4. **Agregar al array**:  
   `taskList.push(task)` agrega la tarea al final del array

5. **Guardar y mostrar**:  
   - `saveTasks()`: Guarda en localStorage
   - `renderTasks()`: Actualiza la pantalla
   - `closeModal()`: Cierra la ventana emergente

**Conceptos:**
- **Objetos JavaScript**: `{ propiedad: valor }`
- **Arrays**: `[elemento1, elemento2]`
- `.push()`: Agrega un elemento al final de un array
- **Eventos**: Acciones del usuario (click, submit, etc.)

---

#### `taskUI(task, index)` - Crear Tarjeta Visual de Tarea
```javascript
function taskUI(task, index) {
    const card = document.createElement("div");
    card.className = "col-12 col-md-6 col-lg-3 task-col";
    card.dataset.priority = task.priority;
    
    card.innerHTML = `
        <article class="task-card">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <span class="priority-tag priority-${task.priority}">${task.priority}</span>
            <select id="status-${task.id}">
                <option value='pending'>Pending</option>
                <option value='process'>In process</option>
                <option value='complete'>Complete</option>
            </select>
            <button onclick="deleteTask(${index})">Delete</button>
        </article>
    `;
    
    container.appendChild(card);
}
```
**Explicación:**

1. **Crear elemento**:  
   `document.createElement("div")` crea un nuevo elemento HTML

2. **Configurar clases CSS**:  
   `card.className` asigna clases CSS (para estilos)

3. **Guardar prioridad**:  
   `card.dataset.priority` guarda datos en el elemento HTML (útil para filtros)

4. **Crear HTML**:  
   - Usa **template literals** (backticks `` ` ``) para crear HTML dinámico
   - `${variable}` inserta el valor de la variable dentro del texto
   - Ejemplo: `` `<h3>${task.title}</h3>` `` → `<h3>Tarea 1</h3>`

5. **Agregar al DOM**:  
   `container.appendChild(card)` añade el elemento al contenedor

**Conceptos:**
- **DOM**: Document Object Model (representación del HTML en JavaScript)
- `document.createElement()`: Crea nuevos elementos HTML
- **Template literals**: Strings con `` ` `` que permiten interpolar variables
- `.appendChild()`: Agrega un elemento hijo al DOM
- `onclick="..."`: Atributo HTML que ejecuta código JavaScript al hacer clic

---

#### `deleteTask(index)` - Eliminar Tarea
```javascript
function deleteTask(index){
    taskList.splice(index, 1);
    saveTasks();
    renderTasks();
}
```
**Explicación:**  
- `splice(index, 1)` elimina 1 elemento desde la posición `index`
- Actualiza localStorage y la pantalla

**Conceptos:**
- `.splice(posición, cantidad)`: Elimina elementos de un array

---

#### `sort(selection)` - Filtrar Tareas por Prioridad
```javascript
function sort(selection) {
    renderTasks(); // Primero muestra todas
    const allCards = document.querySelectorAll(".task-col");
    
    allCards.forEach(card => {
        const cardPriority = card.dataset.priority;
        if (selection === "All" || cardPriority === selection) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}
```
**Explicación:**

1. **Renderizar todas**:  
   Primero muestra todas las tareas

2. **Obtener todas las tarjetas**:  
   `querySelectorAll(".task-col")` obtiene todas las tarjetas

3. **Filtrar**:  
   - Recorre cada tarjeta
   - Obtiene la prioridad guardada en `dataset.priority`
   - Si coincide con el filtro seleccionado (o es "All"), la muestra
   - Si no coincide, la oculta con `display: "none"`

**Conceptos:**
- `querySelectorAll()`: Obtiene todos los elementos que coinciden con un selector CSS
- `.dataset`: Accede a atributos `data-*` del HTML
- `.style.display`: Cambia la visibilidad de un elemento

---

#### `toggleTasks()` - Mostrar/Ocultar Tareas
```javascript
function toggleTasks() {
    isVisible = !isVisible; // Alterna entre true y false
    
    if (isVisible) {
        container.style.display = "none"; // Oculta
    } else {
        container.style.display = "flex"; // Muestra
    }
}
```
**Explicación:**  
- `!isVisible` cambia el valor booleano (true → false, false → true)
- Según el estado, muestra u oculta el contenedor

**Conceptos:**
- **Operador `!`**: NOT lógico (invierte el valor)
- **Variables booleanas**: `true` o `false`

---

### 4. `ux-ui.js` - Autenticación y Navegación

**¿Qué hace?**  
Maneja el sistema de autenticación (login/registro) y protege las rutas de acceso.

---

#### Verificación de Sesión y Protección de Rutas
```javascript
const isAtLogin = window.location.pathname.includes("index.html");
const currentUser = localStorage.getItem("current_user");

if (currentUser && isAtLogin) {
    window.location.href = "tasksort.html";
}

if (!currentUser && !isAtLogin) {
    window.location.href = "index.html";
}
```
**Explicación:**

1. **Detectar página actual**:  
   `window.location.pathname` obtiene la ruta de la URL actual

2. **Obtener usuario**:  
   `localStorage.getItem("current_user")` busca sesión guardada

3. **Redirecciones automáticas**:  
   - Si hay sesión Y está en login → va a tareas
   - Si NO hay sesión Y está en tareas → va a login

**Conceptos:**
- `window.location`: Objeto que contiene información de la URL
- `.includes()`: Verifica si un string contiene otro
- `!` (NOT): Niega una condición

---

#### Base de Datos de Usuarios (localStorage)
```javascript
let dataBase = JSON.parse(localStorage.getItem("tasksort_users")) || [
    { email: "TaskSort@example.com", password: "12345678", user: "Juan Pablo"}
];
```
**Explicación:**  
- Intenta cargar usuarios guardados
- Si no hay (`null`), usa el operador `||` para crear un array con un usuario de ejemplo
- Cada usuario es un objeto con `email`, `password` y `user`

**Conceptos:**
- **Operador `||`**: Retorna el primer valor "verdadero"
  - `null || [array]` → retorna `[array]`
- **Arrays de objetos**: `[{...}, {...}]`

---

#### Registro de Usuarios
```javascript
formSing.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const newUser = {
        email: document.getElementById("Email2").value,
        password: document.getElementById("Password1").value,
        user: document.getElementById("User").value
    };
    
    const exist = dataBase.some(user => user.email === newUser.email);
    
    if (exist) {
        // Mostrar error: email ya existe
    } else {
        dataBase.push(newUser);
        saveData();
        // Mostrar éxito
    }
});
```
**Explicación paso a paso:**

1. **Escuchar evento**:  
   `addEventListener("submit", ...)` se ejecuta cuando se envía el formulario

2. **Prevenir recarga**:  
   `e.preventDefault()` evita que la página se recargue

3. **Crear objeto usuario**:  
   Obtiene los valores del formulario y crea un objeto

4. **Verificar si existe**:  
   ```javascript
   dataBase.some(user => user.email === newUser.email)
   ```
   - `.some()` verifica si AL MENOS UN elemento cumple la condición
   - `=>` es una arrow function (función flecha)
   - Compara si algún usuario tiene el mismo email

5. **Registrar o mostrar error**:  
   - Si existe: muestra error
   - Si no existe: agrega a la base de datos y guarda

**Conceptos:**
- **Arrow functions**: `(parámetro) => { código }` (forma corta de escribir funciones)
- `.some()`: Retorna `true` si algún elemento cumple la condición
- **Comparación**: `===` compara valores (estricto)

---

#### Login de Usuarios
```javascript
formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const emailInput = document.getElementById("Email1").value;
    const passwordInput = document.getElementById("Password").value;
    
    const found = dataBase.find(user => 
        user.email === emailInput && user.password === passwordInput
    );
    
    if (found) {
        localStorage.setItem('current_user', JSON.stringify(found));
        window.location.href = "tasksort.html";
    } else {
        // Mostrar error: credenciales incorrectas
    }
});
```
**Explicación:**

1. **Obtener credenciales**:  
   Lee email y contraseña del formulario

2. **Buscar usuario**:  
   ```javascript
   dataBase.find(user => 
       user.email === emailInput && user.password === passwordInput
   )
   ```
   - `.find()` busca el PRIMER elemento que cumple la condición
   - `&&` significa "Y" (ambas condiciones deben ser verdaderas)

3. **Iniciar sesión**:  
   - Si encuentra el usuario, guarda la sesión en localStorage
   - Redirige a la página de tareas

**Conceptos:**
- `.find()`: Busca y retorna el primer elemento que cumple la condición
- Operador `&&`: AND lógico (ambas condiciones deben ser true)
- `window.location.href`: Cambia la URL (redirige)

---

#### Logout (Cerrar Sesión)
```javascript
logoutBtn.addEventListener("click", () => {
    const confirm = window.confirm("Do you want log out?");
    
    if (confirm) {
        localStorage.removeItem("current_user");
        window.location.href = "index.html";
    }
});
```
**Explicación:**  
1. Muestra un diálogo de confirmación
2. Si el usuario confirma:
   - Elimina la sesión de localStorage
   - Redirige al login

**Conceptos:**
- `window.confirm()`: Muestra un diálogo con "OK" y "Cancelar"
- `.removeItem()`: Elimina un elemento de localStorage

---

### 5. `style.css` - Estilos Visuales

**¿Qué hace?**  
Define cómo se ven todos los elementos de la aplicación: colores, tamaños, posiciones, animaciones, etc.

---

#### Variables CSS (Custom Properties)
```css
:root {
    --Header-color: #fff;
    --Bg-main: #f4f4f4;
    --Int-color: #c0b283;
}
```
**Explicación:**  
- `:root` es el selector raíz (equivalente a `html`)
- `--nombre-variable: valor;` define una variable
- Se usa con `var(--nombre-variable)`

**Ventajas:**
- Cambiar un color en un solo lugar afecta a todo
- Facilita la personalización del tema

**Uso:**
```css
body {
    background-color: var(--Bg-main);
}
```

---

#### Selectores CSS

**1. Selector de elemento:**
```css
h2 {
    text-align: center;
}
```
Aplica a TODOS los elementos `<h2>`

---

**2. Selector de clase:**
```css
.btn-add {
    border-radius: 0;
}
```
Aplica a elementos con `class="btn-add"`  
**Uso en HTML:** `<button class="btn-add">Click</button>`

---

**3. Selector de ID:**
```css
#FilterMenu {
    display: none;
}
```
Aplica al elemento con `id="FilterMenu"`  
**Uso en HTML:** `<ul id="FilterMenu"></ul>`

**⚠️ IMPORTANTE:** Los IDs deben ser ÚNICOS (un solo elemento por ID)

---

**4. Selector descendente:**
```css
.logo-wrapper svg {
    color: black;
}
```
Aplica a elementos `<svg>` dentro de `.logo-wrapper`  
**Uso:** `<div class="logo-wrapper"><svg>...</svg></div>`

---

**5. Pseudo-clases:**
```css
.btn-add:hover {
    color: red;
}
```
Aplica cuando el mouse está SOBRE el elemento

**Otras pseudo-clases comunes:**
- `:active` - Cuando se hace clic
- `:focus` - Cuando tiene el foco
- `:first-child` - Primer elemento hijo

---

#### Propiedades CSS Importantes

**Display:**
```css
display: none;        /* Oculta el elemento */
display: block;       /* Elemento de bloque (ocupa toda la línea) */
display: inline;      /* Elemento en línea (solo ocupa su contenido) */
display: flex;        /* Usa flexbox (para layouts flexibles) */
```

**Position:**
```css
position: static;     /* Posición normal (por defecto) */
position: relative;   /* Posición relativa a su posición original */
position: absolute;   /* Posición relativa al padre más cercano con position */
position: fixed;      /* Posición fija en la ventana (no se mueve al hacer scroll) */
```

**Flexbox:**
```css
display: flex;
flex-direction: row;        /* Elementos en fila (horizontal) */
justify-content: center;   /* Centra horizontalmente */
align-items: center;       /* Centra verticalmente */
gap: 10px;                 /* Espacio entre elementos */
```

**Box Model:**
```css
padding: 20px;        /* Espacio interno */
margin: 10px;         /* Espacio externo */
border: 1px solid black;  /* Borde */
width: 100px;
height: 100px;
```

---

## 🔄 Flujo de la Aplicación

### Flujo de Autenticación

```
1. Usuario abre index.html
   ↓
2. ux-ui.js verifica si hay sesión activa
   ↓
3a. Si hay sesión → Redirige a tasksort.html
3b. Si NO hay sesión → Muestra formulario de login
   ↓
4. Usuario hace login o se registra
   ↓
5. ux-ui.js valida credenciales
   ↓
6a. Si es válido → Guarda sesión y redirige a tasksort.html
6b. Si no es válido → Muestra mensaje de error
```

### Flujo de Gestión de Tareas

```
1. Usuario está en tasksort.html
   ↓
2. script.js carga tareas desde localStorage (loadTask())
   ↓
3. renderTasks() dibuja todas las tareas en pantalla
   ↓
4. Usuario hace clic en "Add note"
   ↓
5. script.js muestra el modal (ventana emergente)
   ↓
6. Usuario completa el formulario y envía
   ↓
7. addTask() valida, crea objeto tarea, agrega al array
   ↓
8. saveTasks() guarda en localStorage
   ↓
9. renderTasks() actualiza la pantalla
```

---

## 🔗 Cómo Interactúan los Archivos

### HTML → CSS
```html
<!-- El HTML usa clases e IDs que están definidos en CSS -->
<button class="btn-add">Click</button>
```
```css
/* CSS define los estilos para esa clase */
.btn-add {
    background-color: blue;
}
```

---

### HTML → JavaScript
```html
<!-- HTML tiene IDs y eventos que JavaScript usa -->
<button id="Add-Task" onclick="addTask()">Add</button>
<form id="Login-form">...</form>
```
```javascript
// JavaScript obtiene elementos por ID
const addBtn = document.getElementById("Add-Task");

// JavaScript escucha eventos
formLogin.addEventListener("submit", (e) => {
    // código
});
```

---

### JavaScript → HTML (Manipulación del DOM)
```javascript
// JavaScript crea elementos HTML dinámicamente
const card = document.createElement("div");
card.innerHTML = `<h3>${task.title}</h3>`;
container.appendChild(card);

// JavaScript cambia estilos
element.style.display = "none";

// JavaScript cambia contenido
element.textContent = "Nuevo texto";
```

---

### JavaScript → localStorage
```javascript
// Guardar datos
localStorage.setItem("clave", JSON.stringify(datos));

// Cargar datos
const datos = JSON.parse(localStorage.getItem("clave"));
```

---

## 📝 Conceptos de Sintaxis JavaScript

### Variables

```javascript
// const: Constante (no se puede cambiar después)
const nombre = "Juan";

// let: Variable que puede cambiar
let edad = 25;
edad = 26; // ✅ Permitido

// var: Forma antigua (evitar en código moderno)
var apellido = "Pérez";
```

---

### Funciones

**Función tradicional:**
```javascript
function miFuncion(parametro) {
    return parametro * 2;
}
```

**Arrow function (función flecha):**
```javascript
const miFuncion = (parametro) => {
    return parametro * 2;
};

// Si solo tiene una línea, puede ser más corta:
const miFuncion = parametro => parametro * 2;
```

---

### Arrays y Objetos

**Array:**
```javascript
const frutas = ["manzana", "banana", "naranja"];
frutas[0];        // "manzana" (primer elemento, índice 0)
frutas.length;    // 3 (cantidad de elementos)
frutas.push("uva"); // Agrega "uva" al final
```

**Objeto:**
```javascript
const persona = {
    nombre: "Juan",
    edad: 25,
    ciudad: "Madrid"
};

persona.nombre;      // "Juan"
persona["edad"];     // 25 (otra forma de acceder)
```

**Array de objetos:**
```javascript
const usuarios = [
    { nombre: "Juan", edad: 25 },
    { nombre: "María", edad: 30 }
];

usuarios[0].nombre;  // "Juan"
```

---

### Métodos de Arrays

```javascript
const numeros = [1, 2, 3, 4, 5];

// forEach: Ejecuta función para cada elemento
numeros.forEach(num => console.log(num));

// map: Transforma cada elemento y retorna nuevo array
const dobles = numeros.map(num => num * 2); // [2, 4, 6, 8, 10]

// filter: Filtra elementos que cumplen condición
const pares = numeros.filter(num => num % 2 === 0); // [2, 4]

// find: Busca primer elemento que cumple condición
const mayor = numeros.find(num => num > 3); // 4

// some: Verifica si algún elemento cumple condición
const hayMayores = numeros.some(num => num > 4); // true
```

---

### Condicionales

```javascript
// if / else
if (edad >= 18) {
    console.log("Mayor de edad");
} else {
    console.log("Menor de edad");
}

// Operador ternario (forma corta)
const mensaje = edad >= 18 ? "Mayor" : "Menor";

// Operadores lógicos
if (edad >= 18 && nombre === "Juan") {
    // Ambas condiciones deben ser true
}

if (edad < 18 || edad > 65) {
    // Al menos una condición debe ser true
}

if (!estaActivo) {
    // Si NO está activo
}
```

---

### Eventos

```javascript
// Escuchar evento click
boton.addEventListener("click", () => {
    console.log("Click detectado");
});

// Escuchar evento submit (formulario)
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault(); // Previene recarga de página
    // código
});

// Eventos comunes:
// - "click" - Clic del mouse
// - "submit" - Envío de formulario
// - "change" - Cambio de valor (select, input)
// - "load" - Carga de página
```

---

### Template Literals (Strings con variables)

```javascript
const nombre = "Juan";
const edad = 25;

// Forma antigua (concatenación)
const mensaje = "Hola, soy " + nombre + " y tengo " + edad + " años";

// Forma moderna (template literals)
const mensaje = `Hola, soy ${nombre} y tengo ${edad} años`;
// Usa backticks `` y ${variable}
```

---

### Async y setTimeout

```javascript
// setTimeout: Ejecuta código después de un tiempo
setTimeout(() => {
    console.log("Esto aparece después de 2 segundos");
}, 2000); // 2000 milisegundos = 2 segundos

// Ejemplo del proyecto:
setTimeout(() => {
    incorrectmsg.textContent = ""; // Limpia mensaje después de 2 segundos
}, 2000);
```

---

## 🎯 Ejemplos Prácticos del Proyecto

### Ejemplo 1: Crear una Tarea

**1. Usuario completa formulario:**
```html
<input id="title" value="Comprar leche">
<input id="description" value="Ir al supermercado">
<select id="priority">
    <option value="High" selected>High</option>
</select>
```

**2. Usuario hace clic en "Save":**
```javascript
// Se ejecuta addTask(event)
function addTask(event) {
    event.preventDefault();
    
    // Obtiene valores
    const title = document.getElementById("title").value; // "Comprar leche"
    const description = document.getElementById("description").value;
    const priority = document.getElementById("priority").value; // "High"
    
    // Crea objeto
    const task = {
        id: Date.now(),        // 1704067200000 (número único)
        title: "Comprar leche",
        description: "Ir al supermercado",
        priority: "High"
    };
    
    // Agrega al array
    taskList.push(task);
    // taskList ahora es: [{ id: 1704067200000, title: "...", ... }]
    
    // Guarda y muestra
    saveTasks();   // Guarda en localStorage como texto JSON
    renderTasks(); // Crea las tarjetas HTML visuales
}
```

**3. Resultado:**
```html
<!-- Se crea dinámicamente en el DOM: -->
<div class="task-col" data-priority="High">
    <article class="task-card">
        <h3>Comprar leche</h3>
        <p>Ir al supermercado</p>
        <span class="priority-tag priority-High">HIGH</span>
    </article>
</div>
```

---

### Ejemplo 2: Filtrar Tareas

**1. Usuario hace clic en "High Priority":**
```html
<li onclick="sort('High')">High Priority</li>
```

**2. Se ejecuta la función:**
```javascript
function sort("High") {
    renderTasks(); // Muestra todas primero
    const allCards = document.querySelectorAll(".task-col");
    // Obtiene: [div1, div2, div3, div4] (todas las tarjetas)
    
    allCards.forEach(card => {
        const cardPriority = card.dataset.priority;
        // card1.dataset.priority = "High"
        // card2.dataset.priority = "Medium"
        // card3.dataset.priority = "Low"
        // card4.dataset.priority = "High"
        
        if ("High" === "All" || cardPriority === "High") {
            // card1: "High" === "High" → true → muestra
            // card2: "Medium" === "High" → false → oculta
            // card3: "Low" === "High" → false → oculta
            // card4: "High" === "High" → true → muestra
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}
```

**3. Resultado:**  
Solo se muestran las tareas con prioridad "High"

---

## 🚀 Cómo Usar el Proyecto

### 1. Abrir la Aplicación

1. Abre `index.html` en tu navegador
2. Si no tienes cuenta, haz clic en "Sing up"
3. Completa el formulario de registro
4. Inicia sesión con tus credenciales

### 2. Crear una Tarea

1. Haz clic en "Add note"
2. Completa:
   - **Title**: Título de la tarea
   - **Description**: Descripción detallada
   - **Priority**: Selecciona High, Medium o Low
3. Haz clic en "Save"

### 3. Gestionar Tareas

- **Filtrar**: Haz clic en "Filter" y selecciona una prioridad
- **Mostrar/Ocultar**: Haz clic en "Show tasks" / "Hide tasks"
- **Completar**: Cambia el status a "Complete" (se elimina automáticamente)
- **Eliminar**: Haz clic en "Delete"

### 4. Cerrar Sesión

1. Haz clic en "Log out"
2. Confirma en el diálogo
3. Serás redirigido al login

---

## 🔍 Depuración (Debugging)

### Ver Datos en localStorage

Abre la consola del navegador (F12) y ejecuta:
```javascript
// Ver tareas guardadas
JSON.parse(localStorage.getItem("Current_Tasks"));

// Ver usuarios guardados
JSON.parse(localStorage.getItem("tasksort_users"));

// Ver usuario actual
JSON.parse(localStorage.getItem("current_user"));
```

### Ver Errores

Abre la consola del navegador (F12 → Console) para ver mensajes de error y advertencias.

### Limpiar Datos

```javascript
// Limpiar todas las tareas
localStorage.removeItem("Current_Tasks");

// Limpiar toda la sesión
localStorage.clear();
```

---

## 📚 Recursos para Aprender Más

### JavaScript
- [MDN JavaScript Guide](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide)
- [JavaScript.info](https://javascript.info/es/)

### HTML
- [MDN HTML Guide](https://developer.mozilla.org/es/docs/Learn/HTML)

### CSS
- [MDN CSS Guide](https://developer.mozilla.org/es/docs/Learn/CSS)
- [CSS-Tricks](https://css-tricks.com/)

### localStorage
- [MDN localStorage](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage)

---

## 🎓 Glosario de Términos

- **DOM**: Document Object Model - Representación del HTML en JavaScript
- **Evento**: Acción del usuario (click, submit, etc.)
- **localStorage**: Almacenamiento persistente en el navegador
- **JSON**: Formato de texto para representar datos estructurados
- **Array**: Lista ordenada de elementos
- **Objeto**: Colección de propiedades (clave: valor)
- **Función**: Bloque de código reutilizable
- **Variable**: Contenedor para almacenar valores
- **Selector CSS**: Patrón para seleccionar elementos HTML
- **Responsive**: Diseño que se adapta a diferentes tamaños de pantalla
- **Modal**: Ventana emergente sobre el contenido principal

---

## 💡 Mejoras Futuras Posibles

- ✨ Editar tareas existentes
- 📅 Fechas de vencimiento
- 🔔 Notificaciones
- 📊 Estadísticas de tareas completadas
- 🔍 Búsqueda de tareas
- 🏷️ Categorías/etiquetas
- 📤 Exportar/importar tareas
- ☁️ Sincronización con servidor

---

## 📄 Licencia

Este es un proyecto educativo. Siéntete libre de usarlo y modificarlo para aprender.

---

## 🤝 Contribuciones

Este es un proyecto de aprendizaje. Si encuentras errores o tienes sugerencias, ¡serán bienvenidas!

---

**¡Feliz aprendizaje! 🚀**

Si tienes dudas sobre alguna parte específica del código, revisa los comentarios detallados en cada archivo.
