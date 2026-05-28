"use strict";

const TOTAL_SECONDS = 60;
const strategies = [
  { title: "看書名", detail: "先抓主題、關鍵詞，以及這本書可能要回答的問題。" },
  { title: "看書背與書腰介紹", detail: "快速找出作者想解決什麼問題，以及出版社主打的重點。" },
  { title: "看作者簡介", detail: "判斷作者的背景、視角，以及他為什麼能談這個主題。" },
  { title: "看目錄", detail: "掌握全書架構、章節順序，推論作者如何安排論點。" },
  { title: "找一頁翻翻看", detail: "體會讀起來的感受：例子多不多、論證難不難、語氣適不適合自己。" },
  { title: "翻到最後面看結論", detail: "作者通常會把最精華、最核心的結論放在最後面。" }
];

const books = [
  {
    id: "atomic",
    title: "原子習慣",
    image: "原子習慣.webp",
    questions: [
      { question: "這本書最核心的主張是什麼？", options: ["成功來自天賦與意志力", "巨大的改變來自持續的微小習慣累積", "習慣只能靠外在監督建立", "壞習慣無法真正被改變"], answer: 1 },
      { question: "作者最想解決的是哪一類問題？", options: ["如何快速累積財富", "如何提升閱讀速度", "如何持續改變行為", "如何訓練領導能力"], answer: 2 },
      { question: "在 30 秒略讀後，你認為哪三個詞最接近本書的重要概念？", options: ["意志力／懲罰／競爭", "環境／獎勵／身分認同", "天賦／效率／管理", "情緒／直覺／冒險"], answer: 1 }
    ]
  },
  {
    id: "neuro",
    title: "神經可塑性",
    image: "神經可塑性.webp",
    questions: [
      { question: "這本書最核心的觀點是什麼？", options: ["情緒問題只能靠藥物改善", "人的性格無法真正改變", "大腦具有可改變性", "壓力與焦慮是命運"], answer: 2 },
      { question: "作者最想幫助讀者解決哪種問題？", options: ["如何提升工作效率", "如何改善負面思考", "如何學會快速閱讀", "如何建立財務自由"], answer: 1 },
      { question: "下列哪組最接近本書的重要關鍵概念？", options: ["神經可塑性／負面偏見／視覺化", "領導力／說服力", "意志力／競爭", "靈感／創業"], answer: 0 }
    ]
  },
  {
    id: "determined",
    title: "命定",
    image: "命定.webp",
    questions: [
      { question: "本書最關鍵也最困難的部分是什麼？", options: ["證明大腦有決定空間", "主張行為被基因決定", "重建責任、懲罰與司法制度", "提倡放棄道德判斷"], answer: 2 },
      { question: "作者明確「反對」的論點是什麼？", options: ["神經科學研究行為", "童年影響行為", "量子不確定性為自由意志保留空間", "環境影響選擇"], answer: 2 },
      { question: "最接近本書的核心概念是什麼？", options: ["命運／儀式", "基因與激素", "道德哲學", "決定論／重新思考懲罰"], answer: 3 }
    ]
  },
  {
    id: "work",
    title: "為工作而活 Work",
    image: "為工作而活.jpg",
    questions: [
      { question: "本書最反直覺的論點是什麼？", options: ["科技讓現代人輕鬆", "狩獵採集者工作時數遠少於現代人", "工作越多社會越進步", "自動化取消工作"], answer: 1 },
      { question: "作者最想回答的問題是什麼？", options: ["提升生產力", "選到熱愛的工作", "朝九晚五是文化產物而非唯一解方", "人類天生喜歡累積財富"], answer: 2 },
      { question: "最接近本書的核心概念是什麼？", options: ["狩獵採集／能量與熵／稀缺性", "生涯探索／斜槓", "KPI／時間管理", "領導力／企業文化"], answer: 0 }
    ]
  }
];

let state = {
  screen: "home",
  selectedBookId: null,
  quizIndex: 0,
  answers: [],
  timerId: null,
  remainingSeconds: TOTAL_SECONDS,
  userRating: 0,
  globalStats: null
};

const app = document.querySelector("#app");

function getSelectedBook() { return books.find(b => b.id === state.selectedBookId) || books[0]; }
function stopTimer() { if (state.timerId) { clearInterval(state.timerId); state.timerId = null; } }
function setScreen(s) { stopTimer(); state.screen = s; render(); }
function resetGame() { 
  stopTimer(); 
  state = { screen: "home", selectedBookId: null, quizIndex: 0, answers: [], remainingSeconds: TOTAL_SECONDS, userRating: 0, globalStats: null }; 
  render(); 
}

async function submitRating(rating) {
  state.userRating = rating;
  state.screen = "loading";
  render();
  try {
    const res = await fetch("/api/rating", { method: "POST", body: JSON.stringify({ bookId: state.selectedBookId, rating }) });
    state.globalStats = await res.json();
    setScreen("stats");
  } catch (e) { setScreen("stats"); }
}

async function fetchStats() {
  try {
    const res = await fetch("/api/rating");
    state.globalStats = await res.json();
    setScreen("stats");
  } catch (e) { setScreen("thanks"); }
}

function topbar(label, home = true) {
  return `<div class="topbar"><span class="step">${label}</span>${home ? '<button class="quiet-button" data-action="home">回到首頁</button>' : ""}</div>`;
}

function renderHome() {
  app.innerHTML = `
    <section class="screen home">
      <div class="content">
        <div class="hero-copy">
          <span class="badge">學習策略課程｜略讀策略單元</span>
          <h1>略讀大挑戰</h1>
          <p class="lead">你會先認識略讀一本書的方法，<br/>再用 1 分鐘挑戰抓出一本書的重點。</p>
        </div>
      </div>
      <div class="actions">
        <button class="primary-button" data-action="strategy">開始挑戰</button>
      </div>
    </section>
  `;
}

function renderStrategy() {
  app.innerHTML = `
    <section class="screen">
      ${topbar("略讀策略")}
      <div class="content">
        <h2>快速理解一本書，可以先看這些地方</h2>
        <div class="strategy-list">
          ${strategies.map((s, i) => `
            <div class="strategy-item">
              <div class="strategy-number">${i+1}</div>
              <div class="strategy-text"><strong>${s.title}</strong><span>${s.detail}</span></div>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="actions">
        <button class="primary-button" data-action="choose">我知道了，選一本書</button>
      </div>
    </section>
  `;
}

function renderChoose() {
  app.innerHTML = `
    <section class="screen">
      ${topbar("選擇書本")}
      <div class="content">
        <h2>想挑戰哪一本？</h2>
        <div class="book-grid">
          ${books.map(b => `
            <button class="book-button" data-book-id="${b.id}">
              <div class="book-image-wrap"><img src="${b.image}" alt="${b.title}"></div>
              <div class="book-title">${b.title}</div>
            </button>
          `).join("")}
        </div>
      </div>
      <div class="actions">
        <button class="quiet-button" data-action="strategy">回到策略</button>
      </div>
    </section>
  `;
}

function renderReady() {
  const b = getSelectedBook();
  app.innerHTML = `
    <section class="screen">
      ${topbar("準備挑戰")}
      <div class="content ready-layout">
        <div class="selected-cover"><img src="${b.image}"></div>
        <div class="ready-copy">
          <span class="badge" style="background: var(--coral); color: #fff; border: 0;">1 分鐘挑戰</span>
          <h2>${b.title}</h2>
          <p class="lead" style="text-align: left;">請拿起實體書。準備好之後按下開始，計時就會立刻啟動。</p>
        </div>
      </div>
      <div class="actions">
        <button class="secondary-button" data-action="choose">換一本書</button>
        <button class="primary-button" data-action="start">開始計時</button>
      </div>
    </section>
  `;
}

function renderTimer() {
  const b = getSelectedBook();
  app.innerHTML = `
    <section class="screen">
      ${topbar("1 分鐘略讀中")}
      <div class="content timer-layout">
        <div class="timer-zone">
          <div class="mini-cover" style="max-width: 180px; margin: 0 auto 15px;"><img src="${b.image}"></div>
          <h2 style="margin-bottom: 5px;">${b.title}</h2>
          <div class="timer-display" data-timer>${state.remainingSeconds}s</div>
          <p style="color: var(--muted); font-weight: 800;">請翻閱實體書</p>
        </div>
        <div class="timer-strategy">
          <h3 style="margin-top: 0;">略讀策略提示</h3>
          <div class="strategy-list compact">
            ${strategies.map((s, i) => `
              <div class="strategy-item compact">
                <div class="strategy-number">${i+1}</div>
                <div class="strategy-text"><strong>${s.title}</strong></div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
      <div class="actions">
        <button class="quiet-button" data-action="finish-timer">我看完了，進入測驗</button>
      </div>
    </section>
  `;
}

function renderQuiz() {
  const b = getSelectedBook();
  const q = b.questions[state.quizIndex];
  app.innerHTML = `
    <section class="screen">
      ${topbar(`測驗 ${state.quizIndex + 1}/${b.questions.length}`)}
      <div class="content quiz-layout">
        <div class="mini-cover"><img src="${b.image}"></div>
        <div class="question-panel">
          <h2>${q.question}</h2>
          <div class="options" style="display: grid; gap: 14px;">
            ${q.options.map((o, i) => `
              <button class="primary-button" style="text-align: left; background: #fff; color: var(--ink); border: 2px solid var(--line); font-size: 20px;" data-option-index="${i}">
                ${String.fromCharCode(65+i)}. ${o}
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderResult() {
  const b = getSelectedBook();
  const missed = b.questions.map((q, i) => ({
    q, i, selected: state.answers[i], correct: q.answer
  })).filter(x => x.selected !== x.correct);
  const score = b.questions.length - missed.length;

  app.innerHTML = `
    <section class="screen">
      ${topbar("挑戰結果", false)}
      <div class="content">
        <div style="background: var(--teal-dark); color: #fff; padding: 30px; border-radius: 12px; display: flex; align-items: center; gap: 30px; margin-bottom: 30px;">
          <div style="width: 100px; height: 100px; background: var(--amber); color: var(--ink); border-radius: 50%; display: grid; place-items: center; font-size: 40px; font-weight: 900;">${score}/${b.questions.length}</div>
          <div>
            <h2 style="margin: 0; color: #fff;">${missed.length === 0 ? "全部答對！" : "挑戰完成"}</h2>
            <p style="margin: 5px 0 0; opacity: 0.8;">${b.title} 的略讀表現</p>
          </div>
        </div>
        <div class="miss-list">
          ${missed.length === 0 ? '<p class="lead">太棒了！你精準抓到了這本書的核心方向。</p>' : missed.map(m => `
            <div class="miss-item">
              <strong>第 ${m.i + 1} 題：${m.q.question}</strong>
              <span>你的答案：${String.fromCharCode(65+m.selected)}. ${m.q.options[m.selected]}</span>
              <span style="color: var(--teal); font-weight: 800;">正確答案：${String.fromCharCode(65+m.correct)}. ${m.q.options[m.correct]}</span>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="actions">
        <button class="primary-button" data-action="go-rating">完成，填寫回饋</button>
      </div>
    </section>
  `;
}

function renderRating() {
  const b = getSelectedBook();
  app.innerHTML = `
    <section class="screen rating">
      ${topbar("讀後回饋", false)}
      <div class="content">
        <div class="rating-box">
          <div class="mini-cover" style="max-width: 120px; margin: 0 auto 15px;"><img src="${b.image}"></div>
          <h2>${b.title}</h2>
          <p class="lead">這本書對你有吸引力嗎？會想深入閱讀嗎？</p>
          <div class="stars">${[1,2,3,4,5].map(v => `<button class="star-btn" data-value="${v}">★</button>`).join("")}</div>
          <p style="color: var(--muted);">點擊星星進行評分</p>
        </div>
      </div>
      <div class="actions">
        <button class="quiet-button" data-action="go-stats">跳過，看大家推薦什麼</button>
      </div>
    </section>
  `;
  
  const stars = app.querySelectorAll(".star-btn");
  stars.forEach(btn => {
    btn.onclick = () => submitRating(Number(btn.dataset.value));
    btn.onmouseover = () => {
      const v = Number(btn.dataset.value);
      stars.forEach(s => s.classList.toggle("active", Number(s.dataset.value) <= v));
    };
    btn.onmouseout = () => stars.forEach(s => s.classList.remove("active"));
  });
}

function renderStats() {
  const s = state.globalStats || [];
  app.innerHTML = `
    <section class="screen stats">
      ${topbar("推薦排行榜", false)}
      <div class="content">
        <h2 style="text-align: center;">展覽現場讀者推薦榜</h2>
        <div class="stats-grid">
          ${books.map(b => {
            const st = s.find(x => x.bookId === b.id) || { avgRating: 0, count: 0 };
            return `
              <div class="stat-row">
                <div class="stat-info">
                  <span>${b.title}</span>
                  <span>${st.count > 0 ? Number(st.avgRating).toFixed(1) + " ★" : "尚無評分"} (${st.count}人)</span>
                </div>
                <div class="stat-bar-bg"><div class="stat-bar-fill" style="width: ${(st.avgRating/5)*100}%"></div></div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
      <div class="actions">
        <button class="primary-button" data-action="thanks">查看致謝</button>
      </div>
    </section>
  `;
}

function renderLoading() { app.innerHTML = `<div class="screen" style="justify-content: center; align-items: center;"><h2>處理中...</h2></div>`; }

function renderThanks() {
  app.innerHTML = `
    <section class="screen thanks">
      <div class="content" style="text-align: center;">
        <span class="badge">感謝參與</span>
        <h1>謝謝您的參與！</h1>
        <p class="lead">希望這次的體驗，能幫助您在未來的閱讀中更精準地捕捉智慧。<br>祝您學習愉快！</p>
      </div>
      <div class="actions">
        <button class="primary-button" data-action="home">回到第一頁</button>
      </div>
    </section>
  `;
}

function render() {
  const s = state.screen;
  if (s === "home") renderHome();
  else if (s === "strategy") renderStrategy();
  else if (s === "choose") renderChoose();
  else if (s === "ready") renderReady();
  else if (s === "timer") renderTimer();
  else if (s === "quiz") renderQuiz();
  else if (s === "result") renderResult();
  else if (s === "rating") renderRating();
  else if (s === "stats") renderStats();
  else if (s === "loading") renderLoading();
  else if (s === "thanks") renderThanks();
}

app.addEventListener("click", e => {
  const b = e.target.closest("[data-book-id]");
  if (b) { state.selectedBookId = b.dataset.bookId; setScreen("ready"); return; }
  
  const o = e.target.closest("[data-option-index]");
  if (o) { 
    state.answers.push(Number(o.dataset.optionIndex)); 
    if (state.quizIndex < getSelectedBook().questions.length - 1) {
      state.quizIndex++;
      render();
    } else {
      setScreen("result");
    }
    return; 
  }
  
  const a = e.target.closest("[data-action]");
  if (!a) return;
  const act = a.dataset.action;
  if (act === "home") resetGame();
  else if (act === "strategy") setScreen("strategy");
  else if (act === "choose") setScreen("choose");
  else if (act === "start") {
    state.screen = "timer"; render();
    state.timerId = setInterval(() => {
      state.remainingSeconds--;
      const t = app.querySelector("[data-timer]");
      if (t) t.textContent = state.remainingSeconds + "s";
      if (state.remainingSeconds <= 0) { stopTimer(); setScreen("quiz"); }
    }, 1000);
  }
  else if (act === "finish-timer") { stopTimer(); setScreen("quiz"); }
  else if (act === "go-rating") setScreen("rating");
  else if (act === "go-stats") fetchStats();
  else if (act === "thanks") setScreen("thanks");
});

render();
