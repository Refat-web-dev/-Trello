export function changeGradientColors() {
    const body = document.querySelector('body');
    let hue = 0;
    let rotation = 0;

    setInterval(() => {
        hue = (hue + 1) % 360;
        rotation = (rotation + 1) % 360;

        const color1 = `hsl(${hue}, 100%, 70%)`;
        const color2 = `hsl(${(hue + 90) % 360}, 100%, 70%)`;

        body.style.background = `linear-gradient(${rotation}deg, ${color1}, ${color2})`;
    }, 100);
}
