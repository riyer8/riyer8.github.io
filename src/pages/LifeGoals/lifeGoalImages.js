import photo1 from "../../assets/life_goals/free.jpg";
import photo2 from "../../assets/life_goals/peak.jpg";
import photo3 from "../../assets/life_goals/waterfall.JPG";

export const LIFE_GOAL_IMAGES = {
  photo1,
  photo2,
  photo3,
};

export const getLifeGoalImage = (imageKey) =>
  LIFE_GOAL_IMAGES[imageKey] || photo1;
