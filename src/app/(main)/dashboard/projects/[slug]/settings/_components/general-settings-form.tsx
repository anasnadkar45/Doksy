"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import GlobePointer from "../../../../../../../../public/Icons/Globe"
import Link from "next/link"

export function GeneralSettingsForm({ project }: { project: any }) {
    const [name, setName] = React.useState(project.name)
    const [slug, setSlug] = React.useState(project.slug)
    const [description, setDescription] = React.useState(project.description)
    const [liveUrl, setLiveUrl] = React.useState(project.liveUrl)
    const [published, setPublished] = React.useState(project.isPublished);
    const [isSaving, setIsSaving] = React.useState(false)

    const router = useRouter()

    const onSave = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setIsSaving(true)
            const response = await fetch(`/api/projects/${project.slug}/settings`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
                body: JSON.stringify({
                    name, description, slug, liveUrl, isPublished: published,
                })
            })

            if (response.ok) {
                const data = await response.json()
                toast.success("Changes saved", {
                    description: "Your project settings were updated.",
                })
                if (data.project.slug !== project.slug) {
                    router.push(`/dashboard/projects/${data.project.slug}/settings`)
                }
            } else {
                const err = await response.json()
                toast.error(err.error || "Something went wrong")
            }
        } catch (error) {
            toast.error(error as string)
            console.log(error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form onSubmit={onSave}>
            <div className="grid gap-6">
                <Card className="border border-border bg-card">
                    <CardHeader>
                        <CardTitle className="text-foreground">General</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Update your project&apos;s name, slug, and description.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Project name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-background"
                                placeholder="My Awesome Project"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="slug">Slug</Label>
                            <div className="relative flex">
                                <div className="h-9 w-fit flex items-center border border-r-0 rounded-l-md bg-secondary px-2">
                                    <span>doksy.site/docs/</span>
                                </div>
                                <Input
                                    id="slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="bg-background rounded-l-none"
                                    placeholder="my-awesome-project"
                                />
                                <Link href={`/docs/${project.slug}`}
                                    className={buttonVariants({
                                        className: "absolute right-0",
                                        variant: "secondary"
                                    })}
                                    target="_blank"
                                ><GlobePointer /></Link>
                            </div>
                            <p className="text-xs text-muted-foreground">Used in URLs. Avoid spaces and special characters.</p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-28 bg-background"
                                placeholder="What is this project about?"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-border bg-card">
                    <CardHeader>
                        <CardTitle className="text-foreground">Publishing</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Configure the publishing settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-5">
                        {/* <div className="grid gap-2">
                            <Label htmlFor="liveUrl">Live URL</Label>
                            <Input
                                id="liveUrl"
                                type="url"
                                value={liveUrl}
                                onChange={(e) => setLiveUrl(e.target.value)}
                                className="bg-background"
                                placeholder="https://your-site.com"
                            />
                        </div> */}

                        {/* <div className="grid gap-2">
                            <Label htmlFor="customDomain">Custom domain</Label>
                            <Input
                                id="customDomain"
                                value={customDomain}
                                onChange={(e) => setCustomDomain(e.target.value)}
                                className="bg-background"
                                placeholder="docs.your-site.com"
                            />
                            <p className="text-xs text-muted-foreground">
                                Connect a domain in your hosting provider to use a branded URL.
                            </p>
                        </div> */}

                        <div className="flex items-center justify-between rounded-md border border-border bg-background p-3">
                            <div className="space-y-1">
                                <Label htmlFor="published" className="cursor-pointer">
                                    Publish project
                                </Label>
                                <p className="text-xs text-muted-foreground">Make your documentation visible to the public.</p>
                            </div>
                            <Switch id="published" checked={published} onCheckedChange={setPublished} />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-end gap-3">
                    <Button type="button" variant="secondary" className="border border-border">
                        Cancel
                    </Button>
                    <Button type="submit" className="bg-primary text-primary-foreground hover:opacity-90">
                        {isSaving ? (
                            <div className="flex items-center gap-2">
                                <Loader className="animate-spin size-4" />
                                <span>Saving</span>
                            </div>
                        ) : "Save changes"}
                    </Button>
                </div>
            </div>
        </form>
    )
}
