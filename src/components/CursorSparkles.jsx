import { useEffect, useRef } from "react";
import "./CursorSparkles.css";

const COLORS = ["#4ECDC4", "#7fe0d8", "#2bb3a8"];
const MAX_DOTS = 40;
const SPAWN_MS = 50;
const LIFE_MS = 800;

const canSparkle = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CursorSparkles = () => {
  const layerRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return undefined;

    const dots = [];
    let lastSpawn = 0;
    let active = canSparkle();

    const removeDot = (dot) => {
      const index = dots.indexOf(dot);
      if (index >= 0) dots.splice(index, 1);
      if (dot.timer) window.clearTimeout(dot.timer);
      dot.el.remove();
    };

    const spawn = (x, y) => {
      if (dots.length >= MAX_DOTS) removeDot(dots[0]);
      const el = document.createElement("span");
      el.className = "cursor-sparkle";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      layer.appendChild(el);
      const dot = { el, timer: null };
      dot.timer = window.setTimeout(() => removeDot(dot), LIFE_MS);
      dots.push(dot);
    };

    const onMove = (event) => {
      if (!active) return;
      const now = performance.now();
      if (now - lastSpawn < SPAWN_MS) return;
      lastSpawn = now;
      spawn(event.clientX, event.clientY);
    };

    const syncMedia = () => {
      active = canSparkle();
      if (active) return;
      [...dots].forEach(removeDot);
    };

    const pointerQuery = window.matchMedia("(pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    pointerQuery.addEventListener("change", syncMedia);
    motionQuery.addEventListener("change", syncMedia);
    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      pointerQuery.removeEventListener("change", syncMedia);
      motionQuery.removeEventListener("change", syncMedia);
      [...dots].forEach(removeDot);
    };
  }, []);

  return <div ref={layerRef} className="cursor-sparkles" aria-hidden="true" />;
};

export default CursorSparkles;
