/**
 * Worst Onboarding Ever — Level Logic
 * Each level is an onboarding anti-pattern the player must survive
 */

const Levels = {

  getInfo(num) {
    const info = {
      1: { name: 'The Welcome Modal From Hell', tagline: 'Just let me in already.' },
      2: { name: 'The Registration Wall', tagline: 'Sign up before you know what this even is.' },
      3: { name: 'The Tooltip Tour of Terror', tagline: '1 of 47. No, you cannot skip.' },
      4: { name: 'The Empty State Abyss', tagline: 'Welcome! Now figure it out yourself.' },
      5: { name: 'The Grand Finale', tagline: 'Everything. All at once. Good luck.' },
    };
    return info[num];
  },

  load(num) {
    const container = document.getElementById(`level-${num}`);
    container.classList.remove('hidden');
    this[`level${num}`](container);
  },

  // ════════════════════════════════════════════════════════
  // LEVEL 1: The Welcome Modal From Hell
  // ════════════════════════════════════════════════════════
  level1(container) {
    container.innerHTML = `
      <div class="l1-page">
        <div class="l1-content-behind">
          <h2>Welcome to ProductApp Pro</h2>
          <p>The best product you'll never get to see.</p>
          <button class="l1-next-btn hidden" data-valid-click id="l1-complete">Continue to Next Level →</button>
        </div>

        <div class="l1-cookie-banner" id="l1-cookie">
          <p>🍪 We use cookies. We use SO many cookies. We use cookies to track cookies.</p>
          <div class="l1-cookie-buttons">
            <button class="l1-cookie-accept" data-valid-click id="l1-cookie-accept">Accept All 847 Cookies</button>
            <button class="l1-cookie-reject" id="l1-cookie-reject-fake">Reject All</button>
            <button class="l1-cookie-reject-real" data-valid-click id="l1-cookie-reject-real">reject</button>
          </div>
        </div>

        <div class="l1-overlay" id="l1-overlay"></div>

        <div class="l1-modal" id="l1-modal-1">
          <button class="l1-close-btn" data-valid-click id="l1-close-1">×</button>
          <h3>🎉 Welcome! We're SO excited you're here!</h3>
          <p>Before you get started, please read our 47-page terms of service, privacy policy, cookie policy, acceptable use policy, and community guidelines.</p>
          <p>Also, we'd love to send you 14 emails a day. You can unsubscribe anytime (in theory).</p>
          <div class="l1-modal-footer">
            <button class="l1-modal-btn-secondary" data-valid-click id="l1-maybe-later">Maybe Later</button>
            <button class="l1-modal-btn-primary" data-valid-click id="l1-agree">I Agree to Everything</button>
          </div>
        </div>

        <div class="l1-modal l1-modal-confirm hidden" id="l1-modal-2">
          <h3>Wait! Are you sure?</h3>
          <p>You're about to miss out on an incredible experience that will definitely change your life forever.</p>
          <div class="l1-modal-footer">
            <button class="l1-btn-swap-yes" data-valid-click id="l1-swap-yes">No, keep showing me popups</button>
            <button class="l1-btn-swap-no" data-valid-click id="l1-swap-no">Yes, I'm sure, please close this</button>
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

    // "I Agree" → shows confirm too
    document.getElementById('l1-agree').addEventListener('click', () => {
      document.getElementById('l1-modal-1').classList.add('hidden');
      document.getElementById('l1-modal-2').classList.remove('hidden');
    });

    // "Maybe Later" → same thing
    document.getElementById('l1-maybe-later').addEventListener('click', () => {
      document.getElementById('l1-modal-1').classList.add('hidden');
      document.getElementById('l1-modal-2').classList.remove('hidden');
    });

    // SWAPPED buttons on confirm modal
    // "No, keep showing me popups" → actually closes (it says No but it's the right choice)
    document.getElementById('l1-swap-yes').addEventListener('click', () => {
      document.getElementById('l1-modal-2').classList.add('hidden');
      document.getElementById('l1-overlay').classList.add('hidden');
      modalDismissed = true;
      checkWin();
    });

    // "Yes, I'm sure, please close this" → reopens modal 1
    document.getElementById('l1-swap-no').addEventListener('click', () => {
      document.getElementById('l1-modal-2').classList.add('hidden');
      document.getElementById('l1-modal-1').classList.remove('hidden');
    });

    // Cookie banner - "Reject All" is fake (greyed out, does nothing visible)
    document.getElementById('l1-cookie-reject-fake').addEventListener('click', (e) => {
      e.target.textContent = 'Lol no.';
      setTimeout(() => e.target.textContent = 'Reject All', 1000);
    });

    // Cookie "Accept All" works
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
  // LEVEL 2: The Registration Wall
  // ════════════════════════════════════════════════════════
  level2(container) {
    container.innerHTML = `
      <div class="l2-page">
        <div class="l2-form-wrapper">
          <h2>Create Your Account</h2>
          <p class="l2-subtitle">Fill in ALL fields to continue. All fields are required. No exceptions.</p>

          <form class="l2-form" id="l2-form" autocomplete="off">
            <div class="l2-field">
              <label for="l2-phone">Email Address</label>
              <input type="text" id="l2-phone" placeholder="Enter your phone number" data-valid-click>
              <span class="l2-hint">Format: +1 (555) 123-4567</span>
            </div>

            <div class="l2-field">
              <label for="l2-email">Phone Number</label>
              <input type="text" id="l2-email" placeholder="Enter your email address" data-valid-click>
              <span class="l2-hint">We'll never call you (we'll email instead)</span>
            </div>

            <div class="l2-field">
              <label for="l2-name">Company Revenue (Annual)</label>
              <input type="text" id="l2-name" placeholder="Enter your full name" data-valid-click>
            </div>

            <div class="l2-field">
              <label for="l2-company">Blood Type</label>
              <input type="text" id="l2-company" placeholder="Enter your company name" data-valid-click>
            </div>

            <div class="l2-field">
              <label for="l2-password">Password</label>
              <input type="password" id="l2-password" placeholder="Choose a strong password" data-valid-click>
              <div class="l2-pw-rules">
                <span class="l2-rule" id="l2-rule-1">✗ Must contain a number</span>
                <span class="l2-rule" id="l2-rule-2">✗ Must not contain any digits</span>
                <span class="l2-rule" id="l2-rule-3">✗ Must be exactly 12 characters</span>
                <span class="l2-rule" id="l2-rule-4">✗ Must include your mother's maiden name</span>
              </div>
            </div>

            <div class="l2-field">
              <label for="l2-role">How did you hear about us?</label>
              <select id="l2-role" data-valid-click>
                <option value="">Select one...</option>
                <option value="dream">It came to me in a dream</option>
                <option value="billboard">Billboard on Mars</option>
                <option value="carrier">Carrier pigeon</option>
                <option value="telepathy">Corporate telepathy</option>
              </select>
            </div>

            <div class="l2-checkbox-field">
              <input type="checkbox" id="l2-terms" data-valid-click>
              <label for="l2-terms">I agree to the Terms of Service, Privacy Policy, Cookie Policy, Data Processing Agreement, Acceptable Use Policy, Community Guidelines, and the entire Geneva Convention</label>
            </div>

            <button type="button" class="l2-submit-btn" id="l2-fake-submit" data-valid-click>Maybe Later</button>
          </form>

          <p class="l2-skip-link">Already have an account? <span data-valid-click id="l2-real-submit">skip for now</span></p>
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

      r1.textContent = /\d/.test(val) ? '✓ Must contain a number' : '✗ Must contain a number';
      r1.className = /\d/.test(val) ? 'l2-rule l2-rule-pass' : 'l2-rule';

      r2.textContent = !/\d/.test(val) ? '✓ Must not contain any digits' : '✗ Must not contain any digits';
      r2.className = !/\d/.test(val) ? 'l2-rule l2-rule-pass' : 'l2-rule';

      r3.textContent = val.length === 12 ? '✓ Must be exactly 12 characters' : '✗ Must be exactly 12 characters';
      r3.className = val.length === 12 ? 'l2-rule l2-rule-pass' : 'l2-rule';
    });

    // Fake submit does nothing useful
    document.getElementById('l2-fake-submit').addEventListener('click', () => {
      const btn = document.getElementById('l2-fake-submit');
      btn.textContent = 'Submitting...';
      setTimeout(() => {
        btn.textContent = 'Error: Blood type is required';
        setTimeout(() => btn.textContent = 'Maybe Later', 2000);
      }, 1500);
    });

    // Real submit is the tiny "skip for now" link
    document.getElementById('l2-real-submit').addEventListener('click', () => {
      clearInterval(checkboxInterval);
      Game.completeLevel();
    });
  },

  // ════════════════════════════════════════════════════════
  // LEVEL 3: The Tooltip Tour of Terror
  // ════════════════════════════════════════════════════════
  level3(container) {
    container.innerHTML = `
      <div class="l3-dashboard">
        <div class="l3-sidebar">
          <div class="l3-logo">ProductApp</div>
          <nav class="l3-nav">
            <a class="l3-nav-item active" id="l3-nav-dashboard">📊 Dashboard</a>
            <a class="l3-nav-item" id="l3-nav-projects">📁 Projects</a>
            <a class="l3-nav-item" id="l3-nav-team">👥 Team</a>
            <a class="l3-nav-item" id="l3-nav-settings">⚙️ Settings</a>
            <a class="l3-nav-item" id="l3-nav-billing">💳 Billing</a>
          </nav>
        </div>
        <div class="l3-main">
          <div class="l3-header">
            <h2>Dashboard</h2>
            <div class="l3-header-actions">
              <button class="l3-btn" id="l3-btn-new">+ New Project</button>
              <button class="l3-btn-icon" id="l3-btn-notif">🔔</button>
              <div class="l3-avatar" id="l3-avatar">M</div>
            </div>
          </div>
          <div class="l3-content">
            <div class="l3-card" id="l3-card-1">
              <h4>Active Projects</h4>
              <p class="l3-stat">0</p>
            </div>
            <div class="l3-card" id="l3-card-2">
              <h4>Team Members</h4>
              <p class="l3-stat">1</p>
            </div>
            <div class="l3-card" id="l3-card-3">
              <h4>Tasks Done</h4>
              <p class="l3-stat">0</p>
            </div>
          </div>
        </div>

        <div class="l3-tooltip-overlay" id="l3-tooltip-overlay"></div>
        <div class="l3-tooltip" id="l3-tooltip">
          <div class="l3-tooltip-counter" id="l3-tooltip-counter">1 of 47</div>
          <p class="l3-tooltip-text" id="l3-tooltip-text"></p>
          <button class="l3-tooltip-next" data-valid-click id="l3-tooltip-next">Next →</button>
        </div>
      </div>
    `;

    const tooltips = [
      { target: '#l3-nav-dashboard', text: 'This is the Dashboard link. It takes you to the Dashboard. You are currently on the Dashboard.', position: 'right' },
      { target: '#l3-btn-new', text: 'This button creates a new project. You can click it to create a new project. It is a button.', position: 'bottom' },
      { target: '#l3-card-1', text: 'This card shows your active projects. You have 0. This means you have no active projects. Zero is a number that represents nothing.', position: 'bottom' },
      { target: '#l3-btn-notif', text: 'This is the notification bell. It will notify you of notifications. Currently there are no notifications to notify you about.', position: 'bottom', coverNext: true },
      { target: '#l3-nav-settings', text: 'Settings. For setting things. You can set your settings in the settings section of settings.', position: 'right' },
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
      document.getElementById('l3-tooltip-counter').textContent = `${index + 1} of ${fakeTotal}`;

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
          counter.textContent = 'Restarting tour...';
        } else if (restartCount >= 2) {
          counter.textContent = `Tour restarted ${restartCount} times. Enjoying yourself?`;
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
            <h3>🎉 Tour Complete!</h3>
            <p>Congratulations, you now know that buttons are buttons and dashboards show dashboards.</p>
            <p class="l3-tour-stats">Tour restarted ${restartCount} time${restartCount !== 1 ? 's' : ''}.</p>
            <button class="l3-done-btn" data-valid-click id="l3-complete">I feel so informed →</button>
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
  // LEVEL 4: The Empty State Abyss
  // ════════════════════════════════════════════════════════
  level4(container) {
    container.innerHTML = `
      <div class="l4-dashboard">
        <div class="l4-sidebar">
          <div class="l4-logo">ProductApp</div>
          <nav class="l4-nav">
            <a class="l4-nav-item active">📊 Dashboard</a>
            <a class="l4-nav-item" data-valid-click id="l4-projects-link">📁 Projects</a>
            <a class="l4-nav-item" data-valid-click id="l4-reports-link">📈 Reports</a>
            <a class="l4-nav-item" data-valid-click id="l4-help-link">❓ Help Center</a>
            <a class="l4-nav-item" data-valid-click id="l4-docs-link">📖 Documentation</a>
          </nav>
        </div>
        <div class="l4-main">
          <div class="l4-empty">
            <div class="l4-empty-icon">📭</div>
            <h2>Welcome!</h2>
            <p class="l4-empty-text">You're all set up! Your dashboard is ready.</p>
            <button class="l4-cta-btn" data-valid-click id="l4-get-started">🚀 Get Started!</button>
          </div>
          <div class="l4-empty-sub">
            <p>Need inspiration? Check out what other users are building.</p>
            <button class="l4-sub-btn" data-valid-click id="l4-inspiration">View Examples</button>
          </div>
        </div>
        <footer class="l4-footer">
          <span>© 2026 ProductApp Inc.</span>
          <span>•</span>
          <span data-valid-click id="l4-privacy">Privacy</span>
          <span>•</span>
          <span data-valid-click id="l4-terms-link">Terms</span>
          <span>•</span>
          <span class="l4-hidden-link" data-valid-click id="l4-create-project">create your first project</span>
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

    // "Get Started" does nothing
    document.getElementById('l4-get-started').addEventListener('click', () => {
      const messages = [
        'Loading...',
        'Still loading...',
        'Just kidding. Nothing happened.',
        'Did you really think that would work?',
        'Try clicking harder.',
        'We admire your persistence.',
      ];
      addClickFeedback(messages[Math.min(clickCount, messages.length - 1)]);
    });

    // "View Examples" is equally useless
    document.getElementById('l4-inspiration').addEventListener('click', () => {
      addClickFeedback('Examples are currently being example-ified. Check back never.');
    });

    // Projects link
    document.getElementById('l4-projects-link').addEventListener('click', () => {
      addClickFeedback('You have no projects. Because you haven\'t created one. Obviously.');
    });

    // Reports link
    document.getElementById('l4-reports-link').addEventListener('click', () => {
      addClickFeedback('Reports require data. Data requires usage. Usage requires... something.');
    });

    // Help link — "opens" a 404
    document.getElementById('l4-help-link').addEventListener('click', () => {
      addClickFeedback('Help center is currently helping itself. Error 404.');
    });

    // Docs link
    document.getElementById('l4-docs-link').addEventListener('click', () => {
      addClickFeedback('Documentation coming soon™ (since 2019)');
    });

    // Footer links do nothing
    document.getElementById('l4-privacy').addEventListener('click', () => {
      addClickFeedback('Privacy? In this economy?');
    });

    document.getElementById('l4-terms-link').addEventListener('click', () => {
      addClickFeedback('The terms are: there are no terms.');
    });

    // THE REAL EXIT — tiny hidden footer link
    document.getElementById('l4-create-project').addEventListener('click', () => {
      Game.completeLevel();
    });
  },

  // ════════════════════════════════════════════════════════
  // LEVEL 5: The Grand Finale
  // ════════════════════════════════════════════════════════
  level5(container) {
    container.innerHTML = `
      <div class="l5-chaos">
        <div class="l5-bg-dashboard">
          <div class="l5-header">
            <h2>ProductApp Dashboard</h2>
            <div class="l5-progress-bar">
              <div class="l5-progress-fill"></div>
              <span class="l5-progress-text">150% Complete</span>
            </div>
          </div>
        </div>

        <div class="l5-cookie-banner" id="l5-cookie">
          <p>🍪 We noticed you already accepted cookies. Would you like to accept them again? Just to be safe.</p>
          <button class="l5-cookie-btn" data-valid-click id="l5-cookie-btn">Accept Again</button>
        </div>

        <div class="l5-overlay" id="l5-overlay-1"></div>
        <div class="l5-modal l5-modal-1" id="l5-modal-1">
          <h3>🎉 Welcome Back (Again)!</h3>
          <p>We missed you! It's been 0 seconds since your last visit!</p>
          <button class="l5-modal-btn" data-valid-click id="l5-close-modal-1">OK Fine</button>
        </div>

        <div class="l5-modal l5-modal-2 hidden" id="l5-modal-2">
          <h3>Wait! One more thing!</h3>
          <p>Have you considered upgrading to our Enterprise plan? It's only $99,999/month!</p>
          <button class="l5-modal-btn" data-valid-click id="l5-close-modal-2">No Thanks</button>
          <button class="l5-modal-btn l5-modal-btn-primary" data-valid-click id="l5-upgrade">Upgrade Now</button>
        </div>

        <div class="l5-modal l5-modal-3 hidden" id="l5-modal-3">
          <h3>📋 Quick Survey</h3>
          <p>On a scale of 1-10, how frustrated are you right now?</p>
          <div class="l5-nps-row">
            ${[1,2,3,4,5,6,7,8,9,10].map(n => `<button class="l5-nps-btn" data-valid-click data-nps="${n}">${n}</button>`).join('')}
          </div>
        </div>

        <div class="l5-tooltip l5-floating-tooltip" id="l5-tooltip">
          <span class="l5-tooltip-counter">1 of ∞</span>
          <p>This chaos you're seeing? That's called "engagement."</p>
          <button class="l5-tooltip-dismiss" data-valid-click id="l5-dismiss-tooltip">Got it</button>
        </div>

        <div class="l5-form-floating hidden" id="l5-form">
          <h4>Just one more field!</h4>
          <input type="text" placeholder="Your mother's maiden name" data-valid-click class="l5-input">
          <button class="l5-form-submit" data-valid-click id="l5-form-submit">Submit</button>
        </div>

        <button class="l5-survived-btn" data-valid-click id="l5-survived">I survived</button>
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
        'You dismissed a tooltip! Here\'s another one.',
        'Tooltips are like cats. They come back.',
        'This is tooltip #∞. We have unlimited tooltips.',
        'You\'re doing great! (at dismissing tooltips)',
      ][Math.floor(Math.random() * 4)];
    });

    // THE WIN BUTTON — tiny, hidden in the chaos
    document.getElementById('l5-survived').addEventListener('click', () => {
      Game.completeLevel();
    });
  },
};
