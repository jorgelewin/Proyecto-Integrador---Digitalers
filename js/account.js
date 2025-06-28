class Account {
    constructor(id, clientId, code, balance = 0) {
        this.id = id;
        this.clientId = clientId;
        this.code = code;
        this.balance = balance;
        this.createdAt = new Date().toISOString();
    }
    
    static getAllAccounts() {
        const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
        return accounts;
    }
    
    static getAccountById(id) {
        const accounts = this.getAllAccounts();
        return accounts.find(a => a.id === id);
    }
    
    static getAccountsByClientId(clientId) {
        const accounts = this.getAllAccounts();
        return accounts.filter(a => a.clientId === clientId);
    }
    
    static createAccount(clientId, initialBalance = 0) {
        const accounts = this.getAllAccounts();
        const id = this.generateId();
        const code = this.generateAccountCode();
        
        const newAccount = new Account(id, clientId, code, initialBalance);
        accounts.push(newAccount);
        localStorage.setItem('accounts', JSON.stringify(accounts));
        return newAccount;
    }
    
    static deleteAccount(id) {
        const accounts = this.getAllAccounts();
        const index = accounts.findIndex(a => a.id === id);
        
        if (index === -1) {
            throw new Error('Cuenta no encontrada');
        }
        
        // Eliminar todas las transacciones asociadas a esta cuenta
        const transactions = Transaction.getAllTransactions();
        const accountTransactions = transactions.filter(t => t.accountId === id);
        accountTransactions.forEach(t => Transaction.deleteTransaction(t.id));
        
        accounts.splice(index, 1);
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }
    
    static deposit(accountId, amount) {
        if (amount <= 0) {
            throw new Error('El monto debe ser positivo');
        }
        
        const accounts = this.getAllAccounts();
        const index = accounts.findIndex(a => a.id === accountId);
        
        if (index === -1) {
            throw new Error('Cuenta no encontrada');
        }
        
        accounts[index].balance += amount;
        localStorage.setItem('accounts', JSON.stringify(accounts));
        
        // Registrar la transacción
        Transaction.createTransaction(accountId, 'deposit', amount);
        
        return accounts[index];
    }
    
    static withdraw(accountId, amount) {
        if (amount <= 0) {
            throw new Error('El monto debe ser positivo');
        }
        
        const accounts = this.getAllAccounts();
        const index = accounts.findIndex(a => a.id === accountId);
        
        if (index === -1) {
            throw new Error('Cuenta no encontrada');
        }
        
        if (accounts[index].balance < amount) {
            throw new Error('Saldo insuficiente');
        }
        
        accounts[index].balance -= amount;
        localStorage.setItem('accounts', JSON.stringify(accounts));
        
        // Registrar la transacción
        Transaction.createTransaction(accountId, 'withdrawal', amount);
        
        return accounts[index];
    }
    
    static generateId() {
        return 'acc-' + Math.random().toString(36).substr(2, 9);
    }
    
    static generateAccountCode() {
        return 'CTA-' + Math.floor(100000 + Math.random() * 900000);
    }
}