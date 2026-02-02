function verifyAccess(requiredRol){
    const session = localStorage.getItem('sessionUser');

    if (!session) {
        alert('Debe iniciar sesion primero');
        window.location.href = '../login/login.html';
        return;
    }

    const user = JSON.parse(session);

    if (user.rol !== requiredRol) {
        alert('Sus credenciales no estan permitidas en esta pagina');
        window.location.href = '../login/login.html';
        return;
    }
}