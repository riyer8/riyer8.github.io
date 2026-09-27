import photo1 from "./free.jpg";
import photo2 from "./peak.jpg";
import photo3 from "./waterfall.JPG";

const LIFE_GOAL_IMAGES = {
  photo1,
  photo2,
  photo3,
};

export const getLifeGoalImage = (imageKey) =>
  LIFE_GOAL_IMAGES[imageKey] || photo1;
