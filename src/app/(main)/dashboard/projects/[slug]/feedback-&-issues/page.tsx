import React, { Suspense } from 'react'
import CommentsPage from './_components/CommentsPage'
import { ScrollArea } from '@/components/ui/scroll-area'
import { prisma } from '@/app/lib/db'

const getProject = async (slug: string) => {
    return await prisma.project.findFirst({
        where: {
            slug: slug
        },
    });
}
const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const project = await getProject((await params).slug)

    return (
        <ScrollArea className="h-full overflow-hidden">
            <div className="p-6 space-y-8">
                <header>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">Comments & Feedback</h1>
                    <p className="text-sm text-muted-foreground mt-1 max-w-prose text-pretty">
                        View comments and feedback from your users to understand their needs and improve your docs.                    </p>
                </header>
                <Suspense fallback={<p>Loading...</p>}>
                    <CommentsPage project={project as any} />
                </Suspense>
            </div>
        </ScrollArea>
    )
}

export default page