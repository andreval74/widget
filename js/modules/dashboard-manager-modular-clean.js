// Dashboard Manager Modular - Sistema otimizado de carregamento de seções
class DashboardManagerModular {
    constructor() {
        this.templateLoader = new TemplateLoader();
        this.currentSection = 'overview';
        this.currentWallet = null;
        this.isAdmin = false;
        this.adminAddresses = [
            '0x0b81337F18767565D2eA40913799317A25DC4bc5',
            '0xc9D6692C29e015308c9D509f0733Cd41A328B6D8'
        ];
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Iniciando Dashboard Manager Modular...');
            
            await this.checkWalletConnection();
            
            if (!this.currentWallet) {
                this.showError('Wallet não conectada. Redirecionando...');
                setTimeout(() => window.location.href = 'index.html', 2000);
                return;
            }
            
            this.checkAdminAccess();
            this.setupNavigation();
            await this.showSection('overview');
            this.updateConnectionStatus(true);
            
            console.log('✅ Dashboard Manager Modular inicializado');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar dashboard:', error);
            this.showError('Erro ao carregar dashboard');
        }
    }

    async checkWalletConnection() {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (typeof window.ethereum === 'undefined') {
                throw new Error('MetaMask não instalado');
            }
            
            const accounts = await window.ethereum.request({method: 'eth_accounts'});
            
            if (accounts.length > 0) {
                this.currentWallet = accounts[0];
                console.log('✅ Wallet conectada:', this.currentWallet);
                this.updateWalletDisplay();
            } else {
                this.currentWallet = null;
            }
            
        } catch (error) {
            console.error('❌ Erro ao verificar wallet:', error);
            this.currentWallet = null;
        }
    }

    checkAdminAccess() {
        if (this.currentWallet) {
            this.isAdmin = this.adminAddresses.includes(this.currentWallet);
            console.log('👑 Acesso admin:', this.isAdmin);
        }
    }

    updateWalletDisplay() {
        const walletDisplay = document.getElementById('wallet-display');
        if (walletDisplay && this.currentWallet) {
            const shortAddress = `${this.currentWallet.slice(0, 6)}...${this.currentWallet.slice(-4)}`;
            walletDisplay.innerHTML = `
                <div class="d-flex align-items-center">
                    <small class="text-muted">${shortAddress}</small>
                    ${this.isAdmin ? '<i class="fas fa-crown text-warning ms-1"></i>' : ''}
                </div>
            `;
        }
    }

    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            if (connected) {
                statusElement.className = 'connection-status connected';
                statusElement.innerHTML = '<i class="fas fa-check-circle me-1"></i> Conectado';
            } else {
                statusElement.className = 'connection-status disconnected';
                statusElement.innerHTML = '<i class="fas fa-times-circle me-1"></i> Desconectado';
            }
        }
    }

    setupNavigation() {
        console.log('⚙️ Configurando navegação...');
        
        document.querySelectorAll('.nav-link[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
            });
        });
        
        document.querySelectorAll('.dropdown-item[data-section]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.showSection(section);
            });
        });
    }

    async showSection(sectionName) {
        try {
            console.log(`📄 Carregando seção: ${sectionName}`);
            
            this.updateActiveNavigation(sectionName);
            const templatePath = this.getTemplatePath(sectionName);
            
            const success = await this.templateLoader.loadTemplate(
                templatePath, 
                'main-content',
                () => this.onSectionLoaded(sectionName)
            );
            
            if (success) {
                this.currentSection = sectionName;
                console.log(`✅ Seção ${sectionName} carregada`);
            } else {
                throw new Error(`Falha ao carregar seção ${sectionName}`);
            }
            
        } catch (error) {
            console.error(`❌ Erro ao carregar seção ${sectionName}:`, error);
            this.showError(`Erro ao carregar a seção ${sectionName}`);
        }
    }

    getTemplatePath(sectionName) {
        const templateMap = {
            'overview': 'dashboard/pages/overview.html',
            'contracts': 'dashboard/pages/contracts.html',
            'new-contract': 'dashboard/pages/new-contract.html',
            'templates': 'dashboard/pages/templates.html',
            'transactions': 'dashboard/pages/transactions.html',
            'earnings': 'dashboard/pages/earnings.html',
            'reports': 'dashboard/pages/reports.html',
            'credits': 'dashboard/pages/credits.html',
            'buy-credits': 'dashboard/pages/buy-credits.html',
            'billing': 'dashboard/pages/billing.html',
            'withdraw': 'dashboard/pages/withdraw.html',
            'settings': 'dashboard/pages/settings.html',
            'help': 'dashboard/pages/help.html',
            'support': 'dashboard/pages/support.html'
        };
        
        return templateMap[sectionName] || 'dashboard/pages/overview.html';
    }

    updateActiveNavigation(sectionName) {
        document.querySelectorAll('.nav-link, .dropdown-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    onSectionLoaded(sectionName) {
        console.log(`🎉 Seção ${sectionName} carregada`);
        
        switch (sectionName) {
            case 'overview':
                this.loadOverviewData();
                break;
            case 'credits':
                this.loadCreditsData();
                break;
            default:
                console.log(`Seção: ${sectionName}`);
        }
    }

    async loadOverviewData() {
        try {
            const stats = {
                totalWidgets: 5,
                totalEarnings: 'R$ 1,250.00',
                availableCredits: 2500,
                monthlyViews: 15200
            };
            
            this.updateElement('total-widgets', stats.totalWidgets);
            this.updateElement('total-earnings', stats.totalEarnings);
            this.updateElement('available-credits', stats.availableCredits);
            this.updateElement('monthly-views', stats.monthlyViews);
            
        } catch (error) {
            console.error('❌ Erro ao carregar dados do overview:', error);
        }
    }

    async loadCreditsData() {
        try {
            const creditsData = {
                currentCredits: 1250,
                totalPurchased: 2000,
                totalUsed: 750
            };
            
            this.updateElement('current-credits', creditsData.currentCredits);
            this.updateElement('total-purchased', creditsData.totalPurchased);
            this.updateElement('total-used', creditsData.totalUsed);
            
        } catch (error) {
            console.error('❌ Erro ao carregar dados dos créditos:', error);
        }
    }

    updateElement(elementId, content) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = content;
        }
    }

    showError(message) {
        console.error('🚨 Erro:', message);
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="alert alert-danger m-4">
                    <h5><i class="fas fa-exclamation-triangle me-2"></i>Erro</h5>
                    <p>${message}</p>
                    <button class="btn btn-outline-danger" onclick="location.reload()">
                        <i class="fas fa-sync-alt me-2"></i>Tentar Novamente
                    </button>
                </div>
            `;
        }
    }

    refreshData() {
        this.onSectionLoaded(this.currentSection);
    }

    getCurrentSection() {
        return this.currentSection;
    }
}

// Exportar para uso global
window.DashboardManagerModular = DashboardManagerModular;