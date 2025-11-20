const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Web Speech API はこのブラウザで使えないよ😭 Chromeで開いてね！");
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
                // interim（途中のやつ）は一時的に表示するだけでもOK
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