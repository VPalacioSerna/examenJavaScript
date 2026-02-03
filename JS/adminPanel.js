// URL APIs
const URL_API_TASKS = 'http://localhost:3000/tasks';

// Task status
let allTasks = [];

//--------Task management

// Load all tasks and statistics
async function getAllTasks() {
    try {
        const res = await fetch(URL_API_TASKS);
        allTasks = await res.json(); //Bring the tasks and store them in the list.
        
        updateDashboardStats(allTasks); //updates the statuses
        renderTasksTable(allTasks); //Update the task table

    } catch (error) {
        console.error("Error loading tasks on the administrator page: ", error);
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
            getAllTasks(); // Reload table
        }
    } catch (error) {
        console.error("Update error:", error);
    }
}


// -------------RENDER

//The list with all the tasks is sent to you.
function updateDashboardStats(tasks) {
    const total = tasks.length;

    const pending = tasks.filter(t => t.status === 'Pending' || t.status === 'In progress').length;

    const complete = tasks.filter(t => t.status === 'Completed').length;

    document.getElementById('total-tasks-count').innerText = total; 
    document.getElementById('pending-tasks-count').innerText = pending;
    document.getElementById('total-tasks').innerText = complete;
}

//Render the TASKS table in Dash
function renderTasksTable(tasks) {

    const tbody = document.getElementById('tasks-tbody');

    tbody.innerHTML = tasks.reverse().map(task => `        
        <tr onclick="viewTaskDetails('${task.id}')" style="cursor:pointer">  
            <td class="fw-bold">${task.title}</td>          
            <td >User ID: ${task.idUser}</td> 
            <td>${getStatusBadge(task.status)}</td> <!--Llama el estado y los colres de cada uno-->
            <td class="fw-bold">${task.priority}</td> 
            <td class="text-end ">$${task.date}</td>
        </tr>
    `).join('');
}


//Function to view tasks
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


// -----------LOGIC

function btnLogOut(){
    localStorage.removeItem('sessionUser');    
}


//Function to assign badge colors
function getStatusBadge(status) {
    const colors = {
        'Pending': 'border-danger text-danger',
        'In progress': 'border-warning text-warning',
        'Completed': 'border-success text-success'
    };
    return `<span class="badge border ${colors[status] || 'border-primary text-primary'} border-2">${status}</span>`;
}


// Init
document.addEventListener('DOMContentLoaded', getAllTasks);
