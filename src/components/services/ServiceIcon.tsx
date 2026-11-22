import { ArrowBigUp, Briefcase, Code2, FileText, Megaphone, MessageSquareText, Mic, MonitorPlay, Presentation, Search, Smartphone } from "lucide-react";
import { MarkGithubIcon } from "@primer/octicons-react";
import type { Service } from "@/data/services";

/** Icon for a service, from its `icon` key. */
export default function ServiceIcon({ icon, className = "size-5" }: { icon: Service["icon"]; className?: string }) {
  switch (icon) {
    case "mic":
      return <Mic className={className} />;
    case "video":
      return <MonitorPlay className={className} />;
    case "github":
      return <MarkGithubIcon className={className} />;
    case "doc":
      return <FileText className={className} />;
    case "code":
      return <Code2 className={className} />;
    case "search":
      return <Search className={className} />;
    case "megaphone":
      return <Megaphone className={className} />;
    case "chat":
      return <MessageSquareText className={className} />;
    case "reddit":
      return <ArrowBigUp className={className} />;
    case "phone":
      return <Smartphone className={className} />;
    case "briefcase":
      return <Briefcase className={className} />;
    case "stage":
      return <Presentation className={className} />;
  }
}
