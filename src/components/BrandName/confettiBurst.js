const COLORS = ["#4ECDC4", "#FFB347", "#f4efe6", "#d9cfc0", "#c4b6a4", "#3d4a49"];
const COUNT = 24;
const DURATION_MS = 1200;

export const burstConfetti = (originX, originY) => {
  if (typeof document === "undefined") return;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:20000;";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();

  const pieces = Array.from({ length: COUNT }, () => ({
    x: originX,
    y: originY,
    vx: (Math.random() - 0.5) * 420,
    vy: -180 - Math.random() * 220,
    w: 5 + Math.random() * 5,
    h: 7 + Math.random() * 6,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 12,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));

  const started = performance.now();
  let frame = 0;
  let last = started;

  const tick = (now) => {
    const dt = Math.min(0.032, (now - last) / 1000);
    last = now;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    pieces.forEach((piece) => {
      piece.vy += 980 * dt;
      piece.x += piece.vx * dt;
      piece.y += piece.vy * dt;
      piece.rot += piece.vr * dt;
      const life = 1 - (now - started) / DURATION_MS;
      ctx.save();
      ctx.globalAlpha = Math.max(0, life);
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rot);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
      ctx.restore();
    });
    if (now - started < DURATION_MS) {
      frame = window.requestAnimationFrame(tick);
    } else {
      canvas.remove();
    }
  };

  frame = window.requestAnimationFrame(tick);
  window.setTimeout(() => {
    window.cancelAnimationFrame(frame);
    canvas.remove();
  }, DURATION_MS + 80);
};
