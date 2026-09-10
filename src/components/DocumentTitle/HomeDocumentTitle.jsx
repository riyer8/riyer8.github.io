import { SITE } from "../../seo/siteMetadata";
import {
  formatPageTitle,
  personSchema,
  usePageMetadata,
  websiteSchema,
} from "../../seo/pageMetadata";

const HOME_SCHEMA = [websiteSchema, personSchema];

const HomeDocumentTitle = () => {
  usePageMetadata({
    title: formatPageTitle(),
    description: SITE.description,
    pathname: "/",
    schema: HOME_SCHEMA,
  });
  return null;
};

export default HomeDocumentTitle;
