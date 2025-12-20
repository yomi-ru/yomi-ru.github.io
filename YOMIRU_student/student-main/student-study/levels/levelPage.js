/* =========================================================
   levelPage.js（全レベル共通）
   - 生徒モード：音声再生 → 再生終了後に回答入力 → 正誤判定
   - 先生モード：問題一覧テーブル表示 + CSV出力 + JSONコピー
   - data-level が無くてもURLからレベル推定して動作
   対応ファイル構成（画像の通り）:
     /site/levels/levelPage.js
     /site/levels/1digit/1digit.html など
     /site/data/level1.json など
     /site/audio/*.mp3
========================================================= */

(() => {
    // ---------- ユーティリティ ----------
    const $ = (id) => document.getElementById(id);
  
    const safeText = (v) => (v ?? "").toString();
    const normalize = (s) =>
      safeText(s)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
  
    const isAbsoluteUrl = (p) => /^https?:\/\//i.test(p);
    const isRootPath = (p) => p.startsWith("/");
  
    // audioパスが JSON に書かれていない/相対が怪しい時の救済
    // 例: "1_digit_add_sub.mp3" だけでも audio フォルダから探せるようにする
    const resolveAudioPath = (audioValue) => {
      const p = safeText(audioValue);
      if (!p) return "";
      if (isAbsoluteUrl(p) || isRootPath(p)) return p;
  
      // すでに ../../audio/ とかを含むならそのまま
      if (p.includes("audio/")) return p;
  
      // ファイル名だけなら、現在のレベルHTMLは /levels/**/ なので audio は ../../audio/
      return `../../audio/${p}`;
    };
  
    // ---------- レベル判定 ----------
    // 1) HTML側で <main id="app" data-level="1"> があればそれを優先
    // 2) 無ければ URLのフォルダ名から推定
    function detectLevel() {
      const app = $("app");
      const fromData = app?.dataset?.level ? Number(app.dataset.level) : NaN;
      if (!Number.isNaN(fromData) && fromData > 0) return fromData;
  
      const path = location.pathname.toLowerCase();
      // 画像のフォルダ名に合わせる
      if (path.includes("/1digit/")) return 1;
      if (path.includes("/2digit/")) return 2;
      if (path.includes("/3digit/")) return 3;
      if (path.includes("/7to13digit/")) return 4;
  
      // ファイル名から推定（保険）
      if (path.includes("1digit.html")) return 1;
      if (path.includes("2digit.html")) return 2;
      if (path.includes("3digit.html")) return 3;
      if (path.includes("7to13digit.html")) return 4;
  
      return 1; // 最後の保険
    }
  
    const LEVEL = detectLevel();
  
    // ---------- 要素取得 ----------
    const pageTitle = $("pageTitle");
    const modeBtn = $("modeBtn");
  
    const studentArea = $("studentArea");
    const teacherArea = $("teacherArea");
  
    const statusEl = $("status");
    const prevBtn = $("prevBtn");
    const playBtn = $("playBtn");
    const nextBtn = $("nextBtn");
  
    const audioEl = $("audio");
    const answerEl = $("answer");
    const checkBtn = $("checkBtn");
    const retryBtn = $("retryBtn");
    const resultEl = $("result");
  
    const tableEl = $("table");
    const exportBtn = $("exportBtn");
    const copyJsonBtn = $("copyJsonBtn");
  
    // HTML側のIDが足りない場合でも、落ちずにメッセ出す
    function missingRequired() {
      const required = [
        ["modeBtn", modeBtn],
        ["pageTitle", pageTitle],
        ["studentArea", studentArea],
        ["teacherArea", teacherArea],
        ["status", statusEl],
        ["prevBtn", prevBtn],
        ["playBtn", playBtn],
        ["nextBtn", nextBtn],
        ["audio", audioEl],
        ["answer", answerEl],
        ["checkBtn", checkBtn],
        ["retryBtn", retryBtn],
        ["result", resultEl],
        ["table", tableEl],
        ["exportBtn", exportBtn],
        ["copyJsonBtn", copyJsonBtn],
      ];
  
      const miss = required.filter(([_, el]) => !el).map(([name]) => name);
      return miss;
    }
  
    const miss = missingRequired();
    if (miss.length) {
      console.warn("levelPage.js: 必要な要素IDが見つかりません:", miss);
      // 画面に出せる場合は出す
      if (pageTitle) pageTitle.textContent = "ページ構造エラー";
      if (statusEl)
        statusEl.textContent =
          "HTML側に必要な要素IDが足りない可能性があります。： " + miss.join(", ");
      return;
    }
  
    // ---------- 状態 ----------
    let db = null;       // levelX.json の中身
    let idx = 0;         // 今の問題index
    let canAnswer = false;
    let isTeacher = false;
  
    // ---------- DBロード ----------
    async function loadDB(level) {
      // レベルHTMLは /levels/**/ にあるので data は ../../data/
      const res = await fetch(`../../data/level${level}.json`, { cache: "no-store" });
      if (!res.ok) throw new Error(`../../data/level${level}.json が読めません。（${res.status}）`);
      const json = await res.json();
  
      // 軽いバリデーション
      if (!json || !Array.isArray(json.items)) {
        throw new Error("JSONの形式が違う可能性があります。items配列がありません。");
      }
      return json;
    }
  
    // ---------- 生徒モードUI ----------
    function setAnswerEnabled(enabled) {
      canAnswer = enabled;
      answerEl.disabled = !enabled;
      checkBtn.disabled = !enabled;
      if (enabled) answerEl.focus();
    }
  
    function currentItem() {
      return db.items[idx];
    }
  
    function updateStudentView() {
      const item = currentItem();
      const title = safeText(db.title || `Level ${LEVEL}`);
      pageTitle.textContent = `${title} / ${safeText(item.id || `#${idx + 1}`)}`;
  
      statusEl.textContent = `問題 ${idx + 1}/${db.items.length}：再生してください。`;
      resultEl.textContent = "（まだ判定していません）";
      answerEl.value = "";
      setAnswerEnabled(false);
  
      retryBtn.disabled = true;
      playBtn.disabled = false;
  
      // audioセット（JSONのaudioが空でも落とさない）
      const audioPath = resolveAudioPath(item.audio);
      audioEl.src = audioPath;
    }
  
    async function playAudio() {
      playBtn.disabled = true;
      retryBtn.disabled = true;
      setAnswerEnabled(false);
      statusEl.textContent = "再生中…（終わったら入力できます。）";
  
      try {
        audioEl.pause();
        audioEl.currentTime = 0;
        await audioEl.play();
      } catch (e) {
        console.error(e);
        statusEl.textContent =
          "音声が再生できません…（ファイル名/パスが合ってるか確認してください。）";
        playBtn.disabled = false;
      }
    }
  
    function isCorrect(input) {
      const x = normalize(input);
      const answers = currentItem().answers || [];
  
      // answers が文字列1個のケースも救う
      if (typeof answers === "string") return normalize(answers) === x;
  
      return answers.some((a) => normalize(a) === x);
    }
  
    // ---------- 先生モードUI ----------
    function renderTeacherTable() {
      const title = safeText(db.title || `Level ${LEVEL}`);
      pageTitle.textContent = `${title}（先生モード）`;
  
      const rows = db.items
        .map((it, i) => {
          const id = safeText(it.id || `#${i + 1}`);
          const prompt = safeText(it.prompt || "");
          const audio = resolveAudioPath(it.audio);
          const answers = Array.isArray(it.answers)
            ? it.answers.join(" / ")
            : safeText(it.answers || "");
          const tags = Array.isArray(it.tags) ? it.tags.join(", ") : safeText(it.tags || "");
  
          return `
            <tr>
              <td>${i + 1}</td>
              <td>${id}</td>
              <td>${prompt}</td>
              <td>${audio ? `<a href="${audio}" target="_blank" rel="noopener">audio</a>` : ""}</td>
              <td>${answers}</td>
              <td>${tags}</td>
            </tr>
          `;
        })
        .join("");
  
      tableEl.innerHTML = `
        <tr>
          <th>#</th>
          <th>ID</th>
          <th>Prompt</th>
          <th>Audio</th>
          <th>Answers</th>
          <th>Tags</th>
        </tr>
        ${rows}
      `;
    }
  
    function exportCSV() {
      const head = ["index", "id", "prompt", "audio", "answers", "tags"];
      const lines = [head.join(",")];
  
      for (let i = 0; i < db.items.length; i++) {
        const it = db.items[i];
        const row = [
          i + 1,
          safeText(it.id),
          safeText(it.prompt).replaceAll('"', '""'),
          resolveAudioPath(it.audio).replaceAll('"', '""'),
          (Array.isArray(it.answers) ? it.answers.join(" / ") : safeText(it.answers)).replaceAll(
            '"',
            '""'
          ),
          (Array.isArray(it.tags) ? it.tags.join(" ") : safeText(it.tags)).replaceAll('"', '""'),
        ].map((v) => `"${v}"`);
        lines.push(row.join(","));
      }
  
      const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = `level${LEVEL}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  
    async function copyJSON() {
      try {
        await navigator.clipboard.writeText(JSON.stringify(db, null, 2));
        alert("JSONをコピーしました。");
      } catch (e) {
        // クリップボードが使えない環境向け
        console.error(e);
        alert("コピーできませんでした…（ブラウザ設定を確認してください）");
      }
    }
  
    // ---------- モード切替 ----------
    function setMode(teacher) {
      isTeacher = teacher;
  
      if (teacher) {
        studentArea.style.display = "none";
        teacherArea.style.display = "block";
        modeBtn.textContent = "生徒モードへ";
        renderTeacherTable();
      } else {
        teacherArea.style.display = "none";
        studentArea.style.display = "block";
        modeBtn.textContent = "先生モードへ";
        updateStudentView();
      }
    }
  
    // ---------- イベント ----------
    modeBtn.addEventListener("click", () => setMode(!isTeacher));
  
    prevBtn.addEventListener("click", () => {
      idx = (idx - 1 + db.items.length) % db.items.length;
      updateStudentView();
    });
  
    nextBtn.addEventListener("click", () => {
      idx = (idx + 1) % db.items.length;
      updateStudentView();
    });
  
    playBtn.addEventListener("click", playAudio);
  
    audioEl.addEventListener("ended", () => {
      statusEl.textContent = "再生を終了しました。答えを入力してください。";
      setAnswerEnabled(true);
      retryBtn.disabled = false;
      playBtn.disabled = false;
    });
  
    checkBtn.addEventListener("click", () => {
      if (!canAnswer) return;
  
      const user = answerEl.value;
      if (!user.trim()) {
        resultEl.textContent = "答えを入力してください。";
        return;
      }
  
      resultEl.textContent = isCorrect(user) ? "✅ 正解！" : "❌ 不正解…";
    });
  
    answerEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !checkBtn.disabled) checkBtn.click();
    });
  
    retryBtn.addEventListener("click", () => {
      answerEl.value = "";
      resultEl.textContent = "（まだ判定していません。）";
      statusEl.textContent = "もう一度再生ボタンを押してください。";
      setAnswerEnabled(false);
    });
  
    exportBtn.addEventListener("click", exportCSV);
    copyJsonBtn.addEventListener("click", copyJSON);
  
    // ---------- 起動 ----------
    (async () => {
      try {
        db = await loadDB(LEVEL);
        idx = 0;
        setMode(false); // 初期：生徒モード
      } catch (e) {
        console.error(e);
        pageTitle.textContent = "読み込みに失敗しました。";
        statusEl.textContent = e.message;
  
        // ボタン類を止める
        playBtn.disabled = true;
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        checkBtn.disabled = true;
        retryBtn.disabled = true;
        exportBtn.disabled = true;
        copyJsonBtn.disabled = true;
      }
    })();
  })();  