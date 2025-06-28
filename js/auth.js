class Auth {
    static login(email, password) {
        const clients = Client.getAllClients();
        const client = clients.find(c => c.email === email && c.password === password);
        
        if (client) {
            localStorage.setItem('currentClient', JSON.stringify(client));
            return true;
        }
        return false;
    }
    
    static logout() {
        localStorage.removeItem('currentClient');
    }
    
    static getCurrentClient() {
        return JSON.parse(localStorage.getItem('currentClient'));
    }
    
    static isAdmin() {
        const client = this.getCurrentClient();
        return client && client.email === 'admin@fintech.com';
    }
}