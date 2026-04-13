/**
 * O Pior Onboarding de Todos os Tempos — Motor do Jogo
 * Timer, pontuação, máquina de estados dos níveis, compartilhamento
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
    document.getElementById('transition-level-num').textContent = `Nível ${levelNum}`;
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
    if (score >= 80) return 'Mestre Zen';
    if (score >= 60) return 'Impressionantemente Calmo';
    if (score >= 40) return 'Levemente Frustrado';
    if (score >= 20) return 'Entusiasta do Clique de Raiva';
    return 'Teclado Destruído';
  },

  // ── LocalStorage ──────────────────────────────────────
  saveBestScore(time, clicks, patience) {
    const prev = JSON.parse(localStorage.getItem('woe-best-ptbr') || 'null');
    if (!prev || time < prev.time) {
      localStorage.setItem('woe-best-ptbr', JSON.stringify({ time, clicks, patience }));
      document.getElementById('end-best').textContent = `Novo recorde pessoal!`;
    } else {
      document.getElementById('end-best').textContent = `Melhor: ${this.formatTime(prev.time)}`;
    }
  },

  loadBestScore() {
    const prev = JSON.parse(localStorage.getItem('woe-best-ptbr') || 'null');
    if (prev) {
      const el = document.getElementById('title-best');
      if (el) el.textContent = `Recorde pessoal: ${this.formatTime(prev.time)}`;
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
