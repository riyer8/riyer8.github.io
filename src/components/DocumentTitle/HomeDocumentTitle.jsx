import { SITE_TITLE, usePageTitle } from "../../utils/pageTitle";

/** Sets the tab title for the home route (render inside `/` only). */
const HomeDocumentTitle = () => {
  usePageTitle(SITE_TITLE);
  return null;
};

export default HomeDocumentTitle;
