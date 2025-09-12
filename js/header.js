// Sistema padronizado XCafe - Gerenciamento de carteira e idiomas
class XCafeHeaderManager {
    constructor() {
        this.isConnected = false;
        this.currentAddress = null;
        this.init();
    }

    async init() {
        await this.checkWalletConnection();
        this.setupEventListeners();
        this.setupLanguageSelector();
    }

    async checkWalletConnection() {
        try {
            if (typeof window.ethereum !== 'undefined') {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts && accounts.length > 0) {
                    this.setConnected(accounts[0]);
                } else {
                    this.setDisconnected();
                }
            } else {
                this.setDisconnected();
            }
        } catch (error) {
            console.error('Erro ao verificar conexão:', error);
            this.setDisconnected();
        }
    }

    async connectWallet() {
        try {
            if (typeof window.ethereum === 'undefined') {
                alert('MetaMask não encontrado! Por favor instale o MetaMask.');
                window.open('https://metamask.io', '_blank');
                return;
            }

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts && accounts.length > 0) {
                this.setConnected(accounts[0]);
            }
        } catch (error) {
            console.error('Erro ao conectar carteira:', error);
            if (error.code === 4001) {
                alert('Conexão rejeitada pelo usuário');
            } else {
                alert('Erro ao conectar carteira: ' + error.message);
            }
        }
    }

    setConnected(address) {
        this.isConnected = true;
        this.currentAddress = address;
        
        const button = document.getElementById('connect-wallet-btn');
        const text = document.getElementById('wallet-text');
        
        if (button && text) {
            button.classList.add('connected');
            button.title = `Conectado: ${address}`;
            
            const shortAddress = address.slice(0, 6) + '...' + address.slice(-4);
            text.textContent = shortAddress;
        }
    }

    setDisconnected() {
        this.isConnected = false;
        this.currentAddress = null;
        
        const button = document.getElementById('connect-wallet-btn');
        const text = document.getElementById('wallet-text');
        
        if (button && text) {
            button.classList.remove('connected');
            button.title = 'Conectar Carteira';
            text.textContent = 'Conectar';
        }
    }

    setupEventListeners() {
        const connectBtn = document.getElementById('connect-wallet-btn');
        if (connectBtn) {
            connectBtn.addEventListener('click', () => {
                if (this.isConnected) {
                    // Se já conectado, redirecionar para dashboard
                    window.location.href = 'dashboard-modular.html';
                } else {
                    // Se não conectado, conectar carteira
                    this.connectWallet();
                }
            });
        }

        // Monitorar mudanças na carteira
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    this.setDisconnected();
                } else {
                    this.setConnected(accounts[0]);
                }
            });
        }
    }

    setupLanguageSelector() {
        // Funcionalidade do seletor de idiomas
        const languageItems = document.querySelectorAll('[data-lang]');
        languageItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = e.target.getAttribute('data-lang');
                const flag = e.target.getAttribute('data-flag');
                
                // Atualizar interface
                const currentFlag = document.getElementById('current-flag');
                const currentLang = document.getElementById('current-lang');
                
                if (currentFlag) currentFlag.textContent = flag;
                if (currentLang) currentLang.textContent = lang.toUpperCase();
                
                // Salvar preferência
                localStorage.setItem('xcafe-language', lang);
                localStorage.setItem('xcafe-flag', flag);
                
                console.log(`Idioma alterado para: ${lang}`);
            });
        });

        // Carregar idioma salvo
        const savedLang = localStorage.getItem('xcafe-language');
        const savedFlag = localStorage.getItem('xcafe-flag');
        if (savedLang && savedFlag) {
            const currentFlag = document.getElementById('current-flag');
            const currentLang = document.getElementById('current-lang');
            
            if (currentFlag) currentFlag.textContent = savedFlag;
            if (currentLang) currentLang.textContent = savedLang.toUpperCase();
        }
    }
}

// Inicializar quando DOM carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.xcafeHeaderManager = new XCafeHeaderManager();
    });
} else {
    window.xcafeHeaderManager = new XCafeHeaderManager();
}
