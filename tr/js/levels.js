/**
 * Dünyanın En Kötü Onboarding'i — Seviye Mantığı
 * Her seviye, oyuncunun hayatta kalması gereken bir onboarding faciası
 */

const Levels = {

  getInfo(num) {
    const info = {
      1: { name: 'Cehennemden Gelen Hoş Geldin Modalı', tagline: 'Bırak da gireyim artık.' },
      2: { name: 'Kayıt Duvarı', tagline: 'Daha ne olduğunu bilmeden kayıt ol.' },
      3: { name: 'Korkunç Tooltip Turu', tagline: '47 üzerinden 1. Hayır, atlayamazsın.' },
      4: { name: 'Boş Ekran Uçurumu', tagline: 'Hoş geldin! Şimdi kendin çöz.' },
      5: { name: 'Büyük Final', tagline: 'Her şey. Aynı anda. Bol şans.' },
    };
    return info[num];
  },

  load(num) {
    const container = document.getElementById(`level-${num}`);
    container.classList.remove('hidden');
    this[`level${num}`](container);
  },

  // ════════════════════════════════════════════════════════
  // SEVİYE 1: Cehennemden Gelen Hoş Geldin Modalı
  // ════════════════════════════════════════════════════════
  level1(container) {
    container.innerHTML = `
      <div class="l1-page">
        <div class="l1-content-behind">
          <h2>ÜrünApp Pro'ya Hoş Geldiniz</h2>
          <p>Asla göremeyeceğin en iyi ürün.</p>
          <button class="l1-next-btn hidden" data-valid-click id="l1-complete">Sonraki Seviyeye Geç →</button>
        </div>

        <div class="l1-cookie-banner" id="l1-cookie">
          <p>🍪 Çerez kullanıyoruz. ÇOK fazla çerez kullanıyoruz. Çerezleri takip etmek için de çerez kullanıyoruz.</p>
          <div class="l1-cookie-buttons">
            <button class="l1-cookie-accept" data-valid-click id="l1-cookie-accept">847 Çerezi Kabul Et</button>
            <button class="l1-cookie-reject" id="l1-cookie-reject-fake">Tümünü Reddet</button>
            <button class="l1-cookie-reject-real" data-valid-click id="l1-cookie-reject-real">reddet</button>
          </div>
        </div>

        <div class="l1-overlay" id="l1-overlay"></div>

        <div class="l1-modal" id="l1-modal-1">
          <button class="l1-close-btn" data-valid-click id="l1-close-1">×</button>
          <h3>🎉 Hoş geldin! Burada olduğun için ÇOK heyecanlıyız!</h3>
          <p>Başlamadan önce lütfen 47 sayfalık kullanım koşullarımızı, gizlilik politikamızı, çerez politikamızı, veri işleme sözleşmemizi ve topluluk kurallarımızı oku.</p>
          <p>Ayrıca günde 14 e-posta göndermek istiyoruz. İstediğin zaman abonelikten çıkabilirsin (teoride).</p>
          <div class="l1-modal-footer">
            <button class="l1-modal-btn-secondary" data-valid-click id="l1-maybe-later">Belki Sonra</button>
            <button class="l1-modal-btn-primary" data-valid-click id="l1-agree">Her Şeyi Kabul Ediyorum</button>
          </div>
        </div>

        <div class="l1-modal l1-modal-confirm hidden" id="l1-modal-2">
          <h3>Dur! Emin misin?</h3>
          <p>Hayatını kesinlikle değiştirecek inanılmaz bir deneyimi kaçırmak üzeresin.</p>
          <div class="l1-modal-footer">
            <button class="l1-btn-swap-yes" data-valid-click id="l1-swap-yes">Hayır, popup göstermeye devam et</button>
            <button class="l1-btn-swap-no" data-valid-click id="l1-swap-no">Evet, eminim, lütfen kapat şunu</button>
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

    // "Her Şeyi Kabul Ediyorum" → shows confirm too
    document.getElementById('l1-agree').addEventListener('click', () => {
      document.getElementById('l1-modal-1').classList.add('hidden');
      document.getElementById('l1-modal-2').classList.remove('hidden');
    });

    // "Belki Sonra" → same thing
    document.getElementById('l1-maybe-later').addEventListener('click', () => {
      document.getElementById('l1-modal-1').classList.add('hidden');
      document.getElementById('l1-modal-2').classList.remove('hidden');
    });

    // SWAPPED buttons on confirm modal
    // "Hayır, popup göstermeye devam et" → actually closes
    document.getElementById('l1-swap-yes').addEventListener('click', () => {
      document.getElementById('l1-modal-2').classList.add('hidden');
      document.getElementById('l1-overlay').classList.add('hidden');
      modalDismissed = true;
      checkWin();
    });

    // "Evet, eminim, lütfen kapat şunu" → reopens modal 1
    document.getElementById('l1-swap-no').addEventListener('click', () => {
      document.getElementById('l1-modal-2').classList.add('hidden');
      document.getElementById('l1-modal-1').classList.remove('hidden');
    });

    // Cookie banner - "Tümünü Reddet" is fake
    document.getElementById('l1-cookie-reject-fake').addEventListener('click', (e) => {
      e.target.textContent = 'Lol yok.';
      setTimeout(() => e.target.textContent = 'Tümünü Reddet', 1000);
    });

    // Cookie "847 Çerezi Kabul Et" works
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
  // SEVİYE 2: Kayıt Duvarı
  // ════════════════════════════════════════════════════════
  level2(container) {
    container.innerHTML = `
      <div class="l2-page">
        <div class="l2-form-wrapper">
          <h2>Hesabını Oluştur</h2>
          <p class="l2-subtitle">TÜM alanları doldur. Hepsi zorunlu. İstisna yok.</p>

          <form class="l2-form" id="l2-form" autocomplete="off">
            <div class="l2-field">
              <label for="l2-phone">E-posta Adresi</label>
              <input type="text" id="l2-phone" placeholder="Telefon numaranı gir" data-valid-click>
              <span class="l2-hint">Format: +90 (555) 123 45 67</span>
            </div>

            <div class="l2-field">
              <label for="l2-email">Telefon Numarası</label>
              <input type="text" id="l2-email" placeholder="E-posta adresini gir" data-valid-click>
              <span class="l2-hint">Seni asla aramayacağız (onun yerine e-posta atarız)</span>
            </div>

            <div class="l2-field">
              <label for="l2-name">Şirket Geliri (Yıllık)</label>
              <input type="text" id="l2-name" placeholder="Adını ve soyadını gir" data-valid-click>
            </div>

            <div class="l2-field">
              <label for="l2-company">Kan Grubu</label>
              <input type="text" id="l2-company" placeholder="Şirket adını gir" data-valid-click>
            </div>

            <div class="l2-field">
              <label for="l2-password">Şifre</label>
              <input type="password" id="l2-password" placeholder="Güçlü bir şifre seç" data-valid-click>
              <div class="l2-pw-rules">
                <span class="l2-rule" id="l2-rule-1">✗ Rakam içermeli</span>
                <span class="l2-rule" id="l2-rule-2">✗ Hiç rakam içermemeli</span>
                <span class="l2-rule" id="l2-rule-3">✗ Tam olarak 12 karakter olmalı</span>
                <span class="l2-rule" id="l2-rule-4">✗ Annenin kızlık soyadını içermeli</span>
              </div>
            </div>

            <div class="l2-field">
              <label for="l2-role">Bizi nereden duydun?</label>
              <select id="l2-role" data-valid-click>
                <option value="">Birini seç...</option>
                <option value="dream">Rüyamda gördüm</option>
                <option value="billboard">Mars'taki billboard'dan</option>
                <option value="carrier">Posta güverciniyle</option>
                <option value="telepathy">Kurumsal telepatiyle</option>
              </select>
            </div>

            <div class="l2-checkbox-field">
              <input type="checkbox" id="l2-terms" data-valid-click>
              <label for="l2-terms">Kullanım Koşulları, Gizlilik Politikası, Çerez Politikası, Veri İşleme Sözleşmesi, Kabul Edilebilir Kullanım Politikası, Topluluk Kuralları ve Kişisel Verilerin Korunması Kanunu'nun tamamını kabul ediyorum</label>
            </div>

            <button type="button" class="l2-submit-btn" id="l2-fake-submit" data-valid-click>Belki Sonra</button>
          </form>

          <p class="l2-skip-link">Zaten hesabın var mı? <span data-valid-click id="l2-real-submit">şimdilik atla</span></p>
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

      r1.textContent = /\d/.test(val) ? '✓ Rakam içermeli' : '✗ Rakam içermeli';
      r1.className = /\d/.test(val) ? 'l2-rule l2-rule-pass' : 'l2-rule';

      r2.textContent = !/\d/.test(val) ? '✓ Hiç rakam içermemeli' : '✗ Hiç rakam içermemeli';
      r2.className = !/\d/.test(val) ? 'l2-rule l2-rule-pass' : 'l2-rule';

      r3.textContent = val.length === 12 ? '✓ Tam olarak 12 karakter olmalı' : '✗ Tam olarak 12 karakter olmalı';
      r3.className = val.length === 12 ? 'l2-rule l2-rule-pass' : 'l2-rule';
    });

    // Fake submit does nothing useful
    document.getElementById('l2-fake-submit').addEventListener('click', () => {
      const btn = document.getElementById('l2-fake-submit');
      btn.textContent = 'Gönderiliyor...';
      setTimeout(() => {
        btn.textContent = 'Hata: Kan grubu zorunludur';
        setTimeout(() => btn.textContent = 'Belki Sonra', 2000);
      }, 1500);
    });

    // Real submit is the tiny "şimdilik atla" link
    document.getElementById('l2-real-submit').addEventListener('click', () => {
      clearInterval(checkboxInterval);
      Game.completeLevel();
    });
  },

  // ════════════════════════════════════════════════════════
  // SEVİYE 3: Korkunç Tooltip Turu
  // ════════════════════════════════════════════════════════
  level3(container) {
    container.innerHTML = `
      <div class="l3-dashboard">
        <div class="l3-sidebar">
          <div class="l3-logo">ÜrünApp</div>
          <nav class="l3-nav">
            <a class="l3-nav-item active" id="l3-nav-dashboard">📊 Dashboard</a>
            <a class="l3-nav-item" id="l3-nav-projects">📁 Projeler</a>
            <a class="l3-nav-item" id="l3-nav-team">👥 Ekip</a>
            <a class="l3-nav-item" id="l3-nav-settings">⚙️ Ayarlar</a>
            <a class="l3-nav-item" id="l3-nav-billing">💳 Faturalama</a>
          </nav>
        </div>
        <div class="l3-main">
          <div class="l3-header">
            <h2>Dashboard</h2>
            <div class="l3-header-actions">
              <button class="l3-btn" id="l3-btn-new">+ Yeni Proje</button>
              <button class="l3-btn-icon" id="l3-btn-notif">🔔</button>
              <div class="l3-avatar" id="l3-avatar">M</div>
            </div>
          </div>
          <div class="l3-content">
            <div class="l3-card" id="l3-card-1">
              <h4>Aktif Projeler</h4>
              <p class="l3-stat">0</p>
            </div>
            <div class="l3-card" id="l3-card-2">
              <h4>Ekip Üyeleri</h4>
              <p class="l3-stat">1</p>
            </div>
            <div class="l3-card" id="l3-card-3">
              <h4>Tamamlanan Görevler</h4>
              <p class="l3-stat">0</p>
            </div>
          </div>
        </div>

        <div class="l3-tooltip-overlay" id="l3-tooltip-overlay"></div>
        <div class="l3-tooltip" id="l3-tooltip">
          <div class="l3-tooltip-counter" id="l3-tooltip-counter">47 üzerinden 1</div>
          <p class="l3-tooltip-text" id="l3-tooltip-text"></p>
          <button class="l3-tooltip-next" data-valid-click id="l3-tooltip-next">Sonraki →</button>
        </div>
      </div>
    `;

    const tooltips = [
      { target: '#l3-nav-dashboard', text: 'Bu Dashboard linki. Seni Dashboard\'a götürür. Şu an zaten Dashboard\'dasın.', position: 'right' },
      { target: '#l3-btn-new', text: 'Bu buton yeni proje oluşturur. Tıklayarak yeni proje oluşturabilirsin. Bu bir butondur.', position: 'bottom' },
      { target: '#l3-card-1', text: 'Bu kart aktif projelerini gösterir. 0 tane var. Bu, hiç aktif projen olmadığı anlamına gelir. Sıfır, hiçliği temsil eden bir sayıdır.', position: 'bottom' },
      { target: '#l3-btn-notif', text: 'Bu bildirim zili. Bildirimleri bildirir. Şu an bildirilecek bildirim yok.', position: 'bottom', coverNext: true },
      { target: '#l3-nav-settings', text: 'Ayarlar. Ayarları ayarlamak için. Ayarlar bölümündeki ayarlardan ayarlarını ayarlayabilirsin.', position: 'right' },
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
      document.getElementById('l3-tooltip-counter').textContent = `47 üzerinden ${index + 1}`;

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
          counter.textContent = 'Tur yeniden başlatılıyor...';
        } else if (restartCount >= 2) {
          counter.textContent = `Tur ${restartCount} kez yeniden başlatıldı. Eğleniyor musun?`;
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
            <h3>🎉 Tur Tamamlandı!</h3>
            <p>Tebrikler, artık butonların buton olduğunu ve dashboard'ların dashboard gösterdiğini biliyorsun.</p>
            <p class="l3-tour-stats">Tur ${restartCount} kez yeniden başlatıldı.</p>
            <button class="l3-done-btn" data-valid-click id="l3-complete">Çok bilgilendirici oldu →</button>
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
  // SEVİYE 4: Boş Ekran Uçurumu
  // ════════════════════════════════════════════════════════
  level4(container) {
    container.innerHTML = `
      <div class="l4-dashboard">
        <div class="l4-sidebar">
          <div class="l4-logo">ÜrünApp</div>
          <nav class="l4-nav">
            <a class="l4-nav-item active">📊 Dashboard</a>
            <a class="l4-nav-item" data-valid-click id="l4-projects-link">📁 Projeler</a>
            <a class="l4-nav-item" data-valid-click id="l4-reports-link">📈 Raporlar</a>
            <a class="l4-nav-item" data-valid-click id="l4-help-link">❓ Yardım Merkezi</a>
            <a class="l4-nav-item" data-valid-click id="l4-docs-link">📖 Dokümantasyon</a>
          </nav>
        </div>
        <div class="l4-main">
          <div class="l4-empty">
            <div class="l4-empty-icon">📭</div>
            <h2>Hoş Geldin!</h2>
            <p class="l4-empty-text">Her şey hazır! Dashboard'ın seni bekliyor.</p>
            <button class="l4-cta-btn" data-valid-click id="l4-get-started">🚀 Hadi Başlayalım!</button>
          </div>
          <div class="l4-empty-sub">
            <p>İlhama mı ihtiyacın var? Diğer kullanıcıların neler yaptığına bak.</p>
            <button class="l4-sub-btn" data-valid-click id="l4-inspiration">Örnekleri Gör</button>
          </div>
        </div>
        <footer class="l4-footer">
          <span>© 2026 ÜrünApp A.Ş.</span>
          <span>•</span>
          <span data-valid-click id="l4-privacy">Gizlilik</span>
          <span>•</span>
          <span data-valid-click id="l4-terms-link">Koşullar</span>
          <span>•</span>
          <span class="l4-hidden-link" data-valid-click id="l4-create-project">ilk projeni oluştur</span>
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

    // "Hadi Başlayalım!" does nothing
    document.getElementById('l4-get-started').addEventListener('click', () => {
      const messages = [
        'Yükleniyor...',
        'Hâlâ yükleniyor...',
        'Şaka şaka. Hiçbir şey olmadı.',
        'Cidden işe yarayacağını mı düşündün?',
        'Daha sert tıklamayı dene.',
        'Azmine hayranız.',
      ];
      addClickFeedback(messages[Math.min(clickCount, messages.length - 1)]);
    });

    // "Örnekleri Gör" is equally useless
    document.getElementById('l4-inspiration').addEventListener('click', () => {
      addClickFeedback('Örnekler şu an örneklendirilme aşamasında. Bir daha kontrol etme.');
    });

    // Projects link
    document.getElementById('l4-projects-link').addEventListener('click', () => {
      addClickFeedback('Hiç projen yok. Çünkü oluşturmadın. Belli değil mi?');
    });

    // Reports link
    document.getElementById('l4-reports-link').addEventListener('click', () => {
      addClickFeedback('Raporlar veri gerektirir. Veri kullanım gerektirir. Kullanım da... bir şeyler gerektirir.');
    });

    // Help link
    document.getElementById('l4-help-link').addEventListener('click', () => {
      addClickFeedback('Yardım merkezi şu an kendine yardım ediyor. Hata 404.');
    });

    // Docs link
    document.getElementById('l4-docs-link').addEventListener('click', () => {
      addClickFeedback('Dokümantasyon yakında™ (2019\'dan beri)');
    });

    // Footer links do nothing
    document.getElementById('l4-privacy').addEventListener('click', () => {
      addClickFeedback('Gizlilik mi? Bu ekonomide mi?');
    });

    document.getElementById('l4-terms-link').addEventListener('click', () => {
      addClickFeedback('Koşullar: koşul yok.');
    });

    // THE REAL EXIT — tiny hidden footer link
    document.getElementById('l4-create-project').addEventListener('click', () => {
      Game.completeLevel();
    });
  },

  // ════════════════════════════════════════════════════════
  // SEVİYE 5: Büyük Final
  // ════════════════════════════════════════════════════════
  level5(container) {
    container.innerHTML = `
      <div class="l5-chaos">
        <div class="l5-bg-dashboard">
          <div class="l5-header">
            <h2>ÜrünApp Dashboard</h2>
            <div class="l5-progress-bar">
              <div class="l5-progress-fill"></div>
              <span class="l5-progress-text">%150 Tamamlandı</span>
            </div>
          </div>
        </div>

        <div class="l5-cookie-banner" id="l5-cookie">
          <p>🍪 Çerezleri zaten kabul ettiğini fark ettik. Bir daha kabul etmek ister misin? Emin olmak için.</p>
          <button class="l5-cookie-btn" data-valid-click id="l5-cookie-btn">Tekrar Kabul Et</button>
        </div>

        <div class="l5-overlay" id="l5-overlay-1"></div>
        <div class="l5-modal l5-modal-1" id="l5-modal-1">
          <h3>🎉 Tekrar Hoş Geldin!</h3>
          <p>Seni özledik! Son ziyaretinin üzerinden 0 saniye geçti!</p>
          <button class="l5-modal-btn" data-valid-click id="l5-close-modal-1">Tamam Ya</button>
        </div>

        <div class="l5-modal l5-modal-2 hidden" id="l5-modal-2">
          <h3>Dur! Bir şey daha!</h3>
          <p>Enterprise planımıza geçmeyi düşündün mü? Sadece ayda 99.999$!</p>
          <button class="l5-modal-btn" data-valid-click id="l5-close-modal-2">Hayır Sağ Ol</button>
          <button class="l5-modal-btn l5-modal-btn-primary" data-valid-click id="l5-upgrade">Hemen Yükselt</button>
        </div>

        <div class="l5-modal l5-modal-3 hidden" id="l5-modal-3">
          <h3>📋 Hızlı Anket</h3>
          <p>1'den 10'a kadar, şu an ne kadar sinirlisin?</p>
          <div class="l5-nps-row">
            ${[1,2,3,4,5,6,7,8,9,10].map(n => `<button class="l5-nps-btn" data-valid-click data-nps="${n}">${n}</button>`).join('')}
          </div>
        </div>

        <div class="l5-tooltip l5-floating-tooltip" id="l5-tooltip">
          <span class="l5-tooltip-counter">∞ üzerinden 1</span>
          <p>Gördüğün bu kaos? Buna "engagement" deniyor.</p>
          <button class="l5-tooltip-dismiss" data-valid-click id="l5-dismiss-tooltip">Anladım</button>
        </div>

        <div class="l5-form-floating hidden" id="l5-form">
          <h4>Son bir alan daha!</h4>
          <input type="text" placeholder="Annenin kızlık soyadı" data-valid-click class="l5-input">
          <button class="l5-form-submit" data-valid-click id="l5-form-submit">Gönder</button>
        </div>

        <button class="l5-survived-btn" data-valid-click id="l5-survived">Hayatta kaldım</button>
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
        'Bir tooltip kapattın! Al sana bir tane daha.',
        'Tooltip\'ler kedi gibidir. Geri gelirler.',
        'Bu tooltip #∞. Sınırsız tooltip\'imiz var.',
        'Harika gidiyorsun! (tooltip kapatma konusunda)',
      ][Math.floor(Math.random() * 4)];
    });

    // THE WIN BUTTON — tiny, hidden in the chaos
    document.getElementById('l5-survived').addEventListener('click', () => {
      Game.completeLevel();
    });
  },
};
