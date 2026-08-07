import React from 'react';
import confetti from 'canvas-confetti';
import { FaHeart } from 'react-icons/fa';
import { useTheme } from '../../components/ThemeContext/ThemeContext';
import { useSeasonalVisibility } from './hooks/useSeasonalVisibility';

// ❤️ Heart-shaped confetti
const heartShape = confetti.shapeFromText({ text: '❤️', scalar: 2 });

export const isValentineVisible = () => {
  return useSeasonalVisibility({ month: 1, day: 14, exact: true });
};

const ValentineToggle = ({ rightOffset = 4.5 }) => {
  const { theme } = useTheme();

  // 💘 Valentine’s Day — exact date
  const isVisible = useSeasonalVisibility({
    month: 1, // February (0-based)
    day: 14,
    exact: true,
  });

  if (!isVisible) return null;

  const fireConfetti = () => {
    const baseConfig = {
      particleCount: 40,
      spread: 70,
      startVelocity: 35,
      shapes: [heartShape],
      scalar: 1.2,
      colors: ['#ff2d55', '#ff4d6d', '#ff6b81'],
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
    color: '#ff2d55',
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
      title="Happy Valentine’s Day 💕"
      aria-label="Celebrate Valentine’s Day"
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <FaHeart style={{ fontSize: '1.2rem' }} />
    </button>
  );
};

export default ValentineToggle;