"use client"
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React, { useEffect, useState } from 'react'
import Message from '../../../../../../../../public/Icons/Message'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

interface DockitsProps {
    canComment: Boolean
}
const DockitsTabs = ({ dockits, slug }: { dockits: DockitsProps, slug: string }) => {
    const [isInlineComment, setIsInlineComment] = useState(dockits.canComment);

    const handleToggle = async (checked: boolean) => {
        setIsInlineComment(checked)
        try {
            const response = await fetch(`/api/projects/${slug}/dockits`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
                body: JSON.stringify({ canComment: checked })
            })

            if (response.ok) {
                const data = await response.json()
                toast.success(
                    data.canComment
                        ? "Inline comment & feedback enabled"
                        : "Inline comment & feedback disabled"
                )
                console.log(data)
            }
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    return (
        <Tabs defaultValue="inlineComment" className="w-full">
            <div className="flex flex-col gap-6 w-full">
                <nav>
                    <Card className="p-2 bg-card border border-border">
                        <TabsList className="flex w-full h-fit gap-1 bg-transparent p-0">
                            <TabsTrigger
                                value="inlineComment"
                                className="justify-center w-full data-[state=active]:bg-muted data-[state=active]:text-foreground"
                            >
                                Inline Comment
                            </TabsTrigger>
                        </TabsList>
                    </Card>
                </nav>

                <section className="min-w-0">
                    <TabsContent value="inlineComment" className="m-0">
                        <div className='w-full grid grid-cols-2 gap-4'>
                            <div>
                                <h1 className='text-xl font-bold'>Inline Comment & Feedback</h1>
                                <p>Enable inline widgets on your docs</p>
                            </div>
                            <Card>
                                <CardHeader>
                                    <CardTitle className='flex justify-between items-center'>
                                        <div className='flex items-center gap-4'>
                                            <Message />
                                            Control Inline Comment
                                        </div>
                                        <Switch
                                            checked={isInlineComment as boolean}
                                            onCheckedChange={handleToggle}
                                        />
                                    </CardTitle>
                                    <CardDescription>
                                        Allow readers to leave inline comments and feedback directly on specific parts of your document.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </TabsContent>
                </section>
            </div>
        </Tabs>
    )
}

export default DockitsTabs