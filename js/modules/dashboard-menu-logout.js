/**
 * ================================================================================
 * DASHBOARD MENU MANAGER - WIDGET SAAS
 * ================================================================================
 * Gerenciador do menu lateral do dashboard com logout e navegação
 * ================================================================================
 */

// ================================================================================
// FUNÇÃO DE LOGOUT DO SISTEMA
// ================================================================================

/**
 * Função de logout que pode ser chamada globalmente
 */
function logout() {
    if (confirm('Tem certeza que deseja sair do sistema?')) {
        console.log('🚪 Fazendo logout do sistema...');
        
        // Desconectar via web3Manager se disponível
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
// FUNÇÃO DE TESTE DE NAVEGAÇÃO
// ================================================================================

/**
 * Função de teste para verificar se os links de navegação funcionam
 * @param {string} section - Nome da seção para navegar
 */
function testNavigateToSection(section) {
    console.log('🔍 Testando navegação para:', section);
    
    if (typeof window.navigateToSection === 'function') {
        console.log('✅ Função navigateToSection encontrada');
        window.navigateToSection(section);
    } else {
        console.log('❌ Função navigateToSection não encontrada');
        console.log('Aguardando dashboard manager...');
        setTimeout(() => testNavigateToSection(section), 1000);
    }
}

// ================================================================================
// INICIALIZAÇÃO
// ================================================================================

// Disponibilizar funções globalmente quando DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    console.log('📋 Dashboard Menu Manager carregado');
    
    // Disponibilizar funções globalmente
    window.logout = logout;
    window.testNavigateToSection = testNavigateToSection;
    
    console.log('🚪 Função logout disponível globalmente');
    console.log('🧪 Função testNavigateToSection disponível globalmente');
});