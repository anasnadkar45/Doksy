"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Github } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { toast } from "sonner"
import { authClient } from "@/app/lib/auth-client"

export default function LoginPage() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    function signInWithGithub() {
        startTransition(async () => {
            // Mock auth client - replace with your actual auth implementation
            try {
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
            } catch (error) {
                toast.error("Internal Server Error")
            }
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back to home button */}
                {/* <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to home
                    </Link>
                </motion.div> */}

                {/* Login card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <Card className="border-dashed">
                        <CardHeader className="text-center space-y-4">
                            {/* Logo */}
                            <motion.div
                                className="flex justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                            >
                                <div className="flex items-center">
                                    <Image src="/Logo.svg" alt="Doksy" width={40} height={40} />
                                    <h1 className="ml-2 text-xl font-bold">Doksy</h1>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
                                <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    Sign in to your account to continue building beautiful documentation
                                </CardDescription>
                            </motion.div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* GitHub sign in button */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >
                                <Button
                                    onClick={signInWithGithub}
                                    disabled={isPending}
                                    className="w-full h-12 text-base font-medium bg-transparent"
                                    variant="outline"
                                >
                                    {isPending ? (
                                        <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            Signing in...
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            className="flex items-center gap-2"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Github className="h-5 w-5" />
                                            Continue with GitHub
                                        </motion.div>
                                    )}
                                </Button>
                            </motion.div>

                            {/* Decorative elements */}
                            <motion.div
                                className="text-center text-xs text-muted-foreground"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                            >
                                By continuing, you agree to our Terms of Service and Privacy Policy
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Decorative sparkles */}
                <motion.div
                    className="absolute top-20 left-10 opacity-20"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.7, type: "spring" }}
                >
                    <Image src="/sparkel.svg" alt="sparkles" width={60} height={60} />
                </motion.div>

                <motion.div
                    className="absolute bottom-20 right-10 opacity-20"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.9, type: "spring" }}
                >
                    <Image src="/sparkel.svg" alt="sparkles" width={60} height={60} />
                </motion.div>
            </div>
        </div>
    )
}
