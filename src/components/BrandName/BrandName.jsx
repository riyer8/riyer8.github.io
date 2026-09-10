import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useReducedMotion } from "framer-motion";
import { burstConfetti } from "./confettiBurst";

const TRIPLE_MS = 800;
const COOLDOWN_MS = 3000;

const BrandName = ({ to = "/ramya", ...rest }) => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const navTimerRef = useRef(null);
  const clicksRef = useRef([]);
  const lastBurstRef = useRef(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => () => window.clearTimeout(navTimerRef.current), []);

  const fireEasterEgg = (event) => {
    const now = Date.now();
    if (now - lastBurstRef.current < COOLDOWN_MS) return;
    lastBurstRef.current = now;
    if (prefersReducedMotion) {
      setPulse(true);
      window.setTimeout(() => setPulse(false), 280);
      return;
    }
    burstConfetti(event.clientX, event.clientY);
  };

  const handleClick = (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.detail === 0) return;

    event.preventDefault();
    event.stopPropagation();
    window.clearTimeout(navTimerRef.current);

    const now = Date.now();
    clicksRef.current = clicksRef.current.filter((time) => now - time < TRIPLE_MS);
    clicksRef.current.push(now);

    if (event.detail >= 3 || clicksRef.current.length >= 3) {
      fireEasterEgg(event);
      clicksRef.current = [];
      return;
    }

    if (event.detail === 2) {
      return;
    }

    navTimerRef.current = window.setTimeout(() => {
      clicksRef.current = [];
      navigate(to);
    }, TRIPLE_MS);
  };

  return (
    <Link
      to={to}
      className={`brand-name${pulse ? " brand-name--pulse" : ""}`}
      aria-label="About Ramya Iyer"
      onClick={handleClick}
      {...rest}
    >
      <span className="brand-name__given">Ramya</span>{" "}
      <span className="brand-name__family">Iyer</span>
    </Link>
  );
};

export default BrandName;
