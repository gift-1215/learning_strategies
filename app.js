"use strict";

const TOTAL_SECONDS = 120;
const strategies = [
  {
    title: "看書名",
    detail: "先抓主題、關鍵詞，以及這本書可能要回答的問題。"
  },
  {
    title: "看書背與書腰介紹",
    detail: "快速找出作者想解決什麼問題，以及出版社主打的重點。"
  },
  {
    title: "看作者簡介",
    detail: "判斷作者的背景、視角，以及他為什麼能談這個主題。"
  },
  {
    title: "看目錄",
    detail: "掌握全書架構、章節順序，推論作者如何安排論點。"
  },
  {
    title: "找一頁翻翻看",
    detail: "體會讀起來的感受：例子多不多、論證難不難、語氣適不適合自己。"
  },
  {
    title: "翻到最後面看結論",
    detail: "作者通常會把最精華、最核心的結論放在最後面。"
  }
];

const books = [
  {
    id: "atomic",
    title: "原子習慣",
    image: "原子習慣.webp",
    questions: [
      {
        question: "這本書最核心的主張是什麼？",
        prompt: "請根據封面標語與章節安排，選出最符合的答案。",
        options: [
          "成功來自天賦與意志力",
          "巨大的改變來自持續的微小習慣累積",
          "習慣只能靠外在監督建立",
          "壞習慣無法真正被改變"
        ],
        answer: 1
      },
      {
        question: "作者最想解決的是哪一類問題？",
        prompt: "請從目錄中的章節名稱推論。",
        options: ["如何快速累積財富", "如何提升閱讀速度", "如何持續改變行為", "如何訓練領導能力"],
        answer: 2
      },
      {
        question: "在 30 秒略讀後，你認為哪三個詞最接近本書的重要概念？",
        prompt: "請從下列選項中挑出最合理的一組。",
        options: [
          "意志力／懲罰／競爭",
          "環境／獎勵／身分認同",
          "天賦／效率／管理",
          "情緒／直覺／冒險"
        ],
        answer: 1
      }
    ]
  },
  {
    id: "neuro",
    title: "神經可塑性",
    image: "神經可塑性.webp",
    questions: [
      {
        question: "這本書最核心的觀點是什麼？",
        prompt: "",
        options: [
          "情緒問題只能靠藥物改善",
          "人的性格無法真正改變",
          "大腦具有可改變性，思想與行為能重新塑造神經連結",
          "壓力與焦慮是現代人無法避免的宿命"
        ],
        answer: 2
      },
      {
        question: "作者最想幫助讀者解決哪種問題？",
        prompt: "",
        options: ["如何提升工作效率", "如何改善負面思考", "如何學會快速閱讀", "如何建立財務自由"],
        answer: 1
      },
      {
        question: "從封面標語與目錄判斷，下列哪組最接近本書的重要關鍵概念？",
        prompt: "",
        options: [
          "神經可塑性／負面偏見／視覺化",
          "領導力／說服力／談判技巧",
          "意志力／競爭／效率",
          "靈感／創業／冒險"
        ],
        answer: 0
      }
    ]
  },
  {
    id: "determined",
    title: "命定",
    image: "命定.webp",
    questions: [
      {
        question: "從目錄結構推論，本書最關鍵也最困難的部分是什麼？",
        prompt: "前半論證沒有自由意志，後半題目是「Now What?」。",
        options: [
          "證明大腦有做出決定的空間",
          "主張行為完全被基因決定",
          "既然自由意志不存在，我們該如何重建責任、懲罰、獎賞與司法制度",
          "提倡放棄一切道德判斷與情感"
        ],
        answer: 2
      },
      {
        question: "從目錄推論，作者明確「反對」、認為救不了自由意志的論點是什麼？",
        prompt: "",
        options: [
          "神經科學可以研究人類行為",
          "童年經驗會影響成年行為",
          "量子不確定性、混沌理論或 emergence 可以為自由意志保留空間",
          "環境會影響選擇"
        ],
        answer: 2
      },
      {
        question: "略讀後最接近本書的三個核心概念是什麼？",
        prompt: "",
        options: [
          "命運／儀式／預言",
          "基因與激素／意志力訓練／決策技巧",
          "道德哲學／不確定性／來世",
          "決定論／自由意志的不存在／重新思考懲罰"
        ],
        answer: 3
      }
    ]
  },
  {
    id: "work",
    title: "為工作而活 Work",
    image: "為工作而活.jpg",
    questions: [
      {
        question: "從目錄推論，本書最反直覺的論點是什麼？",
        prompt: "",
        options: [
          "科技進步讓現代人比古代人輕鬆許多",
          "狩獵採集者每週工作時數遠少於現代人，「為工作而活」是晚近才出現的歷史產物",
          "工作越多，社會越進步",
          "自動化終將完全取消工作"
        ],
        answer: 1
      },
      {
        question: "從章節結構推論，作者最想回答的問題是什麼？",
        prompt: "",
        options: [
          "如何在 AI 時代提升個人生產力",
          "在生涯探索上，我們如何才能選到自己一輩子熱愛的工作",
          "「朝九晚五為工作賣命」是演化與文化的結果，但並非人類生存的唯一解方",
          "為什麼人類天生就喜歡透過工作來累積財富"
        ],
        answer: 2
      },
      {
        question: "略讀後最接近本書的三個核心概念是什麼？",
        prompt: "",
        options: [
          "狩獵採集／能量與熵／稀缺性的建構",
          "生涯探索／斜槓／被動收入",
          "KPI／科技生產力／時間管理",
          "領導力／組織設計／企業文化"
        ],
        answer: 0
      }
    ]
  }
];

const state = {
  screen: "home",
  selectedBookId: null,
  quizIndex: 0,
  answers: [],
  timerId: null,
  remainingSeconds: TOTAL_SECONDS
};

const app = document.querySelector("#app");

function getSelectedBook() {
  return books.find((book) => book.id === state.selectedBookId) || books[0];
}

function stopTimer() {
  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
}

function setScreen(screen) {
  stopTimer();
  state.screen = screen;
  render();
}

function resetGame() {
  stopTimer();
  state.screen = "home";
  state.selectedBookId = null;
  state.quizIndex = 0;
  state.answers = [];
  state.remainingSeconds = TOTAL_SECONDS;
  render();
}

function chooseBook(bookId) {
  state.selectedBookId = bookId;
  state.quizIndex = 0;
  state.answers = [];
  state.remainingSeconds = TOTAL_SECONDS;
  setScreen("ready");
}

function startTimer() {
  state.remainingSeconds = TOTAL_SECONDS;
  state.screen = "timer";
  render();
  state.timerId = window.setInterval(() => {
    state.remainingSeconds -= 1;
    updateTimerText();
    if (state.remainingSeconds <= 0) {
      stopTimer();
      state.quizIndex = 0;
      state.answers = [];
      state.screen = "quiz";
      render();
    }
  }, 1000);
}

function finishTimerNow() {
  stopTimer();
  state.remainingSeconds = 0;
  state.quizIndex = 0;
  state.answers = [];
  state.screen = "quiz";
  render();
}

function answerQuestion(optionIndex) {
  const book = getSelectedBook();
  const question = book.questions[state.quizIndex];
  state.answers[state.quizIndex] = {
    selected: optionIndex,
    correct: question.answer
  };

  if (state.quizIndex < book.questions.length - 1) {
    state.quizIndex += 1;
    render();
    return;
  }

  state.screen = "result";
  render();
}

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(totalSeconds, 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function updateTimerText() {
  const timer = document.querySelector("[data-timer]");
  if (timer) {
    timer.textContent = formatTime(state.remainingSeconds);
  }
}

function strategyList(compact = false) {
  return `
    <ul class="strategy-list${compact ? " compact" : ""}">
      ${strategies
        .map(
          (item, index) => `
            <li class="strategy-item">
              <span class="strategy-number">${index + 1}</span>
              <span class="strategy-text">
                <strong>${item.title}</strong>
                <span>${item.detail}</span>
              </span>
            </li>
          `
        )
        .join("")}
    </ul>
  `;
}

function topbar(label, includeHome = true) {
  return `
    <div class="topbar">
      <span class="step">${label}</span>
      ${includeHome ? '<button class="quiet-button" data-action="home">回到第一頁</button>' : ""}
    </div>
  `;
}

function renderHome() {
  app.innerHTML = `
    <section class="screen home">
      <div></div>
      <div class="home-inner">
        <div class="hero-copy">
          <span class="badge">學習策略課程｜略讀策略單元</span>
          <h1>略讀大挑戰</h1>
          <p class="lead">這是學習策略課程的互動遊戲。你會先認識略讀一本書的方法，再用 2 分鐘挑戰抓出一本書的重點。</p>
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
      ${topbar("第 2 頁／略讀策略")}
      <div class="content strategy-layout">
        <h2>快速理解一本書，可以先看這些地方</h2>
        ${strategyList(false)}
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
      ${topbar("第 3 頁／選擇一本書")}
      <div class="content choose-layout">
        <h2>想挑戰哪一本？</h2>
        <div class="book-grid">
          ${books
            .map(
              (book) => `
                <button class="book-button" data-book-id="${book.id}" aria-label="選擇 ${book.title}">
                  <span class="book-image-wrap"><img src="${book.image}" alt="${book.title}封面" /></span>
                  <span class="book-title">${book.title}</span>
                </button>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="actions">
        <button class="quiet-button" data-action="strategy">回到策略</button>
      </div>
    </section>
  `;
}

function renderReady() {
  const book = getSelectedBook();
  app.innerHTML = `
    <section class="screen">
      ${topbar("第 4 頁／準備略讀")}
      <div class="content ready-layout">
        <div class="selected-cover">
          <img src="${book.image}" alt="${book.title}封面" />
        </div>
        <div class="ready-copy">
          <span class="time-chip">2 分鐘挑戰</span>
          <h2>${book.title}</h2>
          <p>請拿起旁邊的實體書。準備好之後按下開始，計時就會立刻啟動。</p>
        </div>
      </div>
      <div class="actions">
        <button class="secondary-button" data-action="choose">換一本書</button>
        <button class="primary-button" data-action="start">開始</button>
      </div>
    </section>
  `;
}

function renderTimer() {
  const book = getSelectedBook();
  app.innerHTML = `
    <section class="screen">
      ${topbar("第 5 頁／2 分鐘略讀中")}
      <div class="content timer-layout">
        <div class="timer-zone">
          <span class="timer-label">剩餘時間</span>
          <span class="timer-value" data-timer>${formatTime(state.remainingSeconds)}</span>
          <span class="timer-book">${book.title}</span>
        </div>
        <div class="timer-strategy">
          <h2>略讀時可以這樣看</h2>
          ${strategyList(true)}
        </div>
      </div>
      <div class="actions">
        <button class="quiet-button" data-action="finish-timer">我看完了，進入測驗</button>
      </div>
    </section>
  `;
}

function renderQuiz() {
  const book = getSelectedBook();
  const question = book.questions[state.quizIndex];
  app.innerHTML = `
    <section class="screen">
      ${topbar("測驗階段")}
      <div class="content quiz-layout">
        <aside class="quiz-side">
          <div class="mini-cover"><img src="${book.image}" alt="${book.title}封面" /></div>
          <div class="progress">${state.quizIndex + 1} / ${book.questions.length}</div>
        </aside>
        <div class="question-panel">
          <h2>${question.question}</h2>
          ${question.prompt ? `<p class="prompt">${question.prompt}</p>` : ""}
          <div class="options">
            ${question.options
              .map(
                (option, index) => `
                  <button class="option-button" data-option-index="${index}">
                    <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                    <span class="option-text">${option}</span>
                  </button>
                `
              )
              .join("")}
          </div>
        </div>
      </div>
      <div></div>
    </section>
  `;
}

function renderResult() {
  const book = getSelectedBook();
  const missed = book.questions
    .map((question, index) => ({
      question,
      index,
      selected: state.answers[index]?.selected,
      correct: question.answer
    }))
    .filter((item) => item.selected !== item.correct);
  const score = book.questions.length - missed.length;

  app.innerHTML = `
    <section class="screen">
      ${topbar("挑戰結果", false)}
      <div class="content result-layout">
        <div class="score-band">
          <div class="score-number">${score}/${book.questions.length}</div>
          <div class="score-text">
            <strong>${missed.length === 0 ? "全部答對" : "看看剛剛錯在哪裡"}</strong>
            <span>${book.title} 的略讀挑戰完成。</span>
          </div>
        </div>
        <div class="miss-list">
          ${
            missed.length === 0
              ? '<div class="miss-item"><strong>恭喜！你精準抓到了這本書的核心方向。</strong><span>這代表你的略讀策略非常成功。</span></div>'
              : missed
                  .map(
                    (item) => `
                      <div class="miss-item">
                        <strong>第 ${item.index + 1} 題：${item.question.question}</strong>
                        <span>你的答案：${String.fromCharCode(65 + item.selected)}. ${
                          item.question.options[item.selected]
                        }</span>
                        <span>正確答案：${String.fromCharCode(65 + item.correct)}. ${
                          item.question.options[item.correct]
                        }</span>
                      </div>
                    `
                  )
                  .join("")
          }
        </div>
      </div>
      <div class="actions">
        <button class="primary-button" data-action="thanks">完成挑戰</button>
      </div>
    </section>
  `;
}

function renderThanks() {
  app.innerHTML = `
    <section class="screen thanks">
      <div></div>
      <div class="home-inner">
        <div class="hero-copy">
          <span class="badge">感謝參與</span>
          <h1>謝謝您的參與！</h1>
          <p class="lead">掌握略讀技巧，是開啟高效學習的第一步。<br>希望這次的體驗，能幫助您在未來的閱讀中更精準地捕捉智慧。<br>祝您學習愉快！</p>
        </div>
      </div>
      <div class="actions">
        <button class="primary-button" data-action="home">回到第一頁</button>
      </div>
    </section>
  `;
}

function render() {
  if (state.screen === "home") renderHome();
  if (state.screen === "strategy") renderStrategy();
  if (state.screen === "choose") renderChoose();
  if (state.screen === "ready") renderReady();
  if (state.screen === "timer") renderTimer();
  if (state.screen === "quiz") renderQuiz();
  if (state.screen === "result") renderResult();
  if (state.screen === "thanks") renderThanks();
}

app.addEventListener("click", (event) => {
  const bookButton = event.target.closest("[data-book-id]");
  if (bookButton) {
    chooseBook(bookButton.dataset.bookId);
    return;
  }

  const optionButton = event.target.closest("[data-option-index]");
  if (optionButton) {
    answerQuestion(Number(optionButton.dataset.optionIndex));
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;

  const action = actionButton.dataset.action;
  if (action === "home") resetGame();
  if (action === "strategy") setScreen("strategy");
  if (action === "choose") setScreen("choose");
  if (action === "start") startTimer();
  if (action === "finish-timer") finishTimerNow();
  if (action === "thanks") setScreen("thanks");
});

render();

window.__skimmingChallengeTest = {
  finishTimerNow,
  getState: () => ({ ...state })
};
