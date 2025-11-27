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

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    errorEl.textContent = "";

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("ユーザ登録成功:", userCredential.user);
            alert("登録が完了しました。ログイン画面に遷移します。");
            window.location.href = "../YOMIRU_basic/basic-login.html";
        })
        .catch((error) => {
            console.error(error);
            errorEl.textContent = "エラー: " + error.message;
        });
});
