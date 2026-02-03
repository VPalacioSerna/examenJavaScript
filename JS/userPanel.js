// URL APIs
const URL_API_TASKS = 'http://localhost:3000/tasks';

// Estado de las tareas
let allTasks = [];

//--------Manejo de tareas

// Cargar todas las tareas y estadísticas
async function getUserTasks() {
    // Uusuario que se guarda en el local storage gracias a la entrada
    const sessionData = JSON.parse(localStorage.getItem('sessionUser'));

    try {
        const res = await fetch(`${URL_API_TASKS}?idUser=${sessionData.id}`);
        allTasks = await res.json();

        updateDashboardStats(allTasks); //actualiza los estados
        renderTasksTable(allTasks); //actualiza la tabla de tareas
    } catch (error) {
        console.log('Error retrieving tasks in admin:', error);        
    }
}

async function updateTaskStatus(id) {
    const newStatus = document.getElementById(`status-select-${id}`).value;
    
    try {
        const res = await fetch(`${URL_API_TASKS}/${id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ status: newStatus })
        });

        if (res.ok) {
            alert("Status updated!");
            getUserTasks(); // Recargar tabla 
        }
    } catch (error) {
        console.error("Update error:", error);
    }
}


// -------------RENDER

//se le envia la lista con todas las tareas
function updateDashboardStats(tasks) {
    const total = tasks.length;

    const pending = tasks.filter(t => t.status === 'Pending' || t.status === 'In progress').length;

    const complete = tasks.filter(t => t.status === 'Completed').length;

    document.getElementById('total-tasks-count').innerText = total; 
    document.getElementById('pending-tasks-count').innerText = pending;
    document.getElementById('total-tasks').innerText = complete;
}

//Renderiza la tabla de TASKS en dash
function renderTasksTable(tasks) {
    const tbody = document.getElementById('tasks-tbody');

    tbody.innerHTML = tasks.reverse().map(task => `        
        <tr onclick="viewTaskDetails('${task.id}')" style="cursor:pointer">  
            <td class="fw-bold">${task.title}</td>  
            <td>${getStatusBadge(task.status)}</td> <!--Llama el estado y los colres de cada uno-->
            <td class="fw-bold">${task.priority}</td> 
            <td class="text-end ">$${task.date}</td>
        </tr>
    `).join('');
}


//Funcion para ver las tareas
function viewTaskDetails(id) {
    const task = allTasks.find(t => String(t.id) === String(id));
    const container = document.getElementById('tasks-details-card');
    container.style.display = 'block';

    container.innerHTML = `
        <div class="d-flex justify-content-between mb-3">
            <h5 class="mb-0">Task: ${task.title}</h5>
            <span class="badge bg-primary">Active</span>
        </div>
        <p class="mb-1 fw-bold">User ID: ${task.idUser}</p>
        <p class="small text-muted mb-4">Fecha: ${task.date}</p>

        <div class="mt-4 d-grid gap-2">
            <select id="status-select-${task.id}" class="form-select">
                <option value="Pending" ${task.status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="In progress" ${task.status === 'In progress' ? 'selected' : ''}>In progress</option>
                <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
            <button class="btn btn-success" onclick="updateTaskStatus('${task.id}')">Update Status</button>
        </div>
    `;
}


// -----------LOGICA

function btnLogOut(){
    localStorage.removeItem('sessionUser');    
}


//Funcion para asignar colores de los badge
function getStatusBadge(status) {
    const colors = {
        'Pending': 'border-danger text-danger',
        'In progress': 'border-warning text-warning',
        'Completed': 'border-success text-success'
    };
    return `<span class="badge border ${colors[status] || 'border-primary text-primary'} border-2">${status}</span>`;
}


// Inicializar
document.addEventListener('DOMContentLoaded', getUserTasks);
