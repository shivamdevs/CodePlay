const root = document.getElementById("root");

window.addEventListener("mousemove", (e) => {
    root.style.background = `radial-gradient(circle at ${e.pageX}px ${e.pageY}px, #0E95B8 2%, #5A2199)`;
});