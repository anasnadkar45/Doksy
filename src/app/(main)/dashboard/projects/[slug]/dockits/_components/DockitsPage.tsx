import { prisma } from "@/app/lib/db"
import type { User } from "@/components/docs/documentation-viewer"
import DockitsTabs from "./DockitsTabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Sparkles, Zap, Users } from "lucide-react"

import Freelancer from "../../../../../../../../public/freelancer.svg"

interface DockitsProps {
    canComment: boolean
}

const getProject = async (slug: string, userId: string) => {
    return await prisma.project.findFirst({
        where: {
            slug: slug,
        },
        select: {
            canComment: true,
        },
    })
}

const DockitsPage = async ({ slug, user }: { slug: string; user: User }) => {
    const dockits = await getProject(slug, user?.id as string)

    return (
        <div className="space-y-6">
            <DockitsTabs dockits={dockits as DockitsProps} slug={slug} />

            <div className="relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-card via-card/50 to-muted/50 rounded-xl" />

                <Card className="relative border-0 bg-background/80 backdrop-blur-2xl">
                    <CardHeader className="text-center pb-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <CardTitle className="text-3xl font-bold ">
                                Exciting Features Coming Soon
                            </CardTitle>
                        </div>
                        <CardDescription className="text-sm text-muted-foreground max-w-2xl mx-auto">
                            We’re working on more Dockits features to enhance collaboration — such as quick
                            polls, reactions, and inline suggestions. Stay tuned!
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-8">

                        {/* Center illustration with enhanced styling */}
                        <div className="flex flex-col items-center space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-muted/50 to-muted rounded-full blur-3xl scale-120" />
                                <div className="relative p-8 rounded-2xl bg-card/30 border border-border/50">
                                    <Image
                                        src={Freelancer || "/placeholder.svg"}
                                        alt="Exciting features coming soon"
                                        width={300}
                                        height={300}
                                        className="dark:invert opacity-80 hover:opacity-100 transition-opacity duration-300"
                                    />
                                </div>
                            </div>

                            {/* Status badges */}
                            <div className="flex flex-wrap gap-2 justify-center">
                                <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                                    <Zap className="w-3 h-3 mr-1" />
                                    In Development
                                </Badge>
                                <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                                    <Users className="w-3 h-3 mr-1" />
                                    Community Driven
                                </Badge>
                            </div>

                            {/* Call to action */}
                            <div className="text-center space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Want to be the first to know when these features launch?
                                </p>
                                <p className="text-xs text-muted-foreground/70">
                                    Follow our development progress and get early access to beta features.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default DockitsPage
