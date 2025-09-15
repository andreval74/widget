/**
 * LANGUAGE CONTROLLER - CONTROLADOR DE IDIOMA
 * Sistema de internacionalização para o Widget SaaS
 * Por enquanto apenas placeholder - funcionalidade será implementada futuramente
 */

class LanguageController {
    constructor() {
        this.currentLanguage = 'pt-br';
        this.availableLanguages = {
            'pt-br': 'Português',
            'en': 'English',
            'es': 'Español'
        };
        
        this.init();
    }

    init() {
        console.log('🌍 Inicializando Language Controller...');
        this.setupEventListeners();
        this.updateButtonIcon();
    }

    setupEventListeners() {
        const languageBtn = document.getElementById('language-toggle-btn');
        
        if (languageBtn) {
            languageBtn.addEventListener('click', () => {
                this.showDevelopmentMessage();
            });
            
            // Atualizar tooltip com idioma atual
            languageBtn.title = `Idioma atual: ${this.availableLanguages[this.currentLanguage]}`;
        }
    }

    updateButtonIcon() {
        const icon = document.getElementById('language-icon');
        if (icon) {
            // Por enquanto mantém o ícone de globo
            icon.className = 'fas fa-globe';
        }
    }

    showDevelopmentMessage() {
        // Criar modal simples para mostrar que está em desenvolvimento
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        `;
        
        content.innerHTML = `
            <h3 style="margin-bottom: 15px; color: #333;">🌍 Sistema de Idiomas</h3>
            <p style="margin-bottom: 20px; color: #666;">
                Funcionalidade em desenvolvimento!<br>
                Em breve você poderá escolher entre:
            </p>
            <ul style="list-style: none; padding: 0; margin-bottom: 20px;">
                <li style="margin: 5px 0;">🇧🇷 Português</li>
                <li style="margin: 5px 0;">🇺🇸 English</li>
                <li style="margin: 5px 0;">🇪🇸 Español</li>
            </ul>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="
                        background: #007bff; 
                        color: white; 
                        border: none; 
                        padding: 10px 20px; 
                        border-radius: 5px; 
                        cursor: pointer;
                    ">
                OK
            </button>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Fechar clicando fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Métodos para implementação futura
    setLanguage(lang) {
        console.log(`🌍 Mudando idioma para: ${lang}`);
        // Implementar mudança de idioma aqui
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getAvailableLanguages() {
        return this.availableLanguages;
    }
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new LanguageController();
    });
} else {
    new LanguageController();
}

// Exportar para uso global (se necessário)
window.LanguageController = LanguageController;