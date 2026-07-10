// ---------- DADOS (edite aqui para personalizar) ----------
const START_YEAR = 2020; // últimos 6 anos: 2020 -> 2025/2026
const photos = [
  {
    year: "2020",
    age: "10 anos",
    text: "O começo de tudo. Aquela energia de criança que nunca vai embora.",
    img: "photos/ano1.jpg",
  },
  {
    year: "2021",
    age: "11 anos",
    text: "Descobrindo novas paixões e fazendo amizades que ficaram pra vida.",
    img: "photos/ano2.jpg",
  },
  {
    year: "2022",
    age: "12 anos",
    text: "Crescendo, aprontando e colecionando histórias pra contar.",
    img: "photos/ano3.jpg",
  },
  {
    year: "2023",
    age: "13 anos",
    text: "A fase das grandes aventuras e das risadas que não acabam mais.",
    img: "photos/ano4.jpg",
  },
  {
    year: "2024",
    age: "14 anos",
    text: "Mais confiança, mais estilo e sonhos cada vez maiores.",
    img: "photos/ano5.jpg",
  },
  {
    year: "2025",
    age: "15 anos",
    text: "Pronto para o próximo grande capítulo: os 16 anos!",
    img: "photos/ano6.jpg",
  },
];

const achievements = [
  { icon: "🏆", title: "Superação", text: "Enfrentou desafios de cabeça erguida e sempre deu a volta por cima." },
  { icon: "⚽", title: "Esporte", text: "Suor, garra e muita paixão em cada partida jogada." },
  { icon: "🎓", title: "Estudos", text: "Dedicação nos estudos construindo um futuro brilhante." },
  { icon: "🎮", title: "Diversão", text: "Mestre nas partidas e nas resenhas com a galera." },
  { icon: "🤝", title: "Amizade", text: "Um amigo leal, presente e daqueles que a gente não larga." },
  { icon: "🎯", title: "Novos Sonhos", text: "Metas grandes pela frente e toda a energia pra alcançá-las." },
];

// ---------- ÁUDIO CINEMATOGRÁFICO (Web Audio API - sem arquivos) ----------
let audioCtx = null;
let soundOn = true;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// Bipe de contagem regressiva
function playBeep(freq = 440, duration = 0.15, type = "sine", vol = 0.2) {
  if (!audioCtx || !soundOn) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

// Acorde épico da revelação
function playFanfare() {
  if (!audioCtx || !soundOn) return;
  const notes = [261.63, 329.63, 392.0, 523.25]; // C E G C (dó maior)
  notes.forEach((f, i) => {
    setTimeout(() => playBeep(f, 1.2, "triangle", 0.18), i * 90);
  });
}

// Drone/atmosfera de fundo suave
let droneNodes = null;
function startDrone() {
  if (!audioCtx || !soundOn || droneNodes) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = 65;
  gain.gain.value = 0.05;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  droneNodes = { osc, gain };
}
function stopDrone() {
  if (droneNodes) {
    try { droneNodes.osc.stop(); } catch (e) {}
    droneNodes = null;
  }
}

// ---------- ELEMENTOS ----------
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
const countdown = document.getElementById("countdown");
const countNumber = document.getElementById("countNumber");
const ringProgress = document.getElementById("ringProgress");
const reveal = document.getElementById("reveal");
const exploreBtn = document.getElementById("exploreBtn");
const content = document.getElementById("content");
const soundToggle = document.getElementById("soundToggle");
const replayBtn = document.getElementById("replayBtn");

const RING_LEN = 2 * Math.PI * 54; // circunferência

// ---------- CONTAGEM REGRESSIVA ----------
function runCountdown() {
  let n = 5;
  countNumber.textContent = n;
  countNumber.classList.add("pop");
  ringProgress.style.strokeDashoffset = 0;
  playBeep(500, 0.15, "sine", 0.25);

  const total = 5;
  const timer = setInterval(() => {
    n--;
    if (n <= 0) {
      clearInterval(timer);
      showReveal();
      return;
    }
    countNumber.textContent = n;
    countNumber.classList.remove("pop");
    void countNumber.offsetWidth; // reinicia animação
    countNumber.classList.add("pop");
    // anel diminui
    const offset = RING_LEN * ((total - n) / total);
    ringProgress.style.strokeDashoffset = offset;
    // último bipe mais agudo
    playBeep(n === 1 ? 800 : 500, 0.15, "sine", 0.25);
  }, 1000);
}

// ---------- TRANSIÇÕES ----------
function showReveal() {
  countdown.classList.add("hidden");
  reveal.classList.remove("hidden");
  playFanfare();
  startDrone();
}

function showContent() {
  reveal.classList.add("hidden");
  content.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  buildContent();
}

// ---------- CONSTRUÇÃO DO CONTEÚDO ----------
function buildContent() {
  const timeline = document.getElementById("timeline");
  if (timeline.dataset.built) return;
  timeline.dataset.built = "1";

  timeline.innerHTML = photos
    .map(
      (p) => `
      <div class="tl-item">
        <div class="tl-photo">
          <img src="${p.img}" alt="Renzo em ${p.year}" loading="lazy"
               onerror="this.parentElement.classList.add('no-img'); this.style.display='none';" />
        </div>
        <div class="tl-caption">
          <div class="tl-year">${p.year}</div>
          <div class="tl-age">${p.age}</div>
          <p class="tl-text">${p.text}</p>
        </div>
      </div>`
    )
    .join("");

  const ach = document.getElementById("achievements");
  ach.innerHTML = achievements
    .map(
      (a) => `
      <div class="ach-card">
        <div class="ach-icon">${a.icon}</div>
        <h3 class="ach-title">${a.title}</h3>
        <p class="ach-text">${a.text}</p>
      </div>`
    )
    .join("");

  setupScrollReveal();
}

// ---------- SCROLL REVEAL ----------
function setupScrollReveal() {
  const items = document.querySelectorAll(".tl-item, .ach-card");
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  items.forEach((el) => obs.observe(el));
}

// ---------- EVENTOS ----------
startBtn.addEventListener("click", () => {
  initAudio();
  if (audioCtx.state === "suspended") audioCtx.resume();
  startScreen.classList.add("hidden");
  countdown.classList.remove("hidden");
  runCountdown();
});

exploreBtn.addEventListener("click", showContent);

soundToggle.addEventListener("click", () => {
  soundOn = !soundOn;
  soundToggle.classList.toggle("muted", !soundOn);
  soundToggle.querySelector(".sound-icon").textContent = soundOn ? "♪" : "✕";
  if (!soundOn) stopDrone();
  else { initAudio(); startDrone(); }
});

replayBtn.addEventListener("click", () => {
  content.classList.add("hidden");
  reveal.classList.add("hidden");
  countdown.classList.remove("hidden");
  window.scrollTo({ top: 0 });
  stopDrone();
  initAudio();
  if (audioCtx.state === "suspended") audioCtx.resume();
  runCountdown();
});
