function showNextButton() {
    document.getElementById("nextButton").style.display = "block";
}
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
