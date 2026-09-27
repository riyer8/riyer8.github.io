import { FaStar } from 'react-icons/fa';
import { getFavoriteTier } from '../bookshelfUtils';

/** Renders 1–3 stars for a bookshelf entry (nothing if unfavorited). */
const FavoriteStars = ({ item, size = 12, color, className = '' }) => {
  const tier = getFavoriteTier(item);
  if (!tier) return null;

  return (
    <span
      className={`bookshelf-stars ${className}`.trim()}
      aria-label={`${tier} star${tier === 1 ? '' : 's'}`}
      title={`${tier} star${tier === 1 ? '' : 's'}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.08rem',
        flexShrink: 0,
        color,
      }}
    >
      {Array.from({ length: tier }, (_, i) => (
        <FaStar key={i} size={size} color={color} />
      ))}
    </span>
  );
};

export default FavoriteStars;
