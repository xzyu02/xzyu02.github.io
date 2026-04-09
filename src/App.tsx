import { useEffect, useMemo, useState } from "react";
import Layout from "./components/Layout";
import { pageDescriptions, pages, type PageKey } from "./content/siteData";

const defaultPage: PageKey = "overview";

function normalizeRoute(hash: string): PageKey {
  const route = hash.replace(/^#\/?/, "").trim().toLowerCase();

  if (!route || route === "index" || route === "index.html") {
    return defaultPage;
  }

  if (route in pages) {
    return route as PageKey;
  }

  return defaultPage;
}

function routeHref(key: PageKey) {
  return key === defaultPage ? "./" : `./#/${key}`;
}

function loadVisitorMap() {
  const existingScript = document.getElementById("clustrmaps");

  if (existingScript) {
    return;
  }

  const mapContainer = document.createElement("div");
  mapContainer.id = "visitor-map";
  mapContainer.style.display = "none";

  const script = document.createElement("script");
  script.id = "clustrmaps";
  script.type = "text/javascript";
  script.src =
    "//cdn.clustrmaps.com/map_v2.js?cl=ffffff&w=300&t=n&d=IcWN24BKXLBDZwpNrSEUbxixaSVE6vO1BgU8GhRPb5s&co=ebebeb&cmo=c7d7bd&cmn=c7d7bd";

  mapContainer.appendChild(script);
  document.body.appendChild(mapContainer);
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
    <Layout currentPage={currentPage} routeHref={routeHref}>
      <section className="page-section">
        <h2>{page.heading}</h2>
        {page.content}
      </section>
    </Layout>
  );
}
