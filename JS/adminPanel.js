// URL APIs
const URL_API_ORDERS = 'http://localhost:3000/orders';

// Estado de las ordenes
let allOrders = [];

//--------Manejo de Ordenes

// Cargar todas las órdenes y estadísticas
async function getAdminOrders() {
    try {
        const res = await fetch(URL_API_ORDERS);
        allOrders = await res.json(); //Trae las ordenes y las alamacena en la lista
        
        updateDashboardStats(allOrders);
        renderOrdersTable(allOrders);

    } catch (error) {
        console.error("Error cargando órdenes en la pagina administrador:", error);
    }
}

async function updateOrderStatus(id) {
    const newStatus = document.getElementById(`status-select-${id}`).value;
    
    try {
        const res = await fetch(`${URL_API_ORDERS}/${id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ status: newStatus })
        });

        if (res.ok) {
            alert("Estado actualizado!");
            getAdminOrders(); // Recargar tabla 
        }
    } catch (error) {
        console.error("Error al actualizar:", error);
    }
}


// -------------RENDER

//Actualiza en la pagina dash la cantidad de ordenes, pendiente y total money
//se le envia la lista con todas las ordenes
function updateDashboardStats(orders) {
    const total = orders.length;

    //las pendientes se filtran
    const pending = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;

    //Las que estan entregadas son las que se cuentan en el total money
    const revenue = orders
        .filter(o => o.status === 'Delivered')
        .reduce((acc, o) => acc + Number(o.total), 0);

    //No declara al inicio, por el contrario declara y asigna inmediatamente
    document.getElementById('total-orders-count').innerText = total; 
    document.getElementById('pending-orders-count').innerText = pending;
    document.getElementById('total-revenue').innerText = `$${revenue.toFixed(2)}`;
}

//Renderiza la tabla de ORDERS en dash
function renderOrdersTable(orders) {
    const tbody = document.getElementById('orders-tbody');

    tbody.innerHTML = orders.reverse().map(order => `
        <tr onclick="viewOrderDetails('${order.id}')" style="cursor:pointer">
            <td>#${order.id}</td>
            <td class="fw-bold">User ID: ${order.userId}</td> 
            <td>${getStatusBadge(order.status)}</td> <!--Llama el estado y los colres de cada uno-->
            <td class="text-end fw-bold">$${Number(order.total).toFixed(2)}</td>
        </tr>
    `).join('');
}


//Funcion para ver las ordenes
function viewOrderDetails(id) {
    const order = allOrders.find(o => String(o.id) === String(id));
    const container = document.getElementById('order-details-card');
    container.style.display = 'block';

    container.innerHTML = `
        <div class="d-flex justify-content-between mb-3">
            <h5 class="mb-0">Order #${order.id}</h5>
            <span class="badge bg-primary">Active</span>
        </div>
        <p class="mb-1 fw-bold">User ID: ${order.userId}</p>
        <p class="small text-muted mb-4">Fecha: ${order.date}</p>

        <div class="border-top pt-3">
            ${order.products.map(p => `
                <div class="d-flex justify-content-between small mb-2">
                    <span>${p.nameProduct}</span>
                    <span>$${Number(p.price).toFixed(2)}</span>
                </div>
            `).join('')}
            <div class="d-flex justify-content-between fw-bold fs-5 mt-3">
                <span>Total</span>
                <span>$${Number(order.total).toFixed(2)}</span>
            </div>
        </div>

        <div class="mt-4 d-grid gap-2">
            <select id="status-select-${order.id}" class="form-select">
                <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                <option value="Canceled" ${order.status === 'Canceled' ? 'selected' : ''}>Canceled</option>
            </select>
            <button class="btn btn-success" onclick="updateOrderStatus('${order.id}')">Update Status</button>
        </div>
    `;
}



// -----------LOGICA

function btnLogOut(){
    const session = localStorage.removeItem('sessionUser');    
}


//Funcion para asignar colores de los badge
function getStatusBadge(status) {
    const colors = {
        'Pending': 'border-danger text-danger',
        'Preparing': 'border-warning text-warning',
        'Delivered': 'border-success text-success',
        'Canceled': 'border-secondary text-secondary'
    };
    return `<span class="badge border ${colors[status] || 'border-primary text-primary'} border-2">${status}</span>`;
}


// Inicializar
document.addEventListener('DOMContentLoaded', getAdminOrders);
