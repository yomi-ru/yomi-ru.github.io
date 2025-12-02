const firebaseConfig = {
    apiKey: "AIzaSyCUqr9CMa4nzBHNKDhfYaP82LQ9nBb2ZrY",
    authDomain: "yomiru-basic-1d8ed.firebaseapp.com",
    projectId: "yomiru-basic-1d8ed",
    storageBucket: "yomiru-basic-1d8ed.firebasestorage.app",
    messagingSenderId: "732891232934",
    appId: "1:732891232934:web:5bd2bf3ac87e4ff6095267"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const form = document.getElementById("signupForm");
const errorEl = document.getElementById("error");
const passwordInput = document.getElementById("password");
const phoneInput = document.getElementById("phone-number");

const pwStrengthBar = document.getElementById("password-strength-bar");
const pwStrengthFill = document.getElementById("password-strength-fill");

const phoneErrorMsg = document.createElement("p");
phoneErrorMsg.style.fontSize = "0.9rem";
phoneErrorMsg.style.color = "#f88";
phoneErrorMsg.style.marginTop = "4px";
phoneInput.insertAdjacentElement("afterend", phoneErrorMsg);

function evaluatePassword(password) {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    return score;
}

function updateStrengthBar(score) {
    const percent = (score / 5) * 100;

    pwStrengthFill.style.width = percent + "%";

    if (score <= 2) {
        pwStrengthFill.style.backgroundColor = "#ff6b6b"; // 赤
    } else if (score <= 4) {
        pwStrengthFill.style.backgroundColor = "#fbc531"; // 黄
    } else {
        pwStrengthFill.style.backgroundColor = "#4cd137"; // 緑
    }
}

passwordInput.addEventListener("input", () => {
    const score = evaluatePassword(passwordInput.value);
    updateStrengthBar(score);
});

function validatePhone(phone) {
    const trimmed = phone.trim();

    if (!trimmed) return { valid: false, message: "電話番号を入力してください。" };
    if (!/^[0-9+\-\s]+$/.test(trimmed))
        return { valid: false, message: "使えるのは数字・ハイフン・空白・+ のみです。" };

    const digits = trimmed.replace(/\D/g, "");
    if (digits.length < 10)
        return { valid: false, message: "10桁以上の番号を入力してください。" };

    if (digits.length > 15)
        return { valid: false, message: "電話番号が長すぎます。" };

    return { valid: true, message: "" };
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    errorEl.textContent = "";
    phoneErrorMsg.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;
    const phone = phoneInput.value;

    let hasError = false;

    const pwScore = evaluatePassword(password);
    if (pwScore < 3) {
        errorEl.textContent = "パスワードが弱すぎます。強度を高くしてください。";
        hasError = true;
    }

    const phoneResult = validatePhone(phone);
    if (!phoneResult.valid) {
        phoneErrorMsg.textContent = phoneResult.message;
        hasError = true;
    }

    if (hasError) return;

    // Firebase 登録
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("登録が完了しました。ログイン画面に遷移します。");
            window.location.href = "../YOMIRU_basic/basic-login.html";
        })
        .catch((error) => {
            errorEl.textContent = "エラー: " + error.message;
            alert("エラー: " + error.message);
        });
});