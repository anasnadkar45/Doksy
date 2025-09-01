import { ScrollArea } from "@/components/ui/scroll-area";
import { SettingsTabs } from "./_components/settings-tabs";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SettingsSkeleton = () => {
  return (
    <div className="space-y-6 w-full">
      <Skeleton className="w-full h-[50px]"/>
      <Skeleton className="w-full h-[400px]"/>
      <Skeleton className="w-full h-[400px]"/>
    </div>
  )
}
export default async function SettingsPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <ScrollArea className="h-full overflow-hidden">
      <div className="p-6 space-y-8">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">Project Settings</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-prose text-pretty">
            Manage your project&apos;s name, description, URLs, and more. Use the Danger Zone with caution.
          </p>
        </header>

        <Suspense fallback={<SettingsSkeleton />}>
          <SettingsTabs slug={(await params).slug} />
        </Suspense>
      </div>
    </ScrollArea>
  )
}
