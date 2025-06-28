// Datos del usuario (en una app real esto vendría de una API)
const userData = {
    username: getUsernameFromURL() || 'Usuario',
    accountNumber: '4567891012343456',
    balance: 12500.75,
    lastAccess: new Date(),
    transactions: [
        {
            id: 1,
            concept: 'Transferencia recibida',
            date: '2023-06-15T10:30:00',
            amount: 500.00,
            type: 'income'
        },
        {
            id: 2,
            concept: 'Pago de servicios',
            date: '2023-06-10T14:45:00',
            amount: -120.50,
            type: 'expense'
        },
        {
            id: 3,
            concept: 'Depósito bancario',
            date: '2023-06-05T09:15:00',
            amount: 1000.00,
            type: 'income'
        }
    ]
};

// Elementos del DOM
const userMenuBtn = document.getElementById('userMenuBtn');
const userDropdown = document.getElementById('userDropdown');
const usernameDisplay = document.getElementById('usernameDisplay');
const welcomeUsername = document.getElementById('welcomeUsername');
const lastAccess = document.getElementById('lastAccess');
const currentBalance = document.getElementById('currentBalance');
const accountNumber = document.getElementById('accountNumber');
const balanceToggle = document.getElementById('balanceToggle');
const transferBtn = document.getElementById('transferBtn');
const depositBtn = document.getElementById('depositBtn');
const movementsBtn = document.getElementById('movementsBtn');
const transactionsList = document.getElementById('transactionsList');
const currentYear = document.getElementById('currentYear');
const logoutLink = document.querySelector('.logout-link');

// Estado de la aplicación
let balanceVisible = true;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    setupEventListeners();
});

function initDashboard() {
    // Mostrar datos del usuario
    usernameDisplay.textContent = userData.username;
    welcomeUsername.textContent = userData.username;
    
    // Formatear y mostrar última fecha de acceso
    lastAccess.textContent = formatDate(userData.lastAccess);
    
    // Mostrar saldo y número de cuenta
    updateBalanceDisplay();
    accountNumber.textContent = `•••• •••• •••• ${userData.accountNumber.slice(-4)}`;
    
    // Mostrar año actual
    currentYear.textContent = new Date().getFullYear();
    
    // Mostrar transacciones
    renderTransactions();
}

function setupEventListeners() {
    // Menú de usuario
    userMenuBtn.addEventListener('click', toggleUserDropdown);
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('active');
            userMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Balance toggle
    balanceToggle.addEventListener('click', toggleBalanceVisibility);
    
    // Botones de acción
    transferBtn.addEventListener('click', () => navigateTo('transfer'));
    depositBtn.addEventListener('click', () => navigateTo('deposit'));
    movementsBtn.addEventListener('click', () => navigateTo('movements'));
    
    // Cerrar sesión
    logoutLink.addEventListener('click', handleLogout);
}

function toggleUserDropdown() {
    const isExpanded = userMenuBtn.getAttribute('aria-expanded') === 'true';
    userDropdown.classList.toggle('active', !isExpanded);
    userMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
}

function toggleBalanceVisibility() {
    balanceVisible = !balanceVisible;
    updateBalanceDisplay();
    
    // Cambiar ícono
    const eyeIcon = balanceToggle.querySelector('.eye-icon');
    eyeIcon.src = balanceVisible 
        ? '../assets/icons/eye-icon.svg' 
        : '../assets/icons/eye-off-icon.svg';
}

function updateBalanceDisplay() {
    currentBalance.textContent = balanceVisible 
        ? formatCurrency(userData.balance) 
        : '$ •••• ••••';
}

function renderTransactions() {
    if (userData.transactions.length === 0) {
        transactionsList.innerHTML = `
            <div class="empty-state">
                <img src="../assets/icons/empty-icon.svg" alt="">
                <p>No hay movimientos recientes</p>
            </div>
        `;
        return;
    }
    
    transactionsList.innerHTML = '';
    
    userData.transactions.forEach(transaction => {
        const transactionElement = document.createElement('div');
        transactionElement.className = 'transaction-item';
        
        transactionElement.innerHTML = `
            <div class="transaction-details">
                <span class="transaction-concept">${transaction.concept}</span>
                <span class="transaction-date">${formatDateTime(transaction.date)}</span>
            </div>
            <span class="transaction-amount ${transaction.type}">
                ${transaction.type === 'income' ? '+' : ''}${formatCurrency(transaction.amount)}
            </span>
        `;
        
        transactionsList.appendChild(transactionElement);
    });
}

function navigateTo(section) {
    // En una app real, esto redirigiría a la sección correspondiente
    console.log(`Navegando a: ${section}`);
    alert(`Redirigiendo a la sección de ${section}`);
}

function handleLogout(e) {
    e.preventDefault();
    // En una app real, aquí se limpiaría el token de autenticación, etc.
    console.log('Usuario cerró sesión');
    window.location.href = '../index.html';
}

// Funciones de utilidad
function getUsernameFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('username');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'USD'
    }).format(Math.abs(amount));
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}