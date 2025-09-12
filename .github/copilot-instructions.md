# Copilot Instructions for Widget SaaS

## Visão Geral
Widget SaaS é uma plataforma Web3 para criação e incorporação de widgets de venda de tokens. Sistema 100% baseado em MetaMask (sem senhas), com autenticação por assinatura digital, sistema de créditos e comissões automáticas via smart contracts.

## Arquitetura Principal
- **Frontend:** 4 páginas HTML na raiz (`index.html`, `auth.html`, `dashboard.html`, `admin-panel.html`)
- **Backend:** `server.py` (servidor HTTP Python com integração Web3, porta 3000)
- **Smart Contracts:** `UniversalSaleContract.sol` (vendas com comissões automáticas)
- **Dados:** Estrutura JSON em `data/` + SQLite para persistência
- **Configuração:** `admin-config.json` para redes blockchain e tokens suportados

## Estrutura JavaScript Modular
- **`js/xcafe-app.js`:** Coordenador principal que inicializa todos os módulos
- **`js/shared/`:** Utilitários reutilizáveis
  - `web3.js`: Integração MetaMask/Web3
  - `api.js`: Classe APIManager para comunicação com backend
  - `auth.js`: Sistema de autenticação Web3
  - `template-loader.js`: Carregamento modular de componentes
- **`js/modules/`:** Lógica específica de páginas
  - `dashboard-manager-modular.js`: Dashboard com carregamento sob demanda
  - `auth-manager.js`: Gerenciamento de login/logout Web3

## Fluxos Críticos

### Autenticação Web3 (Sem Senhas)
1. Usuario acessa `/auth.html` → Conecta MetaMask → Sistema verifica assinatura
2. **Primeiro admin:** Automaticamente definido como Super Admin no setup inicial
3. **Usuários subsequentes:** Auto-registro ou verificação de permissões admin
4. **Endpoints:** `/api/auth/verify` (POST), `/api/system/setup` (POST)

### Dashboard Modular
- **Carregamento sob demanda:** Páginas individuais em `dashboard/pages/`
- **Menu lateral:** `components/dashboard-menu.html` (reutilizável)
- **Seções:** overview, contracts, new-contract, settings, reports, support
- **Navegação:** `DashboardManagerModular.showSection(sectionName)`

### Sistema de Créditos
- **1 crédito = 1 transação processada** (cobrança apenas por vendas concluídas)
- **Pacotes:** Starter (100), Pro (500), Business (1000), Enterprise (5000)
- **Estrutura:** `data/credits.json`, verificação no smart contract

### Smart Contract Integration
- **Comissões automáticas:** 98% vendedor, 2% plataforma
- **Redes suportadas:** BSC testnet/mainnet (configuração em `admin-config.json`)
- **Tokens:** USDT, BNB, tokens customizados por endereço

## Workflows de Desenvolvimento

### Instalação e Setup
- **Automática:** `setup/setup.ps1` (Windows) ou `setup/setup.sh` (Linux/Mac)
- **Manual:** `pip install -r requirements.txt` → `python server.py`
- **Primeiro acesso:** http://localhost:3000/auth.html (conectar MetaMask para setup inicial)

### Desenvolvimento Backend
- **Python:** `python server.py` (porta 3000, endpoints `/api/*`)
- **Node.js alternativo:** `cd api && npm install && npm run dev`
- **Dados:** JSONs em `data/` + SQLite (`data/widget_saas.db` auto-criado)

### Sistema Modular
- **Adicionar nova página dashboard:** Criar `dashboard/pages/nome.html`
- **Novos utilitários JS:** `js/shared/` para código reutilizável
- **Lógica específica:** `js/modules/` para funcionalidades de página
- **Templates:** `TemplateLoader.loadTemplate()` para componentes dinâmicos

### Deploy e Produção
- **Frontend:** Vercel/Netlify (arquivos estáticos na raiz)
- **Backend:** VPS com PM2 (`pm2 start server.py`) ou Docker
- **Variáveis:** `.env` para JWT_SECRET, RPC_URLS, API_KEYS

## Padrões Específicos

### Estrutura de Dados
- **Usuário:** `{ "walletAddress": "0x...", "apiKey": "wgt_...", "credits": 100, "isAdmin": false }`
- **Widget:** `{ "id": "widget-id", "tokenAddress": "0x...", "price": 0.1, "theme": "light", "active": true }`
- **Admin:** Hierarquia Super Admin > Admin > Moderador com permissões específicas

### Integração Web3
- **Frontend:** `js/shared/web3.js` com MetaMask connector e blockchain utils
- **Backend:** `server.py` usa Web3.py para verificação de assinaturas e transações
- **Configuração:** `admin-config.json` define redes, tokens e contratos suportados

### API Patterns
- **Autenticação:** JWT + assinatura MetaMask (sem senhas)
- **Rate limiting:** 100 requests/15min
- **Endpoints críticos:** `/api/auth/verify`, `/api/system/setup`, `/api/credits/purchase`
- **APIManager:** Classe em `js/shared/api.js` com interceptors e token management

### Dashboard Modular
- **Navegação:** `DashboardManagerModular` carrega seções sob demanda
- **Template system:** `TemplateLoader` para componentes reutilizáveis
- **Estrutura:** Menu em `components/dashboard-menu.html`, páginas em `dashboard/pages/`

## Exemplos Importantes
- **Widget Embed:**
  ```html
  <div id="token-widget"></div>
  <script src="https://yourapi.com/widget.js"></script>
  <script>
    new TokenSaleWidget({ apiKey: '...', containerId: 'token-widget', theme: 'light' });
  </script>
  ```
- **Estrutura de Usuário:**
  ```json
  { "walletAddress": "0x...", "apiKey": "wgt_...", "credits": 100, ... }
  ```
- **Estrutura de Widget:**
  ```json
  { "id": "widget-id", "tokenAddress": "0x...", "price": 0.1, ... }
  ```

## Referências
- Documentação: `docs/`, README.md
- Scripts de setup: `setup/`
- Contratos: `contracts/`
- API: `server.py`, `api/server.js`
- Dados: `data/`

---
**Seção incompleta ou dúvidas? Solicite exemplos ou detalhes específicos!**
