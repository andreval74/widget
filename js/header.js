// Sistema padronizado XCafe - Gerenciamento de carteira e idiomas
class XCafeHeaderManager {
    constructor() {
        this.isConnected = false;
        this.currentAddress = null;
        this.googleTranslateLoaded = false;
        this.init();
    }

    async init() {
        await this.checkWalletConnection();
        this.setupEventListeners();
        this.setupLanguageSelector();
        this.loadGoogleTranslate();
    }

    /**
     * Carrega o Google Translate
     */
    loadGoogleTranslate() {
        // Script do Google Translate
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.onerror = () => {
            console.warn('Google Translate não pôde ser carregado');
        };
        document.head.appendChild(script);
        
        // Função de callback para o Google Translate
        window.googleTranslateElementInit = () => {
            new google.translate.TranslateElement({
                pageLanguage: 'pt',
                includedLanguages: 'pt,en,es',
                layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,
                autoDisplay: true,
                multilanguagePage: true
            }, 'google_translate_element');
            this.googleTranslateLoaded = true;
            console.log('Google Translate carregado com sucesso');
        };
        
        // Força exibição da barra do Google Translate temporariamente
        setTimeout(() => {
            const translateElement = document.getElementById('google_translate_element');
            if (translateElement) {
                translateElement.style.display = 'block';
                translateElement.style.position = 'fixed';
                translateElement.style.top = '10px';
                translateElement.style.right = '10px';
                translateElement.style.zIndex = '9999';
                translateElement.style.background = 'white';
                translateElement.style.padding = '5px';
                translateElement.style.borderRadius = '5px';
                translateElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
            }
        }, 2000);
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
            // Adiciona classe connected
            button.classList.add('connected');
            button.title = `Conectado: ${address}`;
            
            // Mostra endereço abreviado
            const shortAddress = address.slice(0, 6) + '...' + address.slice(-4);
            text.textContent = shortAddress;
            
            // Remove ícone da carteira quando conectado
            const icon = button.querySelector('i');
            if (icon) {
                icon.style.display = 'none';
            }
        }
    }

    setDisconnected() {
        this.isConnected = false;
        this.currentAddress = null;
        
        const button = document.getElementById('connect-wallet-btn');
        const text = document.getElementById('wallet-text');
        
        if (button && text) {
            // Remove classe connected
            button.classList.remove('connected');
            button.title = 'Conectar Carteira';
            text.textContent = 'Conectar';
            
            // Mostra ícone da carteira
            const icon = button.querySelector('i');
            if (icon) {
                icon.style.display = 'inline';
            }
        }
    }

    setupEventListeners() {
        // Event listener removido - Bootstrap cuida do dropdown automaticamente

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
        // Carregar idioma salvo na inicialização
        this.restoreSavedLanguage();
    }

    /**
     * Restaura o idioma salvo
     */
    restoreSavedLanguage() {
        const savedLang = localStorage.getItem('xcafe-language');
        const savedFlag = localStorage.getItem('xcafe-flag');
        const savedName = localStorage.getItem('xcafe-language-name');
        
        if (savedLang && savedFlag && savedName) {
            const currentFlag = document.getElementById('current-flag');
            const currentLang = document.getElementById('current-lang');
            
            if (currentFlag) currentFlag.textContent = savedFlag;
            if (currentLang) currentLang.textContent = savedName;
        }
    }
}

// Inicializar quando DOM carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.headerManager = new XCafeHeaderManager();
        // Inicializar Google Translate
        setTimeout(loadGoogleTranslateForced, 1000);
    });
} else {
    window.headerManager = new XCafeHeaderManager();
    // Inicializar Google Translate
    setTimeout(loadGoogleTranslateForced, 1000);
}

/**
 * Função global para mudança de idioma
 * Chamada pelos links do dropdown de idioma
 */
function changeLanguage(lang, flag, name) {
    console.log(`Mudando idioma para: ${name} (${lang})`);
    
    // Atualizar interface visual
    updateLanguageSelector(lang, flag);
    
    // Salvar preferência
    localStorage.setItem('xcafe-language', lang);
    localStorage.setItem('xcafe-flag', flag);
    localStorage.setItem('xcafe-language-name', name);
    
    // Forçar carregamento do Google Translate se necessário
    if (!window.google || !window.google.translate) {
        console.log('Google Translate não carregado, forçando carregamento...');
        loadGoogleTranslateForced();
    }
    
    // Aplicar tradução via Google Translate
    setTimeout(() => {
        applyGoogleTranslation(lang);
    }, 500);
    
    console.log(`Idioma alterado para: ${name} (${lang})`);
}

/**
 * Força carregamento do Google Translate
 */
function loadGoogleTranslateForced() {
    console.log('Carregando Google Translate forçadamente...');
    
    // Remove script anterior se existir
    const oldScript = document.querySelector('script[src*="translate.google.com"]');
    if (oldScript) {
        oldScript.remove();
    }
    
    // Carrega novo script
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onerror = () => {
        console.warn('Erro ao carregar Google Translate');
    };
    document.head.appendChild(script);
    
    // Função de callback global
    window.googleTranslateElementInit = function() {
        console.log('Google Translate inicializando...');
        try {
            new google.translate.TranslateElement({
                pageLanguage: 'pt',
                includedLanguages: 'pt,en,es',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
                multilanguagePage: true
            }, 'google_translate_element');
            console.log('Google Translate carregado com sucesso!');
        } catch (error) {
            console.error('Erro ao inicializar Google Translate:', error);
        }
    };
}

/**
 * Aplica a tradução usando Google Translate
 */
function applyGoogleTranslation(lang) {
    try {
        // Aguardar o Google Translate carregar completamente
        let attempts = 0;
        const maxAttempts = 20;
        
        function tryTranslate() {
            attempts++;
            
            // Procurar pelo elemento select do Google Translate
            const selectElement = document.querySelector('.goog-te-combo');
            
            if (selectElement) {
                console.log(`Aplicando tradução para: ${lang}`);
                selectElement.value = lang;
                selectElement.dispatchEvent(new Event('change'));
                return;
            }
            
            // Tentar alternativa com frame do Google Translate
            const frame = document.querySelector('.goog-te-banner-frame');
            if (frame) {
                try {
                    const frameDoc = frame.contentDocument || frame.contentWindow.document;
                    const frameSelect = frameDoc.querySelector('select');
                    if (frameSelect) {
                        frameSelect.value = lang;
                        frameSelect.dispatchEvent(new Event('change'));
                        return;
                    }
                } catch (e) {
                    // Ignorar erros de cross-origin
                }
            }
            
            // Continuar tentando se não achou o seletor
            if (attempts < maxAttempts) {
                setTimeout(tryTranslate, 250);
            } else {
                console.warn('Google Translate não pôde ser ativado após várias tentativas');
                // Fallback - recarregar página com parâmetro
                const url = new URL(window.location);
                url.searchParams.set('hl', lang);
                window.location.href = url.toString();
            }
        }
        
        // Iniciar tentativas
        tryTranslate();
        
    } catch (error) {
        console.warn('Erro ao aplicar tradução:', error);
    }
}

/**
 * Desconecta a carteira
 */
function disconnectWallet() {
    if (window.headerManager) {
        window.headerManager.setDisconnected();
        
        // Remove dados salvos
        localStorage.removeItem('connectedWallet');
        
        // Reload da página para resetar estado
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
}

/**
 * Atualiza o seletor de idiomas visual
 */
function updateLanguageSelector(lang, flag) {
    // Atualiza bandeira atual
    const currentFlag = document.getElementById('current-flag');
    if (currentFlag) {
        currentFlag.textContent = flag;
    }
    
    // Remove classe active de todos os itens
    const allItems = document.querySelectorAll('.language-selector .dropdown-item');
    allItems.forEach(item => item.classList.remove('active'));
    
    // Adiciona classe active ao item selecionado
    const selectedItem = document.querySelector(`.language-selector .dropdown-item[onclick*="${lang}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }
}

/**
 * Função global para abrir modal de suporte (delegada para support-modal.js)
 */
function openSupportModal() {
    console.log('openSupportModal do header.js chamada - redirecionando...');
    
    // Verifica se o support modal manager está disponível
    if (window.supportModal && typeof window.supportModal.show === 'function') {
        console.log('Usando SupportModalManager...');
        window.supportModal.show();
        return;
    }
    
    // Se não, usar fallback simples
    console.log('Fallback: Criando modal simples...');
    
    // Verificar se Bootstrap está carregado
    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap não está carregado!');
        alert('Erro: Bootstrap não carregado. Contato: suporte@widgetsaas.com');
        return;
    }
    
    // Criar modal simples se não existir
    if (!document.getElementById('simpleSupportModal')) {
        console.log('Criando modal de suporte...');
        createSimpleSupportModal();
    }
    
    // Mostrar modal
    try {
        const modal = new bootstrap.Modal(document.getElementById('simpleSupportModal'));
        modal.show();
        console.log('Modal aberto com sucesso!');
    } catch (error) {
        console.error('Erro ao abrir modal:', error);
        alert('Contato direto:\nE-mail: suporte@widgetsaas.com\nTelegram: @widgetsaas');
    }
}

/**
 * Cria modal de contato simples
 */
function createSimpleSupportModal() {
    const modalHTML = `
    <div class="modal fade" id="simpleSupportModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-headset me-2"></i>Entre em Contato
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-12 text-center mb-4">
                            <h6>Entre em contato conosco:</h6>
                        </div>
                        <div class="col-md-6 text-center mb-3">
                            <div class="card h-100 border-0 bg-light">
                                <div class="card-body">
                                    <i class="fas fa-envelope fa-2x text-primary mb-2"></i>
                                    <h6>E-mail</h6>
                                    <a href="mailto:suporte@widgetsaas.com" class="btn btn-outline-primary btn-sm">
                                        suporte@widgetsaas.com
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 text-center mb-3">
                            <div class="card h-100 border-0 bg-light">
                                <div class="card-body">
                                    <i class="fab fa-telegram fa-2x text-info mb-2"></i>
                                    <h6>Telegram</h6>
                                    <a href="https://t.me/widgetsaas" target="_blank" class="btn btn-outline-info btn-sm">
                                        @widgetsaas
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Função para conectar wallet (chamada pelo dropdown)
 */
function handleConnect() {
    if (window.headerManager) {
        window.headerManager.connectWallet();
    }
}

/**
 * Função para desconectar wallet (chamada pelo dropdown) 
 */
function handleDisconnect() {
    if (window.headerManager) {
        // Encontrar o botão de desconectar e atualizar o texto
        const disconnectBtn = document.querySelector('.dropdown-item.disconnect-item');
        if (disconnectBtn) {
            const originalText = disconnectBtn.innerHTML;
            disconnectBtn.innerHTML = '<i class="fas fa-check me-2"></i>Sim, desconectar';
            disconnectBtn.classList.add('confirming');
            
            // Aguardar um momento antes de executar a desconexão
            setTimeout(() => {
                window.headerManager.setDisconnected();
                // Remove dados salvos
                localStorage.removeItem('connectedWallet');
                
                // Restaurar texto original após a ação
                disconnectBtn.innerHTML = originalText;
                disconnectBtn.classList.remove('confirming');
            }, 800);
        } else {
            // Fallback caso o botão não seja encontrado
            window.headerManager.setDisconnected();
            localStorage.removeItem('connectedWallet');
        }
    }
}

/**
 * Função para sair completamente do sistema (chamada pelo dropdown)
 */
function handleLogout() {
    if (window.headerManager) {
        // Encontrar o botão de logout e atualizar o texto
        const logoutBtn = document.querySelector('.dropdown-item.logout-item');
        if (logoutBtn) {
            const originalText = logoutBtn.innerHTML;
            logoutBtn.innerHTML = '<i class="fas fa-check me-2"></i>Sim, sair do sistema';
            logoutBtn.classList.add('confirming');
            
            // Aguardar um momento antes de executar o logout
            setTimeout(() => {
                window.headerManager.setDisconnected();
                // Remove todos os dados salvos
                localStorage.removeItem('connectedWallet');
                localStorage.removeItem('xcafe-language');
                localStorage.removeItem('xcafe-flag');
                localStorage.removeItem('xcafe-language-name');
                
                // Reload da página para resetar completamente o estado
                setTimeout(() => {
                    window.location.reload();
                }, 200);
            }, 800);
        } else {
            // Fallback caso o botão não seja encontrado
            window.headerManager.setDisconnected();
            localStorage.removeItem('connectedWallet');
            localStorage.removeItem('xcafe-language');
            localStorage.removeItem('xcafe-flag');
            localStorage.removeItem('xcafe-language-name');
            
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
    }
}

/**
 * Função simples para abrir modal de suporte
 * Disponível globalmente para uso em templates dinâmicos
 */
function handleSupportClick() {
    console.log('🎯 Abrindo modal de contato...');
    
    // Verificar se Bootstrap está disponível
    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap não carregado');
        alert('Entre em contato:\n\n📧 suporte@widgetsaas.com\n💬 @widgetsaas');
        return;
    }
    
    // Criar modal simples diretamente
    const modalHTML = `
    <div class="modal fade" id="contactModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-headset me-2"></i>Entre em Contato
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="card border-0 bg-light h-100">
                                <div class="card-body">
                                    <i class="fas fa-envelope fa-3x text-primary mb-3"></i>
                                    <h6>E-mail</h6>
                                    <a href="mailto:suporte@widgetsaas.com" class="btn btn-primary btn-sm">
                                        suporte@widgetsaas.com
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="card border-0 bg-light h-100">
                                <div class="card-body">
                                    <i class="fab fa-telegram fa-3x text-info mb-3"></i>
                                    <h6>Telegram</h6>
                                    <a href="https://t.me/widgetsaas" target="_blank" class="btn btn-info btn-sm">
                                        @widgetsaas
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <p class="text-muted mb-0">
                        <small>Estamos prontos para ajudar você! 🚀</small>
                    </p>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Verificar se modal já existe
    let existingModal = document.getElementById('contactModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Adicionar modal ao body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('contactModal'));
    modal.show();
    
    console.log('✅ Modal de contato aberto');
}

/**
 * Carregar modal de suporte a partir do arquivo components/support-modal.html
 */
async function loadSupportModal() {
    try {
        console.log('🎯 Carregando modal de suporte...');
        
        // Verificar se TemplateLoader está disponível
        if (typeof TemplateLoader === 'undefined') {
            console.error('TemplateLoader não está disponível');
            // Fallback para modal simples
            handleSupportClick();
            return;
        }
        
        // Carregar o template do modal
        const modalHTML = await TemplateLoader.loadTemplate('components/support-modal.html');
        
        // Verificar se modal já existe e removê-lo
        const existingModal = document.getElementById('support-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Adicionar modal ao body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Abrir o modal
        const modal = new bootstrap.Modal(document.getElementById('support-modal'));
        modal.show();
        
        console.log('✅ Modal de suporte carregado com sucesso');
        
    } catch (error) {
        console.error('❌ Erro ao carregar modal de suporte:', error);
        // Fallback para modal simples
        handleSupportClick();
    }
}

// Garantir que as funções estejam disponíveis globalmente
window.handleSupportClick = handleSupportClick;
window.loadSupportModal = loadSupportModal;
