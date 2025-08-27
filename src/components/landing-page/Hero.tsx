import React from 'react'
import Bolt from "../../../public/Icons/Bolt"
import Rocket from "../../../public/Icons/Rocket"
import Lock from "../../../public/Icons/Lock"
import { Copy, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Changa_One } from 'next/font/google'

const changa = Changa_One({ weight: "400", subsets: ["latin"] })

const Hero = () => {
    return (
        <>
            <div className="relative flex flex-col justify-center items-center p-4 border-b border-dashed dark:border-[#d0d0d0]">
                {/* cta pill */}
                <motion.a
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://www.producthunt.com/products/doksy?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-doksy"
                    target="_blank"
                    rel="noreferrer"
                >
                    <Image
                        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1009132&theme=dark&t=1756230338366"
                        alt="Doksy - Turn your readme into beautiful documentation website | Product Hunt"
                        width="250"
                        height="54"
                        priority
                        unoptimized
                    />
                </motion.a>
                <motion.div
                    className="w-fit z-10 mx-auto mt-6 px-4 py-1 text-[#333333] text-sm font-bold flex items-center gap-4 border dark:border-[#d0d0d0] rounded-2xl shadow-md cursor-pointer hover:bg-card transition-all duration-200"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span><Bolt /></span>
                    <span>Generate Docs Now</span>
                    <span><Rocket /></span>
                </motion.div>

                {/* heading */}
                <motion.h1
                    className={`${changa.className} mt-16 z-10 text-[#333333] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold max-w-[800px] tracking-tighter mx-auto text-center leading-tight`}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.25, 0, 1] }}
                >
                    Turn Your GitHub README into <br className="hidden sm:block" />
                    Beautiful{" "}
                    <span className="relative inline-block">
                        Documentation
                        <motion.svg
                            className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4"
                            viewBox="0 0 300 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="none"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, delay: 1.2, ease: "easeInOut" }}
                        >
                            <motion.path
                                d="M2 4C25 2 50 1 75 3C100 5 125 7 150 5C175 3 200 1 225 3C250 5 275 7 298 5"
                                stroke="#cdcdcd"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                fill="none"
                            />
                            <motion.path
                                d="M2 8C25 6 50 5 75 7C100 9 125 11 150 9C175 7 200 5 225 7C250 9 275 11 298 9"
                                stroke="#cdcdcd"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                fill="none"
                            />
                        </motion.svg>
                    </span>
                    <br className="block sm:hidden" />
                    Instantly.
                </motion.h1>

                <motion.p
                    className="mt-7 text-sm z-10 text-muted-foreground text-center max-w-md mx-auto"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    Doksy helps developers and teams transform their README files into stunning, multi-page documentation
                    websites in just a few clicks.
                </motion.p>

                <motion.div
                    className="absolute z-0 top-10 left-20"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 1, type: "spring" }}
                >
                    <Image
                        src={"/sparkel.svg"}
                        alt="sparkles"
                        width={100}
                        height={100}
                        loading="lazy"
                    />
                </motion.div>
                <motion.div
                    className="absolute z-0 top-60 right-20"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 1.2, type: "spring" }}
                >
                    <Image
                        src={"/sparkel.svg"}
                        alt="sparkles"
                        width={100}
                        height={100}
                        loading="lazy"
                    />
                </motion.div>

                <motion.div
                    className="w-full z-10 flex justify-center mt-10 mb-10"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1 }}
                >
                    <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                        <Link href={"/dashboard"}>
                            <Button className="rounded-full shadow-md font-semibold mx-auto hover:cursor-pointer">
                                Get Started
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Hero Image */}
            <motion.div
                className="border-b border-dashed dark:border-[#d0d0d0] pb-10 px-4"
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.25, 0.25, 0, 1] }}
            >
                <motion.div
                    className="max-w-4xl rounded-md border border-dashed dark:border-[#d0d0d0] mx-auto drop-shadow-2xl overflow-hidden"
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="w-full flex px-4 items-center justify-between h-10 border-b border-dashed dark:border-[#d0d0d0]">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 bg-primary rounded-full" />
                            <div className="h-3 w-3 bg-primary/75 rounded-full" />
                            <div className="h-3 w-3 bg-primary/50 rounded-full" />
                        </div>
                        <div className="w-[300px] h-6 flex justify-between items-center px-2 bg-card dark:bg-primary/30 text-[#333333] rounded-sm">
                            <span><Lock /></span>
                            <span className="text-sm">https://doksy.site/</span>
                            <RotateCcw className="size-4" />
                        </div>
                        <Copy className="size-4" />
                    </div>
                    <Image
                        src={"/ReadmeToDocs.png"}
                        alt="Hero Image showing README to documentation conversion"
                        width={1000}
                        height={600}
                        className="h-full w-full object-cover overflow-hidden"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                    />
                </motion.div>
            </motion.div>
        </>
    )
}

export default Hero