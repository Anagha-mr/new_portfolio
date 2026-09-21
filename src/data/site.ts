export type NavItem = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export const site = {
  name: "Anagha MR",
  project: "The Red Thread",
  role: "AI / Software / IoT",
  program: "CSE — AI/ML",
  heroKicker: "A PERSONAL PORTFOLIO",
  description:
    "Portfolio of Anagha MR — a final-year Computer Science student specialising in AI/ML, building software, computer vision, and IoT/security systems.",
  // Left blank until a public address is provided.
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
