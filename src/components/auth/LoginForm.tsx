"use client"
import { authClient } from '@/app/lib/auth-client'
import { useRouter } from 'next/navigation'
import React, { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Loader, PartyPopperIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'

const LoginForm = ({ className, ...props }: React.ComponentProps<"div">) => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    function signInWithGithub() {
        startTransition(async () => {
            await authClient.signIn.social({
                provider: "github",
                callbackURL: "/",
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
                <Button>
                    Login
                </Button>
            </DialogTrigger>
            <DialogContent className='bg-opacity/70 backdrop-blur-2xl flex flex-col justify-center items-center'>
                <div className='p-4 bg-foreground rounded-md'>
                    <PartyPopperIcon className='text-background'/>
                </div>
                <DialogHeader>
                    <DialogTitle>Welcome To Doksy</DialogTitle>
                    <DialogDescription>
                        Login with your github account to connect with your github repo
                    </DialogDescription>
                </DialogHeader>
                < Button variant="default" onClick={signInWithGithub} disabled={isPending} className="w-full" >
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