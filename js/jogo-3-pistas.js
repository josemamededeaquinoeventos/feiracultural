/**
 * Jogo das 3 Pistas - Engine, Lógica e Importador IA
 * Interface Clean: Fundo Branco & Cards Azuis
 * 
 * Regras:
 * - Rodada ímpar (1, 3, 5...): Inicia Jogador A
 *   * Pista 1 (10 pts) -> Jogador A
 *   * Pista 2 (9 pts)  -> Jogador B
 *   * Pista 3 (8 pts)  -> Jogador A
 *   * Se errar Pista 3 -> Platéia / Outro Grupo
 * 
 * - Rodada par (2, 4, 6...): Inicia Jogador B
 *   * Pista 1 (10 pts) -> Jogador B
 *   * Pista 2 (9 pts)  -> Jogador A
 *   * Pista 3 (8 pts)  -> Jogador B
 *   * Se errar Pista 3 -> Platéia / Outro Grupo
 */

// ==========================================================================
// 1. Áudio Sintetizado Nativo (Web Audio API)
// ==========================================================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.2, gainVal = 0.2, delay = 0) {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  playCorrect() {
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.35, 0.25, idx * 0.08);
    });
  }

  playWrong() {
    this.init();
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    
    [130, 123].forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.linearRampToValueAtTime(freq - 30, now + 0.35);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    });
  }

  playReveal() {
    this.init();
    this.playTone(440, 'sine', 0.2, 0.15, 0);
    this.playTone(880, 'sine', 0.3, 0.2, 0.08);
  }

  playTick() {
    this.init();
    this.playTone(900, 'sine', 0.05, 0.05, 0);
  }

  playVictory() {
    this.init();
    const chords = [
      [523.25, 659.25, 783.99],
      [587.33, 739.99, 880.00],
      [659.25, 830.61, 987.77],
      [1046.50, 1318.51, 1567.98]
    ];
    chords.forEach((chord, i) => {
      chord.forEach(freq => {
        this.playTone(freq, 'triangle', 0.5, 0.2, i * 0.18);
      });
    });
  }
}

// ==========================================================================
// 2. Efeito de Confetes (Canvas)
// ==========================================================================
class ConfettiCannon {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.animId = null;
    this.colors = ['#1d4ed8', '#2563eb', '#3b82f6', '#10b981', '#f59e0b', '#7c3aed'];

    if (this.canvas) {
      window.addEventListener('resize', () => this.resize());
      this.resize();
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  fire(count = 90) {
    if (!this.canvas || !this.ctx) return;
    this.resize();

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: -10,
        w: Math.random() * 10 + 6,
        h: Math.random() * 6 + 4,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 4 + 3,
        rot: Math.random() * 360,
        vrot: (Math.random() - 0.5) * 10,
        life: 1
      });
    }

    if (!this.animId) {
      this.loop();
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      p.life -= 0.008;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rot * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0, p.life);
      this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      this.ctx.restore();

      if (p.life <= 0 || p.y > this.canvas.height) {
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.loop());
    } else {
      this.animId = null;
    }
  }
}

// ==========================================================================
// 3. Normalizador de Texto & Verificador Inteligente
// ==========================================================================
function normalizeAnswer(text) {
  if (!text) return '';
  return text
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s]/g, '')     // remove pontuação
    .replace(/\s+/g, ' ');           // remove espaços extras
}

function levenshteinDistance(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

function checkAnswerMatch(userInput, card) {
  const normInput = normalizeAnswer(userInput);
  if (!normInput) return { result: 'wrong' };

  const validOptions = [card.palavra, ...(card.sinonimos || [])].map(normalizeAnswer);

  // 1. Verificação exata direta
  if (validOptions.includes(normInput)) {
    return { result: 'exact' };
  }

  // 2. Levenshtein com tolerância a pequeno erro de digitação (1 caractere)
  for (const option of validOptions) {
    if (option.length >= 5) {
      const dist = levenshteinDistance(normInput, option);
      if (dist <= 1) return { result: 'exact' };
    }
  }

  // 3. Similaridade / Resposta Parcial (ex: "composto" em "composto térmico", ou "virtual" em "realidade virtual")
  const inputWords = normInput.split(' ').filter(w => w.length >= 3);
  for (const option of validOptions) {
    const optionWords = option.split(' ').filter(w => w.length >= 3);

    // Se o que o aluno digitou está contido na resposta oficial
    if (normInput.length >= 4 && option.includes(normInput)) {
      return { result: 'partial', matchedWord: card.palavra, input: userInput };
    }

    // Se o que o aluno digitou contém a resposta oficial
    if (option.length >= 4 && normInput.includes(option)) {
      return { result: 'partial', matchedWord: card.palavra, input: userInput };
    }

    // Se alguma palavra significativa coincide
    const commonWord = inputWords.find(w => optionWords.includes(w));
    if (commonWord) {
      return { result: 'partial', matchedWord: card.palavra, input: userInput };
    }
  }

  return { result: 'wrong' };
}

function isAnswerCorrect(userInput, card) {
  const match = checkAnswerMatch(userInput, card);
  return match.result === 'exact';
}

// ==========================================================================
// 4. Mecânica Principal do Jogo
// ==========================================================================
class Jogo3Pistas {
  constructor() {
    this.sound = new SoundFX();
    this.confetti = new ConfettiCannon('confetti-canvas');

    this.players = [
      { name: 'Jogador A', score: 0 },
      { name: 'Jogador B', score: 0 }
    ];
    this.plateiaScore = 0;

    this.totalRoundsConfig = 10;
    this.turnTimerSecs = 0;
    this.timerInterval = null;
    this.timeRemaining = 0;

    this.roundList = [];
    this.currentRoundIndex = 0;
    this.currentClueIndex = 0;
    this.pointsValues = [10, 9, 8];
    this.isPlateiaTurn = false;
    this.roundFinished = false;

    this.dom = {};
  }

  init() {
    this.bindDOM();
    this.loadCustomOrStorageCards();
    this.updateCardsIndicator();
    this.bindEvents();
    this.openSetupModal();
  }

  bindDOM() {
    this.dom = {
      // Header
      roundDisplay: document.getElementById('round-display'),
      currentValueDisplay: document.getElementById('current-value-display'),
      btnOpenAIModal: document.getElementById('btn-open-ai-modal'),
      btnSound: document.getElementById('btn-sound'),
      soundIcon: document.getElementById('sound-icon'),
      btnFullscreen: document.getElementById('btn-fullscreen'),
      btnSettings: document.getElementById('btn-settings'),
      btnCustomCards: document.getElementById('btn-custom-cards'),
      btnRestart: document.getElementById('btn-restart'),

      // Pódios
      podiumA: document.getElementById('podium-player-a'),
      podiumB: document.getElementById('podium-player-b'),
      playerAName: document.getElementById('player-a-name'),
      playerBName: document.getElementById('player-b-name'),
      playerAScore: document.getElementById('player-a-score'),
      playerBScore: document.getElementById('player-b-score'),
      plateiaScoreHUD: document.getElementById('plateia-score-hud'),

      // Cartões de Pistas
      clueCards: [
        document.getElementById('clue-card-0'),
        document.getElementById('clue-card-1'),
        document.getElementById('clue-card-2')
      ],
      clueContents: [
        document.getElementById('clue-content-0'),
        document.getElementById('clue-content-1'),
        document.getElementById('clue-content-2')
      ],
      clueTargets: [
        document.getElementById('clue-target-0'),
        document.getElementById('clue-target-1'),
        document.getElementById('clue-target-2')
      ],

      // Console de Resposta
      answerConsole: document.getElementById('answer-console'),
      targetBadge: document.getElementById('target-player-badge'),
      targetPointsBadge: document.getElementById('target-points-badge'),
      timerDisplay: document.getElementById('timer-display'),
      timerSeconds: document.getElementById('timer-seconds'),
      answerForm: document.getElementById('answer-form'),
      answerInput: document.getElementById('answer-input'),
      btnSubmit: document.getElementById('btn-submit-answer'),
      btnPass: document.getElementById('btn-pass-turn'),
      btnManualValidate: document.getElementById('btn-manual-validate'),
      consoleFeedback: document.getElementById('console-feedback'),

      // Modal Confirmação Parcial
      modalPartialConfirm: document.getElementById('modal-partial-confirm'),
      partialPlayerName: document.getElementById('partial-player-name'),
      partialUserInput: document.getElementById('partial-user-input'),
      partialCorrectWord: document.getElementById('partial-correct-word'),
      partialPointsVal: document.getElementById('partial-points-val'),
      btnPartialAccept: document.getElementById('btn-partial-accept'),
      btnPartialReject: document.getElementById('btn-partial-reject'),

      // Seção da Platéia
      plateiaSection: document.getElementById('plateia-section'),
      btnPlateiaHit: document.getElementById('btn-plateia-hit'),
      btnRevealAll: document.getElementById('btn-reveal-all'),
      plateiaAnswerInput: document.getElementById('plateia-answer-input'),
      btnPlateiaSubmit: document.getElementById('btn-plateia-submit'),

      // Modal Configuração
      modalSetup: document.getElementById('modal-setup'),
      formSetup: document.getElementById('form-setup'),
      inputSetupPlayerA: document.getElementById('setup-player-a'),
      inputSetupPlayerB: document.getElementById('setup-player-b'),
      inputSetupRoundsLimit: document.getElementById('setup-rounds-limit'),
      totalCardsIndicator: document.getElementById('total-cards-indicator'),
      btnSetupToAI: document.getElementById('btn-setup-to-ai'),
      selectSetupTimer: document.getElementById('setup-timer'),

      // Modal Importação IA
      modalAIImport: document.getElementById('modal-ai-import'),
      btnCopyAIPrompt: document.getElementById('btn-copy-ai-prompt'),
      aiPromptText: document.getElementById('ai-prompt-text'),
      aiJsonInput: document.getElementById('ai-json-input'),
      aiReplaceExisting: document.getElementById('ai-replace-existing'),
      aiImportFeedback: document.getElementById('ai-import-feedback'),
      btnConfirmAIImport: document.getElementById('btn-confirm-ai-import'),
      btnCancelAIModal: document.getElementById('btn-cancel-ai-modal'),
      btnCloseAIModal: document.getElementById('btn-close-ai-modal'),

      // Modal Vitória
      modalRoundWin: document.getElementById('modal-round-win'),
      winWinnerName: document.getElementById('win-winner-name'),
      winWord: document.getElementById('win-word'),
      winCategory: document.getElementById('win-category'),
      winCluesList: document.getElementById('win-clues-list'),
      winExplanation: document.getElementById('win-explanation'),
      btnNextRound: document.getElementById('btn-next-round'),

      // Modal Fim de Jogo
      modalGameOver: document.getElementById('modal-game-over'),
      gameOverChampion: document.getElementById('game-over-champion'),
      gameOverSummary: document.getElementById('game-over-summary'),
      btnPlayAgain: document.getElementById('btn-play-again'),

      // Modal Editor Manual
      modalEditor: document.getElementById('modal-editor'),
      editorCardsList: document.getElementById('editor-cards-list'),
      formAddCard: document.getElementById('form-add-card'),
      btnCloseEditor: document.getElementById('btn-close-editor'),
      btnResetDefaultCards: document.getElementById('btn-reset-default-cards')
    };
  }

  loadCustomOrStorageCards() {
    const saved = localStorage.getItem('jogo3pistas_cartoes');
    if (saved) {
      try {
        this.allCards = JSON.parse(saved);
      } catch (e) {
        this.allCards = [...PISTAS_PADRAO];
      }
    } else {
      this.allCards = [...PISTAS_PADRAO];
    }
  }

  saveCardsToStorage() {
    localStorage.setItem('jogo3pistas_cartoes', JSON.stringify(this.allCards));
    this.updateCardsIndicator();
  }

  updateCardsIndicator() {
    const count = this.allCards.length;
    if (this.dom.totalCardsIndicator) {
      this.dom.totalCardsIndicator.textContent = `Banco com ${count} pistas disponíveis`;
    }
    if (this.dom.inputSetupRoundsLimit) {
      this.dom.inputSetupRoundsLimit.max = count;
      if (parseInt(this.dom.inputSetupRoundsLimit.value, 10) > count) {
        this.dom.inputSetupRoundsLimit.value = Math.min(10, count);
      }
    }
  }

  // ==========================================================================
  // Controle de Turno e Jogador Ativo
  // ==========================================================================
  getStartingPlayerIndex() {
    return this.currentRoundIndex % 2;
  }

  getTargetPlayerIndexForClue(clueIdx) {
    const starter = this.getStartingPlayerIndex();
    if (clueIdx === 0) return starter;
    if (clueIdx === 1) return 1 - starter;
    if (clueIdx === 2) return starter;
    return null;
  }

  getCurrentActivePlayer() {
    if (this.isPlateiaTurn) return null;
    const playerIdx = this.getTargetPlayerIndexForClue(this.currentClueIndex);
    return this.players[playerIdx];
  }

  // ==========================================================================
  // Ciclo da Partida
  // ==========================================================================
  startNewGame() {
    this.players[0].name = this.dom.inputSetupPlayerA.value.trim() || 'Jogador A';
    this.players[1].name = this.dom.inputSetupPlayerB.value.trim() || 'Jogador B';
    this.players[0].score = 0;
    this.players[1].score = 0;
    this.plateiaScore = 0;

    // Limite de rodadas definido na personalização
    let requestedRounds = parseInt(this.dom.inputSetupRoundsLimit.value, 10);
    if (isNaN(requestedRounds) || requestedRounds < 1) requestedRounds = 5;
    requestedRounds = Math.min(requestedRounds, this.allCards.length);

    this.turnTimerSecs = parseInt(this.dom.selectSetupTimer.value, 10);

    // Embaralhar as cartas
    const shuffled = [...this.allCards].sort(() => Math.random() - 0.5);
    this.roundList = shuffled.slice(0, requestedRounds);
    this.totalRoundsConfig = this.roundList.length;

    this.currentRoundIndex = 0;
    this.closeModal(this.dom.modalSetup);
    this.closeModal(this.dom.modalGameOver);

    this.sound.init();
    this.startRound(this.currentRoundIndex);
  }

  startRound(roundIdx) {
    this.currentRoundIndex = roundIdx;
    this.currentClueIndex = 0;
    this.isPlateiaTurn = false;
    this.roundFinished = false;
    this.clearFeedback();

    const currentCard = this.roundList[this.currentRoundIndex];
    if (!currentCard) {
      this.endGame();
      return;
    }

    this.dom.playerAName.textContent = this.players[0].name;
    this.dom.playerBName.textContent = this.players[1].name;
    this.updateScoresUI();

    this.dom.roundDisplay.textContent = `Rodada ${this.currentRoundIndex + 1} de ${this.totalRoundsConfig}`;
    
    for (let i = 0; i < 3; i++) {
      const targetIdx = this.getTargetPlayerIndexForClue(i);
      const targetName = this.players[targetIdx].name;
      this.dom.clueTargets[i].textContent = `Direcionada a: ${targetName}`;
    }

    this.updateClueCardsUI();
    this.setupTurnForCurrentClue();
  }

  setupTurnForCurrentClue() {
    this.clearFeedback();
    this.stopTimer();

    const points = this.pointsValues[this.currentClueIndex];
    const targetPlayer = this.getCurrentActivePlayer();
    const targetIdx = this.getTargetPlayerIndexForClue(this.currentClueIndex);

    this.dom.currentValueDisplay.textContent = `${points} PONTOS`;

    if (targetIdx === 0) {
      this.dom.podiumA.classList.add('turn-active');
      this.dom.podiumB.classList.remove('turn-active');
      this.dom.answerConsole.className = 'answer-console border-player-a';
      this.dom.targetBadge.className = 'badge-player-target badge-a';
    } else {
      this.dom.podiumB.classList.add('turn-active');
      this.dom.podiumA.classList.remove('turn-active');
      this.dom.answerConsole.className = 'answer-console border-player-b';
      this.dom.targetBadge.className = 'badge-player-target badge-b';
    }

    this.dom.targetBadge.textContent = targetPlayer.name;
    this.dom.targetPointsBadge.textContent = `${points} pts`;

    this.dom.plateiaSection.style.display = 'none';
    this.dom.answerConsole.style.display = 'flex';

    this.dom.answerInput.value = '';
    this.dom.answerInput.disabled = false;
    this.dom.btnSubmit.disabled = false;
    this.dom.btnPass.disabled = false;
    setTimeout(() => {
      this.dom.answerInput.focus();
    }, 100);

    this.sound.playReveal();
    this.updateClueCardsUI();

    if (this.turnTimerSecs > 0) {
      this.startTimer(this.turnTimerSecs);
    } else {
      this.dom.timerDisplay.style.display = 'none';
    }
  }

  updateClueCardsUI() {
    const currentCard = this.roundList[this.currentRoundIndex];

    this.dom.clueCards.forEach((cardEl, idx) => {
      const contentEl = this.dom.clueContents[idx];
      cardEl.classList.remove('active', 'locked', 'revealed');

      if (idx < this.currentClueIndex || this.roundFinished || this.isPlateiaTurn) {
        cardEl.classList.add('revealed');
        contentEl.innerHTML = `<span>${currentCard.pistas[idx]}</span>`;
      } else if (idx === this.currentClueIndex && !this.isPlateiaTurn && !this.roundFinished) {
        cardEl.classList.add('active');
        contentEl.innerHTML = `<span>${currentCard.pistas[idx]}</span>`;
      } else {
        cardEl.classList.add('locked');
        contentEl.innerHTML = `
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>Pista Oculta</span>
        `;
      }
    });
  }

  // ==========================================================================
  // Processamento de Respostas
  // ==========================================================================
  handlePlayerAnswer(inputVal) {
    if (this.roundFinished || this.isPlateiaTurn) return;

    const trimmed = inputVal.trim();
    if (!trimmed) {
      this.showFeedback('Digite uma resposta ou clique em Passar a Vez!', 'wrong');
      return;
    }

    const currentCard = this.roundList[this.currentRoundIndex];
    const match = checkAnswerMatch(trimmed, currentCard);

    if (match.result === 'exact') {
      this.handleCorrectAnswer();
    } else if (match.result === 'partial') {
      // Abre a confirmação para o mediador validar a resposta semelhante (ex: "composto" em "composto térmico")
      this.promptPartialMatchValidation(trimmed, currentCard);
    } else {
      this.handleWrongAnswer(trimmed);
    }
  }

  promptPartialMatchValidation(userInput, currentCard) {
    this.stopTimer();
    const targetIdx = this.getTargetPlayerIndexForClue(this.currentClueIndex);
    const targetPlayer = this.players[targetIdx];
    const points = this.pointsValues[this.currentClueIndex];

    this.pendingUserInput = userInput;
    this.dom.partialPlayerName.textContent = targetPlayer.name;
    this.dom.partialUserInput.textContent = `"${userInput}"`;
    this.dom.partialCorrectWord.textContent = currentCard.palavra;
    this.dom.partialPointsVal.textContent = points;

    this.openModal(this.dom.modalPartialConfirm);
  }

  handleManualValidation() {
    if (this.roundFinished || this.isPlateiaTurn) return;
    const targetIdx = this.getTargetPlayerIndexForClue(this.currentClueIndex);
    const targetPlayer = this.players[targetIdx];
    const points = this.pointsValues[this.currentClueIndex];

    if (confirm(`Validar e aceitar o palpite de ${targetPlayer.name} valendo ${points} pontos?`)) {
      this.handleCorrectAnswer();
    }
  }

  handleCorrectAnswer() {
    this.stopTimer();
    this.roundFinished = true;
    this.sound.playCorrect();
    this.confetti.fire(70);

    const targetIdx = this.getTargetPlayerIndexForClue(this.currentClueIndex);
    const winner = this.players[targetIdx];
    const pointsAwarded = this.pointsValues[this.currentClueIndex];

    winner.score += pointsAwarded;
    this.updateScoresUI();
    this.updateClueCardsUI();

    this.showFeedback(`🎉 Acertou! +${pointsAwarded} pontos para ${winner.name}!`, 'correct');

    setTimeout(() => {
      this.showRoundVictoryModal(winner.name, pointsAwarded);
    }, 900);
  }

  handleWrongAnswer(missedText = '') {
    this.stopTimer();
    this.sound.playWrong();

    this.dom.answerConsole.classList.add('shake-anim');
    setTimeout(() => {
      this.dom.answerConsole.classList.remove('shake-anim');
    }, 450);

    const targetIdx = this.getTargetPlayerIndexForClue(this.currentClueIndex);
    const playerMissed = this.players[targetIdx].name;
    const pointsAttempted = this.pointsValues[this.currentClueIndex];

    // Guarda histórico para validação retroativa caso o mediador deseje validar depois
    this.lastMissedInfo = {
      playerIdx: targetIdx,
      playerName: playerMissed,
      points: pointsAttempted,
      clueIndex: this.currentClueIndex,
      missedText
    };

    if (this.currentClueIndex < 2) {
      this.currentClueIndex++;
      this.showFeedback(
        `❌ ${playerMissed} errou${missedText ? ` ("${missedText}")` : ''}! Passando para a próxima pista...`,
        'wrong',
        true
      );
      
      setTimeout(() => {
        if (!this.roundFinished) {
          this.setupTurnForCurrentClue();
        }
      }, 1400);
    } else {
      this.showFeedback(
        `❌ ${playerMissed} errou a 3ª pista! Vez da Platéia!`,
        'wrong',
        true
      );
      setTimeout(() => {
        if (!this.roundFinished) {
          this.activatePlateiaTurn();
        }
      }, 1500);
    }
  }

  retroactiveValidateLastMiss() {
    if (!this.lastMissedInfo || this.roundFinished) return;
    const { playerIdx, points, playerName } = this.lastMissedInfo;
    this.stopTimer();
    this.roundFinished = true;
    this.sound.playCorrect();
    this.confetti.fire(70);

    const winner = this.players[playerIdx];
    winner.score += points;
    this.updateScoresUI();
    this.updateClueCardsUI();

    this.showFeedback(`🎉 Acerto validado pelo mediador! +${points} pontos para ${playerName}!`, 'correct');

    setTimeout(() => {
      this.showRoundVictoryModal(playerName, points);
    }, 800);
  }

  handlePassTurn() {
    if (this.roundFinished || this.isPlateiaTurn) return;
    this.handleWrongAnswer();
  }

  // ==========================================================================
  // Platéia
  // ==========================================================================
  activatePlateiaTurn() {
    this.stopTimer();
    this.isPlateiaTurn = true;
    this.sound.playReveal();

    this.dom.podiumA.classList.remove('turn-active');
    this.dom.podiumB.classList.remove('turn-active');

    this.updateClueCardsUI();

    this.dom.answerConsole.style.display = 'none';
    this.dom.plateiaSection.style.display = 'flex';
    this.dom.plateiaAnswerInput.value = '';
    setTimeout(() => {
      this.dom.plateiaAnswerInput.focus();
    }, 150);
  }

  handlePlateiaAnswer(inputVal) {
    const currentCard = this.roundList[this.currentRoundIndex];
    const correct = isAnswerCorrect(inputVal, currentCard);

    if (correct) {
      this.plateiaScore += 5;
      this.updateScoresUI();
      this.sound.playCorrect();
      this.confetti.fire(60);
      this.showRoundVictoryModal('Platéia / Outro Grupo', 5);
    } else {
      this.sound.playWrong();
      alert('Palpite da Platéia incorreto!');
    }
  }

  handlePlateiaManualHit() {
    this.plateiaScore += 5;
    this.updateScoresUI();
    this.sound.playCorrect();
    this.confetti.fire(60);
    this.showRoundVictoryModal('Platéia / Outro Grupo', 5);
  }

  revealSecretWithoutWinner() {
    this.showRoundVictoryModal('Ninguém acertou', 0);
  }

  // ==========================================================================
  // Temporizador
  // ==========================================================================
  startTimer(seconds) {
    this.stopTimer();
    this.timeRemaining = seconds;
    this.dom.timerDisplay.style.display = 'inline-flex';
    this.dom.timerSeconds.textContent = `${this.timeRemaining}s`;
    this.dom.timerDisplay.classList.remove('timer-warning');

    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.dom.timerSeconds.textContent = `${this.timeRemaining}s`;

      if (this.timeRemaining <= 3 && this.timeRemaining > 0) {
        this.dom.timerDisplay.classList.add('timer-warning');
        this.sound.playTick();
      }

      if (this.timeRemaining <= 0) {
        this.stopTimer();
        this.handleWrongAnswer();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // ==========================================================================
  // Modais de Resultado e Finalização
  // ==========================================================================
  showRoundVictoryModal(winnerName, points) {
    this.roundFinished = true;
    const currentCard = this.roundList[this.currentRoundIndex];

    this.dom.winWinnerName.textContent = points > 0 
      ? `🎉 ${winnerName} acertou e ganhou ${points} pontos!` 
      : `Tempo esgotado para todos! A palavra secreta era:`;

    this.dom.winWord.textContent = currentCard.palavra;
    this.dom.winCategory.textContent = currentCard.categoria || 'Geral';
    this.dom.winExplanation.textContent = currentCard.explicacao || '';

    this.dom.winCluesList.innerHTML = currentCard.pistas.map((pista, idx) => `
      <div class="revealed-clue-item">
        <strong>Pista ${idx + 1} (${this.pointsValues[idx]} pts):</strong>
        <span>${pista}</span>
      </div>
    `).join('');

    if (this.currentRoundIndex + 1 >= this.totalRoundsConfig) {
      this.dom.btnNextRound.textContent = 'Ver Resultado Final 🏆';
    } else {
      this.dom.btnNextRound.textContent = 'Próxima Rodada ➔';
    }

    this.openModal(this.dom.modalRoundWin);
  }

  nextRoundOrEnd() {
    this.closeModal(this.dom.modalRoundWin);
    if (this.currentRoundIndex + 1 < this.totalRoundsConfig) {
      this.startRound(this.currentRoundIndex + 1);
    } else {
      this.endGame();
    }
  }

  endGame() {
    this.stopTimer();
    this.sound.playVictory();
    this.confetti.fire(120);

    const [pA, pB] = this.players;
    let champText = '';
    if (pA.score > pB.score) {
      champText = `🏆 ${pA.name} é o grande campeão!`;
    } else if (pB.score > pA.score) {
      champText = `🏆 ${pB.name} é o grande campeão!`;
    } else {
      champText = `🤝 Empate entre ${pA.name} e ${pB.name}!`;
    }

    this.dom.gameOverChampion.textContent = champText;
    this.dom.gameOverSummary.innerHTML = `
      <div style="display:flex; justify-content:space-around; width:100%; margin: 1.5rem 0;">
        <div style="text-align:center;">
          <h4 style="color:var(--player-a-color);">${pA.name}</h4>
          <div style="font-size:2.8rem; font-weight:900;">${pA.score}</div>
          <small style="color:var(--text-muted);">pontos</small>
        </div>
        <div style="text-align:center;">
          <h4 style="color:var(--player-b-color);">${pB.name}</h4>
          <div style="font-size:2.8rem; font-weight:900;">${pB.score}</div>
          <small style="color:var(--text-muted);">pontos</small>
        </div>
        <div style="text-align:center;">
          <h4 style="color:var(--plateia-color);">Platéia</h4>
          <div style="font-size:2.8rem; font-weight:900;">${this.plateiaScore}</div>
          <small style="color:var(--text-muted);">pontos</small>
        </div>
      </div>
    `;

    this.openModal(this.dom.modalGameOver);
  }

  // ==========================================================================
  // Importação Gerada por IA
  // ==========================================================================
  copyAIPrompt() {
    const text = this.dom.aiPromptText.textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.dom.btnCopyAIPrompt.textContent = '✅ Copiado com Sucesso!';
        setTimeout(() => {
          this.dom.btnCopyAIPrompt.textContent = '📋 Copiar Prompt';
        }, 2500);
      }).catch(() => {
        this.fallbackCopyText(text);
      });
    } else {
      this.fallbackCopyText(text);
    }
  }

  fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      this.dom.btnCopyAIPrompt.textContent = '✅ Copiado!';
      setTimeout(() => {
        this.dom.btnCopyAIPrompt.textContent = '📋 Copiar Prompt';
      }, 2500);
    } catch (e) {
      alert('Selecione e copie o texto manualmente.');
    }
    document.body.removeChild(textArea);
  }

  importAIJSON() {
    let raw = this.dom.aiJsonInput.value.trim();
    if (!raw) {
      this.dom.aiImportFeedback.textContent = '❌ Cole o JSON gerado pela IA antes de importar.';
      this.dom.aiImportFeedback.style.color = 'var(--accent-danger)';
      return;
    }

    // Limpeza de blocos markdown ```json ... ```
    raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '').trim();

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('O JSON deve ser uma lista com pelo menos 1 rodada.');
      }

      // Validação das rodadas
      const validCards = [];
      parsed.forEach((item, idx) => {
        if (!item.palavra || typeof item.palavra !== 'string') {
          throw new Error(`Rodada #${idx + 1} não possui a propriedade "palavra" obrigatória.`);
        }
        if (!Array.isArray(item.pistas) || item.pistas.length < 3) {
          throw new Error(`A palavra "${item.palavra}" precisa ter exatamente 3 pistas no array "pistas".`);
        }

        validCards.push({
          palavra: item.palavra.trim(),
          categoria: item.categoria ? item.categoria.trim() : 'Geral',
          sinonimos: Array.isArray(item.sinonimos) ? item.sinonimos.map(s => String(s).trim()) : [item.palavra.trim()],
          pistas: [item.pistas[0].trim(), item.pistas[1].trim(), item.pistas[2].trim()],
          explicacao: item.explicacao ? item.explicacao.trim() : ''
        });
      });

      // Substitui ou concatena
      if (this.dom.aiReplaceExisting.checked) {
        this.allCards = validCards;
      } else {
        this.allCards = [...this.allCards, ...validCards];
      }

      this.saveCardsToStorage();
      this.updateCardsIndicator();

      this.dom.aiImportFeedback.textContent = `✅ Sucesso! ${validCards.length} rodadas foram importadas com sucesso!`;
      this.dom.aiImportFeedback.style.color = 'var(--accent-success)';
      this.sound.playCorrect();

      setTimeout(() => {
        this.closeModal(this.dom.modalAIImport);
        this.openSetupModal();
      }, 1200);

    } catch (err) {
      this.dom.aiImportFeedback.textContent = `❌ Erro no JSON: ${err.message}`;
      this.dom.aiImportFeedback.style.color = 'var(--accent-danger)';
      this.sound.playWrong();
    }
  }

  // ==========================================================================
  // Editor Manual
  // ==========================================================================
  renderEditorCards() {
    this.dom.editorCardsList.innerHTML = this.allCards.map((card, idx) => `
      <div style="background:var(--bg-surface-elevated); padding:0.85rem; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:flex-start; gap:1rem;">
        <div>
          <div style="font-weight:800; font-size:1.05rem; color:var(--blue-primary);">${idx + 1}. ${card.palavra} <small style="color:var(--text-muted); font-weight:normal;">(${card.categoria || 'Geral'})</small></div>
          <div style="font-size:0.85rem; color:var(--text-muted); margin-top:0.35rem;">
            1. ${card.pistas[0]}<br>
            2. ${card.pistas[1]}<br>
            3. ${card.pistas[2]}
          </div>
        </div>
        <button type="button" class="btn-icon" data-del-card="${idx}" title="Excluir Rodada" style="color:var(--accent-danger); flex-shrink:0;">
          🗑️
        </button>
      </div>
    `).join('');

    this.dom.editorCardsList.querySelectorAll('[data-del-card]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-del-card'), 10);
        if (confirm(`Deseja remover a palavra "${this.allCards[idx].palavra}"?`)) {
          this.allCards.splice(idx, 1);
          this.saveCardsToStorage();
          this.renderEditorCards();
        }
      });
    });
  }

  // ==========================================================================
  // UI Helpers e Event Listeners
  // ==========================================================================
  updateScoresUI() {
    this.dom.playerAScore.textContent = this.players[0].score;
    this.dom.playerBScore.textContent = this.players[1].score;
    this.dom.plateiaScoreHUD.textContent = this.plateiaScore;
  }

  showFeedback(msg, type = 'wrong', showRetroBtn = false) {
    this.dom.consoleFeedback.className = `console-feedback ${type}`;
    if (showRetroBtn && this.lastMissedInfo) {
      this.dom.consoleFeedback.innerHTML = `
        <span>${msg}</span>
        <button type="button" class="btn-retro-validate" id="btn-retro-validate" title="Clique para validar como acerto mesmo após o erro">
          ✅ Validar Acerto (+${this.lastMissedInfo.points} pts)
        </button>
      `;
      const retroBtn = document.getElementById('btn-retro-validate');
      if (retroBtn) {
        retroBtn.addEventListener('click', () => {
          this.retroactiveValidateLastMiss();
        });
      }
    } else {
      this.dom.consoleFeedback.textContent = msg;
    }
  }

  clearFeedback() {
    this.dom.consoleFeedback.textContent = '';
    this.dom.consoleFeedback.className = 'console-feedback';
  }

  openModal(modal) {
    if (modal) modal.classList.add('open');
  }

  closeModal(modal) {
    if (modal) modal.classList.remove('open');
  }

  openSetupModal() {
    this.updateCardsIndicator();
    this.openModal(this.dom.modalSetup);
  }

  toggleSound() {
    this.sound.enabled = !this.sound.enabled;
    this.dom.btnSound.classList.toggle('active', this.sound.enabled);
    this.dom.soundIcon.textContent = this.sound.enabled ? '🔊' : '🔇';
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      this.dom.btnFullscreen.classList.add('active');
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        this.dom.btnFullscreen.classList.remove('active');
      }
    }
  }

  bindEvents() {
    // Resposta do jogador
    this.dom.answerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handlePlayerAnswer(this.dom.answerInput.value);
    });

    this.dom.btnPass.addEventListener('click', () => {
      this.handlePassTurn();
    });

    // Validação Manual Direta pelo Mediador
    if (this.dom.btnManualValidate) {
      this.dom.btnManualValidate.addEventListener('click', () => {
        this.handleManualValidation();
      });
    }

    // Modal de Confirmação Parcial
    if (this.dom.btnPartialAccept) {
      this.dom.btnPartialAccept.addEventListener('click', () => {
        this.closeModal(this.dom.modalPartialConfirm);
        this.handleCorrectAnswer();
      });
    }

    if (this.dom.btnPartialReject) {
      this.dom.btnPartialReject.addEventListener('click', () => {
        this.closeModal(this.dom.modalPartialConfirm);
        this.handleWrongAnswer(this.pendingUserInput);
      });
    }

    // Platéia
    this.dom.btnPlateiaSubmit.addEventListener('click', () => {
      this.handlePlateiaAnswer(this.dom.plateiaAnswerInput.value);
    });
    this.dom.plateiaAnswerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.handlePlateiaAnswer(this.dom.plateiaAnswerInput.value);
      }
    });
    this.dom.btnPlateiaHit.addEventListener('click', () => {
      this.handlePlateiaManualHit();
    });
    this.dom.btnRevealAll.addEventListener('click', () => {
      this.revealSecretWithoutWinner();
    });

    // Próxima Rodada / Jogar Novamente
    this.dom.btnNextRound.addEventListener('click', () => {
      this.nextRoundOrEnd();
    });
    this.dom.btnPlayAgain.addEventListener('click', () => {
      this.closeModal(this.dom.modalGameOver);
      this.openSetupModal();
    });

    // Setup Form
    this.dom.formSetup.addEventListener('submit', (e) => {
      e.preventDefault();
      this.startNewGame();
    });

    // Botões de Atalho Rápido de Rodadas
    document.querySelectorAll('.btn-quick-round').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-rounds');
        if (val === 'all') {
          this.dom.inputSetupRoundsLimit.value = this.allCards.length;
        } else {
          this.dom.inputSetupRoundsLimit.value = Math.min(parseInt(val, 10), this.allCards.length);
        }
      });
    });

    // Header Buttons
    this.dom.btnSound.addEventListener('click', () => this.toggleSound());
    this.dom.btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
    this.dom.btnSettings.addEventListener('click', () => this.openSetupModal());
    this.dom.btnRestart.addEventListener('click', () => {
      if (confirm('Deseja reiniciar a partida atual?')) {
        this.openSetupModal();
      }
    });

    // Modal Importação IA
    const openAIModal = () => {
      this.dom.aiImportFeedback.textContent = '';
      this.dom.aiJsonInput.value = '';
      this.closeModal(this.dom.modalSetup);
      this.openModal(this.dom.modalAIImport);
    };

    this.dom.btnOpenAIModal.addEventListener('click', openAIModal);
    this.dom.btnSetupToAI.addEventListener('click', openAIModal);

    this.dom.btnCloseAIModal.addEventListener('click', () => {
      this.closeModal(this.dom.modalAIImport);
    });
    this.dom.btnCancelAIModal.addEventListener('click', () => {
      this.closeModal(this.dom.modalAIImport);
      this.openSetupModal();
    });
    this.dom.btnCopyAIPrompt.addEventListener('click', () => {
      this.copyAIPrompt();
    });
    this.dom.btnConfirmAIImport.addEventListener('click', () => {
      this.importAIJSON();
    });

    // Editor Manual
    this.dom.btnCustomCards.addEventListener('click', () => {
      this.renderEditorCards();
      this.openModal(this.dom.modalEditor);
    });

    this.dom.btnCloseEditor.addEventListener('click', () => {
      this.closeModal(this.dom.modalEditor);
    });

    this.dom.btnResetDefaultCards.addEventListener('click', () => {
      if (confirm('Restaurar o banco original com todas as 30 palavras temáticas?')) {
        this.allCards = [...PISTAS_PADRAO];
        this.saveCardsToStorage();
        this.renderEditorCards();
      }
    });

    this.dom.formAddCard.addEventListener('submit', (e) => {
      e.preventDefault();
      const palavra = document.getElementById('new-word').value.trim();
      const cat = document.getElementById('new-cat').value.trim() || 'Geral';
      const p1 = document.getElementById('new-p1').value.trim();
      const p2 = document.getElementById('new-p2').value.trim();
      const p3 = document.getElementById('new-p3').value.trim();
      const sinonimosRaw = document.getElementById('new-synonyms').value.trim();

      if (!palavra || !p1 || !p2 || !p3) {
        alert('Preencha a palavra e as 3 pistas!');
        return;
      }

      const sinonimos = sinonimosRaw ? sinonimosRaw.split(',').map(s => s.trim()).filter(Boolean) : [palavra];

      this.allCards.unshift({
        palavra,
        sinonimos,
        categoria: cat,
        pistas: [p1, p2, p3],
        explicacao: 'Cadastrado manualmente.'
      });

      this.saveCardsToStorage();
      this.renderEditorCards();
      this.dom.formAddCard.reset();
      alert(`Palavra "${palavra}" adicionada com sucesso!`);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.jogo = new Jogo3Pistas();
  window.jogo.init();
});
