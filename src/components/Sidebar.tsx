import { navItems, type PageKey } from "../content/siteContent";

type SidebarProps = {
  currentPage: PageKey;
  routeHref: (key: PageKey) => string;
};

export default function Sidebar({ currentPage, routeHref }: SidebarProps) {
  return (
    <nav className="sidebar" aria-label="Site">
      <ul>
        {navItems.map((item) => (
          <li key={item.key}>
            <a
              href={routeHref(item.key)}
              className={item.key === currentPage ? "active" : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
