const targets = document.getElementsByClassName('fade');
for (let i = targets.length; i--;) {
    let observer = new IntersectionObserver((entries, observer) => {
        for (let j = entries.length; j--;) {
            if (entries[j].isIntersecting) {
                entries[j].target.classList.add('active');
            } else {
                entries[j].target.classList.remove('active');
            }
        }
    });
    observer.observe(targets[i]);
}
const header = document.getElementById('menu');
const headerOffset = header.offsetTop;

window.addEventListener('scroll', () => {
    if (window.scrollY > headerOffset) {
        header.classList.add('fixed');
    } else {
        header.classList.remove('fixed');
    }
});

function showNextButton() {
    const checkbox = document.getElementById("initialButton");
    const button = document.getElementById("nextButton");

    if (checkbox.checked) {
        button.style.display = "block";
    } else {
        button.style.display = "none";
    }
}

// 594f4d4952552070726f6a6563740a6d61646520627920e69d89e69cace79bb4e7b6990ae89197e4bd9ce6a8a9e381afe4bf9de8adb7e38195e3828ce381a6e38184e381bee38199e38082