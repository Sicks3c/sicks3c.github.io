const canvas = document.querySelector('#stars');
const context = canvas.getContext('2d');
let points = [];
let running = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  points = Array.from({ length: Math.min(110, Math.floor(innerWidth / 11)) }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.35 + .2,
    a: Math.random() * .55 + .12,
    v: Math.random() * .12 + .025
  }));
}

function draw() {
  context.clearRect(0, 0, innerWidth, innerHeight);
  points.forEach((point) => {
    if (running) point.y = point.y > innerHeight ? 0 : point.y + point.v;
    context.beginPath();
    context.fillStyle = `rgba(202, 211, 255, ${point.a})`;
    context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
    context.fill();
  });
  requestAnimationFrame(draw);
}

document.querySelector('#pulse-toggle')?.addEventListener('click', (event) => {
  running = !running;
  document.body.classList.toggle('field-paused', !running);
  event.currentTarget.textContent = running ? 'Pause field' : 'Resume field';
});

addEventListener('resize', resize);
resize();
draw();
