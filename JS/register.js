//Variables
const nameText = document.getElementById('name-text');
const emailText = document.getElementById('email-text');
const passwordText = document.getElementById('password-text');
const password2Text = document.getElementById('password2-text');

const getValues = () => ({
  name: nameText.value.trim(),
  email: emailText.value.trim(),
  password: passwordText.value,
  password2: password2Text.value
});

// URL APIs
const URL_API_USERS = 'http://localhost:3000/users';



//Funcion para buscar si el email esta para no repetirlo
async function searchData(email) {
  try {  
    const res = await fetch(`${URL_API_USERS}?email=${email}`);
    const dato = await res.json();    
    
    if (dato.length > 0) {
        return dato[0];        
    }
    return null;

  }
  catch (error) {
    console.log('Hubo un problema: ' + error);  
    return null;  
  }
}

async function createUser(name, email, password) {
  try {
    const res = await fetch(`${URL_API_USERS}`,{ 
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json' 
      }, 
      body: JSON.stringify({ 
          name: name,
          email: email,
          password: password,
          rol: "user"
       }) 
    });

    if (!res.ok) throw new Error("Error en el POST:");

    const data = await res.json();
    alert('Usuario creado con éxito, ahora puede entrar a la pagina con sus credenciales');
    console.log("Usuario creado con éxito:", data);
  }
  catch (error) {
    console.error(error.message);
  }
}



// ---------------Funciones de control de estado

//Funcion para limpiar los campos de registrar
function cleanRegister() {
    nameText.value = '';
    emailText.value = '';
    passwordText.value = '';
    password2Text.value = '';
}



// REGISTRO
async function btnRegistrer(){
    const values = getValues();
    const emailUser = await searchData(values.email);

    if (values.password !== values.password2) {
        alert("Las contraseñas no coinciden");
        cleanRegister();
        return;
    }

    if (emailUser) {
        alert('El email ya esta registrado, ingrese uno diferente');
        cleanRegister();
    } else {
        createUser(values.name, values.email, values.password);
        window.location.href = './login.html';
    }
}



