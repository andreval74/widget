/*
=============================================            // Executar callback se fornecido
            if (callback && typeof callback === 'function') {
                callback(container);
            }

            // Disparar evento personalizado
 // Inicialização automática quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    
    // Aguardar um pouco para garantir que todos os elementos estão prontos
    setTimeout(() => {
        const headerElements = document.querySelectorAll('[data-component="header"]');
        const footerElements = document.querySelectorAll('[data-component="footer"]');
        
        templateLoader.loadDefaultTemplates();
    }, 100);
});t event = new CustomEvent('templateLoaded', {
                detail: {
                    templatePath: templatePath,
                    containerId: containerId,
                    container: container
                }
            });
            document.dispatchEvent(event);

            console.log(`✅ Template carregado: ${templatePath} -> ${containerId}`);
            return true;============================
TEMPLATE-LOADER.JS - Sistema de carregamento de templates
================================================================================
Carrega header e footer de forma modular em todas as páginas
================================================================================
*/

class TemplateLoader {
    constructor() {
        this.loadedTemplates = new Set();
    }

    /**
     * Carrega um template HTML e insere no container especificado
     * @param {string} templatePath - Caminho para o arquivo de template
     * @param {string} containerId - ID do container onde inserir o template
     * @param {Function} callback - Função opcional a ser executada após o carregamento
     */
    async loadTemplate(templatePath, containerId, callback = null) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`Container com ID "${containerId}" não encontrado`);
                return false;
            }

            // Verificar se já foi carregado
            const templateKey = `${templatePath}-${containerId}`;
            if (this.loadedTemplates.has(templateKey)) {
                console.log(`Template ${templatePath} já carregado em ${containerId}`);
                return true;
            }

            // Mostrar indicador de carregamento
            container.innerHTML = '<div class="text-center p-3"><i class="fas fa-spinner fa-spin"></i> Carregando...</div>';

            const response = await fetch(templatePath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const content = await response.text();
            container.innerHTML = content;

            // Marcar como carregado
            this.loadedTemplates.add(templateKey);

            // Executar callback se fornecido
            if (callback && typeof callback === 'function') {
                callback(container);
            }

            console.log(`Template ${templatePath} carregado com sucesso em ${containerId}`);
            return true;

        } catch (error) {
            console.error(`Erro ao carregar template ${templatePath}:`, error);
            
            // Mostrar erro no container
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="alert alert-warning m-3">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Erro ao carregar conteúdo. Tente recarregar a página.
                    </div>
                `;
            }
            return false;
        }
    }

    /**
     * Carrega um template HTML e insere diretamente em um elemento
     * @param {HTMLElement} element - Elemento onde inserir o template
     * @param {string} templatePath - Caminho para o arquivo de template
     * @param {Function} callback - Função opcional a ser executada após o carregamento
     */
    async loadTemplateIntoElement(element, templatePath, callback = null) {
        try {
            if (!element) {
                console.error(`Elemento não fornecido para carregar template ${templatePath}`);
                return false;
            }

            // Verificar se já foi carregado
            const templateKey = `${templatePath}-element-${Date.now()}`;
            
            console.log(`🔄 Carregando template: ${templatePath} em elemento`);

            const response = await fetch(templatePath);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const templateHTML = await response.text();
            element.innerHTML = templateHTML;

            // Marcar como carregado
            this.loadedTemplates.add(templateKey);

            // Executar callback se fornecido
            if (callback && typeof callback === 'function') {
                callback(element);
            }

            // Disparar evento personalizado
            const event = new CustomEvent('templateLoaded', {
                detail: {
                    templatePath: templatePath,
                    element: element
                }
            });
            document.dispatchEvent(event);

            console.log(`✅ Template carregado: ${templatePath} -> elemento ${element.tagName}`);
            return true;

        } catch (error) {
            console.error(`❌ Erro ao carregar template ${templatePath}:`, error);
            element.innerHTML = `
                <div class="alert alert-warning m-3">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Erro ao carregar header. Tente recarregar a página.
                </div>
            `;
            return false;
        }
    }

    /**
     * Carrega header, footer e dashboard-menu automaticamente
     */
    async loadDefaultTemplates() {
        const promises = [];

        // Carregar header - verificar tanto ID quanto data-component
        const headerContainer = document.getElementById('header-container') || 
                               document.querySelector('[data-component="header"]');
        if (headerContainer) {
            // Se for data-component, usar o próprio elemento
            if (headerContainer.hasAttribute('data-component')) {
                promises.push(
                    this.loadTemplateIntoElement(headerContainer, 'header.html', this.initHeaderFeatures)
                );
            } else {
                promises.push(
                    this.loadTemplate('header.html', 'header-container', this.initHeaderFeatures)
                );
            }
        }

        // Carregar footer - verificar tanto ID quanto data-component  
        const footerContainer = document.getElementById('footer-container') || 
                               document.querySelector('[data-component="footer"]');
        if (footerContainer) {
            // Se for data-component, usar o próprio elemento
            if (footerContainer.hasAttribute('data-component')) {
                promises.push(
                    this.loadTemplateIntoElement(footerContainer, 'footer.html', this.initFooterFeatures)
                );
            } else {
                promises.push(
                    this.loadTemplate('footer.html', 'footer-container', this.initFooterFeatures)
                );
            }
        }

        // Carregar dashboard-menu - verificar tanto ID quanto data-component
        const dashboardMenuContainer = document.getElementById('dashboard-menu-container') || 
                                     document.querySelector('[data-component="dashboard-menu"]');
        if (dashboardMenuContainer) {
            console.log('🎯 Dashboard menu container encontrado, carregando...');
            // Se for data-component, usar o próprio elemento
            if (dashboardMenuContainer.hasAttribute('data-component')) {
                promises.push(
                    this.loadTemplateIntoElement(dashboardMenuContainer, 'components/dashboard-menu.html', this.initDashboardMenuFeatures)
                );
            } else {
                promises.push(
                    this.loadTemplate('components/dashboard-menu.html', 'dashboard-menu-container', this.initDashboardMenuFeatures)
                );
            }
        }

        try {
            await Promise.all(promises);
        } catch (error) {
            // Template loading error handled silently
        }
    }

    /**
     * Inicializa funcionalidades específicas do header após carregamento
     * @param {HTMLElement} headerContainer 
     */
    initHeaderFeatures(headerContainer) {
        // Inicializar dropdown Bootstrap se houver
        const dropdowns = headerContainer.querySelectorAll('[data-bs-toggle="dropdown"]');
        dropdowns.forEach(dropdown => {
            new bootstrap.Dropdown(dropdown);
        });

        // Adicionar classe active ao link da página atual
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = headerContainer.querySelectorAll('.nav-link[href]');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Inicializa funcionalidades específicas do footer após carregamento
     * @param {HTMLElement} footerContainer 
     */
    initFooterFeatures(footerContainer) {
        // Atualizar ano atual no copyright
        const currentYear = new Date().getFullYear();
        const copyrightText = footerContainer.querySelector('.mb-0');
        if (copyrightText) {
            copyrightText.textContent = `© ${currentYear} Widget SaaS. Todos os direitos reservados.`;
        }

        // Inicializar tooltips se houver
        const tooltips = footerContainer.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltips.forEach(tooltip => {
            new bootstrap.Tooltip(tooltip);
        });
    }

    /**
     * Inicializa funcionalidades específicas do dashboard-menu após carregamento
     * @param {HTMLElement} dashboardMenuContainer 
     */
    initDashboardMenuFeatures(dashboardMenuContainer) {
        console.log('🎯 Inicializando funcionalidades do dashboard menu...');
        
        // Inicializar dropdowns Bootstrap
        const dropdowns = dashboardMenuContainer.querySelectorAll('[data-bs-toggle="dropdown"]');
        dropdowns.forEach(dropdown => {
            new bootstrap.Dropdown(dropdown);
        });

        // Configurar eventos de navegação
        const navLinks = dashboardMenuContainer.querySelectorAll('[data-section]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionName = link.getAttribute('data-section');
                
                // Disparar evento personalizado para o dashboard manager
                const event = new CustomEvent('dashboardNavigation', {
                    detail: { section: sectionName }
                });
                document.dispatchEvent(event);
                
                console.log(`📌 Navegação para seção: ${sectionName}`);
            });
        });

        // Atualizar display da carteira se disponível
        const walletDisplay = dashboardMenuContainer.querySelector('#wallet-display');
        if (walletDisplay && typeof window.getCurrentWallet === 'function') {
            const wallet = window.getCurrentWallet();
            if (wallet) {
                walletDisplay.innerHTML = `
                    <div class="d-flex align-items-center">
                        <i class="fas fa-wallet text-success me-2"></i>
                        <div>
                            <div class="text-white small">${wallet.substring(0, 6)}...${wallet.substring(wallet.length - 4)}</div>
                            <div class="text-success small">Conectado</div>
                        </div>
                    </div>
                `;
            }
        }

        console.log('✅ Dashboard menu inicializado com sucesso');
    }

    /**
     * Recarregar um template específico
     * @param {string} templatePath 
     * @param {string} containerId 
     */
    async reloadTemplate(templatePath, containerId) {
        const templateKey = `${templatePath}-${containerId}`;
        this.loadedTemplates.delete(templateKey);
        return await this.loadTemplate(templatePath, containerId);
    }

    /**
     * Verificar se um template foi carregado
     * @param {string} templatePath 
     * @param {string} containerId 
     * @returns {boolean}
     */
    isTemplateLoaded(templatePath, containerId) {
        const templateKey = `${templatePath}-${containerId}`;
        return this.loadedTemplates.has(templateKey);
    }
}

// Instância global do carregador de templates
const templateLoader = new TemplateLoader();

// Auto-inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOMContentLoaded - Iniciando carregamento de templates');
    
    // Aguardar um pouco para garantir que todos os elementos estão prontos
    setTimeout(() => {
        console.log('📋 Verificando elementos data-component...');
        const headerElements = document.querySelectorAll('[data-component="header"]');
        const footerElements = document.querySelectorAll('[data-component="footer"]');
        const dashboardMenuElements = document.querySelectorAll('[data-component="dashboard-menu"]');
        
        console.log(`Encontrados ${headerElements.length} elementos header, ${footerElements.length} elementos footer e ${dashboardMenuElements.length} elementos dashboard-menu`);
        
        templateLoader.loadDefaultTemplates();
    }, 100);
});

// Exportar para uso global
window.TemplateLoader = TemplateLoader;
window.templateLoader = templateLoader;
