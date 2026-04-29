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

const revealGroups = [
    { selector: '.about, .point', step: 0.08 },
    { selector: '.underline', step: 0.05 },
    { selector: '.card', step: 0.12 }
];

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, {
    threshold: 0.18,
    rootMargin: '0px 0px -10% 0px'
});

revealGroups.forEach(({ selector, step }) => {
    document.querySelectorAll(selector).forEach((element, index) => {
        element.classList.add('reveal-on-scroll');
        element.style.setProperty('--reveal-delay', `${index * step}s`);
        revealObserver.observe(element);
    });
});

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
