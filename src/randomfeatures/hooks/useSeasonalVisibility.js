import { useMemo } from 'react';

export const useSeasonalVisibility = ({
  month,
  day,
  rangeDays = 0,   // number of days AFTER the start day
  exact = false,   // if true, only exact date
}) => {
  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const year = today.getFullYear();
    const start = new Date(year, month, day);
    start.setHours(0, 0, 0, 0);

    if (exact) {
      return (
        today.getMonth() === month &&
        today.getDate() === day
      );
    }

    const end = new Date(year, month, day + rangeDays);
    end.setHours(23, 59, 59, 999);

    return today >= start && today <= end;
  }, [month, day, rangeDays, exact]);
};
export default useSeasonalVisibility;