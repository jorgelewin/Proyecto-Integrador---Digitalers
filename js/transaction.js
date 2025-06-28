class Transaction {
    constructor(id, accountId, type, amount) {
        this.id = id;
        this.accountId = accountId;
        this.type = type;
        this.amount = amount;
        this.date = new Date().toISOString();
    }
    
    static getAllTransactions() {
        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        return transactions;
    }
    
    static getTransactionById(id) {
        const transactions = this.getAllTransactions();
        return transactions.find(t => t.id === id);
    }
    
    static getTransactionsByAccountId(accountId) {
        const transactions = this.getAllTransactions();
        return transactions.filter(t => t.accountId === accountId).sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    static getTransactionsByClientId(clientId) {
        const accounts = Account.getAccountsByClientId(clientId);
        const transactions = this.getAllTransactions();
        
        return transactions
            .filter(t => accounts.some(a => a.id === t.accountId))
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    static createTransaction(accountId, type, amount) {
        const transactions = this.getAllTransactions();
        const id = this.generateId();
        
        const newTransaction = new Transaction(id, accountId, type, amount);
        transactions.push(newTransaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        return newTransaction;
    }
    
    static deleteTransaction(id) {
        const transactions = this.getAllTransactions();
        const index = transactions.findIndex(t => t.id === id);
        
        if (index === -1) {
            throw new Error('Transacción no encontrada');
        }
        
        transactions.splice(index, 1);
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }
    
    static generateId() {
        return 'txn-' + Math.random().toString(36).substr(2, 9);
    }
}