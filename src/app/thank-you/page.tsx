import type { Metadata } from "next";
import MessagePage from "@/components/ui/MessagePage";

export const metadata: Metadata = { title: "Thank you" };

export default function ThankYouPage() {
  return <MessagePage title="Thank you" body="We've received your submission and will get back to you soon." />;
}
