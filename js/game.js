/**
 * Worst Onboarding Ever — Game Engine
 * Timer, scoring, level state machine, sharing
 */

const Game = {
  state: 'title', // title | playing | transition | end
  currentLevel: 0,
  totalLevels: 5,
  timer: 0,
  timerInterval: null,
  rageClicks: 0,
  levelStartTime: 0,
  levelRageClicks: 0,
  validClickTargets: new Set(),

  // ── Init ──────────────────────────────────────────────
  init() {
    document.getElementById('start-btn').addEventListener('click', () => this.start());
    document.getElementById('play-again-btn').addEventListener('click', () => this.restart());
    document.getElementById('share-btn').addEventListener('click', () => this.share());

    // Global rage click tracker
    document.addEventListener('click', (e) => {
      if (this.state !== 'playing') return;
      if (!e.target.closest('[data-valid-click]') && !e.target.hasAttribute('data-valid-click')) {
        this.rageClicks++;
        this.levelRageClicks++;
        this.updateHUD();
        this.flashRageClick(e);
      }
    });

    this.loadBestScore();
  },

  // ── Start Game ────────────────────────────────────────
  start() {
    this.state = 'playing';
    this.currentLevel = 0;
    this.timer = 0;
    this.rageClicks = 0;

    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');

    this.startTimer();
    this.showTransition(1);
  },

  // ── Timer ─────────────────────────────────────────────
  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timer++;
      this.updateHUD();
    }, 1000);
  },

  stopTimer() {
    clearInterval(this.timerInterval);
  },

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  },

  // ── HUD ───────────────────────────────────────────────
  updateHUD() {
    document.getElementById('hud-timer').textContent = this.formatTime(this.timer);
    document.getElementById('hud-clicks').textContent = this.rageClicks;
    document.getElementById('hud-level').textContent = `${this.currentLevel} / ${this.totalLevels}`;
  },

  // ── Rage Click Flash ──────────────────────────────────
  flashRageClick(e) {
    const flash = document.createElement('div');
    flash.className = 'rage-flash';
    flash.textContent = '+1';
    flash.style.left = e.clientX + 'px';
    flash.style.top = e.clientY + 'px';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 600);
  },

  // ── Level Transitions ────────────────────────────────
  showTransition(levelNum) {
    this.currentLevel = levelNum;
    this.levelRageClicks = 0;
    this.updateHUD();

    const info = Levels.getInfo(levelNum);
    const screen = document.getElementById('transition-screen');
    document.getElementById('transition-level-num').textContent = `Level ${levelNum}`;
    document.getElementById('transition-level-name').textContent = info.name;
    document.getElementById('transition-level-desc').textContent = info.tagline;

    // Hide all levels
    document.querySelectorAll('.level-container').forEach(el => {
      el.classList.add('hidden');
      el.innerHTML = '';
    });

    screen.classList.remove('hidden');
    this.state = 'transition';

    setTimeout(() => {
      screen.classList.add('hidden');
      this.state = 'playing';
      this.levelStartTime = this.timer;
      Levels.load(levelNum);
    }, 2000);
  },

  // ── Level Complete ────────────────────────────────────
  completeLevel() {
    const levelTime = this.timer - this.levelStartTime;

    if (this.currentLevel < this.totalLevels) {
      this.showTransition(this.currentLevel + 1);
    } else {
      this.endGame();
    }
  },

  // ── End Game ──────────────────────────────────────────
  endGame() {
    this.stopTimer();
    this.state = 'end';

    document.getElementById('hud').classList.add('hidden');
    document.querySelectorAll('.level-container').forEach(el => el.classList.add('hidden'));

    // Calculate patience score (0-100, higher = more patient)
    const timeScore = Math.max(0, 100 - (this.timer / 3));
    const clickPenalty = this.rageClicks * 0.5;
    const patienceScore = Math.max(0, Math.round(timeScore - clickPenalty));

    document.getElementById('end-time').textContent = this.formatTime(this.timer);
    document.getElementById('end-clicks').textContent = this.rageClicks;
    document.getElementById('end-patience').textContent = patienceScore + '/100';
    document.getElementById('end-patience-label').textContent = this.getPatienceLabel(patienceScore);

    this.saveBestScore(this.timer, this.rageClicks, patienceScore);

    const end = document.getElementById('end-screen');
    end.classList.remove('hidden');

    this.launchConfetti();
  },

  getPatienceLabel(score) {
    if (score >= 80) return 'Zen Master';
    if (score >= 60) return 'Remarkably Calm';
    if (score >= 40) return 'Slightly Frustrated';
    if (score >= 20) return 'Rage-Clicking Enthusiast';
    return 'Keyboard Smashed';
  },

  // ── Sharing ───────────────────────────────────────────
  share() {
    const patienceScore = Math.max(0, Math.round(Math.max(0, 100 - (this.timer / 3)) - this.rageClicks * 0.5));
    const label = this.getPatienceLabel(patienceScore);
    const time = this.formatTime(this.timer);
    const clicks = this.rageClicks;

    const text = `I just survived the Worst Onboarding Ever.\n\n⏱ ${time} minutes | 💀 ${clicks} rage clicks | Patience: "${label}"\n\nCan you beat me? Try here: https://mert-aktas.github.io/worst-onboarding/\n\n#WorstOnboardingEver`;
    const linkedInUrl = 'https://www.linkedin.com/feed/?shareActive=true&text=' + encodeURIComponent(text);

    // Copy share image to clipboard, then countdown, then open LinkedIn
    this.generateShareImage(time, clicks, patienceScore, label).then(() => {
      const btn = document.getElementById('share-btn');
      let countdown = 3;
      const tick = () => {
        const s = countdown === 1 ? 'second' : 'seconds';
        btn.textContent = `Image copied! Just paste it in LinkedIn — Redirecting in ${countdown} ${s}`;
        if (countdown === 0) {
          btn.textContent = 'Share Your Victory on LinkedIn';
          window.open(linkedInUrl, '_blank', 'width=600,height=600');
          return;
        }
        countdown--;
        setTimeout(tick, 1000);
      };
      tick();
    });
  },

  generateShareImage(time, clicks, patience, label) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, 1200, 630);

    // Subtle gradient overlay
    const grad = ctx.createRadialGradient(600, 200, 0, 600, 200, 500);
    grad.addColorStop(0, 'rgba(77, 255, 145, 0.06)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 630);

    // Title
    ctx.fillStyle = '#e8e6e3';
    ctx.font = '700 72px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('You Survived.', 600, 160);

    // Subtitle
    ctx.fillStyle = '#6b6976';
    ctx.font = '400 22px system-ui, sans-serif';
    ctx.fillText('Against all odds, you made it through the worst onboarding ever created.', 600, 210);

    // Stats
    const stats = [
      { value: time, label: 'TIME' },
      { value: String(clicks), label: 'RAGE CLICKS' },
      { value: patience + '/100', label: 'PATIENCE SCORE' }
    ];

    const startX = 200;
    const spacing = 400;

    stats.forEach((stat, i) => {
      const x = startX + i * spacing;

      ctx.fillStyle = '#e8e6e3';
      ctx.font = '400 64px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(stat.value, x, 350);

      ctx.fillStyle = '#6b6976';
      ctx.font = '500 14px system-ui, sans-serif';
      ctx.fillText(stat.label, x, 385);
    });

    // Patience label
    ctx.fillStyle = '#ff4d4d';
    ctx.font = '500 28px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, 600, 460);

    // Accent line at bottom
    ctx.strokeStyle = '#ff4d4d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 627);
    ctx.lineTo(1200, 627);
    ctx.stroke();

    // Copy to clipboard
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (navigator.clipboard && window.ClipboardItem) {
          navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]).then(() => resolve()).catch(() => resolve());
        } else {
          resolve();
        }
      }, 'image/png');
    });
  },

  // ── LocalStorage ──────────────────────────────────────
  saveBestScore(time, clicks, patience) {
    const prev = JSON.parse(localStorage.getItem('woe-best') || 'null');
    if (!prev || time < prev.time) {
      localStorage.setItem('woe-best', JSON.stringify({ time, clicks, patience }));
      document.getElementById('end-best').textContent = `New personal best!`;
    } else {
      document.getElementById('end-best').textContent = `Best: ${this.formatTime(prev.time)}`;
    }
  },

  loadBestScore() {
    const prev = JSON.parse(localStorage.getItem('woe-best') || 'null');
    if (prev) {
      const el = document.getElementById('title-best');
      if (el) el.textContent = `Personal best: ${this.formatTime(prev.time)}`;
    }
  },

  // ── Restart ───────────────────────────────────────────
  restart() {
    document.getElementById('end-screen').classList.add('hidden');
    document.querySelectorAll('.level-container').forEach(el => {
      el.classList.add('hidden');
      el.innerHTML = '';
    });
    document.getElementById('title-screen').classList.remove('hidden');
    this.loadBestScore();
  },

  // ── Confetti ──────────────────────────────────────────
  launchConfetti() {
    const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6eb4'];
    const container = document.getElementById('confetti-container');
    container.innerHTML = '';

    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 2 + 's';
      piece.style.animationDuration = (2 + Math.random() * 2) + 's';
      container.appendChild(piece);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => Game.init());
