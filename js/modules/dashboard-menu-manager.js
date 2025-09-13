/*
================================================================================
DASHBOARD MENU MANAGER OTIMIZADO - Widget SaaS
================================================================================
Funcionalidades específicas do menu lateral do dashboard
Otimizado para trabalhar em conjunto com wallet-menu-manager.js
================================================================================
*/

class DashboardMenuManager {
    constructor() {
        this.init();
    }

    init() {
        console.log('📋 Inicializando DashboardMenuManager Otimizado...');
        this.setupNavigationEvents();
        this.setupActionButtons();
    }

    setupNavigationEvents() {
        // Configurar eventos de navegação para links com data-section
        const navLinks = document.querySelectorAll('[data-section]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(link, e);
            });
        });
    }

    handleNavigation(link, event) {
        const sectionName = link.getAttribute('data-section');
        
        // Remover classe active de todos os links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        
        // Adicionar active ao link clicado
        link.classList.add('active');
        
        // Disparar evento personalizado para o dashboard manager
        const customEvent = new CustomEvent('dashboardNavigation', {
            detail: { 
                section: sectionName,
                element: link,
                originalEvent: event
            }
        });
        document.dispatchEvent(customEvent);
        
        console.log(`📌 Navegação para seção: ${sectionName}`);
    }

    setupActionButtons() {
        // Os botões já têm onclick definido no HTML
        console.log('✅ Botões de ação configurados via HTML');
    }

    // ================================================================================
    // MÉTODOS UTILITÁRIOS DO MENU
    // ================================================================================

    setActiveSection(sectionName) {
        // Remover active de todos
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        
        // Adicionar active ao section específico
        const targetLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }
    }

    expandMenu(menuId) {
        const menu = document.getElementById(menuId);
        if (menu && menu.classList.contains('collapse')) {
            const bsCollapse = new bootstrap.Collapse(menu, { show: true });
        }
    }

    collapseMenu(menuId) {
        const menu = document.getElementById(menuId);
        if (menu && menu.classList.contains('collapse')) {
            const bsCollapse = new bootstrap.Collapse(menu, { hide: true });
        }
    }

    collapseAllMenus() {
        const allMenus = document.querySelectorAll('.collapse');
        allMenus.forEach(menu => {
            if (menu.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(menu, { hide: true });
            }
        });
    }
}

// ================================================================================
// FUNÇÕES GLOBAIS DO DASHBOARD
// ================================================================================

function refreshDashboard() {
    console.log('🔄 Atualizando dashboard...');
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Atualizando...';
    btn.disabled = true;
    
    // OTIMIZADO: Forçar atualização via walletMenuManager
    if (window.walletMenuManager) {
        window.walletMenuManager.forceUpdate();
    }
    
    // Disparar evento de refresh
    const refreshEvent = new CustomEvent('dashboardRefresh', {
        detail: { timestamp: new Date().toISOString() }
    });
    document.dispatchEvent(refreshEvent);

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        console.log('✅ Dashboard atualizado');
    }, 1500);
}

function logout() {
    if (confirm('Tem certeza que deseja sair do sistema?')) {
        console.log('🚪 Fazendo logout do sistema...');
        
        // OTIMIZADO: Desconectar via web3Manager se disponível
        if (window.web3Manager && typeof window.web3Manager.disconnectWallet === 'function') {
            window.web3Manager.disconnectWallet();
        }
        
        // Parar atualizações periódicas da carteira
        if (window.walletMenuManager && typeof window.walletMenuManager.stopPeriodicUpdate === 'function') {
            window.walletMenuManager.stopPeriodicUpdate();
        }
        
        // Limpar dados locais (preservando configurações essenciais)
        try {
            // Limpar dados de carteira
            localStorage.removeItem('walletconnect');
            localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE');
            localStorage.removeItem('web3_connection_state');
            sessionStorage.clear();
            
            // Manter apenas configurações do usuário
            const lang = localStorage.getItem('xcafe-language');
            const flag = localStorage.getItem('xcafe-flag');
            
            // Limpar tudo e restaurar configurações essenciais
            localStorage.clear();
            if (lang) localStorage.setItem('xcafe-language', lang);
            if (flag) localStorage.setItem('xcafe-flag', flag);
            
            console.log('🧹 Dados locais limpos, configurações preservadas');
        } catch (error) {
            console.error('⚠️ Erro ao limpar dados locais:', error);
        }
        
        // Redirecionar para página inicial
        console.log('👋 Redirecionando para página inicial...');
        window.location.href = '../index.html';
    }
}

// ================================================================================
// INICIALIZAÇÃO
// ================================================================================

// Inicializar quando DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que outros scripts carregaram
    setTimeout(() => {
        // Criar instância global do manager
        window.dashboardMenuManager = new DashboardMenuManager();
        console.log('✅ DashboardMenuManager Otimizado inicializado');
    }, 100);
});