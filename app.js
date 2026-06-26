// ─── DOMAIN MAP ────────────────────────────────────────
const DOMAINS = [
  { name: 'D1 · Security Principles', range: [0,   100] },
  { name: 'D2 · BC / DR / IR',        range: [100, 150] },
  { name: 'D3 · Access Control',      range: [150, 230] },
  { name: 'D4 · Network Security',    range: [230, 380] },
  { name: 'D5 · Security Operations', range: [380, 502] },
];

function getDomain(idx) {
  for (const d of DOMAINS) {
    if (idx >= d.range[0] && idx < d.range[1]) return d.name;
  }
  return 'General';
}

// ─── STATE ─────────────────────────────────────────────
let mode      = 'practice';
let questions = [];
let current   = 0;
let answers   = {};   // question index → chosen option index
let startTime, timerID;
const TOTAL_SECONDS = 9000; // 2.5 hours

// ─── SPLASH ────────────────────────────────────────────
function selectMode(m) {
  mode = m;
  document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('sel'));
  document.getElementById('m-' + m).classList.add('sel');
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function startExam() {
  switch (mode) {
    case 'quick':
      questions = shuffle(ALL_Q)
        .slice(0, 50)
        .map((q, i) => ({ ...q, origIdx: i }));
      break;

    case 'weak': {
      const missed = JSON.parse(localStorage.getItem('cc_missed') || '[]');
      const pool   = missed.length >= 10
        ? missed.map(i => ALL_Q[i]).filter(Boolean)
        : shuffle(ALL_Q).slice(0, 50);
      questions = pool.map((q, i) => ({ ...q, origIdx: i }));
      break;
    }

    default: // 'practice' and 'exam'
      questions = ALL_Q.map((q, i) => ({ ...q, origIdx: i }));
      if (mode === 'exam') questions = shuffle(questions);
  }

  current   = 0;
  answers   = {};
  startTime = Date.now();

  show('exam');
  buildMiniGrid();
  renderQuestion();

  const timerEl = document.getElementById('timer-display');
  if (mode === 'exam') {
    timerEl.style.display = '';
    startTimer();
  } else {
    timerEl.style.display = 'none';
  }
}

// ─── TIMER ─────────────────────────────────────────────
function startTimer() {
  const el = document.getElementById('timer-display');

  timerID = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const left    = TOTAL_SECONDS - elapsed;

    if (left <= 0) {
      clearInterval(timerID);
      finishExam();
      return;
    }

    const h = Math.floor(left / 3600);
    const m = Math.floor((left % 3600) / 60);
    const s = left % 60;
    el.textContent = [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
    el.className   = 'timer' + (left < 300 ? ' crit' : '');
  }, 1000);
}

// ─── RENDER QUESTION ───────────────────────────────────
function renderQuestion() {
  const q     = questions[current];
  const total = questions.length;

  // Top bar
  document.getElementById('prog-text').textContent  = `Question ${current + 1} of ${total}`;
  document.getElementById('prog-fill').style.width  = `${(current / total) * 100}%`;

  // Question header
  document.getElementById('q-num').textContent    = `Question ${current + 1}`;
  document.getElementById('q-domain').textContent = getDomain(q.origIdx ?? current);
  document.getElementById('q-text').textContent   = q.q;

  const answered = answers[current] !== undefined;
  const chosen   = answers[current];
  const correct  = q.a;

  // Options
  const optsEl = document.getElementById('options');
  optsEl.innerHTML = '';

  q.o.forEach((text, i) => {
    const div = document.createElement('div');
    div.className = 'opt';

    if (answered) {
      div.classList.add('locked');
      if (i === correct)                      div.classList.add('reveal');
      if (i === chosen && i !== correct)      div.classList.add('wrong');
      if (i === chosen && i === correct)      div.classList.add('correct');
    } else {
      div.addEventListener('click', () => selectAnswer(i));
    }

    div.innerHTML = `
      <div class="opt-letter">${'ABCD'[i]}</div>
      <div class="opt-text">${text}</div>
    `;
    optsEl.appendChild(div);
  });

  // Feedback (practice mode only)
  const fb = document.getElementById('feedback');
  if (answered && mode === 'practice') {
    if (chosen === correct) {
      fb.className   = 'feedback correct';
      fb.textContent = '✓ Correct!';
    } else {
      fb.className   = 'feedback wrong';
      fb.textContent = `✗ Incorrect. Correct answer: ${q.o[correct]}`;
    }
  } else {
    fb.className = 'feedback'; // hidden
  }

  // Navigation buttons
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');

  btnPrev.disabled = current === 0;

  if (current === total - 1) {
    btnNext.textContent = 'Finish ✓';
    btnNext.onclick = () => { if (confirmFinish()) finishExam(); };
  } else {
    btnNext.textContent = 'Next →';
    btnNext.onclick = () => navigate(1);
  }

  updateLiveScore();
  updateMiniGrid();
}

// ─── ANSWER SELECTION ──────────────────────────────────
function selectAnswer(i) {
  if (answers[current] !== undefined) return; // already answered
  answers[current] = i;
  renderQuestion();
}

// ─── NAVIGATION ────────────────────────────────────────
function navigate(dir) {
  current = Math.max(0, Math.min(questions.length - 1, current + dir));
  renderQuestion();
}

function confirmFinish() {
  const unanswered = questions.length - Object.keys(answers).length;
  if (unanswered > 0) {
    return confirm(`You have ${unanswered} unanswered question(s). Finish anyway?`);
  }
  return true;
}

function confirmEnd() {
  if (confirmFinish()) finishExam();
}

// ─── MINI GRID (sidebar) ───────────────────────────────
function buildMiniGrid() {
  const grid = document.getElementById('mini-grid');
  grid.innerHTML = '';
  questions.forEach((_, i) => {
    const dot    = document.createElement('div');
    dot.className = 'mini-dot';
    dot.title     = `Q${i + 1}`;
    dot.addEventListener('click', () => { current = i; renderQuestion(); });
    grid.appendChild(dot);
  });
}

function updateMiniGrid() {
  document.querySelectorAll('.mini-dot').forEach((dot, i) => {
    dot.className = 'mini-dot';
    if (answers[i] !== undefined) {
      dot.classList.add(answers[i] === questions[i].a ? 'ans-c' : 'ans-w');
    }
    if (i === current) dot.classList.add('curr');
  });
}

// ─── LIVE SCORE (sidebar) ──────────────────────────────
function updateLiveScore() {
  const answered = Object.keys(answers).length;
  let correct = 0;

  Object.entries(answers).forEach(([idx, val]) => {
    if (questions[+idx] && val === questions[+idx].a) correct++;
  });

  document.getElementById('live-score').textContent = correct;
  document.getElementById('live-pct').textContent   = answered
    ? `${Math.round((correct / answered) * 100)}% correct`
    : '0% correct';
}

// ─── FINISH / RESULTS ──────────────────────────────────
function finishExam() {
  clearInterval(timerID);

  const elapsed  = Math.floor((Date.now() - startTime) / 1000);
  const total    = questions.length;
  let correct    = 0;
  let wrong      = 0;
  const missed   = [];
  const domStats = {};

  DOMAINS.forEach(d => { domStats[d.name] = { c: 0, t: 0 }; });

  questions.forEach((q, i) => {
    const dom = getDomain(q.origIdx ?? i);
    if (!domStats[dom]) domStats[dom] = { c: 0, t: 0 };
    domStats[dom].t++;

    if (answers[i] !== undefined) {
      if (answers[i] === q.a) {
        correct++;
        domStats[dom].c++;
      } else {
        wrong++;
        missed.push(q.origIdx ?? i);
      }
    } else {
      missed.push(q.origIdx ?? i); // unanswered counts as missed
    }
  });

  // Persist missed for Weak Areas mode
  localStorage.setItem('cc_missed', JSON.stringify([...new Set(missed)]));

  const unanswered = total - correct - wrong;
  const pct        = Math.round((correct / total) * 100);
  const pass       = pct >= 70;

  // ── Result card ──
  document.getElementById('res-icon').textContent  = pass ? '🏆' : '📚';
  document.getElementById('res-title').textContent = pass ? 'Congratulations!' : 'Keep Studying';
  document.getElementById('res-sub').textContent   = pass
    ? 'You passed! Great work on the ISC2 CC exam.'
    : `You scored ${pct}%. You need 70% to pass. Review and try again!`;

  const badge     = document.getElementById('pass-badge');
  badge.textContent = pass ? '✓ PASS' : '✗ FAIL';
  badge.className   = 'pass-badge ' + (pass ? 'pass' : 'fail');

  // Score ring
  document.getElementById('ring-pct').textContent = pct + '%';
  const circumference  = 364.4;
  const ringCircle     = document.getElementById('ring-circle');
  ringCircle.style.strokeDashoffset = circumference - (pct / 100) * circumference;
  ringCircle.style.stroke           = pass ? '#3fb950' : '#f85149';

  // Stats grid
  document.getElementById('r-correct').textContent   = correct;
  document.getElementById('r-wrong').textContent     = wrong;
  document.getElementById('r-unanswered').textContent = unanswered;

  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  document.getElementById('r-time').textContent = h > 0
    ? `${h}h ${m}m ${s}s`
    : `${m}m ${s}s`;

  // Domain breakdown bars
  let html = '';
  Object.entries(domStats).forEach(([name, stat]) => {
    if (stat.t === 0) return;
    const dp  = Math.round((stat.c / stat.t) * 100);
    const col = dp >= 70 ? '#3fb950' : dp >= 50 ? '#d29922' : '#f85149';
    html += `
      <div class="dom-row">
        <div class="dom-name" title="${name}">${name.substring(0, 28)}</div>
        <div class="dom-bar">
          <div class="dom-fill" style="width:${dp}%; background:${col}"></div>
        </div>
        <div class="dom-pct" style="color:${col}">${dp}%</div>
      </div>`;
  });
  document.getElementById('dom-breakdown').innerHTML =
    `<div class="domain-breakdown"><h3>By Domain</h3>${html}</div>`;

  show('results');
}

// ─── REVIEW WRONG ──────────────────────────────────────
function reviewWrong() {
  const missed = JSON.parse(localStorage.getItem('cc_missed') || '[]');
  if (missed.length === 0) {
    alert('No wrong answers to review — perfect score! 🎉');
    return;
  }
  selectMode('weak');
  startExam();
}

// ─── UTILITY ───────────────────────────────────────────
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
