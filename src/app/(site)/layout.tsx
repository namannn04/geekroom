import SiteChrome from "@/components/layout/SiteChrome";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
