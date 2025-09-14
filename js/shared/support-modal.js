/**
 * Support Modal Manager
 * Gerencia o modal de suporte/contato universal
 */
class SupportModalManager {
    constructor() {
        this.modalElement = null;
        this.form = null;
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.loadModalHTML().then(() => {
            this.setupEventListeners();
            this.setupFormHandling();
            this.autoFillWalletAddress();
            this.isInitialized = true;
        });
    }

    /**
     * Carrega o HTML do modal dinamicamente
     */
    async loadModalHTML() {
        try {
            // Verifica se o modal já existe
            if (document.getElementById('support-modal')) {
                this.modalElement = document.getElementById('support-modal');
                this.form = document.getElementById('contact-support-form');
                return;
            }

            // Carrega o HTML do modal
            const response = await fetch('./components/support-modal.html');
            if (!response.ok) {
                // Tenta caminho alternativo para páginas em subpastas
                const alternativeResponse = await fetch('../components/support-modal.html');
                if (!alternativeResponse.ok) throw new Error('Modal HTML not found');
                const html = await alternativeResponse.text();
                this.injectModalHTML(html);
            } else {
                const html = await response.text();
                this.injectModalHTML(html);
            }
            
            this.modalElement = document.getElementById('support-modal');
            this.form = document.getElementById('contact-support-form');
            
        } catch (error) {
            console.warn('Could not load support modal HTML:', error);
            this.createFallbackModal();
        }
    }

    /**
     * Injeta o HTML do modal no documento
     */
    injectModalHTML(html) {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = html;
        document.body.appendChild(modalContainer.firstElementChild);
    }

    /**
     * Cria um modal básico como fallback
     */
    createFallbackModal() {
        const fallbackHTML = `
        <div class="modal fade" id="support-modal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Suporte & Contato</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p>Entre em contato conosco:</p>
                        <div class="d-grid gap-2">
                            <a href="https://wa.me/5543999446606" target="_blank" class="btn btn-success">
                                <i class="fab fa-whatsapp"></i> WhatsApp
                            </a>
                            <a href="#" target="_blank" class="btn btn-primary">
                                <i class="fab fa-telegram"></i> Telegram
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', fallbackHTML);
        this.modalElement = document.getElementById('support-modal');
    }

    /**
     * Configura os event listeners
     */
    setupEventListeners() {
        // Listener para quando o modal for mostrado
        if (this.modalElement) {
            this.modalElement.addEventListener('shown.bs.modal', () => {
                this.autoFillWalletAddress();
            });
        }
    }

    /**
     * Configura o handling do formulário
     */
    setupFormHandling() {
        if (!this.form) return;

        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleFormSubmit();
        });
    }

    /**
     * Preenche automaticamente o endereço da carteira se conectado
     */
    autoFillWalletAddress() {
        const walletField = document.getElementById('contact-wallet');
        if (!walletField) return;

        // Tenta obter o endereço da carteira de diferentes fontes
        let walletAddress = null;
        
        // Verifica se há Web3Manager global
        if (window.web3Manager && window.web3Manager.currentAccount) {
            walletAddress = window.web3Manager.currentAccount;
        }
        // Verifica se há ethereum global (MetaMask)
        else if (window.ethereum && window.ethereum.selectedAddress) {
            walletAddress = window.ethereum.selectedAddress;
        }
        // Verifica localStorage
        else {
            walletAddress = localStorage.getItem('connectedWallet');
        }

        if (walletAddress) {
            walletField.value = walletAddress;
        }
    }

    /**
     * Processa o envio do formulário
     */
    async handleFormSubmit() {
        try {
            const formData = this.getFormData();
            
            // Mostra loading
            const submitButton = this.form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Enviando...';
            submitButton.disabled = true;

            // Envia para o backend
            const response = await fetch('/api/support/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.showSuccess();
                this.resetForm();
            } else {
                throw new Error('Erro ao enviar mensagem');
            }

        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            this.showError(error.message);
        } finally {
            // Restaura o botão
            const submitButton = this.form.querySelector('button[type="submit"]');
            submitButton.innerHTML = '<i class="fas fa-paper-plane me-1"></i> Enviar Mensagem';
            submitButton.disabled = false;
        }
    }

    /**
     * Extrai os dados do formulário
     */
    getFormData() {
        return {
            name: document.getElementById('contact-name')?.value,
            email: document.getElementById('contact-email')?.value,
            subject: document.getElementById('contact-subject')?.value,
            message: document.getElementById('contact-message')?.value,
            wallet: document.getElementById('contact-wallet')?.value,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        };
    }

    /**
     * Mostra mensagem de sucesso
     */
    showSuccess() {
        this.showToast('Mensagem enviada com sucesso!', 'success');
    }

    /**
     * Mostra mensagem de erro
     */
    showError(message) {
        this.showToast(`Erro: ${message}`, 'danger');
    }

    /**
     * Exibe toast notification
     */
    showToast(message, type = 'info') {
        // Tenta usar o sistema de toast existente ou cria um simples
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            alert(message); // Fallback simples
        }
    }

    /**
     * Reseta o formulário
     */
    resetForm() {
        if (this.form) {
            this.form.reset();
            this.autoFillWalletAddress(); // Recoloca a carteira
        }
    }

    /**
     * Abre o modal de suporte
     */
    show() {
        if (this.modalElement) {
            const modal = new bootstrap.Modal(this.modalElement);
            modal.show();
        }
    }

    /**
     * Fecha o modal de suporte
     */
    hide() {
        if (this.modalElement) {
            const modal = bootstrap.Modal.getInstance(this.modalElement);
            if (modal) {
                modal.hide();
            }
        }
    }
}

// Instância global
window.supportModal = new SupportModalManager();

/**
 * Função global para abrir o modal de suporte
 * Pode ser chamada de qualquer lugar: openSupportModal()
 */
function openSupportModal() {
    console.log('openSupportModal do support-modal.js chamada!');
    
    if (window.supportModal) {
        console.log('window.supportModal existe, chamando show()...');
        window.supportModal.show();
    } else {
        console.error('window.supportModal não existe!');
        alert('Erro ao carregar modal de suporte. Contato: suporte@widgetsaas.com');
    }
}

// Também disponibiliza como método no window
window.openSupportModal = openSupportModal;

// Auto-inicialização quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Modal já inicializado no constructor
    });
}