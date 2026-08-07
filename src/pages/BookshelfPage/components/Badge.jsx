import './Badge.css';

const Badge = ({ children, theme }) => {
  return (
    <span
      className={`badge ${theme.isDarkMode ? 'badge-dark' : 'badge-light'}`}
    >
      {children}
    </span>
  );
};

export default Badge;