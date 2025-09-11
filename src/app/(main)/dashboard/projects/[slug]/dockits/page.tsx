import { auth } from '@/app/lib/auth'
import { ScrollArea } from '@/components/ui/scroll-area'
import { headers } from 'next/headers'
import React, { Suspense } from 'react'
import DockitsPage from './_components/DockitsPage'
import { User } from '@/components/docs/documentation-viewer'
import { Skeleton } from '@/components/ui/skeleton'

const DockitsSkeleton = () => {
    return(
        <div className='space-y-6'>
            <Skeleton className='w-full h-10'/>
            <div className='grid grid-cols-2 gap-2'>
                <Skeleton className='w-full h-20'/>
                <Skeleton className='w-full h-20'/>
            </div>
            <Skeleton className='w-full h-[400px]'/>
        </div>
    )
}

const Dockits = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const data = await auth.api.getSession({
        headers: await headers()
    })

    return (
        <ScrollArea className="h-full overflow-hidden">
            <div className="p-6 space-y-8">
                <header>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">Dockits</h1>
                    <p className="text-sm text-muted-foreground mt-1 max-w-prose text-pretty">
                        Control how readers interact with your docs through Dockits. Enable or disable inline comments, feedback, and other engagement features.
                    </p>
                </header>

                <Suspense fallback={<DockitsSkeleton />}>
                    <DockitsPage slug={(await params).slug} user={data?.user as User} />
                </Suspense>
            </div>

        </ScrollArea>
    )
}

export default Dockits