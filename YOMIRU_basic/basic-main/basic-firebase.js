// Firebaseのインポート（モジュール版）
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCUqr9CMa4nzBHNKDhfYaP82LQ9nBb2ZrY",
    authDomain: "yomiru-basic-1d8ed.firebaseapp.com",
    projectId: "yomiru-basic-1d8ed",
    storageBucket: "yomiru-basic-1d8ed.firebasestorage.app",
    messagingSenderId: "732891232934",
    appId: "1:732891232934:web:5bd2bf3ac87e4ff6095267"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "../basic-login.html";
    }
});

// 594f4d4952552070726f6a6563740a6d61646520627920e69d89e69cace79bb4e7b6990ae89197e4bd9ce6a8a9e381afe4bf9de8adb7e38195e3828ce381a6e38184e381bee38199e38082