"use client"
import { authClient } from '@/app/lib/auth-client'
import { BookOpen, LogOut } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { ModeToggle } from './ModeToggle'
import Image from 'next/image'

const Header = () => {
    const {
        data: session,
    } = authClient.useSession()

    const router = useRouter()

    const handleSignOut = async () => {
        await authClient.signOut()
        router.push("/")
    }
    return (
        <header className="bg-card border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Image src={'/Logo.svg'} alt='Doksy' width={40} height={40}/>
                        <h1 className="ml-2 text-xl font-bold">Doksy</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            {session?.user.image && (
                                <Image
                                    src={session.user.image || "/placeholder.svg"}
                                    alt={session.user.name || "User"}
                                    className="w-8 h-8 rounded-full"
                                    loading='lazy'
                                    unoptimized
                                    width={100}
                                    height={100}
                                />
                            )}
                            <span className="text-sm text-muted-foreground">{session?.user.name || session?.user.email}</span>
                        </div>
                        <ModeToggle />
                        <Button variant="ghost" size="sm" onClick={handleSignOut}>
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header