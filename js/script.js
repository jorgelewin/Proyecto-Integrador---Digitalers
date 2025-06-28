document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    const loginButton = document.getElementById('loginButton');
    const buttonText = document.getElementById('buttonText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Cargar credenciales guardadas si existe la opción "Recordar usuario"
    loadSavedCredentials();
    
    // Event listeners
    loginForm.addEventListener('submit', handleLogin);
    usernameInput.addEventListener('input', clearError);
    passwordInput.addEventListener('input', clearError);
    
    // Funciones
    function handleLogin(e) {
        e.preventDefault();
        
        // Validar campos
        const isUsernameValid = validateUsername();
        const isPasswordValid = validatePassword();
        
        if (isUsernameValid && isPasswordValid) {
            // Simular envío de datos al servidor
            simulateLogin();
        }
    }
    
    function validateUsername() {
        const username = usernameInput.value.trim();
        const errorElement = document.getElementById('usernameError');
        
        if (!username) {
            showError(errorElement, 'El campo usuario es requerido');
            return false;
        }
        
        if (username.length < 4) {
            showError(errorElement, 'El usuario debe tener al menos 4 caracteres');
            return false;
        }
        
        return true;
    }
    
    function validatePassword() {
        const password = passwordInput.value;
        const errorElement = document.getElementById('passwordError');
        
        if (!password) {
            showError(errorElement, 'El campo contraseña es requerido');
            return false;
        }
        
        if (password.length < 8) {
            showError(errorElement, 'La contraseña debe tener al menos 8 caracteres');
            return false;
        }
        
        return true;
    }
    
    function showError(element, message) {
        element.textContent = message;
    }
    
    function clearError(e) {
        const field = e.target;
        const errorElement = document.getElementById(`${field.id}Error`);
        errorElement.textContent = '';
    }
    
    function simulateLogin() {
        // Mostrar estado de carga
        buttonText.textContent = 'Autenticando...';
        loginButton.disabled = true;
        loadingSpinner.style.display = 'block';
        
        // Simular llamada a API (en un caso real sería una petición fetch)
        setTimeout(() => {
            // Aquí iría la lógica real de autenticación
            // Por ahora simulamos una respuesta exitosa después de 1.5 segundos
            
            // Guardar credenciales si está marcado "Recordar usuario"
            if (rememberCheckbox.checked) {
                localStorage.setItem('rememberedUsername', usernameInput.value.trim());
            } else {
                localStorage.removeItem('rememberedUsername');
            }
            
            // Simular redirección después de login exitoso
            loginSuccess();
            
            // Restaurar estado del botón (en caso de que el login falle)
            // buttonText.textContent = 'Iniciar Sesión';
            // loginButton.disabled = false;
            // loadingSpinner.style.display = 'none';
        }, 1500);
    }
    
    function loginSuccess() {
        // En una aplicación real, redirigiríamos al dashboard
        alert('¡Login exitoso! Redirigiendo al dashboard...');
        console.log('Credenciales enviadas:', {
            username: usernameInput.value.trim(),
            password: passwordInput.value // En realidad nunca deberías loguear contraseñas
        });
        
        // Aquí iría: window.location.href = '/dashboard';
    }
    
    function loadSavedCredentials() {
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        if (rememberedUsername) {
            usernameInput.value = rememberedUsername;
            rememberCheckbox.checked = true;
            passwordInput.focus();
        } else {
            usernameInput.focus();
        }
    }
    
    // Mejora de accesibilidad: manejar tecla Enter para enviar el formulario
    loginForm.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            if (!loginForm.checkValidity()) {
                e.preventDefault();
                handleLogin(e);
            }
        }
    });
});