import type { ReactNode } from "react";
import type { PageKey } from "../content/siteData";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

type LayoutProps = {
  children: ReactNode;
  currentPage: PageKey;
  routeHref: (key: PageKey) => string;
};

export default function Layout({
  children,
  currentPage,
  routeHref,
}: LayoutProps) {
  return (
    <>
      <Sidebar currentPage={currentPage} routeHref={routeHref} />
      <main className="container">{children}</main>
      <Footer />
    </>
  );
}
