import { redirect } from "next/navigation";
import { AuthFrame, LoginForm } from "@/components/track/AuthForms";
import { getCurrentUser } from "@/lib/track/session";
import { userCount } from "@/lib/track/queries";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/");
  if ((await userCount()) === 0) redirect("/setup");
  return (
    <AuthFrame heading={<>Every effort <em>counts</em></>} sub="Sign in to see your work, your crew and what Geek Room is shipping.">
      <LoginForm />
      <p className="mt-4 text-xs leading-relaxed text-subtle">New here? Ask your lead or a core member for an invite link.</p>
    </AuthFrame>
  );
}
