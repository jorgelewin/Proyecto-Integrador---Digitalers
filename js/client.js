class Client {
    constructor(id, name, lastName, dni, email, password) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.dni = dni;
        this.email = email;
        this.password = password;
    }
    
    static getAllClients() {
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        return clients;
    }
    
    static getClientById(id) {
        const clients = this.getAllClients();
        return clients.find(c => c.id === id);
    }
    
    static createClient(name, lastName, dni, email, password) {
        const clients = this.getAllClients();
        
        // Verificar si el email ya existe
        if (clients.some(c => c.email === email)) {
            throw new Error('El correo electrónico ya está registrado');
        }
        
        // Verificar si el DNI ya existe
        if (clients.some(c => c.dni === dni)) {
            throw new Error('El DNI ya está registrado');
        }
        
        const id = this.generateId();
        const newClient = new Client(id, name, lastName, dni, email, password);
        clients.push(newClient);
        localStorage.setItem('clients', JSON.stringify(clients));
        return newClient;
    }
    
    static updateClient(id, name, lastName, dni, email, password = null) {
        const clients = this.getAllClients();
        const index = clients.findIndex(c => c.id === id);
        
        if (index === -1) {
            throw new Error('Cliente no encontrado');
        }
        
        // Verificar si el nuevo email ya existe (excluyendo al cliente actual)
        if (clients.some((c, i) => i !== index && c.email === email)) {
            throw new Error('El correo electrónico ya está registrado');
        }
        
        // Verificar si el nuevo DNI ya existe (excluyendo al cliente actual)
        if (clients.some((c, i) => i !== index && c.dni === dni)) {
            throw new Error('El DNI ya está registrado');
        }
        
        clients[index].name = name;
        clients[index].lastName = lastName;
        clients[index].dni = dni;
        clients[index].email = email;
        
        if (password) {
            clients[index].password = password;
        }
        
        localStorage.setItem('clients', JSON.stringify(clients));
        
        // Actualizar también el cliente en el localStorage si es el actual
        const currentClient = Auth.getCurrentClient();
        if (currentClient && currentClient.id === id) {
            localStorage.setItem('currentClient', JSON.stringify(clients[index]));
        }
        
        return clients[index];
    }
    
    static deleteClient(id) {
        const clients = this.getAllClients();
        const index = clients.findIndex(c => c.id === id);
        
        if (index === -1) {
            throw new Error('Cliente no encontrado');
        }
        
        // Eliminar todas las cuentas asociadas a este cliente
        const accounts = Account.getAllAccounts();
        const clientAccounts = accounts.filter(a => a.clientId === id);
        clientAccounts.forEach(a => Account.deleteAccount(a.id));
        
        clients.splice(index, 1);
        localStorage.setItem('clients', JSON.stringify(clients));
        
        // Cerrar sesión si el cliente eliminado es el actual
        const currentClient = Auth.getCurrentClient();
        if (currentClient && currentClient.id === id) {
            Auth.logout();
        }
    }
    
    static generateId() {
        return 'cli-' + Math.random().toString(36).substr(2, 9);
    }
}