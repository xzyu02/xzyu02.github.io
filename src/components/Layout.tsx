import type { ReactNode } from "react";
import type { PageKey } from "../content/siteContent";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

type LayoutProps = {
  children: ReactNode;
  currentPage: PageKey;
  routeHref: (key: PageKey) => string;
  footerText: string;
};

export default function Layout({
  children,
  currentPage,
  routeHref,
  footerText,
}: LayoutProps) {
  return (
    <>
      <Sidebar currentPage={currentPage} routeHref={routeHref} />
      <main className="container">{children}</main>
      <Footer text={footerText} />
    </>
  );
}
