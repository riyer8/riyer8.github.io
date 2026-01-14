import React from 'react';
import confetti from 'canvas-confetti';
import { FaGhost } from 'react-icons/fa';
import { useTheme } from '../../../components/ThemeContext/ThemeContext';
import { useSeasonalVisibility } from '../hooks/useSeasonalVisibility';

// 👻 Ghost-shaped confetti
const ghostShape = confetti.shapeFromText({ text: '👻', scalar: 2 });

export const isHalloweenVisible = () => {
  return useSeasonalVisibility({ month: 9, day: 31, exact: true });
};

const HalloweenToggle = ({ rightOffset = 4.5 }) => {
  const { theme } = useTheme();

  const isVisible = useSeasonalVisibility({
    month: 9, // October (0-based)
    day: 31,
    exact: true,
  });

  if (!isVisible) return null;

  const fireConfetti = () => {
    const baseConfig = {
      particleCount: 50,
      spread: 70,
      startVelocity: 30,
      shapes: [ghostShape],
      scalar: 1.2,
      colors: ['#ff7518', '#ffb347', '#000000'],
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
    color: '#ff7518',
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
      title="Happy Halloween 🎃"
      aria-label="Celebrate Halloween"
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <FaGhost style={{ fontSize: '1.2rem' }} />
    </button>
  );
};

export default HalloweenToggle;
