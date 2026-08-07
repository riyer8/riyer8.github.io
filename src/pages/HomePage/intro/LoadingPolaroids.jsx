import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./LoadingPolaroids.css";

/** Profile photos plus any extras in src/assets/loading_page (e.g. bookshelf, alt crops). */
function loadFolderImages() {
  const toUrls = (ctx) =>
    ctx.keys().map((key) => ctx(key)).map((m) => (m && m.default) || m);

  const images = [];
  try {
    images.push(
      ...toUrls(
        require.context(
          "../../../assets",
          false,
          /\.(png|jpe?g|gif|webp|avif)$/i
        )
      )
    );
  } catch (e) {
    /* ignore */
  }
  try {
    images.push(
      ...toUrls(
        require.context(
          "../../../assets/loading_page",
          false,
          /\.(png|jpe?g|gif|webp|avif)$/i
        )
      )
    );
  } catch (e) {
    /* ignore */
  }
  return images;
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

/** Keep the loading screen sparse and never request more photos than exist. */
const MAX_VISIBLE = 5;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LoadingPolaroids = ({ onAllImagesLoaded }) => {
  const [loadedIndices, setLoadedIndices] = useState(() => new Set());
  const notifiedRef = useRef(false);
  const onAllImagesLoadedRef = useRef(onAllImagesLoaded);

  useEffect(() => {
    onAllImagesLoadedRef.current = onAllImagesLoaded;
  }, [onAllImagesLoaded]);

  const items = useMemo(() => {
    if (!ALL_IMAGES.length) return [];
    const slots = shuffle(SLOTS);
    const imgs = shuffle(ALL_IMAGES);
    const count = Math.min(imgs.length, MAX_VISIBLE);
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

  const markLoaded = useCallback((index) => {
    setLoadedIndices((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!items.length) {
      if (!notifiedRef.current) {
        notifiedRef.current = true;
        onAllImagesLoadedRef.current?.();
      }
      return;
    }

    if (loadedIndices.size >= items.length && !notifiedRef.current) {
      notifiedRef.current = true;
      onAllImagesLoadedRef.current?.();
    }
  }, [items.length, loadedIndices]);

  if (!items.length) return null;

  return (
    <div className="loading-polaroids" aria-hidden="true">
      {items.map((item, i) => (
        <figure
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className={`loading-polaroid${loadedIndices.has(i) ? " loading-polaroid--visible" : ""
            }`}
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
            onLoad={() => markLoaded(i)}
            onError={() => markLoaded(i)}
          />
        </figure>
      ))}
    </div>
  );
};

export default LoadingPolaroids;
