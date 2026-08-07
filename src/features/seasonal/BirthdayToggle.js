import React from 'react';
import confetti from 'canvas-confetti';
import { FaBirthdayCake } from 'react-icons/fa';
import { useTheme } from '../../components/ThemeContext/ThemeContext';
import { useSeasonalVisibility } from './hooks/useSeasonalVisibility';

export const isBirthdayVisible = () => {
  return useSeasonalVisibility({ month: 11, day: 18, rangeDays: 6 });
};

const BirthdayToggle = ({ rightOffset = 4.5 }) => {
  const { theme } = useTheme();

  // 🎉 Visible for the entire birthday week
  const isVisible = useSeasonalVisibility({
    month: 11,   // December (0-based)
    day: 18,
    rangeDays: 6, // birthday + 6 days = 7-day week
  });

  if (!isVisible) return null;

  const fireConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.2 },
    });
    confetti({
      particleCount: 60,
      spread: 55,
      origin: { x: 0.2 },
    });
    confetti({
      particleCount: 60,
      spread: 55,
      origin: { x: 0.8 },
    });
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
    color: theme.colors.text,
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
      title="It's my birthday week! 🎉"
      aria-label="Celebrate birthday"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <FaBirthdayCake style={{ fontSize: '1.2rem' }} />
    </button>
  );
};

export default BirthdayToggle;