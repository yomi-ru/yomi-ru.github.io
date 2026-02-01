// Firebaseのインポート（モジュール版）
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCMTU0NVPxs1TVJVReZhahjVJvyKLBjZjE",
    authDomain: "yomiru-student.firebaseapp.com",
    projectId: "yomiru-student",
    storageBucket: "yomiru-student.firebasestorage.app",
    messagingSenderId: "19694028330",
    appId: "1:19694028330:web:931065608d98cf275a6553"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "../student-login.html";
        console.log("No user is signed in, redirecting to login page.");
    }
});

// Initialize Firebase (removed duplicate initialization)

function logout() {
    auth.signOut().then(() => {
        window.location.href = "../../index.html"; // Redirect to your desired page
    }).catch((error) => {
        console.error("Error logging out: ", error);
        alert("ログアウト中にエラーが発生しました。再度お試しください。");
    });
}

// Call logout function when needed, e.g., on a button click

// 594f4d4952552070726f6a6563740a6d61646520627920e69d89e69cace79bb4e7b6990ae89197e4bd9ce6a8a9e381afe4bf9de8adb7e38195e3828ce381a6e38184e381bee38199e38082