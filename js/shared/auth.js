/*
================================================================================
XCAFE WIDGET SAAS - SISTEMA DE AUTENTICAÇÃO WEB3
================================================================================
Sistema de autenticação baseado 100% em MetaMask (sem senhas).
Utiliza assinatura digital para verificação de identidade.

CARACTERÍSTICAS:
✅ Autenticação MetaMask (sem senhas)
✅ Verificação por assinatura digital
✅ Sistema de permissões hierárquico
✅ Auto-refresh de tokens JWT
✅ Detecção de mudança de conta
✅ Logout automático em desconexões
✅ Cache inteligente de sessões
✅ Suporte a múltiplas redes

FLUXO DE AUTENTICAÇÃO:
1. Conectar MetaMask
2. Solicitar assinatura de mensagem
3. Backend valida assinatura
4. Retorna JWT + dados do usuário
5. Armazena sessão localmente

HIERARQUIA DE USUÁRIOS:
- Super Admin (primeiro usuário)
- Admin (gerencia sistema)
- Moderador (relatórios)
- Usuário (widgets próprios)
================================================================================
*/

/**
 * =======================================================================
 * CLASSE PRINCIPAL DE GERENCIAMENTO DE AUTENTICAÇÃO
 * =======================================================================
 * Controla todo o ciclo de vida da autenticação Web3
 */
class AuthManager {
    /**
     * Inicializa o gerenciador de autenticação
     * Configura estado inicial e event listeners
     */
    constructor() {
        this.user = null; // Dados do usuário logado
        this.token = null; // Token JWT atual
        this.isAuthenticated = false; // Status de autenticação
        this.userType = null; // Tipo: admin, moderador, usuário
        this.permissions = []; // Permissões específicas
        
        this.init(); // Inicialização assíncrona
    }

    /**
     * ===========================================
     * INICIALIZAÇÃO DO SISTEMA
     * ===========================================
     * Verifica autenticação armazenada e configura listeners
     */
    /**
     * ===========================================
     * INICIALIZAÇÃO DO SISTEMA
     * ===========================================
     * Verifica autenticação armazenada e configura listeners
     */
    async init() {
        await this.checkStoredAuth(); // Verifica sessão armazenada
        this.setupEventListeners(); // Configura listeners de eventos
    }

    /**
     * ===========================================
     * VERIFICAÇÃO DE AUTENTICAÇÃO ARMAZENADA
     * ===========================================
     * Recupera e valida sessão salva no localStorage
     */
    /**
     * ===========================================
     * VERIFICAÇÃO DE AUTENTICAÇÃO ARMAZENADA
     * ===========================================
     * Recupera e valida sessão salva no localStorage
     */
    async checkStoredAuth() {
        const token = localStorage.getItem('xcafe_token');
        const userData = localStorage.getItem('xcafe_user');
        
        if (token && userData) {
            try {
                this.token = token;
                this.user = JSON.parse(userData);
                this.isAuthenticated = true;
                this.userType = this.user.userType;
                this.permissions = this.user.permissions || [];
                
                // Verificar se o token ainda é válido no servidor
                await this.validateToken();
            } catch (error) {
                console.warn('Token armazenado inválido:', error);
                this.clearAuth();
            }
        }
    }

    /**
     * ===========================================
     * VALIDAÇÃO DE TOKEN NO SERVIDOR
     * ===========================================
     * Verifica se o JWT ainda é válido no backend
     */
    /**
     * ===========================================
     * VALIDAÇÃO DE TOKEN NO SERVIDOR
     * ===========================================
     * Verifica se o JWT ainda é válido no backend
     */
    async validateToken() {
        try {
            const response = await api.auth.checkStatus();
            if (!response.success) {
                this.clearAuth(); // Token inválido, limpa autenticação
            }
        } catch (error) {
            console.warn('Falha na validação do token:', error);
            this.clearAuth();
        }
    }

    /**
     * ===========================================
     * CONFIGURAÇÃO DE EVENT LISTENERS
     * ===========================================
     * Monitora mudanças na wallet e status de conexão
     */
    /**
     * ===========================================
     * CONFIGURAÇÃO DE EVENT LISTENERS
     * ===========================================
     * Monitora mudanças na wallet e status de conexão
     */
    setupEventListeners() {
        // Listener para mudanças no status da carteira MetaMask
        window.addEventListener('walletStatusChanged', (event) => {
            const { isConnected, account } = event.detail;
            
            if (!isConnected && this.isAuthenticated) {
                // Wallet desconectada - fazer logout automático
                this.logout();
            } else if (isConnected && this.user && this.user.address !== account) {
                // Endereço da carteira mudou - revalidar autenticação
                this.handleAddressChange(account);
            }
        });
    }

    /**
     * ===========================================
     * AUTENTICAÇÃO PRINCIPAL COM WALLET
     * ===========================================
     * Fluxo completo de autenticação Web3:
     * 1. Conecta wallet
     * 2. Obtém assinatura
     * 3. Valida no servidor
     * 4. Armazena sessão
     */
    async authenticateWithWallet() {
        try {
            // Verificar se a wallet está conectada
            if (!window.isWalletConnected()) {
                const connected = await window.connectWallet();
                if (!connected) {
                    throw new Error('Falha ao conectar wallet');
                }
            }

            const address = window.getWalletAddress();
            if (!address) {
                throw new Error('Endereço da wallet não encontrado');
            }

            // Criar mensagem para assinatura
            const timestamp = Date.now();
            const message = this.createSignatureMessage(address, timestamp);

            // Solicitar assinatura
            const signature = await window.signMessage(message);

            // Autenticar com o servidor
            const authData = {
                address: address,
                message: message,
                signature: signature,
                timestamp: timestamp
            };

            const response = await api.auth.login(authData);

            if (response.success) {
                this.setAuthData(response);
                return response;
            } else {
                throw new Error(response.error || 'Falha na autenticação');
            }

        } catch (error) {
            console.error('Erro na autenticação:', error);
            throw error;
        }
    }

    async setupFirstAdmin() {
        try {
            // Verificar se a wallet está conectada
            if (!window.isWalletConnected()) {
                const connected = await window.connectWallet();
                if (!connected) {
                    throw new Error('Falha ao conectar wallet');
                }
            }

            const address = window.getWalletAddress();
            if (!address) {
                throw new Error('Endereço da wallet não encontrado');
            }

            const setupData = {
                address: address,
                name: 'Super Administrator',
                department: 'System'
            };

            const response = await api.auth.setupAdmin(setupData);

            if (response.success) {
                // Após configurar, fazer login automático
                await this.authenticateWithWallet();
                return response;
            } else {
                throw new Error(response.error || 'Falha na configuração');
            }

        } catch (error) {
            console.error('Erro na configuração:', error);
            throw error;
        }
    }

    createSignatureMessage(address, timestamp) {
        return `XCafe Widget SaaS - Login
Endereço: ${address}
Timestamp: ${timestamp}
Nonce: ${Math.random().toString(36).substr(2, 9)}

Ao assinar esta mensagem, você está se autenticando no sistema XCafe Widget SaaS.`;
    }

    setAuthData(authResponse) {
        this.user = {
            address: authResponse.address,
            userType: authResponse.userType,
            permissions: authResponse.permissions || [],
            loginAt: new Date().toISOString()
        };
        
        this.token = authResponse.token;
        this.isAuthenticated = true;
        this.userType = authResponse.userType;
        this.permissions = authResponse.permissions || [];

        // Armazenar dados
        localStorage.setItem('xcafe_token', this.token);
        localStorage.setItem('xcafe_user', JSON.stringify(this.user));

        // Configurar API Manager
        if (window.apiManager) {
            window.apiManager.setToken(this.token);
        }

        // Emitir evento
        this.emitAuthChange();
    }

    clearAuth() {
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
        this.userType = null;
        this.permissions = [];

        // Limpar storage
        localStorage.removeItem('xcafe_token');
        localStorage.removeItem('xcafe_user');

        // Limpar API Manager
        if (window.apiManager) {
            window.apiManager.clearToken();
        }

        // Emitir evento
        this.emitAuthChange();
    }

    logout() {
        this.clearAuth();
        
        // Desconectar wallet se conectada
        if (window.isWalletConnected()) {
            window.disconnectWallet();
        }

        // Redirecionar para login
        window.location.href = '/auth.html';
    }

    async handleAddressChange(newAddress) {
        if (this.user && this.user.address !== newAddress) {
            // Endereço mudou, fazer novo login
            this.clearAuth();
            try {
                await this.authenticateWithWallet();
            } catch (error) {
                this.logout();
            }
        }
    }

    // ============================================================================
    // VERIFICAÇÕES DE PERMISSÃO
    // ============================================================================

    hasPermission(permission) {
        if (!this.isAuthenticated) return false;
        if (this.userType === 'Super Admin') return true;
        return this.permissions.includes(permission);
    }

    canManageAdmins() {
        return this.hasPermission('manage_admins') || 
               this.userType === 'Super Admin' || 
               this.userType === 'Admin';
    }

    canCreateWidgets() {
        return this.hasPermission('create_widgets') || 
               this.userType !== 'normal';
    }

    canDeleteWidgets() {
        return this.hasPermission('delete_widgets') || 
               this.userType === 'Super Admin' || 
               this.userType === 'Admin';
    }

    canViewStats() {
        return this.hasPermission('view_stats') || 
               this.userType !== 'normal';
    }

    canResetSystem() {
        return this.userType === 'Super Admin';
    }

    // ============================================================================
    // GETTERS
    // ============================================================================

    getUser() {
        return this.user;
    }

    getUserType() {
        return this.userType;
    }

    getAddress() {
        return this.user ? this.user.address : null;
    }

    getToken() {
        return this.token;
    }

    isAdmin() {
        return ['Super Admin', 'Admin', 'Moderator'].includes(this.userType);
    }

    isSuperAdmin() {
        return this.userType === 'Super Admin';
    }

    // ============================================================================
    // EVENTOS
    // ============================================================================

    emitAuthChange() {
        window.dispatchEvent(new CustomEvent('authStatusChanged', {
            detail: {
                isAuthenticated: this.isAuthenticated,
                user: this.user,
                userType: this.userType,
                permissions: this.permissions
            }
        }));
    }

    // ============================================================================
    // REDIRECIONAMENTOS
    // ============================================================================

    requireAuth() {
        if (!this.isAuthenticated) {
            window.location.href = '/auth.html';
            return false;
        }
        return true;
    }

    requireAdmin() {
        if (!this.isAuthenticated || !this.isAdmin()) {
            window.location.href = '/auth.html';
            return false;
        }
        return true;
    }

    requireSuperAdmin() {
        if (!this.isAuthenticated || !this.isSuperAdmin()) {
            window.location.href = '/auth.html';
            return false;
        }
        return true;
    }

    redirectAfterLogin() {
        // Verificar se há URL de retorno armazenada
        const returnUrl = localStorage.getItem('xcafe_return_url');
        
        if (returnUrl) {
            localStorage.removeItem('xcafe_return_url');
            window.location.href = returnUrl;
            return;
        }

        // Redirecionamento padrão baseado no tipo de usuário
        switch (this.userType) {
            case 'Super Admin':
            case 'Admin':
            case 'Moderator':
                window.location.href = '/admin-panel.html';
                break;
            default:
                window.location.href = '/dashboard.html';
        }
    }

    // ============================================================================
    // UTILITÁRIOS DE UI
    // ============================================================================

    updateAuthUI() {
        // Atualizar elementos de interface baseados na autenticação
        const authElements = document.querySelectorAll('[data-auth]');
        
        authElements.forEach(element => {
            const authType = element.dataset.auth;
            
            switch (authType) {
                case 'required':
                    element.style.display = this.isAuthenticated ? 'block' : 'none';
                    break;
                case 'guest':
                    element.style.display = this.isAuthenticated ? 'none' : 'block';
                    break;
                case 'admin':
                    element.style.display = this.isAdmin() ? 'block' : 'none';
                    break;
                case 'super-admin':
                    element.style.display = this.isSuperAdmin() ? 'block' : 'none';
                    break;
            }
        });

        // Atualizar informações do usuário
        const userInfo = document.getElementById('userInfo');
        if (userInfo && this.isAuthenticated) {
            userInfo.innerHTML = `
                <div class="user-info">
                    <div class="user-address">${utils.formatAddress(this.getAddress())}</div>
                    <div class="user-type">${this.getUserType()}</div>
                </div>
            `;
        }
    }
}

// Instância global
const authManager = new AuthManager();

// Funções auxiliares globais
window.auth = {
    login: () => authManager.authenticateWithWallet(),
    logout: () => authManager.logout(),
    setupAdmin: () => authManager.setupFirstAdmin(),
    isAuthenticated: () => authManager.isAuthenticated,
    getUser: () => authManager.getUser(),
    getUserType: () => authManager.getUserType(),
    hasPermission: (permission) => authManager.hasPermission(permission),
    requireAuth: () => authManager.requireAuth(),
    requireAdmin: () => authManager.requireAdmin(),
    requireSuperAdmin: () => authManager.requireSuperAdmin()
};

// Event listener para atualizar UI quando a autenticação mudar
window.addEventListener('authStatusChanged', () => {
    authManager.updateAuthUI();
});

// Atualizar UI inicial
document.addEventListener('DOMContentLoaded', () => {
    authManager.updateAuthUI();
});
