// random generator function
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const random_color = () => Math.floor(Math.random() * 16777215).toString(16);
const random_star = (s) => [random(0 - s, window.innerHeight), random(0 - s, window.innerWidth)];

// declare constant variables
const sky = document.getElementById('sky');
const star = document.getElementById('star');
let generated_stars = 0;

// stars
function generate_stars() {
    for (let i = 0; i < random(30, 60); i++) {
        if (generated_stars >= 250) return generate_stars_max();
        const s = document.createElement('div');
        s.className = 'star';
        sky.appendChild(s);
        generate_stars_fly(s, 1);
        generated_stars++;
    }
}
function generate_stars_max() {
    star.innerHTML = "Sky is full of stars";
    star.disabled = true;
}

function generate_stars_fly(i, f) {
    const s = random(1, 50);
    const c = random_star(s);
    const b = `#${random_color()}`;
    const t = f ? random(0, 500) : random(5000, 10000);
    i.style.width = s + "px";
    i.style.height = s + "px";
    i.style.top = c[0] + "px";
    i.style.left = c[1] + "px";
    i.style.backgroundColor = b;
    i.style.transition = t + "ms ease";
    i.style.rotate = `${random(-360, 360) * 8}deg`;
    i.style.boxShadow = `0px 0px 12px 1px ${b}`;
    i.style.borderRadius = random(s / 4, s / 2) + "px";
    i.style.animation = `flicker ${t / 5}s linear infinite`;
    i.style.opacity = random(1, 10) / 10;
    setTimeout(() => generate_stars_fly(i), t);
}

// auto generate stars
generate_stars();