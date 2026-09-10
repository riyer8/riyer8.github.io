import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useOutlet } from "react-router";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "../ThemeContext/ThemeContext";
import "./AnimatedLayout.css";

/** Top-level pages only — bookshelf list/detail share one transition. */
function getTransitionKey(pathname) {
  if (pathname.startsWith("/recent-reads")) return "/recent-reads";
  return pathname;
}

const COVER = { duration: 0.32, ease: [0.4, 0, 0.2, 1] };
const REVEAL = { duration: 0.52, ease: [0.22, 1, 0.36, 1] };
const INSTANT = { duration: 0 };

/**
 * Real content units (copy, media, rows) — not layout shells.
 * Sorted top→bottom so they drop in reading order.
 */
const CASCADE_SELECTOR = [
  "h1",
  "h2",
  "h3",
  "h4",
  "p",
  "img",
  "picture",
  "figure",
  "blockquote",
  "li",
  "aside",
  "input",
  ".back-home-link",
  ".bookshelf-quote",
  ".bookshelf-hero",
  ".bookshelf-filters",
  ".bookshelf-search-row",
  ".bookshelf-count",
  ".bookshelf-head-row",
  ".bookshelf-row",
  ".bookshelf-credits",
  ".bookshelf-pagination",
  ".note-box",
  ".life-goal-box",
  ".about-page__link",
  ".about-carousel",
  ".about-page__title",
  ".about-page__note",
  ".brand-name",
  ".status-widget",
  ".home-feed__section-head",
  ".home-feed-card",
  ".home-feed__row",
  ".home-feed__more",
].join(",");

function isVisible(el) {
  if (!(el instanceof HTMLElement)) return false;
  const style = window.getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return false;
  if (parseFloat(style.opacity) === 0) return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 2 && rect.height > 2;
}

function pickVisible(root, selector) {
  const el = root.querySelector(selector);
  return el && isVisible(el) ? el : null;
}

/** Bookshelf: deliberate reading-order cascade — chrome, then each table row. */
function collectBookshelfCascade(root) {
  const nodes = [];
  const add = (el) => {
    if (el && !nodes.includes(el)) nodes.push(el);
  };

  add(pickVisible(root, ".bookshelf-chrome .back-home-link") || pickVisible(root, ".back-home-link"));
  add(pickVisible(root, ".bookshelf-hero"));
  add(pickVisible(root, ".bookshelf-quote"));
  add(pickVisible(root, ".bookshelf-filters"));
  add(pickVisible(root, ".bookshelf-search-row"));
  add(pickVisible(root, ".bookshelf-count"));
  add(pickVisible(root, ".bookshelf-head-row"));

  const rows = [...root.querySelectorAll("tbody tr.bookshelf-row")].filter(isVisible);
  // Waterfall enough rows to feel full, without an endless wait.
  rows.slice(0, 32).forEach(add);

  add(pickVisible(root, ".bookshelf-pagination"));
  add(pickVisible(root, ".bookshelf-credits"));

  return nodes;
}

function collectCascadeNodes(root) {
  if (!root) return [];

  if (root.querySelector(".bookshelf-hero, .bookshelf-row")) {
    return collectBookshelfCascade(root);
  }

  const found = [...root.querySelectorAll(CASCADE_SELECTOR)].filter(isVisible);

  const selected = found.filter((el) => {
    if (el.matches(".bookshelf-row, .bookshelf-head-row, tr, .home-feed-card"))
      return true;
    return !found.some(
      (other) =>
        other !== el &&
        other.contains(el) &&
        !other.matches(".bookshelf-row, .bookshelf-head-row, tr, .home-feed-card")
    );
  });

  const leaves = selected.filter(
    (el) =>
      !selected.some(
        (other) =>
          other !== el &&
          el.contains(other) &&
          !el.matches(".bookshelf-row, .bookshelf-head-row, tr, .home-feed-card")
      )
  );

  leaves.sort((a, b) => {
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    const dy = ar.top - br.top;
    if (Math.abs(dy) > 4) return dy;
    return ar.left - br.left;
  });

  return leaves.slice(0, 40);
}

/**
 * Soft veil covers → swap → veil lifts while text/images drop in top→bottom.
 */
const AnimatedLayout = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const outlet = useOutlet();
  const prefersReducedMotion = useReducedMotion();

  const targetKey = getTransitionKey(location.pathname);

  const [activeKey, setActiveKey] = useState(targetKey);
  const [activeOutlet, setActiveOutlet] = useState(outlet);
  const [phase, setPhase] = useState("idle");
  const [veilOpacity, setVeilOpacity] = useState(0);
  const [veilTween, setVeilTween] = useState(INSTANT);
  const [entering, setEntering] = useState(false);

  const phaseRef = useRef("idle");
  const pendingRef = useRef(null);
  const activeKeyRef = useRef(activeKey);
  const cascadeRef = useRef(null);
  const taggedRef = useRef([]);

  useEffect(() => {
    activeKeyRef.current = activeKey;
  }, [activeKey]);

  const setPhaseSafe = useCallback((next) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const clearCascade = useCallback(() => {
    taggedRef.current.forEach((el) => {
      el.classList.remove("page-cascade-item");
      el.style.removeProperty("--cascade-i");
    });
    taggedRef.current = [];
  }, []);

  const armCascade = useCallback(() => {
    clearCascade();
    const nodes = collectCascadeNodes(cascadeRef.current);
    nodes.forEach((el, i) => {
      el.style.setProperty("--cascade-i", String(i));
      el.classList.add("page-cascade-item");
    });
    taggedRef.current = nodes;
  }, [clearCascade]);

  const swapTo = useCallback(
    (key, nextOutlet) => {
      clearCascade();
      setActiveKey(key);
      setActiveOutlet(nextOutlet);
      window.scrollTo(0, 0);
      setEntering(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => armCascade());
      });
    },
    [armCascade, clearCascade]
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      clearCascade();
      setActiveKey(targetKey);
      setActiveOutlet(outlet);
      setVeilTween(INSTANT);
      setVeilOpacity(0);
      setEntering(false);
      setPhaseSafe("idle");
      window.scrollTo(0, 0);
      return;
    }

    if (targetKey === activeKeyRef.current) {
      if (phaseRef.current === "idle") setActiveOutlet(outlet);
      return;
    }

    pendingRef.current = { key: targetKey, outlet };

    if (phaseRef.current !== "idle") return;

    setPhaseSafe("cover");
    setVeilTween(COVER);
    setVeilOpacity(1);
  }, [targetKey, outlet, prefersReducedMotion, setPhaseSafe, clearCascade]);

  const handleVeilComplete = useCallback(() => {
    if (phaseRef.current === "cover") {
      const next = pendingRef.current;
      pendingRef.current = null;
      if (next) swapTo(next.key, next.outlet);
      setPhaseSafe("reveal");
      setVeilTween(REVEAL);
      setVeilOpacity(0);
      return;
    }

    if (phaseRef.current === "reveal") {
      // Let cascade finish, then clean classes.
      window.setTimeout(() => {
        setEntering(false);
        clearCascade();
      }, 3200);

      setVeilTween(INSTANT);
      setVeilOpacity(0);

      if (pendingRef.current) {
        setPhaseSafe("cover");
        requestAnimationFrame(() => {
          setVeilTween(COVER);
          setVeilOpacity(1);
        });
        return;
      }
      setPhaseSafe("idle");
    }
  }, [clearCascade, setPhaseSafe, swapTo]);

  useEffect(() => () => clearCascade(), [clearCascade]);

  if (prefersReducedMotion) {
    return <div className="page-transition">{outlet}</div>;
  }

  return (
    <div className="page-transition">
      <div
        ref={cascadeRef}
        className={`page-transition__page${entering ? " is-entering" : ""}`}
        key={activeKey}
      >
        {activeOutlet}
      </div>

      <motion.div
        className={`page-transition__veil${phase !== "idle" ? " page-transition__veil--active" : ""}`}
        style={{
          // Solid site ground — never a frosted white sheet over content.
          backgroundColor: theme.colors.background,
          backgroundImage: `
            radial-gradient(ellipse at 20% 30%, ${theme.colors.backgroundAccentPrimary} 0%, transparent 55%),
            radial-gradient(ellipse at 80% 70%, ${theme.colors.backgroundAccentSecondary} 0%, transparent 55%)
          `,
        }}
        initial={false}
        animate={{ opacity: veilOpacity }}
        transition={veilTween}
        onAnimationComplete={handleVeilComplete}
        aria-hidden="true"
      />
    </div>
  );
};

export default AnimatedLayout;
