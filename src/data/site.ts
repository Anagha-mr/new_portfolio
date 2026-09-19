export type NavItem = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

/**
 * Single source of truth for site-wide identity, navigation, and metadata.
 * Nothing personal should be hardcoded into components — it flows from here.
 */
export const site = {
  name: "Anagha MR",
  project: "The Red Thread",
  role: "AI / Software / IoT",
  program: "CSE — AI/ML",
  heroKicker: "A PERSONAL PORTFOLIO",
  description:
    "Portfolio of Anagha MR — a final-year Computer Science student specialising in AI/ML, building software, computer vision, and IoT/security systems.",
  // No public contact address has been provided yet. Fill this in before
  // launch — leaving it blank rather than inventing one.
  email: "",
  socials: [] as SocialLink[],
  navigation: [
    { label: "WORK", href: "/work" },
    { label: "ABOUT", href: "/about" },
    { label: "PLAY", href: "/play" },
    { label: "CONTACT", href: "/contact" },
  ] satisfies NavItem[],
};

export type Site = typeof site;
