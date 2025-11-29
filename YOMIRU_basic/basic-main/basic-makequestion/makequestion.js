const countInput = document.getElementById("countInput");
const generateBtn = document.getElementById("generateBtn");
const boxes = document.getElementById("boxes");
const downloadBtn = document.getElementById("downloadJsonBtn");
const jsonPreview = document.getElementById("jsonPreview");
const problemTitleInput = document.getElementById("problemTitle");

// 枠を生成
generateBtn.addEventListener("click", () => {
    const count = Number(countInput.value);

    if (!count || count < 1) {
        alert("1以上の数字を入れてください");
        return;
    }

    boxes.innerHTML = "";

    for (let i = 1; i <= count; i++) {
        const div = document.createElement("div");
        div.className = "box-item";
        div.innerHTML = `
            <label>${i}口目</label><br>
            <input type="number" class="numBox" placeholder="数字を入れてください">
        `;
        boxes.appendChild(div);
    }
});

// JSONダウンロード
downloadBtn.addEventListener("click", () => {
    const inputs = [...document.querySelectorAll(".numBox")];
    const values = inputs.map(input => Number(input.value));

    if (values.length === 0) {
        alert("先に枠を生成して数字を入れてください");
        return;
    }

    if (values.some(v => isNaN(v))) {
        alert("すべての枠に数字を入れてください");
        return;
    }

    const total = values.reduce((a, b) => a + b, 0);

    const data = {
        title: problemTitleInput.value || "無題の問題",
        createdAt: new Date().toISOString(),
        count: values.length,
        nums: values,
        sum: total
    };

    const jsonText = JSON.stringify(data, null, 2);

    // ★ ここを安全に
    if (jsonPreview) {
        jsonPreview.textContent = jsonText;
    }

    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (data.title || "problem") + ".json";
    a.click();
    URL.revokeObjectURL(url);

    alert("JSONファイルをダウンロードしました！");
});
