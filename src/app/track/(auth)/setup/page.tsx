import { redirect } from "next/navigation";
import { AuthFrame, SetupForm } from "@/components/track/AuthForms";
import { userCount } from "@/lib/track/queries";

export const metadata = { title: "Set up" };

export default async function SetupPage() {
  if ((await userCount()) > 0) redirect("/login");
  return (
    <AuthFrame
      heading={<>Set up <em>Track</em></>}
      sub="Create the first core account. From there you can invite the rest of the core team, then leads and members."
    >
      <SetupForm needsKey={Boolean(process.env.TRACK_SETUP_KEY)} />
    </AuthFrame>
  );
}
