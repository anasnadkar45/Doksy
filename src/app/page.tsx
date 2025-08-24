"use client"
import LoginForm from "@/components/auth/LoginForm"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import Bolt from "../../public/Icons/Bolt"
import DuplicatePlus from "../../public/Icons/Plus2"
import { Changa_One } from "next/font/google"
import { authClient } from "./lib/auth-client"
const changa = Changa_One({ weight: "400", subsets: ["latin"] });

import Hero from './../../public/Hero.png'
import { Clipboard, Copy, RotateCcw } from "lucide-react"
import Lock from "../../public/Icons/Lock"

export default function HomePage() {
  const { data: session } = authClient.useSession()
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl min-h-screen h-full space-y-10 border-x border-dashed mx-auto">
        {/* header */}
        <div className="w-full flex justify-between items-center border-b border-dashed px-6 py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Image src={'/Logo.svg'} alt='Doksy' width={40} height={40} />
            <h1 className="ml-2 text-xl font-bold">Doksy</h1>
          </div>
          {session?.user ? (
            <Link href={'/dashboard'} className={buttonVariants({
              variant: "default"
            })}>My Account</Link>
          ) : (<LoginForm />)}
        </div>

        {/* hero section */}
        <div className="relative flex flex-col justify-center items-center p-4 border-b border-dashed">
          {/* cta pill */}
          <div className="w-fit z-10 mx-auto px-4 py-1 text-sm font-bold flex items-center gap-4 border rounded-2xl shadow-md cursor-pointer hover:bg-card transition-all duration-200">
            <Bolt className="size-6" />
            <span>Generate Docs Now</span>
            <DuplicatePlus className="size-6" />
          </div>

          {/* heading */}
          <h1 className={`${changa.className} mt-16 z-10 text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold max-w-[630px] mx-auto text-center leading-tight`}>
            Turn Your GitHub README into <br className="hidden sm:block" />
            Beautiful{" "}
            <span className="relative inline-block">
              Documentation
              <svg
                className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                {/* First wavy line */}
                <path
                  d="M2 4C25 2 50 1 75 3C100 5 125 7 150 5C175 3 200 1 225 3C250 5 275 7 298 5"
                  stroke="#cdcdcd"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Second wavy line with different curve */}
                <path
                  d="M2 8C25 6 50 5 75 7C100 9 125 11 150 9C175 7 200 5 225 7C250 9 275 11 298 "
                  stroke="#cdcdcd"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
            — <br className="block sm:hidden" />
            Instantly.
          </h1>

          <p className="mt-7 text-sm z-10 text-muted-foreground text-center max-w-md mx-auto">Doksy helps developers and teams transform their README files into stunning, multi-page documentation websites in just a few clicks.</p>

          <Image src={'/sparkel.svg'} alt="sparkels" className="absolute z-0 top-10 left-20" width={100} height={100} />
          <Image src={'/sparkel.svg'} alt="sparkels" className="absolute z-0 top-60 right-20" width={100} height={100} />

          <div className="w-full z-10 flex justify-center mt-10 mb-10">
            <Button variant={"secondary"} className="rounded-full shadow-md font-semibold mx-auto">
              Get Starter
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="max-w-4xl h-fit rounded-md border border-dashed mx-auto drop-shadow-2xl ">
          <div className="w-full flex px-4 items-center justify-between h-10 border-b border-dashed">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-primary rounded-full" />
              <div className="h-3 w-3 bg-primary/75 rounded-full" />
              <div className="h-3 w-3 bg-primary/50 rounded-full" />
            </div>
            <div className="w-[300px] h-6 flex justify-between items-center px-2 bg-card rounded-sm">
              <Lock className="size-4"/>
              <span className="text-sm">https://doksy.site/</span>
              <RotateCcw className="size-4"/>
            </div>

            <Copy className="size-4"/>
          </div>
          <Image src={Hero} alt="Hero Image" width={1000} height={1000} className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  )
}
