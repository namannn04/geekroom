import MessagePage from "@/components/ui/MessagePage";

export default function NotFound() {
  return (
    <MessagePage
      label="Oops, something went wrong"
      title="404"
      body="This page doesn't exist or the URL has a typo. Here's a way back."
    />
  );
}
