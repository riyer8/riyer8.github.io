import './Badge.css';
import { formatTagCount } from '../tagCounts';

const Badge = ({ children, theme, count }) => {
  const tooltip =
    typeof count === 'number' ? formatTagCount(children, count) : undefined;

  return (
    <span
      className={`badge ${theme.isDarkMode ? 'badge-dark' : 'badge-light'}`}
      data-tooltip={tooltip}
      style={{
        '--badge-tip-bg': theme.isDarkMode ? '#2a2a2a' : '#ffffff',
        '--badge-tip-fg': theme.colors.text,
        '--badge-tip-border': theme.colors.border,
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
