import React from 'react';
import confetti from 'canvas-confetti';
import { FaTree } from 'react-icons/fa';
import { useTheme } from '../../../components/ThemeContext/ThemeContext';
import { useSeasonalVisibility } from '../hooks/useSeasonalVisibility';

// 🎄 Tree-shaped confetti
const treeShape = confetti.shapeFromText({ text: '🎄', scalar: 2 });

export const isChristmasVisible = () => {
  return useSeasonalVisibility({ month: 11, day: 25, exact: true });
};

const ChristmasToggle = ({ rightOffset = 4.5 }) => {
  const { theme } = useTheme();

  const isVisible = useSeasonalVisibility({
    month: 11, // December (0-based)
    day: 25,
    exact: true,
  });

  if (!isVisible) return null;

  const fireConfetti = () => {
    const baseConfig = {
      particleCount: 50,
      spread: 70,
      startVelocity: 30,
      shapes: [treeShape],
      scalar: 1.2,
      colors: ['#00a86b', '#ffd700', '#ff0000'],
    };

    confetti({ ...baseConfig, origin: { y: 0.25 } });
    confetti({ ...baseConfig, origin: { x: 0.2, y: 0.4 } });
    confetti({ ...baseConfig, origin: { x: 0.8, y: 0.4 } });
  };

  const buttonStyle = {
    position: 'fixed',
    top: '1rem',
    right: `${rightOffset}rem`,
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: theme.colors.cardBackground,
    border: `1px solid ${theme.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#00a86b',
    backdropFilter: 'blur(10px)',
    transition: 'box-shadow 0.25s ease, transform 0.25s ease',
    zIndex: 1001,
    boxShadow: theme.isDarkMode
      ? '0 4px 14px rgba(0, 0, 0, 0.3)'
      : '0 4px 14px rgba(0, 0, 0, 0.12)',
    padding: 0,
  };

  return (
    <button
      style={buttonStyle}
      onClick={fireConfetti}
      title="Merry Christmas 🎄"
      aria-label="Celebrate Christmas"
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <FaTree style={{ fontSize: '1.2rem' }} />
    </button>
  );
};

export default ChristmasToggle;
