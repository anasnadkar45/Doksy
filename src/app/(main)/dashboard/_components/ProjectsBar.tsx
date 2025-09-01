"use client"
import { authClient } from "@/app/lib/auth-client"
import { ModeToggle } from "@/components/ModeToggle"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import Avatar from "boring-avatars"
import { LogOutIcon } from "lucide-react"
import Image from "next/image"
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

export interface Project {
    id: string
    name: string
    description: string | null
    liveUrl: string | null
    creator: string | null
    slug: string
    isPublished: boolean
    githubUrl: string
}

const variants: ("marble" | "beam" | "pixel" | "sunset" | "ring" | "bauhaus")[] = [
    "marble", "beam", "pixel", "sunset", "ring", "bauhaus"
]

const colorSets = [
    // Warm & playful
    ["#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF"],

    // Soft pastels
    ["#A0C4FF", "#BDB2FF", "#FFC6FF", "#FFFFFC", "#FFB5A7"],

    // Earthy neutrals
    ["#FCD5CE", "#F8EDEB", "#D8E2DC", "#ECE4DB", "#FFE5D9"],

    // Bold & vibrant
    ["#FF6B6B", "#F7B801", "#6FFFE9", "#4ECDC4", "#1A535C"],

    // Sunset vibes
    ["#FFE3B3", "#FF9A52", "#FF5252", "#C91E5A", "#3D2922"],

    // Ocean blues
    ["#E0F7FA", "#80DEEA", "#26C6DA", "#00838F", "#004D40"],

    // Fresh greens
    ["#DFF8EB", "#A3F7B5", "#10B981", "#047857", "#064E3B"],

    // Techy neon
    ["#D946EF", "#8B5CF6", "#6366F1", "#06B6D4", "#22D3EE"],

    // Fire & lava
    ["#FEE2E2", "#FCA5A5", "#EF4444", "#B91C1C", "#7F1D1D"],

    // Modern grayscale with accent
    ["#F5F5F5", "#D4D4D8", "#A1A1AA", "#3F3F46", "#2563EB"],
];


const ProjectsBar = ({ projects }: { projects: Project[] }) => {
    const params = useParams();
    const router = useRouter()
    const handleSignOut = async () => {
        await authClient.signOut()
        router.push("/")
    }
    return (
        <div className="h-screen flex flex-col justify-between items-center py-4 px-2">
            <div>
                <Link href={'/dashboard'} className="border-b pb-2 mb-2">
                    <Image src={'/Logo.svg'} alt="Logo" width={40} height={100} />
                </Link>
                <div className='w-fit flex flex-col items-center gap-3 '>
                    {projects.map((project) => {
                        // Use slug length or id hash to pick deterministic style
                        const index = project.slug.charCodeAt(0) % variants.length;
                        const colorIndex = project.slug.charCodeAt(project.slug.length - 1) % colorSets.length;

                        return (
                            <Tooltip key={project.id}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={`/dashboard/projects/${project.slug}/edit`}
                                        className={`${params.slug === project.slug ? "bg-foreground" : ""} p-1 rounded-md`}
                                    >
                                        <Avatar
                                            size={30}
                                            name={project.name}
                                            variant={variants[index]}
                                            colors={colorSets[colorIndex]}
                                        />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent align="start" alignOffset={20}>
                                    <p>{project.slug}</p>
                                </TooltipContent>
                            </Tooltip>
                        )
                    })}
                </div>
            </div>
            <div className="flex flex-col gap-2 items-center">
                <ModeToggle />
                <Button onClick={handleSignOut}>
                    <LogOutIcon />
                </Button>
            </div>
        </div>
    )
}

export default ProjectsBar
