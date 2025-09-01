import DashboardContent from "@/components/dashboard/dashboard-content"
import { requireUser } from "@/app/data/user/requireUser";
import Header from "@/components/Header";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <>
      <Header />
      <DashboardContent user={user?.user as any} />
    </>
  )
}
