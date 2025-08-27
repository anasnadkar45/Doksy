"use client"
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import LoginForm from '../auth/LoginForm'
import { buttonVariants } from '../ui/button'
import {motion} from "framer-motion"
import { authClient } from '@/app/lib/auth-client'

const Header = () => {
    const {data:session} = authClient.useSession()
    return (
        <motion.div
            className="w-full flex justify-between items-center border-b border-dashed dark:border-[#d0d0d0] px-6 py-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Logo */}
            <motion.div className="flex items-center" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Image src={"/Logo.svg"} alt="Doksy" width={40} height={40} priority />
                <h1 className="ml-2 text-xl text-[#333333] font-bold">Doksy</h1>
            </motion.div>
            <motion.div
                className="flex items-center gap-4"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                {/* <ModeToggle /> */}
                {session?.user ? (
                    <Link href={'/dashboard'} className={buttonVariants({
                        variant: "default"
                    })}>My Account</Link>
                ) : (<LoginForm text="Login" />)}
            </motion.div>
        </motion.div>
    )
}

export default Header