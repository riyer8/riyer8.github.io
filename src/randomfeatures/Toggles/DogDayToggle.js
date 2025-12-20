import React from 'react';
import confetti from 'canvas-confetti';
import { FaDog } from 'react-icons/fa';
import { useTheme } from '../../components/ThemeContext/ThemeContext';
import { useSeasonalVisibility } from '../hooks/useSeasonalVisibility';

// 🐾 Paw-print confetti
const pawShape = confetti.shapeFromText({ text: '🐾', scalar: 2 });

export const isDogDayVisible = () => {
  return useSeasonalVisibility({ month: 7, day: 26, exact: true });
};

const DogDayToggle = ({ rightOffset = 4.5 }) => {
  const { theme } = useTheme();

  // 🐶 National Dog Day — exact date
  const isVisible = useSeasonalVisibility({
    month: 7, // August (0-based)
    day: 26,
    exact: true,
  });

  if (!isVisible) return null;

  const fireConfetti = () => {
    const baseConfig = {
      particleCount: 45,
      spread: 70,
      startVelocity: 30,
      shapes: [pawShape],
      scalar: 1.2,
      colors: ['#8b5e3c', '#c68642', '#f5deb3'],
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
    color: '#8b5e3c',
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
      title="Happy National Dog Day 🐶"
      aria-label="Celebrate National Dog Day"
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <FaDog style={{ fontSize: '1.25rem' }} />
    </button>
  );
};

export default DogDayToggle;
