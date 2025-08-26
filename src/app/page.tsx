"use client"
import { Button, buttonVariants } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Changa_One } from "next/font/google"
import { Copy, RotateCcw } from "lucide-react"
import FeatureImageCard, { type FeatureProps } from "@/components/landing-page/FeatureImageCard"
import HowItWorks from "@/components/landing-page/HowItWorks"
import { motion } from "framer-motion"
import Footer from "@/components/landing-page/Footer"
import GlobePointer from "../../public/Icons/Globe"
import { ModeToggle } from "@/components/ModeToggle"
import LoginForm from "@/components/auth/LoginForm"
import { authClient } from "./lib/auth-client"
import Bolt from "../../public/Icons/Bolt"
import Rocket from "../../public/Icons/Rocket"
import Lock from "../../public/Icons/Lock"
import Github from "../../public/Icons/Github"

const changa = Changa_One({ weight: "400", subsets: ["latin"] })

const Features = [
  {
    id: 0,
    title: "One-click README to Docs",
    description: "Instantly convert your GitHub README into a multi-page documentation site.",
    image: "/ReadmeToDocs.png",
  },
  {
    id: 1,
    title: "Live Preview Editor",
    description: "Edit your documentation with real-time preview and instant updates.",
    image: "",
    icon: GlobePointer
  },
  {
    id: 2,
    title: "Custom Domain Support Upcoming",
    description: "Host your docs on yourproject.doksy.site domain.",
    image: "/og-image.png",
  },
  {
    id: 3,
    title: "GitHub Integration",
    description: "Seamlessly sync with your GitHub repositories.",
    image: "",
    icon: Github
  },
]

export default function Home() {
  const { data: session } = authClient.useSession()
  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-5xl min-h-screen h-full space-y-10 border-x border-dashed dark:border-[#d0d0d0] mx-auto">
        <motion.div
          className="w-full flex justify-between items-center border-b border-dashed dark:border-[#d0d0d0] px-6 py-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Logo */}
          <motion.div className="flex items-center" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <Image src={"/Logo.svg"} alt="Doksy" width={40} height={40} />
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

        <div className="relative flex flex-col justify-center items-center p-4 border-b border-dashed dark:border-[#d0d0d0]">
          {/* cta pill */}
          <motion.a
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            href="https://www.producthunt.com/products/doksy?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-doksy" target="_blank">
            <Image src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1009132&theme=dark&t=1756230338366" alt="Doksy - Turn&#0032;your&#0032;readme&#0032;into&#0032;beautiful&#0032;documentation&#0032;website | Product Hunt" width="250" height="54" />
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
              src={"/og-image.png"}
              alt="Hero Image"
              width={1000}
              height={600}
              className="h-full w-full object-cover overflow-hidden"
            />
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          className="border-b border-dashed dark:border-[#d0d0d0] px-4 pb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
              className="space-y-1"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-center text-[#333333] text-xl md:text-2xl font-semibold">
                Smart features for professional docs
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground text-center max-w-2xl mx-auto">
                Doksy gives you everything you need to transform plain README files into clean, structured, and
                shareable documentation sites — instantly.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-3 sm:grid-rows-2 gap-6">
              <FeatureImageCard key={Features[0].id} feature={Features[0] as FeatureProps} className="row-span-2" />
              <FeatureImageCard key={Features[1].id} feature={Features[1] as FeatureProps} className="row-span-1" />
              <FeatureImageCard key={Features[2].id} feature={Features[2] as FeatureProps} className="row-span-2" />
              <FeatureImageCard key={Features[3].id} feature={Features[3] as FeatureProps} className="row-span-1" />
            </div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <HowItWorks />
        </motion.div>

        <Footer />
      </div>
    </motion.div>
  )
}
