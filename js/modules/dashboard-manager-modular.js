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
            case 'contracts':
                this.loadContractsData();
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
    
    async loadContractsData() {
        try {
            const contracts = this.getUserContracts();
            const contractsList = document.getElementById('contracts-list');
            
            if (!contractsList) return;
            
            if (contracts.length === 0) {
                contractsList.innerHTML = `
                    <div class="text-center py-5">
                        <i class="fas fa-contract fa-3x text-muted mb-3"></i>
                        <h5>Nenhum contrato encontrado</h5>
                        <p class="text-muted">Crie seu primeiro contrato para começar</p>
                        <button class="btn btn-success" onclick="dashboardManager.showSection('new-contract')">
                            <i class="fas fa-plus"></i> Criar Primeiro Contrato
                        </button>
                    </div>
                `;
                return;
            }
            
            contractsList.innerHTML = contracts.map(contract => this.generateContractCard(contract)).join('');
            
        } catch (error) {
            console.error('❌ Erro ao carregar contratos:', error);
        }
    }
    
    generateContractCard(contract) {
        const statusClass = {
            'active': 'success',
            'paused': 'warning', 
            'expired': 'danger'
        }[contract.status] || 'secondary';
        
        const typeIcon = {
            'payment': 'fas fa-credit-card',
            'subscription': 'fas fa-sync-alt',
            'donation': 'fas fa-heart',
            'custom': 'fas fa-cog'
        }[contract.type] || 'fas fa-cube';
        
        return `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <div class="d-flex align-items-center">
                                <i class="${typeIcon} fa-lg me-3" style="color: ${contract.color || '#007bff'};"></i>
                                <div>
                                    <h5 class="mb-1">${contract.name}</h5>
                                    <p class="text-muted mb-1">${contract.description || 'Sem descrição'}</p>
                                    <small class="text-muted">
                                        Criado em: ${new Date(contract.createdAt).toLocaleDateString('pt-BR')}
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 text-end">
                            <div class="mb-2">
                                <span class="badge bg-${statusClass}">${this.translateStatus(contract.status)}</span>
                            </div>
                            <div class="mb-2">
                                <strong>${contract.price} ETH</strong>
                            </div>
                            <div class="btn-group">
                                <button class="btn btn-outline-primary btn-sm" onclick="dashboardManager.editContract('${contract.id}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-outline-success btn-sm" onclick="dashboardManager.viewContractStats('${contract.id}')">
                                    <i class="fas fa-chart-bar"></i>
                                </button>
                                <button class="btn btn-outline-warning btn-sm" onclick="dashboardManager.toggleContractStatus('${contract.id}')">
                                    <i class="fas fa-pause"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    translateStatus(status) {
        const translations = {
            'active': 'Ativo',
            'paused': 'Pausado',
            'expired': 'Expirado'
        };
        return translations[status] || status;
    }
    
    refreshContracts() {
        this.loadContractsData();
        this.showAlert('Lista de contratos atualizada!', 'success');
    }
    
    editContract(contractId) {
        // Implementar edição de contrato
        this.showAlert('Função de edição será implementada em breve.', 'info');
    }
    
    viewContractStats(contractId) {
        // Implementar visualização de estatísticas
        this.showAlert('Estatísticas do contrato serão implementadas em breve.', 'info');
    }
    
    toggleContractStatus(contractId) {
        // Implementar toggle de status
        this.showAlert('Toggle de status será implementado em breve.', 'info');
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

    // Métodos para gerenciar contratos
    createContract(contractData) {
        try {
            console.log('📝 Criando novo contrato:', contractData);
            
            // Validar dados obrigatórios
            if (!contractData.name || !contractData.type || !contractData.price) {
                this.showAlert('Por favor, preencha todos os campos obrigatórios.', 'warning');
                return;
            }
            
            // Simular criação do contrato
            const newContract = {
                id: this.generateContractId(),
                ...contractData,
                status: 'active',
                createdAt: new Date().toISOString(),
                earnings: 0,
                views: 0
            };
            
            // Salvar no localStorage (temporário)
            this.saveContract(newContract);
            
            this.showAlert('Contrato criado com sucesso!', 'success');
            
            // Voltar para a lista de contratos
            setTimeout(() => {
                this.showSection('contracts');
            }, 1500);
            
        } catch (error) {
            console.error('❌ Erro ao criar contrato:', error);
            this.showAlert('Erro ao criar contrato. Tente novamente.', 'error');
        }
    }
    
    generateContractId() {
        return 'contract_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    saveContract(contract) {
        try {
            let contracts = JSON.parse(localStorage.getItem('user_contracts') || '[]');
            contracts.push(contract);
            localStorage.setItem('user_contracts', JSON.stringify(contracts));
        } catch (error) {
            console.error('Erro ao salvar contrato:', error);
        }
    }
    
    getUserContracts() {
        try {
            return JSON.parse(localStorage.getItem('user_contracts') || '[]');
        } catch (error) {
            console.error('Erro ao carregar contratos:', error);
            return [];
        }
    }
    
    previewWidget() {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div class="modal fade" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Preview do Widget</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p>Preview do widget será implementado aqui...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const bootstrapModal = new bootstrap.Modal(modal.querySelector('.modal'));
        bootstrapModal.show();
        
        // Remover modal após fechar
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }
    
    showAlert(message, type = 'info') {
        const alertClass = {
            'success': 'alert-success',
            'error': 'alert-danger',
            'warning': 'alert-warning',
            'info': 'alert-info'
        }[type] || 'alert-info';
        
        const alert = document.createElement('div');
        alert.className = `alert ${alertClass} alert-dismissible fade show position-fixed`;
        alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alert);
        
        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
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