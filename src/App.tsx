import { useEffect, useMemo, useState } from "react";
import profilePhoto from "./assets/photos/me.jpeg";
import Layout from "./components/Layout";
import { pageDescriptions, pages, siteContent, type PageKey } from "./content/siteContent";

const defaultPage: PageKey = "overview";

function normalizeRoute(hash: string): PageKey {
  const route = hash.replace(/^#\/?/, "").trim().toLowerCase();

  if (!route || route === "index" || route === "index.html") {
    return defaultPage;
  }

  // Teaching was merged into Services; keep old links working.
  if (route === "teaching") {
    return "services";
  }

  if (route in pages) {
    return route as PageKey;
  }

  return defaultPage;
}

function routeHref(key: PageKey) {
  return key === defaultPage ? "./" : `./#/${key}`;
}

const visitorTrackers = [
  {
    id: "clustrmaps",
    src: "//cdn.clustrmaps.com/map_v2.js?cl=ffffff&w=300&t=n&d=IcWN24BKXLBDZwpNrSEUbxixaSVE6vO1BgU8GhRPb5s&co=ebebeb&cmo=c7d7bd&cmn=c7d7bd",
  },
  {
    id: "mapmyvisitors",
    src: "https://mapmyvisitors.com/map.js?d=9q2st1KHGt0eoqp8St4dj1J2mi31yavQuttXp0m9HnE&cl=ffffff&w=a",
  },
];

function loadVisitorMap() {
  if (document.getElementById("visitor-map")) {
    return;
  }

  const mapContainer = document.createElement("div");
  mapContainer.id = "visitor-map";
  mapContainer.style.display = "none";

  for (const tracker of visitorTrackers) {
    const script = document.createElement("script");
    script.id = tracker.id;
    script.type = "text/javascript";
    script.src = tracker.src;
    mapContainer.appendChild(script);
  }

  document.body.appendChild(mapContainer);
}

function HtmlParagraph({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return <p className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

function OverviewContent() {
  return (
    <>
      <section className="intro-section">
        <div className="intro-content">
          <div className="photo-column">
            <img src={profilePhoto} alt="Xizheng Yu" className="profile-photo" />
            <div className="social-icons">
              {siteContent.overview.socialLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  title={link.title}
                  target={link.newTab ? "_blank" : undefined}
                  rel={link.newTab ? "noreferrer" : undefined}
                  className={link.label ? "social-text-link" : undefined}
                >
                  {link.iconClass ? <i className={link.iconClass} /> : link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="text-column">
            <p
              className="bio"
              dangerouslySetInnerHTML={{ __html: siteContent.overview.bioHtml }}
            />
          </div>
        </div>
      </section>

      <section>
        <h2>News</h2>
        <div className="content-box compact">
          {siteContent.overview.news.map((item) => (
            <p key={`${item.date}-${item.text}`}>
              <strong>{item.date}</strong> - {item.text}
            </p>
          ))}
        </div>
      </section>
    </>
  );
}

function PublicationsContent() {
  return (
    <div className="content-box">
      {siteContent.publications.items.map((item, index) => (
        <div key={item.title}>
          <HtmlParagraph
            html={`[${index + 1}] ${item.authorsHtml}<br /><strong>${item.title}</strong><br />${item.venueHtml}${item.award ? `<br /><strong>${item.award}</strong>` : ""}`}
            className={index === 0 ? undefined : "spaced-paragraph"}
          />
        </div>
      ))}
    </div>
  );
}

function HonorsContent() {
  return (
    <div className="content-box compact">
      {siteContent.honors.items.map((item) => (
        <HtmlParagraph key={item} html={item} />
      ))}
    </div>
  );
}

function ServicesContent() {
  return (
    <div className="content-box compact">
      <p>
        <strong>Reviewing</strong>
      </p>
      {siteContent.services.items.map((item) => (
        <HtmlParagraph key={item} html={item} className="indented-row" />
      ))}
      <p>
        <strong>Teaching</strong>
      </p>
      {siteContent.teaching.groups.map((group) => (
        <div key={group.label}>
          <p className="indented-row">
            <em>{group.label}</em>
          </p>
          {group.items.map((item) => (
            <p
              key={`${group.label}-${item.course}`}
              className="date-line indented-row nested-row"
            >
              <span>{item.course}</span>
              <span>{item.term}</span>
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

function MiscContent() {
  return (
    <div className="content-box compact">
      {siteContent.misc.items.map((item) => (
        <HtmlParagraph key={item} html={item} />
      ))}
    </div>
  );
}

function PageContent({ pageKey }: { pageKey: PageKey }) {
  if (pageKey === "overview") {
    return <OverviewContent />;
  }

  if (pageKey === "publications") {
    return <PublicationsContent />;
  }

  if (pageKey === "honors") {
    return <HonorsContent />;
  }

  if (pageKey === "services") {
    return <ServicesContent />;
  }

  return <MiscContent />;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>(() =>
    normalizeRoute(window.location.hash),
  );

  useEffect(() => {
    const syncRoute = () => {
      setCurrentPage(normalizeRoute(window.location.hash));
    };

    syncRoute();
    window.addEventListener("hashchange", syncRoute);

    return () => {
      window.removeEventListener("hashchange", syncRoute);
    };
  }, []);

  useEffect(() => {
    const page = pages[currentPage];
    document.title = page.title;

    const metaDescription = document.querySelector('meta[name="description"]');
    metaDescription?.setAttribute(
      "content",
      pageDescriptions[currentPage] ?? page.description,
    );

    loadVisitorMap();
  }, [currentPage]);

  const page = useMemo(() => pages[currentPage], [currentPage]);

  return (
    <Layout
      currentPage={currentPage}
      routeHref={routeHref}
      footerText={siteContent.footerText}
    >
      <div className="page-grid-corner" aria-hidden="true" />
      <div className="page-grid-right-line" aria-hidden="true" />
      <section className="page-section">
        <h2>{page.heading}</h2>
        <PageContent pageKey={currentPage} />
      </section>
    </Layout>
  );
}
