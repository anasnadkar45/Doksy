// app/(main)/dashboard/projects/[slug]/layout.tsx
import React, { ReactNode, Suspense } from 'react'
import ProjectsBar from '../../_components/ProjectsBar'
import { requireUser } from '@/app/data/user/requireUser';
import { prisma } from '@/app/lib/db';
import { Skeleton } from '@/components/ui/skeleton';
import ProjectSidebar from './_components/ProjectSidebar';

const getProjects = async (userId: string) => {
    return await prisma.project.findMany({
        where: {
            userId: userId
        }
    })
}

const ChildrenSkeleton = () => {
    return (
        <div className='w-full p-4'>
            <Skeleton className="h-full w-full rounded-md" />
        </div>
    )
}

const layout = async ({ children }: { children: ReactNode }) => {
    const user = await requireUser();
    const projects = await getProjects(user.user.id);
    return (
        <div className='flex h-full w-full bg-card'>
            <ProjectsBar projects={projects} />
            <Suspense fallback={<ChildrenSkeleton />}>
                <div className='flex border rounded-2xl my-4 mr-4 bg-background flex-1 max-h-[calc(100vh-1.6rem)] w-[90vw]'>
                    <ProjectSidebar />
                    <div className='w-full h-full overflow-hidden'>
                        {children}
                    </div>
                </div>
            </Suspense>

        </div>
    )
}

export default layout