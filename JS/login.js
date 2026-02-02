//Variables

const nameText = document.getElementById('name-text');
const emailText = document.getElementById('email-text');
const passwordText = document.getElementById('password-text');
const rolText = document.getElementById('rol-text');

// URL APIs
const URL_API_USERS = 'http://localhost:3000/users';


//Traer usuarios registrados 
async function getUser(URL) {
    try {
        const res = await fetch(URL);
        return await res.json();
    } catch (error) {
        console.error("Error en la petición:", error);
    }
}


// Funciones de control de estado

//Funcion para limpiar los campos de login
function cleanLogin() {
  nameText.value = '';
  emailText.value = '';
  passwordText.value = '';
}


// LOGIN
async function btnLogin(){
  
  const query = `${URL_API_USERS}?email=${encodeURIComponent(emailText.value)}&password=${encodeURIComponent(passwordText.value)}&rol=${encodeURIComponent(rolText.value)}`;

  const users = await getUser(query);
  
  if (users.length === 0) {
    Swal.fire({
        title: 'Campos incorrectos',
        text: 'Ingrese los campos correctos y verifique el rol',
        icon: 'error',
        timer: 1500, 
        showConfirmButton: false
    });
    return;
  }

  localStorage.setItem('sessionUser', JSON.stringify(users[0])); //convierte a objeto

  Swal.fire({
      title: 'Binevenido',
      text: 'Iniciando sesión...',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
  });

  if (users[0].rol === 'admin') {
      window.location.href = '../admin/indexAdmin.html';
  } else {
      window.location.href = '../user/indexUser.html';
  }
}




