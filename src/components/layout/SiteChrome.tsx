import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/motion/SmoothScroll";
import PageTransition from "@/components/motion/PageTransition";
import ChinkuDock from "@/components/layout/ChinkuDock";

/** Navbar, footer, smooth scrolling and page transitions for the public marketing site. */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <PageTransition>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </PageTransition>
      {/* Outside the page transition so its fixed position isn't trapped by transforms */}
      <ChinkuDock />
    </SmoothScroll>
  );
}
