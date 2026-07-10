import { auth } from "@/lib/auth";
import { buildDashboardData } from "@/lib/dashboard";
import Dashboard from "@/components/Dashboard";

export default async function AppPage() {
  const session = await auth();
  const data = await buildDashboardData(session!.user.id);

  return <Dashboard initialData={data} />;
}
