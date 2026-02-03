// URL APIs
const URL_API_TASKS= 'http://localhost:3000/tasks'; 


async function getTasks() {
    const sessionData = JSON.parse(localStorage.getItem('sessionUser'));
    try {
        const res = await fetch(`${URL_API_TASKS}?idUser=${sessionData.id}`);
        const listTasks = await res.json();

        renderUserProfile(listTasks);

    } catch (error) {
        console.log('Error retrieving tasks in admin:', error);        
    }
}

function renderUserProfile(listTasks) {
    // Obtenemos el usuario de la sesión
    const sessionData = JSON.parse(localStorage.getItem('sessionUser'));

    if (!sessionData) return;

    //Elementos de html de pagina de info (locales porque solo se necesitan aqui)
    const nameUser = document.getElementById('user-name');
    const emailUser = document.getElementById('user-email');
    const rolUser = document.getElementById('user-rol');
    const countUser = document.getElementById('user-tasks-count');


    if (nameUser) nameUser.innerText = sessionData.name;
    if (emailUser) emailUser.innerText = sessionData.email;
    if (rolUser) rolUser.innerText = sessionData.rol;
    if (countUser) countUser.innerText = listTasks.length;
}



document.addEventListener('DOMContentLoaded', getTasks);

