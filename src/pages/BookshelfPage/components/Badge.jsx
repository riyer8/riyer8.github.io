import './Badge.css';
import { formatTagCount } from '../tagCounts';

// Renders as a plain span by default. Pass `onClick` to get a real <button>
// (keyboard-focusable, toggle semantics via `active`).
const Badge = ({ children, theme, count, onClick, active }) => {
  const tooltip =
    typeof count === 'number' ? formatTagCount(children, count) : undefined;
  const className =
    `badge ${theme.isDarkMode ? 'badge-dark' : 'badge-light'}` +
    (onClick ? ' badge--button' : '') +
    (active ? ' badge--active' : '');
  const style = {
    '--badge-tip-bg': theme.isDarkMode ? '#2a2a2a' : '#ffffff',
    '--badge-tip-fg': theme.colors.text,
    '--badge-tip-border': theme.colors.border,
  };

  if (onClick) {
    return (
      <button
        type="button"
        className={className}
        data-tooltip={tooltip}
        style={style}
        onClick={onClick}
        aria-pressed={active ? true : false}
        aria-label={`Filter by tag ${children}`}
      >
        {children}
      </button>
    );
  }

  return (
    <span className={className} data-tooltip={tooltip} style={style}>
      {children}
    </span>
  );
};

export default Badge;
