import stanford from "./stanford.png";
import katla from "./katla.png";
import palace_dark from "./palace_dark.jpg";
import carouselPhotos from "./aboutCarouselPhotos.json";

/** Map filenames from aboutCarouselPhotos.json to bundled URLs. */
export const SRC_BY_FILENAME = {
  "stanford.png": stanford,
  "katla.png": katla,
  "palace_dark.jpg": palace_dark
};

/** Single source of truth: the photo list, alt text and captions all
 * live in aboutCarouselPhotos.json. Both the home sidebar (ProfilePhoto)
 * and the about page (AboutCarousel) read from it, so a caption is
 * entered once here and shows up in both places. Add a photo by adding
 * one entry to the JSON and one import + map line above. */
const PROFILE_ENTRIES = carouselPhotos.photos.filter(
  (entry) => SRC_BY_FILENAME[entry.file] != null
);

/** Ordered list for cycling profile photos on the home sidebar. */
export const PROFILE_PHOTOS = PROFILE_ENTRIES.map(
  (entry) => SRC_BY_FILENAME[entry.file]
);

/** Caption for each photo above, in the same order. */
export const PROFILE_PHOTO_CAPTIONS = PROFILE_ENTRIES.map((entry) =>
  typeof entry.caption === "string" ? entry.caption : ""
);
