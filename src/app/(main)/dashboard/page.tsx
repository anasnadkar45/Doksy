import { auth } from "@/app/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import DashboardContent from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    redirect("/login")
  }

  return <DashboardContent user={session?.user as any} />
}
