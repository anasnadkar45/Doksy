"use client"
import { authClient } from '@/app/lib/auth-client'
import { useRouter } from 'next/navigation'
import React, { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Loader, PartyPopperIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import Image from 'next/image'
import { Changa_One } from 'next/font/google'
const changa = Changa_One({ weight: "400", subsets: ["latin"] });

const LoginForm = ({ className, text }: { className?: string, text: string }) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    function signInWithGithub() {
        startTransition(async () => {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/dashboard",
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Signed in with Google, you will be redirected...")
                        router.push("/dashboard")
                    },
                    onError: () => {
                        toast.error("Internal Server Error")
                    },
                },
            })
        })
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className={`${className}hover:cursor-pointer`}>
                    {text}
                </Button>
            </DialogTrigger>
            <DialogContent className='flex flex-col justify-center items-center bg-white border-white'>
                <Image src={'/Logo.svg'} alt='Doksy' width={100} height={40} />
                <DialogHeader >
                    <DialogTitle className={`${changa.className} text-3xl font-extrabold text-center text-[#333333]`}>Welcome To Doksy</DialogTitle>
                    <DialogDescription className='text-center'>
                        Login with your github account to connect with your github repo
                    </DialogDescription>
                </DialogHeader>
                < Button variant="default" onClick={signInWithGithub} disabled={isPending} className="w-full bg-[#242424] hover:bg-[#2e2e2e] text-white hover:cursor-pointer'" >
                    {
                        isPending ? (
                            <>
                                <Loader className="animate-spin" />
                                <span>Loading...</span>
                            </>
                        ) : (
                            "Login with Github"
                        )}
                </Button >
            </DialogContent>
        </Dialog>
    )
}

export default LoginForm