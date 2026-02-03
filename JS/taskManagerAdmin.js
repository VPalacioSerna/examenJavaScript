//1. Variables
//2. Funciones Api
//3. Funciones renderizar
//4. Funciones logica

//Fecha actual
let currentDate = new Date().toLocaleString()

const inputTitle = document.getElementById('input-title');
const inputCategory = document.getElementById('input-category');
const inputPriority = document.getElementById('input-priority');
const inputStatus = document.getElementById('input-status');
const inputDescription = document.getElementById('input-description');


// URL APIs
const URL_API_TASKS= 'http://localhost:3000/tasks';  


//List of items
const tbody = document.getElementById('tbody'); 
let listTasks = [];

//Button control
const btnSaveTask = document.getElementById('btnSaveTask');
let currentMode = 'CREATE'; // 'CREATE', 'EDIT', 'VIEW'
let taskInEdition = null;



//---------------------API functions

//Bring tasks (call GET to render)
async function getTasks() {
    try {
        const res = await fetch(`${URL_API_TASKS}`);
        listTasks = await res.json();
        //muestra
        renderTasks(listTasks);
    } catch (error) {
        console.log('Error retrieving tasks in admin:', error);        
    }
}

//Crear tarea
async function createTask(data) {
    try {
        const res = await fetch(`${URL_API_TASKS}`, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });   

    } catch (error) {
        console.log('Error creating task: ', error);
    }
}

//Editar tarea
async function updateTask(id, data) {
    try {
        const res = await fetch(`${URL_API_TASKS}/${id}`, {
            method: 'PATCH', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })      

    } catch (error) {
        console.log('Task update error: ', error);
    }
}

//Eliminar tarea
async function deleteTask(id) {
    try {
        const res = await fetch(`${URL_API_TASKS}/${id}`, {
            method: 'DELETE'
        })      
        if(res.ok) {
            return;
        } else {
            throw new Error("Error deleting task: ");            
        }
    } catch (error) {
        console.log(error.message);
    }
}



//---------------------Rendering Functions
//Mostrar los tareas
function renderTasks(listTasks) {
    tbody.innerHTML = '';

    if (listTasks.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-danger text-center">No hay tareas</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = listTasks.map((t) => {
        return `
            <tr>
                <td class="fw-bold">${t.id}</td>
                <td>${t.idUser}</td>
                <td class="fw-bold">${t.title}</td>
                <td >${t.category}</td>
                <td >${t.priority}</td>
                <td>${t.status}</td>
                <td class="text-truncate" style="max-width: 150px;">${t.description}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-info" onclick="infoTask('${t.id}')">Details</button>
                    <button class="btn btn-sm btn-outline-warning me-1" onclick="editTask('${t.id}')">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteTaskConfirm('${t.id}')">Delete</button>
                </td>
            </tr>
        `;
    }).join(""); 

}


//---------------------Status and form control functions

// Function to clear everything and return to the initial state
function resetForm() {
    cleanForm();
    currentMode = 'CREATE';
    taskInEdition = null;
    btnSaveTask.innerText = "Save Task";
}

// Function to fill in the data sent to the API
function fillForm(t) {
    inputTitle.value = t.title;
    inputCategory.value = t.category;
    inputPriority.value = t.priority;
    inputStatus.value = t.status;
    inputDescription.value = t.description;    
}

//clear the form data
function cleanForm() {
    inputTitle.value = '';
    inputCategory.value = '';
    inputPriority.value = '';
    inputStatus.value = '';
    inputDescription.value = '';
}

function btnLogOut(){
    const session = localStorage.removeItem('sessionUser');    
}


//---------------------Interaction functions (table buttons)
//These functions populate the form with data and manage control variables

//Function for details
function infoTask(id) {
    const task = listTasks.find(p => String(p.id) === String(id));
    if (task) {
        fillForm(task);
        currentMode = 'VIEW';
        btnSaveTask.innerText = 'Close details';
    }
}

//Funcion para editar
function editTask(id) {
    const task = listTasks.find(p => String(p.id) === String(id));
    if (task) {
        fillForm(task);
        taskInEdition = id;
        currentMode = 'EDIT';
        btnSaveTask.innerText = 'Update task';
    }
}

//Funcion para eliminar tarea
 async function deleteTaskConfirm(id) {
    const task = listTasks.find(p => String(p.id) === String(id));
    if (task) {
        taskInEdition = id;
        await deleteTask(id);
        alert('Task deleted!')
        await getTasks();
    }
}

//---------------------Main handler (save button)
//Calls the CRUD functions to make changes to the database

//Manejo del guardado de datos
btnSaveTask.addEventListener('click', async ()=> {
    const sessionData = JSON.parse(localStorage.getItem('sessionUser'));

    //si esta en detalles
    if (currentMode === 'VIEW') {
        resetForm();
        return;
    }

    const taskData = {
        idUser: sessionData.id,
        title: inputTitle.value,
        category: inputCategory.value,
        priority: inputPriority.value,
        status: inputStatus.value,
        description: inputDescription.value,
        date: currentDate
    };

    try {
        //si esta editando
        if (currentMode === 'EDIT') { //taskInEdition would have an id at this time
            await updateTask(taskInEdition, taskData);
            getTasks();
            alert('Task updated!');
        }
        else {
            //si esta creando
            await createTask(taskData);
            getTasks();
            alert('Task created!');
        } 

        resetForm(); //quita toda la info del form y vuelve a los estados iniciales

    } catch (error) {
        console.log('Error in calling the async functions of CRUD');        
    }
}) 


//---------------------Inicializacion
document.addEventListener('DOMContentLoaded', getTasks);




