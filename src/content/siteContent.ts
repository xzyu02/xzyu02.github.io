import { parse } from "yaml";
import brownLogoText from "../assets/icons/brown_logo_text.png";
import wiscLogo from "../assets/icons/wisc_logo.svg";
import rawSiteContent from "./site.yaml?raw";

export type PageKey =
  | "overview"
  | "publications"
  | "honors"
  | "services"
  | "teaching"
  | "misc";

export type NavItem = {
  key: PageKey;
  label: string;
};

export type PageMeta = {
  title: string;
  description: string;
  heading: string;
};

export type SocialLink = {
  href: string;
  title: string;
  iconClass?: string;
  label?: string;
  newTab?: boolean;
};

export type NewsItem = {
  date: string;
  text: string;
};

export type PublicationItem = {
  authorsHtml: string;
  title: string;
  venueHtml: string;
  award?: string;
};

export type TeachingGroup = {
  label: string;
  items: Array<{
    course: string;
    term: string;
  }>;
};

export type SiteContent = {
  footerText: string;
  navigation: NavItem[];
  pages: Record<PageKey, PageMeta>;
  overview: {
    bioHtml: string;
    socialLinks: SocialLink[];
    news: NewsItem[];
  };
  publications: {
    items: PublicationItem[];
  };
  honors: {
    items: string[];
  };
  services: {
    items: string[];
  };
  teaching: {
    groups: TeachingGroup[];
  };
  misc: {
    items: string[];
  };
};

function replaceAssetTokens(input: string) {
  return input
    .replaceAll("{{brownLogoText}}", brownLogoText)
    .replaceAll("{{wiscLogo}}", wiscLogo);
}

const parsed = parse(rawSiteContent) as SiteContent;

parsed.overview.bioHtml = replaceAssetTokens(parsed.overview.bioHtml);

export const siteContent = parsed;
export const navItems = siteContent.navigation;
export const pages = siteContent.pages;
export const pageDescriptions = Object.fromEntries(
  Object.entries(siteContent.pages).map(([key, page]) => [key, page.description]),
) as Record<PageKey, string>;
