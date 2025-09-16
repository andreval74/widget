# 🎨 ESPECIFICAÇÕES DO DESIGN SYSTEM - WIDGET SAAS

## 📋 RESUMO EXECUTIVO

Este documento define as especificações completas do design system padronizado para o Widget SaaS, baseado em Bootstrap 5.3 como framework principal, mantendo a identidade visual única do projeto.

---

## 🔤 TIPOGRAFIA

### Fonte Principal
- **Família**: Inter (Google Fonts)
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **CDN**: `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap`

### Pesos de Fonte
| Peso | Valor | Uso |
|------|-------|-----|
| Light | 300 | Textos secundários, legendas |
| Regular | 400 | Texto padrão, parágrafos |
| Medium | 500 | Labels, navegação, formulários |
| Semibold | 600 | Subtítulos, cards headers |
| Bold | 700 | Títulos importantes, botões |
| Extrabold | 800 | Destaques especiais |
| Black | 900 | Títulos principais, hero sections |

### Hierarquia de Títulos
```css
/* Display Headings - Para hero sections */
.display-1 { font-size: 6rem; font-weight: 300; }
.display-2 { font-size: 5.5rem; font-weight: 300; }
.display-3 { font-size: 4.5rem; font-weight: 300; }
.display-4 { font-size: 3.5rem; font-weight: 300; }

/* Headings Padrão */
h1 { font-size: 2.5rem; font-weight: 700; }
h2 { font-size: 2rem; font-weight: 700; }
h3 { font-size: 1.75rem; font-weight: 600; }
h4 { font-size: 1.5rem; font-weight: 600; }
h5 { font-size: 1.25rem; font-weight: 600; }
h6 { font-size: 1rem; font-weight: 600; }

/* Texto especial */
.lead { font-size: 1.25rem; font-weight: 300; }
.small { font-size: 0.875rem; }
```

---

## 🎨 PALETA DE CORES

### Cores Principais (Bootstrap Padrão)
```css
:root {
  --bs-primary: #007bff;      /* Azul principal */
  --bs-secondary: #6c757d;    /* Cinza neutro */
  --bs-success: #28a745;      /* Verde sucesso */
  --bs-info: #17a2b8;         /* Azul informativo */
  --bs-warning: #ffc107;      /* Amarelo/mostarda */
  --bs-danger: #dc3545;       /* Vermelho erro */
  --bs-light: #f8f9fa;        /* Cinza claro */
  --bs-dark: #212529;         /* Preto/cinza escuro */
}
```

### Cores Específicas do Projeto
```css
:root {
  /* Cores especiais */
  --widget-neon: #4facfe;           /* Azul neon para efeitos */
  --widget-accent: #ffc107;         /* Amarelo de destaque */
  
  /* Gradientes */
  --gradient-primary: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  --gradient-warning: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
  --gradient-success: linear-gradient(135deg, #28a745 0%, #218838 100%);
  
  /* Efeitos Neon */
  --neon-glow-light: 0 0 10px rgba(79, 172, 254, 0.3);
  --neon-glow: 0 0 20px rgba(79, 172, 254, 0.5);
  --neon-glow-strong: 0 0 30px rgba(79, 172, 254, 0.7);
}
```

### Tema Escuro
```css
[data-bs-theme="dark"] {
  --bs-primary: #4facfe;        /* Azul mais claro */
  --bs-warning: #ffd43b;        /* Amarelo mais vibrante */
  --bs-success: #51cf66;        /* Verde mais suave */
  --bs-body-bg: #1a1a1a;        /* Fundo principal */
  --bs-body-color: #ffffff;     /* Texto principal */
  --bs-secondary-bg: #2d2d2d;   /* Fundo secundário */
  --bs-tertiary-bg: #3d3d3d;    /* Fundo terciário */
}
```

### Cores Neutras (Escala de Cinza)
| Nome | Hex | Uso |
|------|-----|-----|
| Gray 50 | #f9fafb | Backgrounds muito claros |
| Gray 100 | #f3f4f6 | Backgrounds claros |
| Gray 200 | #e5e7eb | Bordas, separadores |
| Gray 300 | #d1d5db | Bordas ativas |
| Gray 400 | #9ca3af | Placeholders |
| Gray 500 | #6b7280 | Texto secundário |
| Gray 600 | #4b5563 | Texto terciário |
| Gray 700 | #374151 | Texto principal (tema claro) |
| Gray 800 | #1f2937 | Backgrounds escuros |
| Gray 900 | #111827 | Texto principal (tema escuro) |

---

## 🧩 COMPONENTES

### Botões

#### Classes Bootstrap Padrão
```html
<!-- Botões sólidos -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-info">Info</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-danger">Danger</button>

<!-- Botões outline -->
<button class="btn btn-outline-primary">Outline Primary</button>
<button class="btn btn-outline-secondary">Outline Secondary</button>

<!-- Tamanhos -->
<button class="btn btn-primary btn-sm">Pequeno</button>
<button class="btn btn-primary">Normal</button>
<button class="btn btn-primary btn-lg">Grande</button>
```

#### Botões Customizados com Efeito Neon
```html
<button class="btn btn-primary btn-neon">
  <i class="fas fa-rocket me-2"></i>Começar Agora
</button>
```

```css
.btn-neon {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-neon::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn-neon:hover::before {
  left: 100%;
}

.btn-neon:hover {
  transform: translateY(-2px);
  box-shadow: var(--neon-glow);
}
```

### Cards

#### Estrutura Bootstrap Padrão
```html
<div class="card">
  <div class="card-header bg-primary text-white">
    <h5 class="card-title mb-0">Título do Card</h5>
  </div>
  <div class="card-body">
    <p class="card-text">Conteúdo do card.</p>
    <button class="btn btn-primary">Ação</button>
  </div>
  <div class="card-footer bg-light">
    <small class="text-muted">Rodapé opcional</small>
  </div>
</div>
```

#### Card com Hover Effect
```html
<div class="card card-hover">
  <div class="card-body text-center">
    <i class="fas fa-star text-warning fa-3x mb-3"></i>
    <h5 class="card-title">Card Interativo</h5>
    <p class="card-text">Card com efeito hover.</p>
    <button class="btn btn-outline-primary">Ver Mais</button>
  </div>
</div>
```

```css
.card-hover {
  transition: all 0.3s ease;
  border: 1px solid var(--bs-border-color);
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border-color: var(--bs-primary);
}
```

### Badges

#### Badges Padrão
```html
<span class="badge bg-primary">Primary</span>
<span class="badge bg-success">Success</span>
<span class="badge bg-warning text-dark">Warning</span>
<span class="badge bg-danger">Danger</span>
```

#### Badges com Efeito Neon
```html
<span class="badge bg-primary badge-neon">Neon Badge</span>
```

```css
.badge-neon {
  background: var(--gradient-primary) !important;
  box-shadow: var(--neon-glow-light);
}
```

### Alertas

```html
<div class="alert alert-primary" role="alert">
  <i class="fas fa-info-circle me-2"></i>
  <strong>Informação:</strong> Mensagem informativa.
</div>

<div class="alert alert-success" role="alert">
  <i class="fas fa-check-circle me-2"></i>
  <strong>Sucesso:</strong> Operação realizada com sucesso!
</div>

<div class="alert alert-warning" role="alert">
  <i class="fas fa-exclamation-triangle me-2"></i>
  <strong>Atenção:</strong> Verifique os dados.
</div>

<div class="alert alert-danger" role="alert">
  <i class="fas fa-times-circle me-2"></i>
  <strong>Erro:</strong> Ocorreu um problema.
</div>
```

---

## 📝 FORMULÁRIOS

### Estrutura Padrão Bootstrap
```html
<form>
  <div class="mb-3">
    <label for="input" class="form-label">Label</label>
    <input type="text" class="form-control" id="input" placeholder="Placeholder">
    <div class="form-text">Texto de ajuda opcional.</div>
  </div>
  
  <div class="mb-3">
    <label for="select" class="form-label">Select</label>
    <select class="form-select" id="select">
      <option selected>Escolha...</option>
      <option value="1">Opção 1</option>
      <option value="2">Opção 2</option>
    </select>
  </div>
  
  <div class="mb-3">
    <label for="textarea" class="form-label">Textarea</label>
    <textarea class="form-control" id="textarea" rows="3"></textarea>
  </div>
  
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="check">
    <label class="form-check-label" for="check">Checkbox</label>
  </div>
  
  <button type="submit" class="btn btn-primary">Enviar</button>
</form>
```

### Formulários Aprimorados
```html
<div class="mb-3">
  <label for="enhanced-input" class="form-label fw-semibold">Campo Aprimorado</label>
  <input type="text" class="form-control form-control-enhanced" id="enhanced-input">
</div>

<div class="mb-3">
  <label for="input-group" class="form-label fw-semibold">Com Ícone</label>
  <div class="input-group">
    <span class="input-group-text">
      <i class="fas fa-envelope"></i>
    </span>
    <input type="email" class="form-control form-control-enhanced" id="input-group">
  </div>
</div>
```

```css
.form-control-enhanced {
  border: 2px solid var(--bs-border-color);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}

.form-control-enhanced:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
}
```

### Estados de Validação
```html
<!-- Campo válido -->
<input type="text" class="form-control is-valid" value="Dados corretos">
<div class="valid-feedback">Perfeito!</div>

<!-- Campo inválido -->
<input type="text" class="form-control is-invalid" value="Dados incorretos">
<div class="invalid-feedback">Corrija este campo.</div>
```

---

## 📐 SISTEMA DE GRID

### Breakpoints Bootstrap
| Breakpoint | Class infix | Dimensions |
|------------|-------------|------------|
| Extra small | *None* | <576px |
| Small | `sm` | ≥576px |
| Medium | `md` | ≥768px |
| Large | `lg` | ≥992px |
| Extra large | `xl` | ≥1200px |
| Extra extra large | `xxl` | ≥1400px |

### Estrutura de Grid
```html
<div class="container">
  <div class="row g-3"> <!-- g-3 = gap entre colunas -->
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card">Conteúdo 1</div>
    </div>
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card">Conteúdo 2</div>
    </div>
    <div class="col-12 col-md-12 col-lg-4">
      <div class="card">Conteúdo 3</div>
    </div>
  </div>
</div>
```

### Containers
```html
<!-- Container fixo -->
<div class="container">...</div>

<!-- Container fluido (100% width) -->
<div class="container-fluid">...</div>

<!-- Container responsivo -->
<div class="container-sm">...</div> <!-- 100% até sm -->
<div class="container-md">...</div> <!-- 100% até md -->
<div class="container-lg">...</div> <!-- 100% até lg -->
<div class="container-xl">...</div> <!-- 100% até xl -->
<div class="container-xxl">...</div> <!-- 100% até xxl -->
```

---

## 🔧 UTILITÁRIOS BOOTSTRAP

### Espaçamento
```html
<!-- Margins -->
<div class="m-0">margin: 0</div>
<div class="m-1">margin: 0.25rem</div>
<div class="m-2">margin: 0.5rem</div>
<div class="m-3">margin: 1rem</div>
<div class="m-4">margin: 1.5rem</div>
<div class="m-5">margin: 3rem</div>

<!-- Paddings -->
<div class="p-0">padding: 0</div>
<div class="p-1">padding: 0.25rem</div>
<div class="p-2">padding: 0.5rem</div>
<div class="p-3">padding: 1rem</div>
<div class="p-4">padding: 1.5rem</div>
<div class="p-5">padding: 3rem</div>

<!-- Direções específicas -->
<div class="mt-3">margin-top: 1rem</div>
<div class="mb-4">margin-bottom: 1.5rem</div>
<div class="ms-2">margin-start: 0.5rem</div>
<div class="me-1">margin-end: 0.25rem</div>
<div class="mx-auto">margin horizontal: auto</div>
<div class="my-3">margin vertical: 1rem</div>
```

### Display
```html
<div class="d-none">display: none</div>
<div class="d-block">display: block</div>
<div class="d-flex">display: flex</div>
<div class="d-inline">display: inline</div>
<div class="d-inline-block">display: inline-block</div>

<!-- Responsivo -->
<div class="d-none d-md-block">Oculto em mobile, visível em desktop</div>
<div class="d-block d-md-none">Visível em mobile, oculto em desktop</div>
```

### Flexbox
```html
<div class="d-flex justify-content-center">justify-content: center</div>
<div class="d-flex justify-content-between">justify-content: space-between</div>
<div class="d-flex align-items-center">align-items: center</div>
<div class="d-flex flex-column">flex-direction: column</div>
<div class="d-flex flex-wrap">flex-wrap: wrap</div>
<div class="d-flex gap-3">gap: 1rem</div>
```

### Texto
```html
<div class="text-start">text-align: start</div>
<div class="text-center">text-align: center</div>
<div class="text-end">text-align: end</div>

<div class="fw-light">font-weight: 300</div>
<div class="fw-normal">font-weight: 400</div>
<div class="fw-bold">font-weight: 700</div>

<div class="text-primary">Cor primary</div>
<div class="text-secondary">Cor secondary</div>
<div class="text-muted">Cor muted</div>
```

### Cores de Background
```html
<div class="bg-primary text-white">Background primary</div>
<div class="bg-secondary text-white">Background secondary</div>
<div class="bg-light text-dark">Background light</div>
<div class="bg-dark text-white">Background dark</div>
```

---

## 📱 RESPONSIVIDADE

### Estratégia Mobile-First
```css
/* Base (mobile) */
.elemento {
  font-size: 1rem;
  padding: 1rem;
}

/* Tablet e acima */
@media (min-width: 768px) {
  .elemento {
    font-size: 1.125rem;
    padding: 1.5rem;
  }
}

/* Desktop e acima */
@media (min-width: 992px) {
  .elemento {
    font-size: 1.25rem;
    padding: 2rem;
  }
}
```

### Classes Responsivas Bootstrap
```html
<!-- Colunas responsivas -->
<div class="col-12 col-sm-6 col-md-4 col-lg-3">
  <!-- 100% mobile, 50% tablet, 33% desktop, 25% large -->
</div>

<!-- Display responsivo -->
<div class="d-none d-md-block">Oculto em mobile</div>
<div class="d-block d-md-none">Visível apenas em mobile</div>

<!-- Texto responsivo -->
<h1 class="fs-6 fs-md-4 fs-lg-1">Título responsivo</h1>

<!-- Espaçamento responsivo -->
<div class="p-2 p-md-3 p-lg-4">Padding responsivo</div>
```

---

## 🎭 SISTEMA DE TEMAS

### Implementação de Tema Escuro
```html
<!-- Aplicar tema escuro -->
<html data-bs-theme="dark">
```

```javascript
// Toggle de tema
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-bs-theme');
  
  if (currentTheme === 'dark') {
    html.setAttribute('data-bs-theme', 'light');
  } else {
    html.setAttribute('data-bs-theme', 'dark');
  }
}
```

### Customização de Cores por Tema
```css
/* Tema claro (padrão) */
:root {
  --custom-bg: #ffffff;
  --custom-text: #212529;
}

/* Tema escuro */
[data-bs-theme="dark"] {
  --custom-bg: #1a1a1a;
  --custom-text: #ffffff;
}

/* Uso das variáveis */
.meu-componente {
  background-color: var(--custom-bg);
  color: var(--custom-text);
}
```

---

## 🚀 IMPLEMENTAÇÃO

### Ordem de Implementação Sugerida

1. **Fase 1: Base**
   - Migrar tipografia (Inter font)
   - Implementar variáveis de cores Bootstrap
   - Configurar tema escuro

2. **Fase 2: Utilitários**
   - Substituir classes de espaçamento customizadas
   - Migrar para utilitários de display e flexbox
   - Implementar classes de texto Bootstrap

3. **Fase 3: Componentes**
   - Padronizar botões com classes Bootstrap
   - Migrar estrutura de cards
   - Atualizar formulários

4. **Fase 4: Layout**
   - Implementar grid system Bootstrap
   - Configurar containers responsivos
   - Otimizar breakpoints

5. **Fase 5: Efeitos Especiais**
   - Manter efeitos neon customizados
   - Preservar gradientes únicos
   - Adicionar animações de hover

### Arquivos a Serem Modificados

#### Prioridade Alta
- `css/styles.css` - Arquivo principal
- `index.html` - Página inicial
- `header.html` - Navegação
- `dashboard.html` - Interface principal

#### Prioridade Média
- `dashboard/pages/*.html` - Páginas do dashboard
- `auth.html` - Página de autenticação
- `admin-panel.html` - Painel administrativo

#### Prioridade Baixa
- `css/widget-sale.css` - Widget isolado (manter separado)
- Arquivos de backup e teste

### Checklist de Migração

- [ ] Configurar Bootstrap 5.3 CDN
- [ ] Implementar fonte Inter
- [ ] Migrar variáveis de cores
- [ ] Configurar tema escuro
- [ ] Atualizar classes de botões
- [ ] Migrar estrutura de cards
- [ ] Padronizar formulários
- [ ] Implementar grid system
- [ ] Adicionar utilitários de espaçamento
- [ ] Testar responsividade
- [ ] Otimizar performance
- [ ] Validar acessibilidade

---

## 📊 BENEFÍCIOS ESPERADOS

### Performance
- **Redução de CSS**: ~60% menos código customizado
- **Cache**: Uso de CDN Bootstrap (cache compartilhado)
- **Otimização**: CSS Bootstrap otimizado e minificado

### Manutenibilidade
- **Padrões**: Uso de convenções conhecidas
- **Documentação**: Bootstrap bem documentado
- **Comunidade**: Suporte ativo da comunidade

### Desenvolvimento
- **Velocidade**: Desenvolvimento mais rápido
- **Consistência**: Visual uniforme
- **Responsividade**: Sistema grid robusto

### Acessibilidade
- **ARIA**: Componentes com atributos ARIA
- **Contraste**: Cores com contraste adequado
- **Navegação**: Suporte a navegação por teclado

---

## 🔍 VALIDAÇÃO E TESTES

### Checklist de Testes
- [ ] Teste em Chrome, Firefox, Safari, Edge
- [ ] Teste em dispositivos móveis (iOS/Android)
- [ ] Teste de acessibilidade (WAVE, axe)
- [ ] Teste de performance (Lighthouse)
- [ ] Teste de tema escuro/claro
- [ ] Teste de responsividade (todos os breakpoints)

### Ferramentas Recomendadas
- **Browser DevTools**: Teste responsivo
- **Lighthouse**: Performance e acessibilidade
- **WAVE**: Validação de acessibilidade
- **BrowserStack**: Teste cross-browser
- **Figma**: Comparação visual

---

## 📚 RECURSOS E REFERÊNCIAS

### Documentação
- [Bootstrap 5.3 Documentation](https://getbootstrap.com/docs/5.3/)
- [Inter Font](https://fonts.google.com/specimen/Inter)
- [Font Awesome Icons](https://fontawesome.com/icons)

### Ferramentas
- [Bootstrap Customizer](https://bootstrap.build/)
- [Color Palette Generator](https://coolors.co/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Inspiração
- [Bootstrap Examples](https://getbootstrap.com/docs/5.3/examples/)
- [Material Design](https://material.io/design)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

---

*Documento criado em: Dezembro 2024*  
*Versão: 1.0*  
*Autor: Widget SaaS Team*