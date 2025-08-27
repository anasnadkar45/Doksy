import DashboardContent from "@/components/dashboard/dashboard-content"
import { requireUser } from "@/app/data/user/requireUser";

export default async function DashboardPage() {
  const user = await requireUser();

  return <DashboardContent user={user?.user as any} />
}
