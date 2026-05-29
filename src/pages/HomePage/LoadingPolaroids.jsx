import React, { useMemo } from "react";
import "./LoadingPolaroids.css";

/** Grab every image dropped into src/assets/loading_page (webpack require.context). */
function loadFolderImages() {
  try {
    const ctx = require.context(
      "../../assets/loading_page",
      false,
      /\.(png|jpe?g|gif|webp|avif)$/i
    );
    return ctx.keys().map((key) => ctx(key)).map((m) => (m && m.default) || m);
  } catch (e) {
    return [];
  }
}

const ALL_IMAGES = loadFolderImages();

/**
 * Slots live only in the corners + far left/right side columns, leaving the
 * whole centered band (where the name sits) clear of any polaroid. Rotations
 * stay small + upright ("downward" regular orientation).
 */
const SLOTS = [
  { top: "8%", left: "4%", rotate: -7 },
  { top: "6%", left: "79%", rotate: 6 },
  { top: "31%", left: "1%", rotate: -4 },
  { top: "34%", left: "84%", rotate: 5 },
  { top: "67%", left: "6%", rotate: 6 },
  { top: "70%", left: "80%", rotate: -6 },
];

/** With a big folder (20-30), only ever show a small random handful. */
const MIN_VISIBLE = 4;
const MAX_VISIBLE = 6;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LoadingPolaroids = () => {
  const items = useMemo(() => {
    if (!ALL_IMAGES.length) return [];
    const slots = shuffle(SLOTS);
    const imgs = shuffle(ALL_IMAGES);
    const target =
      MIN_VISIBLE + Math.floor(Math.random() * (MAX_VISIBLE - MIN_VISIBLE + 1));
    const count = Math.min(slots.length, imgs.length, target);
    return Array.from({ length: count }, (_, i) => {
      const slot = slots[i];
      const jitter = (Math.random() - 0.5) * 4; // +-2deg so no two feel identical
      return {
        src: imgs[i],
        top: slot.top,
        left: slot.left,
        rotate: slot.rotate + jitter,
        delay: 140 + i * 110,
      };
    });
  }, []);

  if (!items.length) return null;

  return (
    <div className="loading-polaroids" aria-hidden="true">
      {items.map((item, i) => (
        <figure
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className="loading-polaroid"
          style={{
            top: item.top,
            left: item.left,
            "--polaroid-rotate": `${item.rotate}deg`,
            "--polaroid-delay": `${item.delay}ms`,
          }}
        >
          <img
            className="loading-polaroid__img"
            src={item.src}
            alt=""
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </figure>
      ))}
    </div>
  );
};

export default LoadingPolaroids;
