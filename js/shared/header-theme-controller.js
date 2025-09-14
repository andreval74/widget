/*
================================================================================
HEADER THEME CONTROLLER - CONTROLE SIMPLES DE TEMA NO HEADER
================================================================================
Sistema simples para controle de tema diretamente no header
Integra com o theme-controller-unified.js
================================================================================
*/

class HeaderThemeController {
    constructor() {
        this.currentTheme = localStorage.getItem('xcafe-theme') || 'light';
        this.init();
    }

    init() {
        // Aguardar carregamento do DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupThemeButton();
            });
        } else {
            this.setupThemeButton();
        }
    }

    setupThemeButton() {
        const themeIcon = document.getElementById('theme-toggle-btn');

        if (themeIcon) {
            // Aplicar tema inicial
            this.applyTheme(this.currentTheme);
            this.updateIcon(this.currentTheme);

            // Event listener para o ícone
            themeIcon.addEventListener('click', () => {
                this.toggleTheme();
            });

            // Suporte a teclado
            themeIcon.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });

            console.log('🎨 Header Theme Controller inicializado');
        } else {
            // Tentar novamente em 100ms se elemento não foi encontrado
            setTimeout(() => this.setupThemeButton(), 100);
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('xcafe-theme', theme);
        
        this.applyTheme(theme);
        this.updateIcon(theme);
        
        console.log(`🎨 Tema alterado para: ${theme}`);
        
        // Notificar outros sistemas
        this.notifyThemeChange(theme);
    }

    applyTheme(theme) {
        // Aplicar tema no documento
        document.documentElement.setAttribute('data-theme', theme);
        
        // Aplicar classes no body
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }

        // Aplicar tema em widgets se existirem
        const widgets = document.querySelectorAll('[data-token-widget]');
        widgets.forEach(widget => {
            widget.setAttribute('data-theme', theme);
        });
    }

    updateIcon(theme) {
        const themeIcon = document.getElementById('theme-toggle-btn');
        if (themeIcon) {
            if (theme === 'light') {
                themeIcon.className = 'fas fa-moon fs-5 text-white theme-icon-toggle';
                themeIcon.title = 'Ativar modo escuro';
            } else {
                themeIcon.className = 'fas fa-sun fs-5 theme-icon-toggle';
                themeIcon.title = 'Ativar modo claro';
                // Cor será aplicada via CSS do tema escuro
            }
        }
    }

    notifyThemeChange(theme) {
        // Criar evento customizado
        const event = new CustomEvent('themeChanged', {
            detail: { theme: theme }
        });
        document.dispatchEvent(event);

        // Notificar theme controller unificado se existir
        if (window.themeController && window.themeController.setTheme) {
            window.themeController.setTheme(theme);
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Inicializar automaticamente
const headerThemeController = new HeaderThemeController();
window.headerThemeController = headerThemeController;

console.log('🎨 Header Theme Controller carregado com sucesso!');