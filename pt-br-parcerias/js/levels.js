/**
 * O Pior Onboarding de Todos os Tempos — Lógica dos Níveis
 * Cada nível é um anti-padrão de onboarding que o jogador precisa sobreviver
 */

const Levels = {

  getInfo(num) {
    const info = {
      1: { name: 'O Modal de Boas-Vindas do Inferno', tagline: 'Só me deixa entrar logo.' },
      2: { name: 'O Muro do Cadastro', tagline: 'Cadastre-se antes de saber o que isso faz.' },
      3: { name: 'O Tour de Tooltips do Terror', tagline: '1 de 47. Não, você não pode pular.' },
      4: { name: 'O Abismo do Estado Vazio', tagline: 'Bem-vindo! Agora se vira.' },
      5: { name: 'O Grande Final', tagline: 'Tudo. De uma vez. Boa sorte.' },
    };
    return info[num];
  },

  load(num) {
    const container = document.getElementById(`level-${num}`);
    container.classList.remove('hidden');
    this[`level${num}`](container);
  },

  // ════════════════════════════════════════════════════════
  // NÍVEL 1: O Modal de Boas-Vindas do Inferno
  // ════════════════════════════════════════════════════════
  level1(container) {
    container.innerHTML = `
      <div class="l1-page">
        <div class="l1-content-behind">
          <h2>Bem-vindo ao ProductApp Pro</h2>
          <p>O melhor produto que você nunca vai conseguir ver.</p>
          <button class="l1-next-btn hidden" data-valid-click id="l1-complete">Continuar para o Próximo Nível →</button>
        </div>

        <div class="l1-cookie-banner" id="l1-cookie">
          <p>🍪 Usamos cookies. MUITOS cookies. Usamos cookies pra rastrear cookies que rastreiam outros cookies.</p>
          <div class="l1-cookie-buttons">
            <button class="l1-cookie-accept" data-valid-click id="l1-cookie-accept">Aceitar Todos os 847 Cookies</button>
            <button class="l1-cookie-reject" id="l1-cookie-reject-fake">Rejeitar Todos</button>
            <button class="l1-cookie-reject-real" data-valid-click id="l1-cookie-reject-real">rejeitar</button>
          </div>
        </div>

        <div class="l1-overlay" id="l1-overlay"></div>

        <div class="l1-modal" id="l1-modal-1">
          <button class="l1-close-btn" data-valid-click id="l1-close-1">×</button>
          <h3>🎉 Bem-vindo! Estamos MUITO empolgados que você está aqui!</h3>
          <p>Antes de começar, por favor leia nossos termos de serviço de 47 páginas, política de privacidade, política de cookies, política de uso aceitável e diretrizes da comunidade.</p>
          <p>Ah, e adoraríamos te mandar 14 emails por dia. Você pode cancelar a qualquer momento (em teoria).</p>
          <div class="l1-modal-footer">
            <button class="l1-modal-btn-secondary" data-valid-click id="l1-maybe-later">Talvez Depois</button>
            <button class="l1-modal-btn-primary" data-valid-click id="l1-agree">Concordo com Tudo</button>
          </div>
        </div>

        <div class="l1-modal l1-modal-confirm hidden" id="l1-modal-2">
          <h3>Espera! Tem certeza?</h3>
          <p>Você está prestes a perder uma experiência incrível que com certeza vai mudar sua vida para sempre.</p>
          <div class="l1-modal-footer">
            <button class="l1-btn-swap-yes" data-valid-click id="l1-swap-yes">Não, continua me mostrando popups</button>
            <button class="l1-btn-swap-no" data-valid-click id="l1-swap-no">Sim, tenho certeza, fecha isso por favor</button>
          </div>
        </div>
      </div>
    `;

    let modalDismissed = false;
    let cookieDismissed = false;

    const checkWin = () => {
      if (modalDismissed && cookieDismissed) {
        container.querySelector('.l1-next-btn').classList.remove('hidden');
      }
    };

    // Close button on modal 1 → shows confirm modal
    document.getElementById('l1-close-1').addEventListener('click', () => {
      document.getElementById('l1-modal-1').classList.add('hidden');
      document.getElementById('l1-modal-2').classList.remove('hidden');
    });

    // "Concordo com Tudo" → shows confirm too
    document.getElementById('l1-agree').addEventListener('click', () => {
      document.getElementById('l1-modal-1').classList.add('hidden');
      document.getElementById('l1-modal-2').classList.remove('hidden');
    });

    // "Talvez Depois" → same thing
    document.getElementById('l1-maybe-later').addEventListener('click', () => {
      document.getElementById('l1-modal-1').classList.add('hidden');
      document.getElementById('l1-modal-2').classList.remove('hidden');
    });

    // SWAPPED buttons on confirm modal
    // "Não, continua me mostrando popups" → actually closes
    document.getElementById('l1-swap-yes').addEventListener('click', () => {
      document.getElementById('l1-modal-2').classList.add('hidden');
      document.getElementById('l1-overlay').classList.add('hidden');
      modalDismissed = true;
      checkWin();
    });

    // "Sim, tenho certeza, fecha isso por favor" → reopens modal 1
    document.getElementById('l1-swap-no').addEventListener('click', () => {
      document.getElementById('l1-modal-2').classList.add('hidden');
      document.getElementById('l1-modal-1').classList.remove('hidden');
    });

    // Cookie banner - "Rejeitar Todos" is fake
    document.getElementById('l1-cookie-reject-fake').addEventListener('click', (e) => {
      e.target.textContent = 'Kkk não.';
      setTimeout(() => e.target.textContent = 'Rejeitar Todos', 1000);
    });

    // Cookie "Aceitar Todos" works
    document.getElementById('l1-cookie-accept').addEventListener('click', () => {
      document.getElementById('l1-cookie').classList.add('hidden');
      cookieDismissed = true;
      checkWin();
    });

    // Tiny real reject button
    document.getElementById('l1-cookie-reject-real').addEventListener('click', () => {
      document.getElementById('l1-cookie').classList.add('hidden');
      cookieDismissed = true;
      checkWin();
    });

    // Complete level
    document.getElementById('l1-complete').addEventListener('click', () => {
      Game.completeLevel();
    });
  },

  // ════════════════════════════════════════════════════════
  // NÍVEL 2: O Muro do Cadastro
  // ════════════════════════════════════════════════════════
  level2(container) {
    container.innerHTML = `
      <div class="l2-page">
        <div class="l2-form-wrapper">
          <h2>Crie Sua Conta</h2>
          <p class="l2-subtitle">Preencha TODOS os campos para continuar. Todos são obrigatórios. Sem exceções.</p>

          <form class="l2-form" id="l2-form" autocomplete="off">
            <div class="l2-field">
              <label for="l2-phone">Endereço de Email</label>
              <input type="text" id="l2-phone" placeholder="Digite seu número de telefone" data-valid-click>
              <span class="l2-hint">Formato: +55 (11) 99999-9999</span>
            </div>

            <div class="l2-field">
              <label for="l2-email">Número de Telefone</label>
              <input type="text" id="l2-email" placeholder="Digite seu endereço de email" data-valid-click>
              <span class="l2-hint">Nunca vamos te ligar (vamos mandar email no lugar)</span>
            </div>

            <div class="l2-field">
              <label for="l2-name">Faturamento Anual da Empresa</label>
              <input type="text" id="l2-name" placeholder="Digite seu nome completo" data-valid-click>
            </div>

            <div class="l2-field">
              <label for="l2-company">Tipo Sanguíneo</label>
              <input type="text" id="l2-company" placeholder="Digite o nome da sua empresa" data-valid-click>
            </div>

            <div class="l2-field">
              <label for="l2-password">Senha</label>
              <input type="password" id="l2-password" placeholder="Escolha uma senha forte" data-valid-click>
              <div class="l2-pw-rules">
                <span class="l2-rule" id="l2-rule-1">✗ Deve conter um número</span>
                <span class="l2-rule" id="l2-rule-2">✗ Não pode conter nenhum dígito</span>
                <span class="l2-rule" id="l2-rule-3">✗ Deve ter exatamente 12 caracteres</span>
                <span class="l2-rule" id="l2-rule-4">✗ Deve incluir o nome de solteira da sua mãe</span>
              </div>
            </div>

            <div class="l2-field">
              <label for="l2-role">Como você ficou sabendo da gente?</label>
              <select id="l2-role" data-valid-click>
                <option value="">Selecione...</option>
                <option value="dream">Apareceu num sonho</option>
                <option value="billboard">Outdoor em Marte</option>
                <option value="carrier">Pombo-correio</option>
                <option value="telepathy">Telepatia corporativa</option>
              </select>
            </div>

            <div class="l2-checkbox-field">
              <input type="checkbox" id="l2-terms" data-valid-click>
              <label for="l2-terms">Concordo com os Termos de Serviço, Política de Privacidade, Política de Cookies, Acordo de Processamento de Dados, Política de Uso Aceitável, Diretrizes da Comunidade e a Convenção de Genebra inteira</label>
            </div>

            <button type="button" class="l2-submit-btn" id="l2-fake-submit" data-valid-click>Talvez Depois</button>
          </form>

          <p class="l2-skip-link">Já tem uma conta? <span data-valid-click id="l2-real-submit">pular por enquanto</span></p>
        </div>
      </div>
    `;

    // Checkbox unchecks itself
    let checkboxInterval;
    const checkbox = document.getElementById('l2-terms');
    checkboxInterval = setInterval(() => {
      if (checkbox.checked) {
        setTimeout(() => {
          checkbox.checked = false;
        }, 2000);
      }
    }, 500);

    // Password validation — contradictory rules
    const pwInput = document.getElementById('l2-password');
    pwInput.addEventListener('input', () => {
      const val = pwInput.value;
      const r1 = document.getElementById('l2-rule-1');
      const r2 = document.getElementById('l2-rule-2');
      const r3 = document.getElementById('l2-rule-3');
      const r4 = document.getElementById('l2-rule-4');

      r1.textContent = /\d/.test(val) ? '✓ Deve conter um número' : '✗ Deve conter um número';
      r1.className = /\d/.test(val) ? 'l2-rule l2-rule-pass' : 'l2-rule';

      r2.textContent = !/\d/.test(val) ? '✓ Não pode conter nenhum dígito' : '✗ Não pode conter nenhum dígito';
      r2.className = !/\d/.test(val) ? 'l2-rule l2-rule-pass' : 'l2-rule';

      r3.textContent = val.length === 12 ? '✓ Deve ter exatamente 12 caracteres' : '✗ Deve ter exatamente 12 caracteres';
      r3.className = val.length === 12 ? 'l2-rule l2-rule-pass' : 'l2-rule';
    });

    // Fake submit does nothing useful
    document.getElementById('l2-fake-submit').addEventListener('click', () => {
      const btn = document.getElementById('l2-fake-submit');
      btn.textContent = 'Enviando...';
      setTimeout(() => {
        btn.textContent = 'Erro: Tipo sanguíneo é obrigatório';
        setTimeout(() => btn.textContent = 'Talvez Depois', 2000);
      }, 1500);
    });

    // Real submit is the tiny "pular por enquanto" link
    document.getElementById('l2-real-submit').addEventListener('click', () => {
      clearInterval(checkboxInterval);
      Game.completeLevel();
    });
  },

  // ════════════════════════════════════════════════════════
  // NÍVEL 3: O Tour de Tooltips do Terror
  // ════════════════════════════════════════════════════════
  level3(container) {
    container.innerHTML = `
      <div class="l3-dashboard">
        <div class="l3-sidebar">
          <div class="l3-logo">ProductApp</div>
          <nav class="l3-nav">
            <a class="l3-nav-item active" id="l3-nav-dashboard">📊 Dashboard</a>
            <a class="l3-nav-item" id="l3-nav-projects">📁 Projetos</a>
            <a class="l3-nav-item" id="l3-nav-team">👥 Equipe</a>
            <a class="l3-nav-item" id="l3-nav-settings">⚙️ Configurações</a>
            <a class="l3-nav-item" id="l3-nav-billing">💳 Cobrança</a>
          </nav>
        </div>
        <div class="l3-main">
          <div class="l3-header">
            <h2>Dashboard</h2>
            <div class="l3-header-actions">
              <button class="l3-btn" id="l3-btn-new">+ Novo Projeto</button>
              <button class="l3-btn-icon" id="l3-btn-notif">🔔</button>
              <div class="l3-avatar" id="l3-avatar">M</div>
            </div>
          </div>
          <div class="l3-content">
            <div class="l3-card" id="l3-card-1">
              <h4>Projetos Ativos</h4>
              <p class="l3-stat">0</p>
            </div>
            <div class="l3-card" id="l3-card-2">
              <h4>Membros da Equipe</h4>
              <p class="l3-stat">1</p>
            </div>
            <div class="l3-card" id="l3-card-3">
              <h4>Tarefas Concluídas</h4>
              <p class="l3-stat">0</p>
            </div>
          </div>
        </div>

        <div class="l3-tooltip-overlay" id="l3-tooltip-overlay"></div>
        <div class="l3-tooltip" id="l3-tooltip">
          <div class="l3-tooltip-counter" id="l3-tooltip-counter">1 de 47</div>
          <p class="l3-tooltip-text" id="l3-tooltip-text"></p>
          <button class="l3-tooltip-next" data-valid-click id="l3-tooltip-next">Próximo →</button>
        </div>
      </div>
    `;

    const tooltips = [
      { target: '#l3-nav-dashboard', text: 'Este é o link do Dashboard. Ele te leva pro Dashboard. Você já está no Dashboard.', position: 'right' },
      { target: '#l3-btn-new', text: 'Este botão cria um novo projeto. Você pode clicar nele para criar um novo projeto. É um botão.', position: 'bottom' },
      { target: '#l3-card-1', text: 'Este card mostra seus projetos ativos. Você tem 0. Isso significa que você não tem projetos ativos. Zero é um número que representa nada.', position: 'bottom' },
      { target: '#l3-btn-notif', text: 'Este é o sino de notificações. Ele vai te notificar sobre notificações. No momento não há notificações para te notificar.', position: 'bottom', coverNext: true },
      { target: '#l3-nav-settings', text: 'Configurações. Para configurar coisas. Você pode configurar suas configurações na seção de configurações das configurações.', position: 'right' },
    ];

    let currentTooltip = 0;
    let restartCount = 0;

    const showTooltip = (index) => {
      const tooltip = document.getElementById('l3-tooltip');
      const overlay = document.getElementById('l3-tooltip-overlay');
      const data = tooltips[index];
      const target = container.querySelector(data.target);

      if (!target) return;

      const rect = target.getBoundingClientRect();

      // Position tooltip to COVER the target element
      if (data.position === 'right') {
        tooltip.style.left = (rect.right + 12) + 'px';
        tooltip.style.top = rect.top + 'px';
      } else {
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.bottom + 12) + 'px';
      }

      // If this tooltip should cover the Next button
      if (data.coverNext) {
        tooltip.classList.add('l3-tooltip-cover-next');
      } else {
        tooltip.classList.remove('l3-tooltip-cover-next');
      }

      document.getElementById('l3-tooltip-text').textContent = data.text;

      // Counter shenanigans
      const fakeTotal = index <= 2 ? 47 : (index === 3 ? 47 : 47);
      document.getElementById('l3-tooltip-counter').textContent = `${index + 1} de ${fakeTotal}`;

      tooltip.classList.remove('hidden');
      overlay.classList.remove('hidden');

      // Highlight target
      container.querySelectorAll('.l3-tooltip-highlight').forEach(el => el.classList.remove('l3-tooltip-highlight'));
      target.classList.add('l3-tooltip-highlight');
    };

    // Click outside overlay = restart tour
    document.getElementById('l3-tooltip-overlay').addEventListener('click', (e) => {
      if (e.target === document.getElementById('l3-tooltip-overlay')) {
        restartCount++;
        currentTooltip = 0;

        const counter = document.getElementById('l3-tooltip-counter');
        if (restartCount === 1) {
          counter.textContent = 'Reiniciando o tour...';
        } else if (restartCount >= 2) {
          counter.textContent = `Tour reiniciado ${restartCount} vezes. Está se divertindo?`;
        }
        setTimeout(() => showTooltip(0), 800);
      }
    });

    // Next button
    document.getElementById('l3-tooltip-next').addEventListener('click', () => {
      currentTooltip++;
      if (currentTooltip >= tooltips.length) {
        // The punchline: jumps from 5 to "Done!"
        document.getElementById('l3-tooltip').classList.add('hidden');
        document.getElementById('l3-tooltip-overlay').classList.add('hidden');
        container.querySelectorAll('.l3-tooltip-highlight').forEach(el => el.classList.remove('l3-tooltip-highlight'));

        // Show completion
        const main = container.querySelector('.l3-content');
        main.innerHTML = `
          <div class="l3-tour-done">
            <h3>🎉 Tour Completo!</h3>
            <p>Parabéns, agora você sabe que botões são botões e dashboards mostram dashboards.</p>
            <p class="l3-tour-stats">Tour reiniciado ${restartCount} vez${restartCount !== 1 ? 'es' : ''}.</p>
            <button class="l3-done-btn" data-valid-click id="l3-complete">Me sinto muito bem informado →</button>
          </div>
        `;
        document.getElementById('l3-complete').addEventListener('click', () => Game.completeLevel());
      } else {
        showTooltip(currentTooltip);
      }
    });

    // Start the tour
    showTooltip(0);
  },

  // ════════════════════════════════════════════════════════
  // NÍVEL 4: O Abismo do Estado Vazio
  // ════════════════════════════════════════════════════════
  level4(container) {
    container.innerHTML = `
      <div class="l4-dashboard">
        <div class="l4-sidebar">
          <div class="l4-logo">ProductApp</div>
          <nav class="l4-nav">
            <a class="l4-nav-item active">📊 Dashboard</a>
            <a class="l4-nav-item" data-valid-click id="l4-projects-link">📁 Projetos</a>
            <a class="l4-nav-item" data-valid-click id="l4-reports-link">📈 Relatórios</a>
            <a class="l4-nav-item" data-valid-click id="l4-help-link">❓ Central de Ajuda</a>
            <a class="l4-nav-item" data-valid-click id="l4-docs-link">📖 Documentação</a>
          </nav>
        </div>
        <div class="l4-main">
          <div class="l4-empty">
            <div class="l4-empty-icon">📭</div>
            <h2>Bem-vindo!</h2>
            <p class="l4-empty-text">Tudo pronto! Seu dashboard está preparado.</p>
            <button class="l4-cta-btn" data-valid-click id="l4-get-started">🚀 Começar!</button>
          </div>
          <div class="l4-empty-sub">
            <p>Precisa de inspiração? Veja o que outros usuários estão criando.</p>
            <button class="l4-sub-btn" data-valid-click id="l4-inspiration">Ver Exemplos</button>
          </div>
        </div>
        <footer class="l4-footer">
          <span>© 2026 ProductApp Inc.</span>
          <span>•</span>
          <span data-valid-click id="l4-privacy">Privacidade</span>
          <span>•</span>
          <span data-valid-click id="l4-terms-link">Termos</span>
          <span>•</span>
          <span class="l4-hidden-link" data-valid-click id="l4-create-project">crie seu primeiro projeto</span>
        </footer>
      </div>
    `;

    let clickCount = 0;
    const addClickFeedback = (message) => {
      clickCount++;
      const existing = container.querySelector('.l4-feedback');
      if (existing) existing.remove();

      const fb = document.createElement('div');
      fb.className = 'l4-feedback';
      fb.textContent = message;
      container.querySelector('.l4-main').appendChild(fb);
      setTimeout(() => fb.remove(), 2000);
    };

    // "Começar" does nothing
    document.getElementById('l4-get-started').addEventListener('click', () => {
      const messages = [
        'Carregando...',
        'Ainda carregando...',
        'Brincadeira. Não aconteceu nada.',
        'Você realmente achou que ia funcionar?',
        'Tenta clicar com mais força.',
        'Admiramos sua persistência.',
      ];
      addClickFeedback(messages[Math.min(clickCount, messages.length - 1)]);
    });

    // "Ver Exemplos" is equally useless
    document.getElementById('l4-inspiration').addEventListener('click', () => {
      addClickFeedback('Os exemplos estão sendo exemplificados. Volte nunca.');
    });

    // Projects link
    document.getElementById('l4-projects-link').addEventListener('click', () => {
      addClickFeedback('Você não tem projetos. Porque você não criou nenhum. Óbvio.');
    });

    // Reports link
    document.getElementById('l4-reports-link').addEventListener('click', () => {
      addClickFeedback('Relatórios precisam de dados. Dados precisam de uso. Uso precisa de... algo.');
    });

    // Help link — "opens" a 404
    document.getElementById('l4-help-link').addEventListener('click', () => {
      addClickFeedback('A Central de Ajuda está se ajudando. Erro 404.');
    });

    // Docs link
    document.getElementById('l4-docs-link').addEventListener('click', () => {
      addClickFeedback('Documentação em breve™ (desde 2019)');
    });

    // Footer links do nothing
    document.getElementById('l4-privacy').addEventListener('click', () => {
      addClickFeedback('Privacidade? Nessa economia?');
    });

    document.getElementById('l4-terms-link').addEventListener('click', () => {
      addClickFeedback('Os termos são: não existem termos.');
    });

    // THE REAL EXIT — tiny hidden footer link
    document.getElementById('l4-create-project').addEventListener('click', () => {
      Game.completeLevel();
    });
  },

  // ════════════════════════════════════════════════════════
  // NÍVEL 5: O Grande Final
  // ════════════════════════════════════════════════════════
  level5(container) {
    container.innerHTML = `
      <div class="l5-chaos">
        <div class="l5-bg-dashboard">
          <div class="l5-header">
            <h2>ProductApp Dashboard</h2>
            <div class="l5-progress-bar">
              <div class="l5-progress-fill"></div>
              <span class="l5-progress-text">150% Completo</span>
            </div>
          </div>
        </div>

        <div class="l5-cookie-banner" id="l5-cookie">
          <p>🍪 Percebemos que você já aceitou os cookies. Gostaria de aceitar de novo? Só por garantia.</p>
          <button class="l5-cookie-btn" data-valid-click id="l5-cookie-btn">Aceitar de Novo</button>
        </div>

        <div class="l5-overlay" id="l5-overlay-1"></div>
        <div class="l5-modal l5-modal-1" id="l5-modal-1">
          <h3>🎉 Bem-vindo de Volta (De Novo)!</h3>
          <p>Sentimos sua falta! Faz 0 segundos desde sua última visita!</p>
          <button class="l5-modal-btn" data-valid-click id="l5-close-modal-1">Tá Bom</button>
        </div>

        <div class="l5-modal l5-modal-2 hidden" id="l5-modal-2">
          <h3>Espera! Mais uma coisa!</h3>
          <p>Já considerou fazer upgrade pro nosso plano Enterprise? São apenas R$ 499.999/mês!</p>
          <button class="l5-modal-btn" data-valid-click id="l5-close-modal-2">Não, Obrigado</button>
          <button class="l5-modal-btn l5-modal-btn-primary" data-valid-click id="l5-upgrade">Fazer Upgrade</button>
        </div>

        <div class="l5-modal l5-modal-3 hidden" id="l5-modal-3">
          <h3>📋 Pesquisa Rápida</h3>
          <p>De 1 a 10, quão frustrado você está agora?</p>
          <div class="l5-nps-row">
            ${[1,2,3,4,5,6,7,8,9,10].map(n => `<button class="l5-nps-btn" data-valid-click data-nps="${n}">${n}</button>`).join('')}
          </div>
        </div>

        <div class="l5-tooltip l5-floating-tooltip" id="l5-tooltip">
          <span class="l5-tooltip-counter">1 de ∞</span>
          <p>Esse caos que você está vendo? Isso se chama "engajamento."</p>
          <button class="l5-tooltip-dismiss" data-valid-click id="l5-dismiss-tooltip">Entendi</button>
        </div>

        <div class="l5-form-floating hidden" id="l5-form">
          <h4>Só mais um campinho!</h4>
          <input type="text" placeholder="Nome de solteira da sua mãe" data-valid-click class="l5-input">
          <button class="l5-form-submit" data-valid-click id="l5-form-submit">Enviar</button>
        </div>

        <button class="l5-survived-btn" data-valid-click id="l5-survived">Sobrevivi</button>
      </div>
    `;

    let modalsCleared = 0;
    let surveyDone = false;
    let cookieRedone = false;
    const checkSurvived = () => {
      // The button is always there, just hard to find
    };

    // Modal 1 close → shows modal 2
    document.getElementById('l5-close-modal-1').addEventListener('click', () => {
      document.getElementById('l5-modal-1').classList.add('hidden');
      document.getElementById('l5-modal-2').classList.remove('hidden');
      modalsCleared++;
    });

    // Modal 2 close → shows modal 3 (survey)
    document.getElementById('l5-close-modal-2').addEventListener('click', () => {
      document.getElementById('l5-modal-2').classList.add('hidden');
      document.getElementById('l5-modal-3').classList.remove('hidden');
      modalsCleared++;
    });

    // Upgrade button → same as close
    document.getElementById('l5-upgrade').addEventListener('click', () => {
      document.getElementById('l5-modal-2').classList.add('hidden');
      document.getElementById('l5-modal-3').classList.remove('hidden');
      modalsCleared++;
    });

    // NPS buttons → close survey, show floating form
    container.querySelectorAll('.l5-nps-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('l5-modal-3').classList.add('hidden');
        document.getElementById('l5-overlay-1').classList.add('hidden');
        document.getElementById('l5-form').classList.remove('hidden');
        surveyDone = true;
      });
    });

    // Form submit → hide form
    document.getElementById('l5-form-submit').addEventListener('click', () => {
      document.getElementById('l5-form').classList.add('hidden');
    });

    // Cookie re-accept
    document.getElementById('l5-cookie-btn').addEventListener('click', () => {
      document.getElementById('l5-cookie').classList.add('hidden');
      cookieRedone = true;
    });

    // Dismiss tooltip
    document.getElementById('l5-dismiss-tooltip').addEventListener('click', () => {
      const tip = document.getElementById('l5-tooltip');
      tip.style.top = (Math.random() * 60 + 10) + '%';
      tip.style.left = (Math.random() * 60 + 10) + '%';
      tip.querySelector('p').textContent = [
        'Você dispensou um tooltip! Toma outro.',
        'Tooltips são como gatos. Eles sempre voltam.',
        'Este é o tooltip #∞. Temos tooltips ilimitados.',
        'Você tá indo bem! (em dispensar tooltips)',
      ][Math.floor(Math.random() * 4)];
    });

    // THE WIN BUTTON — tiny, hidden in the chaos
    document.getElementById('l5-survived').addEventListener('click', () => {
      Game.completeLevel();
    });
  },
};
