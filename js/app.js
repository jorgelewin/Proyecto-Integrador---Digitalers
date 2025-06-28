document.addEventListener('DOMContentLoaded', () => {
    // Inicializar datos de prueba si no existen
    initializeSampleData();
    
    // Manejar pantallas
    const loginScreen = document.getElementById('login-screen');
    const registerScreen = document.getElementById('register-screen');
    const mainScreen = document.getElementById('main-screen');
    
    // Mostrar pantalla de login por defecto
    loginScreen.classList.remove('hidden');
    registerScreen.classList.add('hidden');
    mainScreen.classList.add('hidden');
    
    // Manejar botones de cambio de pantalla
    document.getElementById('show-register').addEventListener('click', () => {
        loginScreen.classList.add('hidden');
        registerScreen.classList.remove('hidden');
    });
    
    document.getElementById('show-login').addEventListener('click', () => {
        registerScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
    });
    
    // Manejar formulario de login
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            if (Auth.login(email, password)) {
                loginScreen.classList.add('hidden');
                mainScreen.classList.remove('hidden');
                loadClientData();
            } else {
                alert('Credenciales incorrectas');
            }
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Manejar formulario de registro
    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const lastName = document.getElementById('reg-lastname').value;
        const dni = document.getElementById('reg-dni').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        
        try {
            Client.createClient(name, lastName, dni, email, password);
            alert('Registro exitoso. Por favor inicie sesión.');
            registerScreen.classList.add('hidden');
            loginScreen.classList.remove('hidden');
            
            // Limpiar formulario
            document.getElementById('register-form').reset();
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Manejar cierre de sesión
    document.getElementById('logout-btn').addEventListener('click', () => {
        Auth.logout();
        mainScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
        
        // Limpiar formulario de login
        document.getElementById('login-form').reset();
    });
    
    // Manejar pestañas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase active de todos los botones y paneles
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            
            // Agregar clase active al botón y panel seleccionado
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
            
            // Cargar datos según la pestaña
            if (tabId === 'accounts-tab') {
                loadAccounts();
            } else if (tabId === 'transactions-tab') {
                loadTransactions();
            } else if (tabId === 'profile-tab') {
                loadProfile();
            } else if (tabId === 'admin-tab') {
                loadAdminPanel();
            }
        });
    });
    
    // Mostrar/ocultar pestaña de admin según privilegios
    if (Auth.isAdmin()) {
        document.getElementById('admin-tab').classList.remove('hidden');
    } else {
        document.getElementById('admin-tab').classList.add('hidden');
    }
    
    // Cargar datos del cliente al iniciar
    function loadClientData() {
        const client = Auth.getCurrentClient();
        if (client) {
            document.getElementById('client-name').textContent = `${client.name} ${client.lastName}`;
            loadAccounts();
        }
    }
    
    // Cargar cuentas del cliente
    function loadAccounts() {
        const client = Auth.getCurrentClient();
        if (!client) return;
        
        const accounts = Account.getAccountsByClientId(client.id);
        const accountsList = document.getElementById('accounts-list');
        accountsList.innerHTML = '';
        
        if (accounts.length === 0) {
            accountsList.innerHTML = '<p>No tienes cuentas registradas.</p>';
            return;
        }
        
        accounts.forEach(account => {
            const accountCard = document.createElement('div');
            accountCard.className = 'account-card';
            accountCard.dataset.accountId = account.id;
            accountCard.innerHTML = `
                <h3>Cuenta: ${account.code}</h3>
                <p>Saldo: $${account.balance.toFixed(2)}</p>
                <p>Creada el: ${new Date(account.createdAt).toLocaleDateString()}</p>
                <button class="select-account-btn" data-account-id="${account.id}">Seleccionar</button>
            `;
            accountsList.appendChild(accountCard);
        });
        
        // Manejar selección de cuenta
        document.querySelectorAll('.select-account-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const accountId = e.target.getAttribute('data-account-id');
                document.getElementById('account-operations').classList.remove('hidden');
                document.getElementById('selected-account').value = accountId;
                document.getElementById('operation-form').classList.add('hidden');
            });
        });
    }
    
    // Manejar creación de nueva cuenta
    document.getElementById('create-account-btn').addEventListener('click', () => {
        const client = Auth.getCurrentClient();
        if (!client) return;
        
        try {
            Account.createAccount(client.id);
            loadAccounts();
            alert('Cuenta creada exitosamente');
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Manejar botones de operaciones
    document.getElementById('deposit-btn').addEventListener('click', () => {
        document.getElementById('operation-form').classList.remove('hidden');
        document.getElementById('transaction-form').dataset.operation = 'deposit';
    });
    
    document.getElementById('withdraw-btn').addEventListener('click', () => {
        document.getElementById('operation-form').classList.remove('hidden');
        document.getElementById('transaction-form').dataset.operation = 'withdraw';
    });
    
    document.getElementById('check-balance-btn').addEventListener('click', () => {
        const accountId = document.getElementById('selected-account').value;
        const account = Account.getAccountById(accountId);
        alert(`Saldo actual: $${account.balance.toFixed(2)}`);
    });
    
    // Manejar formulario de transacción
    document.getElementById('transaction-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const accountId = document.getElementById('selected-account').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const operation = e.target.dataset.operation;
        
        try {
            if (operation === 'deposit') {
                Account.deposit(accountId, amount);
                alert(`Depósito de $${amount.toFixed(2)} realizado exitosamente`);
            } else if (operation === 'withdraw') {
                Account.withdraw(accountId, amount);
                alert(`Retiro de $${amount.toFixed(2)} realizado exitosamente`);
            }
            
            // Actualizar lista de cuentas y transacciones
            loadAccounts();
            loadTransactions();
            
            // Limpiar formulario
            e.target.reset();
            document.getElementById('operation-form').classList.add('hidden');
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Manejar cancelación de operación
    document.getElementById('cancel-transaction').addEventListener('click', () => {
        document.getElementById('transaction-form').reset();
        document.getElementById('operation-form').classList.add('hidden');
    });
    
    // Cargar transacciones del cliente
    function loadTransactions() {
        const client = Auth.getCurrentClient();
        if (!client) return;
        
        const transactions = Transaction.getTransactionsByClientId(client.id);
        const transactionsList = document.getElementById('transactions-list');
        transactionsList.innerHTML = '';
        
        if (transactions.length === 0) {
            transactionsList.innerHTML = '<p>No hay movimientos registrados.</p>';
            return;
        }
        
        transactions.forEach(transaction => {
            const account = Account.getAccountById(transaction.accountId);
            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            transactionItem.innerHTML = `
                <h3>${transaction.type === 'deposit' ? 'Depósito' : 'Retiro'} - Cuenta: ${account.code}</h3>
                <p>Monto: $${transaction.amount.toFixed(2)}</p>
                <p>Fecha: ${new Date(transaction.date).toLocaleString()}</p>
            `;
            transactionsList.appendChild(transactionItem);
        });
    }
    
    // Cargar perfil del cliente
    function loadProfile() {
        const client = Auth.getCurrentClient();
        if (!client) return;
        
        const clientInfo = document.getElementById('client-info');
        clientInfo.innerHTML = `
            <p><strong>Nombre:</strong> ${client.name} ${client.lastName}</p>
            <p><strong>DNI:</strong> ${client.dni}</p>
            <p><strong>Correo electrónico:</strong> ${client.email}</p>
        `;
        
        document.getElementById('edit-profile-form').classList.add('hidden');
    }
    
    // Manejar edición de perfil
    document.getElementById('edit-profile-btn').addEventListener('click', () => {
        const client = Auth.getCurrentClient();
        if (!client) return;
        
        document.getElementById('edit-name').value = client.name;
        document.getElementById('edit-lastname').value = client.lastName;
        document.getElementById('edit-dni').value = client.dni;
        document.getElementById('edit-email').value = client.email;
        
        document.getElementById('client-info').classList.add('hidden');
        document.getElementById('edit-profile-form').classList.remove('hidden');
    });
    
    // Manejar cancelación de edición de perfil
    document.getElementById('cancel-edit-profile').addEventListener('click', () => {
        document.getElementById('client-info').classList.remove('hidden');
        document.getElementById('edit-profile-form').classList.add('hidden');
    });
    
    // Manejar actualización de perfil
    document.getElementById('update-client-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const client = Auth.getCurrentClient();
        if (!client) return;
        
        const name = document.getElementById('edit-name').value;
        const lastName = document.getElementById('edit-lastname').value;
        const dni = document.getElementById('edit-dni').value;
        const email = document.getElementById('edit-email').value;
        const password = document.getElementById('edit-password').value;
        
        try {
            if (password) {
                Client.updateClient(client.id, name, lastName, dni, email, password);
            } else {
                Client.updateClient(client.id, name, lastName, dni, email);
            }
            
            alert('Perfil actualizado exitosamente');
            loadProfile();
            loadClientData(); // Actualizar nombre en el header
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Manejar eliminación de perfil
    document.getElementById('delete-profile-btn').addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
            const client = Auth.getCurrentClient();
            if (!client) return;
            
            try {
                Client.deleteClient(client.id);
                alert('Tu cuenta ha sido eliminada');
                mainScreen.classList.add('hidden');
                loginScreen.classList.remove('hidden');
            } catch (error) {
                alert(error.message);
            }
        }
    });
    
    // Cargar panel de administración
    function loadAdminPanel() {
        if (!Auth.isAdmin()) return;
        
        document.getElementById('view-all-clients-btn').addEventListener('click', () => {
            const clients = Client.getAllClients();
            const resultsDiv = document.getElementById('admin-results');
            resultsDiv.innerHTML = '<h3>Todos los clientes</h3>';
            
            if (clients.length === 0) {
                resultsDiv.innerHTML += '<p>No hay clientes registrados.</p>';
                return;
            }
            
            clients.forEach(client => {
                const clientItem = document.createElement('div');
                clientItem.className = 'client-item';
                clientItem.innerHTML = `
                    <h3>${client.name} ${client.lastName}</h3>
                    <p><strong>DNI:</strong> ${client.dni}</p>
                    <p><strong>Email:</strong> ${client.email}</p>
                    <p><strong>ID:</strong> ${client.id}</p>
                `;
                resultsDiv.appendChild(clientItem);
            });
        });
        
        document.getElementById('view-all-accounts-btn').addEventListener('click', () => {
            const accounts = Account.getAllAccounts();
            const resultsDiv = document.getElementById('admin-results');
            resultsDiv.innerHTML = '<h3>Todas las cuentas</h3>';
            
            if (accounts.length === 0) {
                resultsDiv.innerHTML += '<p>No hay cuentas registradas.</p>';
                return;
            }
            
            accounts.forEach(account => {
                const client = Client.getClientById(account.clientId);
                const accountItem = document.createElement('div');
                accountItem.className = 'account-card';
                accountItem.innerHTML = `
                    <h3>Cuenta: ${account.code}</h3>
                    <p><strong>Cliente:</strong> ${client ? `${client.name} ${client.lastName}` : 'Desconocido'}</p>
                    <p><strong>Saldo:</strong> $${account.balance.toFixed(2)}</p>
                    <p><strong>Creada el:</strong> ${new Date(account.createdAt).toLocaleDateString()}</p>
                `;
                resultsDiv.appendChild(accountItem);
            });
        });
        
        document.getElementById('view-all-transactions-btn').addEventListener('click', () => {
            const transactions = Transaction.getAllTransactions();
            const resultsDiv = document.getElementById('admin-results');
            resultsDiv.innerHTML = '<h3>Todas las transacciones</h3>';
            
            if (transactions.length === 0) {
                resultsDiv.innerHTML += '<p>No hay transacciones registradas.</p>';
                return;
            }
            
            transactions.forEach(transaction => {
                const account = Account.getAccountById(transaction.accountId);
                const client = account ? Client.getClientById(account.clientId) : null;
                const transactionItem = document.createElement('div');
                transactionItem.className = 'transaction-item';
                transactionItem.innerHTML = `
                    <h3>${transaction.type === 'deposit' ? 'Depósito' : 'Retiro'}</h3>
                    <p><strong>Cuenta:</strong> ${account ? account.code : 'Desconocida'}</p>
                    <p><strong>Cliente:</strong> ${client ? `${client.name} ${client.lastName}` : 'Desconocido'}</p>
                    <p><strong>Monto:</strong> $${transaction.amount.toFixed(2)}</p>
                    <p><strong>Fecha:</strong> ${new Date(transaction.date).toLocaleString()}</p>
                `;
                resultsDiv.appendChild(transactionItem);
            });
        });
    }
    
    // Inicializar datos de prueba
    function initializeSampleData() {
        if (!localStorage.getItem('clients')) {
            // Crear admin
            Client.createClient('Admin', 'FinTech', '00000000', 'admin@fintech.com', 'admin123');
            
            // Crear cliente de prueba
            Client.createClient('Juan', 'Pérez', '12345678', 'juan@example.com', 'password123');
            
            // Crear cuentas de prueba
            const client = Client.getAllClients().find(c => c.email === 'juan@example.com');
            Account.createAccount(client.id, 1000);
            
            // Crear transacciones de prueba
            const account = Account.getAllAccounts()[0];
            Account.deposit(account.id, 500);
            Account.withdraw(account.id, 200);
        }
    }
});