import React from "react";
import { useTheme } from "../../components/ThemeContext/ThemeContext";
import { SITE } from "../../seo/siteMetadata";
import {
  formatPageTitle,
  makeBreadcrumbSchema,
  personSchema,
  usePageMetadata,
  websiteSchema,
} from "../../seo/pageMetadata";
import BackHomeLink from "../../components/Navigation/BackHomeLink";
import NotesSection from "./principles/NotesSection";
import LifeGoalsSection from "./lifeGoals/LifeGoalsSection";
import AboutCarousel from "./AboutCarousel";
import "./AboutPage.css";

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/riyer8" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ramya-i/" },
  { label: "X", href: "https://x.com/ramya_iyer1" },
  { label: "Email", href: "mailto:ramya1@stanford.edu" },
  {
    label: "Google Scholar",
    href: "https://scholar.google.com/citations?user=uou0pPoAAAAJ&hl=en",
  },
  { label: "Substack", href: "https://ramyai.substack.com/" },
];

const PAGE_TITLE = formatPageTitle("about");
const ABOUT_SCHEMA = [
  websiteSchema,
  personSchema,
  {
    "@type": "ProfilePage",
    "@id": `${SITE.url}/ramya/#profile`,
    url: `${SITE.url}/ramya/`,
    name: "About Ramya Iyer",
    mainEntity: { "@id": `${SITE.url}/#person` },
    isPartOf: { "@id": `${SITE.url}/#website` },
  },
  makeBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "About Ramya Iyer", path: "/ramya" },
  ]),
];

const AboutPage = () => {
  const { theme } = useTheme();
  usePageMetadata({
    title: PAGE_TITLE,
    description: SITE.aboutDescription,
    pathname: "/ramya",
    type: "profile",
    schema: ABOUT_SCHEMA,
  });

  return (
    <div
      className="about-page"
      style={{
        color: theme.colors.text,
        "--about-text": theme.colors.text,
        "--about-muted": theme.colors.textSecondary,
        "--about-accent": theme.colors.accent,
      }}
    >
      <main className="about-page__content">
        <BackHomeLink className="about-page__home-link" />

        <section className="about-page__hero" aria-label="About Ramya">
          <aside className="about-page__aside" aria-label="Photos and links">
            <AboutCarousel />

            <ul className="about-page__links">
              {SOCIAL_LINKS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="about-page__link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <div className="about-page__intro">
            <h1 className="about-page__title" style={{ color: theme.colors.text }}>
              Hi, I&apos;m{" "}
              <span className="about-page__title-name">Ramya</span>.
            </h1>

            <div className="about-page__body">
              <p>
                I&apos;ve always found it a little unrealistic to define who I am in a
                few sentences. It would probably be updated every other day anyway.
              </p>

              <p className="about-page__note">
                That said, here&apos;s my best attempt today.
              </p>

              <p>
                I&apos;m a recent Stanford graduate in my twenties, currently living in
                San Francisco and living this thing called life! A lot of my days revolve
                around AI and mathematics, but those are only part of the story. I love
                strava-ing my hikes, discovering new restaurants, wandering through cities,
                and indulging in new books. I&apos;m also fascinated by human connection and
                people.
              </p>

              <p>
                I&apos;ve recently started writing as well on my Substack, which I hope
                you&apos;ll check out! If any of that resonates with you, I can&apos;t wait
                to hear from you. You can email me at{" "}
                <a href="mailto:ramya1@stanford.edu" className="about-page__email">
                  ramya1@stanford.edu
                </a>
                ; I pride myself on replying to <em>exciting</em> emails rather quickly.
              </p>

              <p className="about-page__note about-page__note--footer">
                Even this will probably be updated soon. ✨
              </p>
            </div>
          </div>
        </section>
      </main>

      <section className="about-page__principles" aria-label="Life goals and life advice notes">
        <LifeGoalsSection />
        <NotesSection />
      </section>
    </div>
  );
};

export default AboutPage;
