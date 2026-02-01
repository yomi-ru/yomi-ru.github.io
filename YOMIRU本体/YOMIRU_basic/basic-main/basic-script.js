const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Web Speech API はこのブラウザに対応していません GoogleChromeで開いてください。");
} else {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = true;

    let outputDiv = document.getElementById('output');
    let logDiv = document.getElementById('log');
    let fullTranscript = '';

    recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript.trim();

            if (event.results[i].isFinal) {
                fullTranscript += transcript + '\n';
            } else {
                // interim（途中のやつ）は一時的に表示するだけでも
                // もし使うなら temporaryTranscript += transcript;
            }
        }
        outputDiv.textContent = fullTranscript;
    };

    recognition.onerror = (event) => {
        console.error('Speech error:', event.error);
        alert('エラー発生: ' + event.error);
    };

    document.getElementById('startBtn').onclick = () => {
        fullTranscript = ''; // 認識結果リセット
        outputDiv.textContent = "🎤 Listening...";
        recognition.start();
    };

    document.getElementById('stopBtn').onclick = () => {
        recognition.stop();
        logDiv.textContent += "\n🛑 録音が停止されました";
    };

    document.getElementById('saveBtn').onclick = () => {
        const blob = new Blob([fullTranscript], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "speech_transcript.txt";
        a.click();
        URL.revokeObjectURL(url);
    };
}

// ===== 問題JSONを読み込んで表示する処理 =====
const jsonInput = document.getElementById("jsonInput");
const problemView = document.getElementById("problemView");
const basicLayout = document.querySelector(".basic-layout");

basicLayout.classList.remove("layout-active");

if (jsonInput && problemView) {
    jsonInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== "application/json") {
            alert("JSONファイルを選んでね〜");
            jsonInput.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (!Array.isArray(data.nums)) {
                    alert("このJSONには nums 配列が見つかりません");
                    return;
                }

                renderProblemsFromJson(data);
                alert("問題JSONを読み込みました✨");
            } catch (err) {
                console.error(err);
                alert("JSONの形式にエラーがあります");
            }
        };
        reader.readAsText(file, "utf-8");
    });
}
function renderProblemsFromJson(data) {
    if (basicLayout) {
        basicLayout.classList.add("layout-active");
    }
    problemView.innerHTML = "";
    const titleEl = document.createElement("h3");
    titleEl.textContent = data.title || "問題";
    problemView.appendChild(titleEl);
    const column = document.createElement("div");
    column.className = "problem-column";
    const numsWrapper = document.createElement("div");
    numsWrapper.className = "problem-column-numbers";

    data.nums.forEach((num) => {
        const numEl = document.createElement("div");
        numEl.className = "problem-column-number";
        numEl.textContent = num;
        numsWrapper.appendChild(numEl);
    });
    let total = data.sum;
    if (typeof total !== "number") {
        total = data.nums.reduce((a, b) => a + b, 0);
    }
    const sumEl = document.createElement("div");
    sumEl.className = "problem-column-sum";
    sumEl.textContent = total;
    column.appendChild(numsWrapper);
    column.appendChild(sumEl);
    problemView.appendChild(column);
}



// 594f4d4952552070726f6a6563740a6d61646520627920e69d89e69cace79bb4e7b6990ae89197e4bd9ce6a8a9e381afe4bf9de8adb7e38195e3828ce381a6e38184e381bee38199e38082