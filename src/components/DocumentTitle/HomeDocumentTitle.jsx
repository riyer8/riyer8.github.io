import { SITE } from "../../seo/siteMetadata";
import {
  personSchema,
  usePageMetadata,
  websiteSchema,
} from "../../seo/pageMetadata";

const HOME_SCHEMA = [websiteSchema, personSchema];

const HomeDocumentTitle = () => {
  usePageMetadata({
    title: "Ramya Iyer",
    description: SITE.description,
    pathname: "/",
    schema: HOME_SCHEMA,
  });
  return null;
};

export default HomeDocumentTitle;
