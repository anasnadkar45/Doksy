"use client"
import React from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import Edit from '../../../../../../../public/Icons/Edit'
import Settings from '../../../../../../../public/Icons/Settings'
import Message from '../../../../../../../public/Icons/Message'
import Addon from '../../../../../../../public/Icons/Addon'

const NavLinks = [
    {
        id: 0,
        name: "Editor",
        href: "edit",
        icon: Edit
    },
    {
        id: 1,
        name: "Settings",
        href: "settings",
        icon: Settings
    },
    {
        id: 2,
        name: "Feedback & Comments",
        href: "feedback-&-issues",
        icon: Message
    },
    {
        id: 3,
        name: "Dockits",
        href: "dockits",
        icon: Addon
    },
]
const ProjectSidebar = () => {
    const params = useParams();
    const activeLink = usePathname();

    return (
        <div className='min-w-[170px] border-r p-2'>
            {NavLinks.map((link) => (
                <Link key={link.id} href={`/dashboard/projects/${params.slug}/${link.href}`} className={`${activeLink.includes(link.href) ? "bg-secondary/50 rounded-md  inset-shadow-[0px_2px_0px,0px_0px_1px] inset-shadow-accent font-bold" : "text-muted-foreground"} text-sm flex gap-2 items-center p-2 text`}>
                    <link.icon className='size-6' />
                    <span>{link.name}</span>
                </Link>
            ))}
        </div>
    )
}

export default ProjectSidebar