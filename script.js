// ========== DADOS (edite aqui para personalizar) ==========
// 3 abas de fotos. Coloque as imagens reais em photos/ com os nomes indicados.
const photoTabs = [
  {
    id: "destaques",
    label: "Destaques",
    items: [
      { title: "2020", sub: "10 anos", img: "photos/ano1.jpg" },
      { title: "2021", sub: "11 anos", img: "photos/ano2.jpg" },
      { title: "2022", sub: "12 anos", img: "photos/ano3.jpg" },
      { title: "2023", sub: "13 anos", img: "photos/ano4.jpg" },
      { title: "2024", sub: "14 anos", img: "photos/ano5.jpg" },
      { title: "2025", sub: "15 anos", img: "photos/ano6.jpg" },
    ],
  },
  {
    id: "aventuras",
    label: "Aventuras",
    items: [
      { title: "Viagens", sub: "Novos lugares", img: "photos/aventura1.jpg" },
      { title: "Esporte", sub: "Em campo", img: "photos/aventura2.jpg" },
      { title: "Praia", sub: "Verão", img: "photos/aventura3.jpg" },
      { title: "Shows", sub: "Boas vibes", img: "photos/aventura4.jpg" },
      { title: "Trilhas", sub: "Natureza", img: "photos/aventura5.jpg" },
      { title: "Games", sub: "Diversão", img: "photos/aventura6.jpg" },
    ],
  },
  {
    id: "amigos",
    label: "Amigos & Família",
    items: [
      { title: "Família", sub: "Sempre juntos", img: "photos/amigos1.jpg" },
      { title: "Amigos", sub: "A galera", img: "photos/amigos2.jpg" },
      { title: "Festas", sub: "Momentos", img: "photos/amigos3.jpg" },
      { title: "Resenha", sub: "Risadas", img: "photos/amigos4.jpg" },
      { title: "Escola", sub: "Companheiros", img: "photos/amigos5.jpg" },
      { title: "Sempre", sub: "Do lado", img: "photos/amigos6.jpg" },
    ],
  },
];

const achievements = [
  { title: "Superação", text: "Enfrentou cada desafio com resiliência e determinação." },
  { title: "Esporte", text: "Disciplina e dedicação dentro e fora de campo." },
  { title: "Estudos", text: "Comprometimento constante na construção do futuro." },
  { title: "Amizade", text: "Lealdade e presença em todos os momentos." },
  { title: "Caráter", text: "Integridade e respeito como marcas registradas." },
  { title: "Novos Objetivos", text: "Metas ambiciosas e a garra para alcançá-las." },
];

// ========== ÁUDIO (Web Audio API, sem arquivos) ==========
let audioCtx = null;
let soundOn = true;

function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
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
// "Tudum" estilo Netflix: dois toques graves
function playTudum() {
  if (!audioCtx || !soundOn) return;
  playBeep(73.42, 0.22, "sine", 0.35);
  setTimeout(() => playBeep(98.0, 0.5, "sine", 0.35), 180);
}

// ========== ELEMENTOS ==========
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
const countdown = document.getElementById("countdown");
const countNumber = document.getElementById("countNumber");
const ringProgress = document.getElementById("ringProgress");
const reveal = document.getElementById("reveal");
const app = document.getElementById("app");
const navbar = document.getElementById("navbar");
const soundToggle = document.getElementById("soundToggle");
const replayBtn = document.getElementById("replayBtn");

const RING_LEN = 2 * Math.PI * 54;

// ========== CONTAGEM REGRESSIVA ==========
function runCountdown() {
  let n = 5;
  const total = 5;
  countNumber.textContent = n;
  countNumber.classList.add("pop");
  ringProgress.style.strokeDashoffset = 0;
  playBeep(500, 0.15, "sine", 0.25);

  const timer = setInterval(() => {
    n--;
    if (n <= 0) {
      clearInterval(timer);
      showReveal();
      return;
    }
    countNumber.textContent = n;
    countNumber.classList.remove("pop");
    void countNumber.offsetWidth;
    countNumber.classList.add("pop");
    ringProgress.style.strokeDashoffset = RING_LEN * ((total - n) / total);
    playBeep(n === 1 ? 800 : 500, 0.15, "sine", 0.25);
  }, 1000);
}

// ========== TRANSIÇÕES ==========
function showReveal() {
  countdown.classList.add("hidden");
  reveal.classList.remove("hidden");
  playTudum();
  setTimeout(showApp, 2600);
}
function showApp() {
  reveal.classList.add("hidden");
  app.classList.remove("hidden");
  window.scrollTo({ top: 0 });
  buildApp();
}

// ========== CONSTRUÇÃO DO APP ==========
let appBuilt = false;
function buildApp() {
  if (appBuilt) return;
  appBuilt = true;
  buildPhotoTabs();
  renderPhotoRow(photoTabs[0]);
  buildAchievements();
}

function cardHTML(it) {
  return `
    <div class="card" data-label="${it.title}">
      <img src="${it.img}" alt="${it.title}" loading="lazy"
           onerror="this.closest('.card').classList.add('no-img'); this.remove();" />
      <div class="card-info">
        <span class="card-title">${it.title}</span>
        <span class="card-sub">${it.sub}</span>
      </div>
    </div>`;
}

function buildPhotoTabs() {
  const tabs = document.getElementById("photoTabs");
  tabs.innerHTML = photoTabs
    .map(
      (t, i) =>
        `<button class="tab-btn ${i === 0 ? "active" : ""}" data-id="${t.id}">${t.label}</button>`
    )
    .join("");

  tabs.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = photoTabs.find((t) => t.id === btn.dataset.id);
      renderPhotoRow(tab);
      playBeep(600, 0.08, "sine", 0.12);
    });
  });
}

function renderPhotoRow(tab) {
  const row = document.getElementById("photoRow");
  row.innerHTML = tab.items.map(cardHTML).join("");
  row.classList.remove("fade-swap");
  void row.offsetWidth;
  row.classList.add("fade-swap");
  row.scrollLeft = 0;
}

function buildAchievements() {
  const row = document.getElementById("achRow");
  row.innerHTML = achievements
    .map(
      (a, i) => `
      <div class="card ach">
        <span class="ach-num">${String(i + 1).padStart(2, "0")}</span>
        <h3 class="ach-title">${a.title}</h3>
        <p class="ach-text">${a.text}</p>
      </div>`
    )
    .join("");
}

// ========== NAVBAR: scroll + navegação ==========
window.addEventListener("scroll", () => {
  if (!app.classList.contains("hidden")) {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }
});

document.querySelectorAll("[data-target]").forEach((el) => {
  el.addEventListener("click", () => {
    const target = document.getElementById(el.dataset.target);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// destaca link ativo conforme a seção visível
const sections = ["banner", "fotos", "conquistas", "mensagem"];
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        document.querySelectorAll(".nav-links li").forEach((li) => {
          li.classList.toggle("active", li.dataset.target === e.target.id);
        });
      }
    });
  },
  { threshold: 0.5 }
);
window.addEventListener("load", () => {
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) navObserver.observe(el);
  });
});

// ========== SETAS DOS CARROSSÉIS ==========
document.querySelectorAll(".row-arrow").forEach((arrow) => {
  arrow.addEventListener("click", () => {
    const row = document.getElementById(arrow.dataset.row);
    const amount = row.clientWidth * 0.8;
    row.scrollBy({ left: arrow.classList.contains("left") ? -amount : amount, behavior: "smooth" });
  });
});

// ========== EVENTOS PRINCIPAIS ==========
startBtn.addEventListener("click", () => {
  initAudio();
  if (audioCtx.state === "suspended") audioCtx.resume();
  startScreen.classList.add("hidden");
  countdown.classList.remove("hidden");
  runCountdown();
});

soundToggle.addEventListener("click", () => {
  soundOn = !soundOn;
  soundToggle.classList.toggle("muted", !soundOn);
  soundToggle.querySelector(".sound-icon").textContent = soundOn ? "♪" : "✕";
  if (soundOn) initAudio();
});

replayBtn.addEventListener("click", () => {
  app.classList.add("hidden");
  reveal.classList.add("hidden");
  countdown.classList.remove("hidden");
  window.scrollTo({ top: 0 });
  initAudio();
  if (audioCtx.state === "suspended") audioCtx.resume();
  runCountdown();
});
