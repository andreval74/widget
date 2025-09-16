// Sistema padronizado para Dashboard Header - Com tema, idiomas, wallet e logout
class DashHeaderManager {
    constructor() {
        this.googleTranslateLoaded = false;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupLanguageSelector();
        this.loadGoogleTranslate();
        this.initializeWalletDisplay();
        this.initializeUserTypeDisplay();
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

    setupEventListeners() {
        // Eventos específicos do dashboard podem ser adicionados aqui
        this.setupWalletClickToCopy();
        console.log('✅ Dashboard header event listeners configurados');
    }

    /**
     * Inicializa a exibição da carteira
     */
    initializeWalletDisplay() {
        // Verificar se há carteira conectada
        const connectedWallet = localStorage.getItem('connectedWallet');
        if (connectedWallet) {
            this.updateWalletDisplay(connectedWallet);
        } else {
            // Tentar obter do wallet.js se disponível
            setTimeout(() => {
                if (window.walletManager && window.walletManager.currentAccount) {
                    this.updateWalletDisplay(window.walletManager.currentAccount);
                }
            }, 1000);
        }
    }

    /**
     * Inicializa a exibição do tipo de usuário
     */
    initializeUserTypeDisplay() {
        // Verificar tipo de usuário salvo ou determinar baseado em dados
        const userType = this.determineUserType();
        this.updateUserTypeDisplay(userType);
    }

    /**
     * Atualiza a exibição da carteira
     */
    updateWalletDisplay(address) {
        const walletElements = [
            document.getElementById('user-wallet-address'),
            document.getElementById('connected-wallet-address')
        ];
        
        walletElements.forEach(element => {
            if (element) {
                const shortAddress = this.shortenAddress(address);
                element.textContent = shortAddress;
                element.title = `${address} - Clique para copiar`;
            }
        });
    }

    /**
     * Atualiza a exibição do tipo de usuário
     */
    updateUserTypeDisplay(userType) {
        const userTypeBadge = document.getElementById('user-type-badge');
        if (userTypeBadge) {
            userTypeBadge.textContent = userType.label;
            userTypeBadge.className = `badge ${userType.class}`;
        }
    }

    /**
     * Determina o tipo de usuário
     */
    determineUserType() {
        // Verificar se é admin
        const isAdmin = this.checkIfAdmin();
        if (isAdmin) {
            return { label: 'Administrador', class: 'bg-danger' };
        }

        // Verificar nível baseado em créditos ou outros critérios
        const credits = this.getUserCredits();
        if (credits >= 1000) {
            return { label: 'Premium', class: 'bg-warning text-dark' };
        } else if (credits >= 100) {
            return { label: 'Pro', class: 'bg-info' };
        } else {
            return { label: 'Básico', class: 'bg-success' };
        }
    }

    /**
     * Verifica se o usuário é admin
     */
    checkIfAdmin() {
        // Implementar lógica para verificar se é admin
        // Por exemplo, verificar endereço da carteira ou dados salvos
        const adminAddresses = [
            '0x1234567890123456789012345678901234567890', // Exemplo
            // Adicionar endereços de admin aqui
        ];
        
        const currentAddress = localStorage.getItem('connectedWallet');
        return adminAddresses.includes(currentAddress);
    }

    /**
     * Obtém os créditos do usuário
     */
    getUserCredits() {
        // Implementar lógica para obter créditos
        // Por enquanto, retorna um valor simulado
        return parseInt(localStorage.getItem('userCredits') || '50');
    }

    /**
     * Encurta o endereço da carteira
     */
    shortenAddress(address) {
        if (!address) return 'Não conectado';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    /**
     * Configura o clique para copiar endereço
     */
    setupWalletClickToCopy() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'user-wallet-address' || e.target.id === 'connected-wallet-address') {
                const fullAddress = localStorage.getItem('connectedWallet');
                if (fullAddress) {
                    this.copyToClipboard(fullAddress);
                    this.showCopyFeedback(e.target);
                }
            }
        });
    }

    /**
     * Copia texto para a área de transferência
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            console.log('Endereço copiado para a área de transferência');
        } catch (err) {
            // Fallback para navegadores mais antigos
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    }

    /**
     * Mostra feedback visual ao copiar
     */
    showCopyFeedback(element) {
        const originalText = element.textContent;
        element.textContent = 'Copiado!';
        element.classList.add('bg-success');
        
        setTimeout(() => {
            element.textContent = originalText;
            element.classList.remove('bg-success');
        }, 1500);
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
        window.dashHeaderManager = new DashHeaderManager();
        // Inicializar Google Translate
        setTimeout(loadGoogleTranslateForced, 1000);
    });
} else {
    window.dashHeaderManager = new DashHeaderManager();
    // Inicializar Google Translate
    setTimeout(loadGoogleTranslateForced, 1000);
}

// Funções globais (mesmas de header.js, com ajustes se necessário)
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

function disconnectWallet() {
    if (window.dashHeaderManager) {
        // Assumindo wallet.js gerencia a desconexão
        console.log('Desconectando wallet...');
        localStorage.removeItem('connectedWallet');
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
}

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

// Funções para suporte modal (mesmas de header.js)
function openSupportModal() {
    console.log('openSupportModal chamada - redirecionando...');
    
    if (window.supportModal && typeof window.supportModal.show === 'function') {
        window.supportModal.show();
        return;
    }
    
    // Fallback simples
    handleSupportClick();
}

function handleSupportClick() {
    // Código para modal simples, igual ao header.js
    // ... (copiar o código de handleSupportClick de header.js se necessário)
    console.log('Fallback support modal');
    // Implementar modal simples aqui se preciso
}

window.handleSupportClick = handleSupportClick;
window.loadSupportModal = loadSupportModal; // Se existir no header.js

// Funções globais para o menu Sistema
function toggleTheme() {
    console.log('Alternando tema...');
    
    // Verificar tema atual
    const currentTheme = document.body.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Aplicar novo tema
    document.body.setAttribute('data-theme', newTheme);
    document.body.className = `theme-${newTheme}`;
    
    // Atualizar ícone
    const themeIcon = document.getElementById('theme-icon-menu');
    if (themeIcon) {
        themeIcon.className = newTheme === 'dark' ? 'fas fa-moon me-2' : 'fas fa-sun me-2';
    }
    
    // Salvar preferência
    localStorage.setItem('theme-preference', newTheme);
    
    console.log(`Tema alterado para: ${newTheme}`);
}

function showLanguageOptions() {
    console.log('Mostrando opções de idioma...');
    
    // Criar modal simples para seleção de idioma
    const modalHTML = `
    <div class="modal fade" id="languageModal" tabindex="-1">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-globe me-2"></i>Selecionar Idioma
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="list-group">
                        <a href="#" class="list-group-item list-group-item-action" onclick="changeLanguage('pt', '🇧🇷', 'Português'); closeLanguageModal();">
                            🇧🇷 Português
                        </a>
                        <a href="#" class="list-group-item list-group-item-action" onclick="changeLanguage('en', '🇺🇸', 'English'); closeLanguageModal();">
                            🇺🇸 English
                        </a>
                        <a href="#" class="list-group-item list-group-item-action" onclick="changeLanguage('es', '🇪🇸', 'Español'); closeLanguageModal();">
                            🇪🇸 Español
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Remover modal existente se houver
    const existingModal = document.getElementById('languageModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Adicionar modal ao body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('languageModal'));
    modal.show();
}

function closeLanguageModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('languageModal'));
    if (modal) {
        modal.hide();
    }
}

function showWalletInfo() {
    console.log('Mostrando informações da carteira...');
    
    const connectedWallet = localStorage.getItem('connectedWallet');
    const userCredits = localStorage.getItem('userCredits') || '50';
    
    // Criar modal com informações da carteira
    const modalHTML = `
    <div class="modal fade" id="walletInfoModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-wallet me-2"></i>Informações da Carteira
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-12 mb-3">
                            <label class="form-label fw-bold">Endereço da Carteira:</label>
                            <div class="input-group">
                                <input type="text" class="form-control" value="${connectedWallet || 'Não conectado'}" readonly>
                                <button class="btn btn-outline-secondary" type="button" onclick="copyWalletAddress()">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold">Créditos Disponíveis:</label>
                            <div class="badge bg-warning text-dark fs-6">${userCredits}</div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label fw-bold">Status:</label>
                            <div class="badge bg-success fs-6">${connectedWallet ? 'Conectado' : 'Desconectado'}</div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    ${connectedWallet ? '<button type="button" class="btn btn-danger" onclick="disconnectWallet()">Desconectar</button>' : ''}
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Remover modal existente se houver
    const existingModal = document.getElementById('walletInfoModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Adicionar modal ao body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('walletInfoModal'));
    modal.show();
}

function copyWalletAddress() {
    const connectedWallet = localStorage.getItem('connectedWallet');
    if (connectedWallet && window.dashHeaderManager) {
        window.dashHeaderManager.copyToClipboard(connectedWallet);
        
        // Feedback visual
        const button = event.target.closest('button');
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check text-success"></i>';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
        }, 1500);
    }
}

// Tornar funções disponíveis globalmente
window.toggleTheme = toggleTheme;
window.showLanguageOptions = showLanguageOptions;
window.closeLanguageModal = closeLanguageModal;
window.showWalletInfo = showWalletInfo;
window.copyWalletAddress = copyWalletAddress;