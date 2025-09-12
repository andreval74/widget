/**
 * ================================================================================
 * DASHBOARD-COMPLEX.JS - Dashboard Avançado
 * ================================================================================
 * Controlador principal do dashboard complexo com múltiplas funcionalidades
 * ================================================================================
 */

class Dashboard {
    constructor() {
        this.dataManager = new DataManager();
        this.authManager = new AuthManager(this.dataManager);
        this.currentSection = 'overview';
        this.charts = {};
        
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Iniciando Dashboard...');
            
            // Configurar event listeners
            this.setupEventListeners();
            
            // Verificar se usuário está conectado (com delay para permitir carregamento)
            setTimeout(async () => {
                const isConnected = await this.checkConnection();
                if (!isConnected) {
                    console.log('❌ Usuário não conectado, redirecionando...');
                    window.location.href = 'index.html';
                    return;
                }
                
                // Carregar dados do usuário
                await this.loadUserData();
                
                // Inicializar gráficos
                this.initCharts();
                
                console.log('✅ Dashboard inicializado');
            }, 1000); // 1 segundo de delay
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Dashboard:', error);
            this.showError('Erro ao carregar dashboard');
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(link.dataset.section);
            });
        });

        // Disconnect button
        document.getElementById('disconnect-btn')?.addEventListener('click', () => {
            this.authManager.disconnect();
            window.location.href = 'index.html';
        });

        // Credit packages
        document.querySelectorAll('.credit-package').forEach(card => {
            card.addEventListener('click', () => this.selectCreditPackage(card));
        });

        // Forms
        document.getElementById('profile-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });

        // Auth events
        this.authManager.addEventListener('accountChanged', () => {
            this.updateConnectionStatus();
            this.loadUserData();
        });

        this.authManager.addEventListener('disconnected', () => {
            window.location.href = 'index.html';
        });
    }

    async checkConnection() {
        try {
            // Verificar se MetaMask está disponível
            if (typeof window.ethereum === 'undefined') {
                console.log('❌ MetaMask não detectado');
                return false;
            }

            // Verificar se há contas conectadas
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length === 0) {
                console.log('❌ Nenhuma conta conectada');
                return false;
            }

            // Atualizar estado do AuthManager
            this.authManager.currentAccount = accounts[0];
            this.authManager.isAuthenticated = true;
            
            console.log('✅ Conexão verificada:', accounts[0]);
            return true;
        } catch (error) {
            console.error('❌ Erro ao verificar conexão:', error);
            return false;
        }
    }

    showSection(sectionName) {
        // Ocultar todas as seções
        document.querySelectorAll('.section-content').forEach(section => {
            section.style.display = 'none';
        });

        // Mostrar seção selecionada
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.style.display = 'block';
        }

        // Atualizar navegação
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        this.currentSection = sectionName;

        // Carregar dados específicos da seção
        this.loadSectionData(sectionName);
    }

    async loadSectionData(sectionName) {
        switch (sectionName) {
            case 'widgets':
                await this.loadWidgets();
                break;
            case 'credits':
                await this.loadCreditsHistory();
                break;
            case 'transactions':
                await this.loadTransactions();
                break;
            case 'analytics':
                await this.loadAnalytics();
                break;
            case 'settings':
                await this.loadSettings();
                break;
        }
    }

    async loadUserData() {
        try {
            const account = this.authManager.getCurrentAccount();
            const userData = await this.dataManager.getUser(account);

            if (userData) {
                // Atualizar estatísticas
                this.updateStats(userData);
                
                // Atualizar status de conexão
                this.updateConnectionStatus();
                
                // Carregar atividade recente
                await this.loadRecentActivity();
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
        }
    }

    updateStats(userData) {
        const credits = userData.credits || 0;
        const widgets = userData.widgets?.length || 0;
        const transactions = userData.transactions?.length || 0;
        const volume = userData.transactions?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;

        document.getElementById('user-credits').textContent = credits;
        document.getElementById('user-widgets').textContent = widgets;
        document.getElementById('user-transactions').textContent = transactions;
        document.getElementById('user-volume').textContent = `$${volume.toFixed(2)}`;
        document.getElementById('credits-balance').textContent = credits;
    }

    updateConnectionStatus() {
        const statusDiv = document.getElementById('connection-status');
        
        if (this.authManager.isConnected()) {
            const account = this.authManager.getCurrentAccount();
            const shortAccount = `${account.substring(0, 6)}...${account.substring(38)}`;
            
            statusDiv.className = 'connection-status connected';
            statusDiv.innerHTML = `<i class="fas fa-check-circle me-1"></i>${shortAccount}`;
        } else {
            statusDiv.className = 'connection-status disconnected';
            statusDiv.innerHTML = '<i class="fas fa-times-circle me-1"></i>Desconectado';
        }
    }

    async loadRecentActivity() {
        const account = this.authManager.getCurrentAccount();
        const activities = await this.dataManager.getUserTransactions(account, 10);
        
        const tbody = document.querySelector('#recent-activity-table tbody');
        if (!tbody) return;

        if (activities.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted">
                        Nenhuma atividade recente
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = activities.map(activity => `
            <tr>
                <td>${new Date(activity.timestamp).toLocaleString('pt-BR')}</td>
                <td><span class="badge bg-primary">${activity.type}</span></td>
                <td>${activity.description}</td>
                <td><span class="badge bg-${this.getStatusColor(activity.status)}">${activity.status}</span></td>
                <td>${activity.value || '-'}</td>
            </tr>
        `).join('');
    }

    async loadWidgets() {
        const account = this.authManager.getCurrentAccount();
        const userData = await this.dataManager.getUser(account);
        const widgets = userData?.widgets || [];

        const container = document.getElementById('widgets-container');
        if (!container) return;

        if (widgets.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="card text-center">
                        <div class="card-body py-5">
                            <h5>Nenhum widget criado ainda</h5>
                            <p class="text-muted">Crie seu primeiro widget para começar a vender tokens</p>
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newWidgetModal">
                                Criar Primeiro Widget
                            </button>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = widgets.map(widget => `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">${widget.name}</h6>
                        <span class="badge bg-${widget.active ? 'success' : 'secondary'}">
                            ${widget.active ? 'Ativo' : 'Inativo'}
                        </span>
                    </div>
                    <div class="card-body">
                        <p class="text-muted small mb-2">${widget.description || 'Sem descrição'}</p>
                        <div class="row text-center">
                            <div class="col-6">
                                <small class="text-muted">Preço</small>
                                <div class="fw-bold">$${widget.price}</div>
                            </div>
                            <div class="col-6">
                                <small class="text-muted">Vendas</small>
                                <div class="fw-bold">${widget.sales || 0}</div>
                            </div>
                        </div>
                        <div class="mt-3 d-flex gap-2">
                            <button class="btn btn-sm btn-primary flex-fill" onclick="dashboard.viewWidget('${widget.id}')">
                                Ver Código
                            </button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="dashboard.editWidget('${widget.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="dashboard.deleteWidget('${widget.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async loadCreditsHistory() {
        const account = this.authManager.getCurrentAccount();
        const history = await this.dataManager.getUserTransactions(account);
        
        const tbody = document.querySelector('#credits-history-table tbody');
        if (!tbody) return;

        if (history.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted">
                        Nenhuma transação de créditos
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = history.map(record => `
            <tr>
                <td>${new Date(record.timestamp).toLocaleDateString('pt-BR')}</td>
                <td><span class="badge bg-${record.type === 'purchase' ? 'success' : 'warning'}">${record.type === 'purchase' ? 'Compra' : 'Uso'}</span></td>
                <td>${record.amount > 0 ? '+' : ''}${record.amount}</td>
                <td>${record.cost ? `$${record.cost}` : '-'}</td>
                <td><span class="badge bg-${this.getStatusColor(record.status)}">${record.status}</span></td>
            </tr>
        `).join('');
    }

    async loadTransactions() {
        const account = this.authManager.getCurrentAccount();
        const transactions = await this.dataManager.getUserTransactions(account);
        
        const tbody = document.querySelector('#transactions-table tbody');
        if (!tbody) return;

        if (transactions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted">
                        Nenhuma transação encontrada
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = transactions.map(tx => `
            <tr>
                <td>${new Date(tx.timestamp).toLocaleString('pt-BR')}</td>
                <td>${tx.widgetName || 'Widget'}</td>
                <td>${tx.buyer ? `${tx.buyer.substring(0, 6)}...${tx.buyer.substring(38)}` : '-'}</td>
                <td>${tx.quantity || 0} tokens</td>
                <td>$${tx.amount || 0}</td>
                <td><span class="badge bg-${this.getStatusColor(tx.status)}">${tx.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="dashboard.viewTransaction('${tx.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    async loadAnalytics() {
        // Implementar analytics detalhadas
        console.log('Carregando analytics...');
    }

    async loadSettings() {
        const account = this.authManager.getCurrentAccount();
        const userData = await this.dataManager.getUser(account);

        document.getElementById('wallet-address').value = account;
        document.getElementById('display-name').value = userData?.profile?.displayName || '';
        document.getElementById('user-email').value = userData?.profile?.email || '';
        document.getElementById('api-key').value = userData?.apiKey || '';
    }

    selectCreditPackage(card) {
        // Remover seleção anterior
        document.querySelectorAll('.credit-package').forEach(c => {
            c.classList.remove('border-primary', 'bg-light');
        });

        // Selecionar novo
        card.classList.add('border-primary', 'bg-light');

        const credits = card.dataset.credits;
        const price = card.dataset.price;

        document.getElementById('selected-credits').textContent = credits;
        document.getElementById('selected-price').textContent = price;
        document.getElementById('purchase-details').style.display = 'block';
        document.getElementById('confirm-purchase').disabled = false;

        // Armazenar seleção
        this.selectedCredits = {credits, price};
    }

    async createWidget() {
        try {
            const formData = {
                name: document.getElementById('widget-name').value,
                tokenAddress: document.getElementById('token-address').value,
                price: parseFloat(document.getElementById('token-price').value),
                network: document.getElementById('blockchain-network').value,
                minPurchase: parseFloat(document.getElementById('min-purchase').value),
                maxPurchase: parseFloat(document.getElementById('max-purchase').value),
                theme: document.getElementById('widget-theme').value,
                description: document.getElementById('widget-description').value
            };

            // Validações
            if (!formData.name || !formData.tokenAddress || !formData.price || !formData.network) {
                this.showError('Preencha todos os campos obrigatórios');
                return;
            }

            const account = this.authManager.getCurrentAccount();
            // TODO: Implementar createWidget no DataManager
            const result = { success: true, message: 'Widget simulado criado' };

            if (result.success) {
                bootstrap.Modal.getInstance(document.getElementById('newWidgetModal')).hide();
                this.showSuccess('Widget criado com sucesso!');
                this.loadUserData();
                
                // Se estiver na seção de widgets, recarregar
                if (this.currentSection === 'widgets') {
                    this.loadWidgets();
                }
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    async purchaseCredits() {
        try {
            if (!this.selectedCredits) {
                this.showError('Selecione um pacote de créditos');
                return;
            }

            const account = this.authManager.getCurrentAccount();
            const result = await this.dataManager.addCredits(account, this.selectedCredits, 'Compra de créditos');

            if (result.success) {
                bootstrap.Modal.getInstance(document.getElementById('buyCreditsModal')).hide();
                this.showSuccess('Créditos comprados com sucesso!');
                this.loadUserData();
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    initCharts() {
        // Chart de hoje
        const todayCtx = document.getElementById('todayChart');
        if (todayCtx) {
            this.charts.today = new Chart(todayCtx, {
                type: 'line',
                data: {
                    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                    datasets: [{
                        label: 'Vendas',
                        data: [0, 2, 5, 3, 8, 12],
                        borderColor: '#007bff',
                        backgroundColor: 'rgba(0,123,255,0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    getStatusColor(status) {
        const colors = {
            'completed': 'success',
            'pending': 'warning',
            'failed': 'danger',
            'active': 'success',
            'inactive': 'secondary'
        };
        return colors[status] || 'secondary';
    }

    showSuccess(message) {
        this.showToast(message, 'success');
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'success' ? 'success' : 'danger'} position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        toast.innerHTML = `
            ${message}
            <button type="button" class="btn-close float-end" onclick="this.parentElement.remove()"></button>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }
}

// Funções globais
function showSection(sectionName) {
    if (window.dashboard) {
        window.dashboard.showSection(sectionName);
    }
}

function createWidget() {
    dashboard.createWidget();
}

function purchaseCredits() {
    dashboard.purchaseCredits();
}

function toggleApiKey() {
    const input = document.getElementById('api-key');
    const icon = document.getElementById('api-key-icon');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Inicializar dashboard
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});
