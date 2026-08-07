import BirthdayToggle, { isBirthdayVisible } from './BirthdayToggle';
import ValentineToggle, { isValentineVisible } from './ValentinesToggle';
import DogDayToggle, { isDogDayVisible } from './DogDayToggle';
import HalloweenToggle, { isHalloweenVisible } from './HalloweenToggle';
import ChristmasToggle, { isChristmasVisible } from './ChristmasToggle';

const toggles = [
  { Component: BirthdayToggle, isVisible: isBirthdayVisible },
  { Component: ValentineToggle, isVisible: isValentineVisible },
  { Component: DogDayToggle, isVisible: isDogDayVisible },
  { Component: HalloweenToggle, isVisible: isHalloweenVisible },
  { Component: ChristmasToggle, isVisible: isChristmasVisible },
];

const baseRightOffset = 4.5;
const spacing = 3;

const SeasonalToggleManager = () => {
  const visibleToggles = toggles.filter(t => t.isVisible());

  return (
    <>
      {visibleToggles.map(({ Component }, index) => (
        <Component key={index} rightOffset={baseRightOffset + index * spacing} />
      ))}
    </>
  );
};

export default SeasonalToggleManager;
