import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { GeneralSettingsForm } from "./general-settings-form"
import { DangerZone } from "./danger-zone"
import { requireUser } from "@/app/data/user/requireUser"
import { prisma } from "@/app/lib/db"

const getProjectData = async (userId: string, slug: string) => {
    const data = await prisma.project.findFirst({
        where: {
            slug: slug,
            userId: userId
        }
    })

    return data
}

export async function SettingsTabs({ slug }: { slug: string}) {
    const user = requireUser()
    const projectData = await getProjectData((await user).user.id, slug);

    console.log(projectData)
    return (
        <Tabs defaultValue="general" className="w-full">
            <div className="flex flex-col gap-6 w-full">
                <nav>
                    <Card className="p-2 bg-card border border-border">
                        <TabsList className="flex w-full h-fit gap-1 bg-transparent p-0">
                            <TabsTrigger
                                value="general"
                                className="justify-center w-full data-[state=active]:bg-muted data-[state=active]:text-foreground"
                            >
                                General
                            </TabsTrigger>
                            <TabsTrigger
                                value="danger"
                                className="justify-center w-full data-[state=active]:bg-muted data-[state=active]:text-foreground"
                            >
                                Danger Zone
                            </TabsTrigger>
                        </TabsList>
                    </Card>
                </nav>

                <section className="min-w-0">
                    <TabsContent value="general" className="m-0">
                        <GeneralSettingsForm project={projectData}/>
                    </TabsContent>

                    <TabsContent value="danger" className="m-0">
                        <DangerZone project={projectData}/>
                    </TabsContent>
                </section>
            </div>
        </Tabs>
    )
}
