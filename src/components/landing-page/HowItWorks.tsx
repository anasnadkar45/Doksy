"use client"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const Content = [
  {
    id: 1,
    title: "Connect your GitHub",
    description: "Easily log in with your GitHub account to get started.",
    image: "/ConnectGithub.png",
  },
  {
    id: 2,
    title: "Select a repo / Create a project",
    description: "Choose an existing repository or start a new project for your docs.",
    image: "/SelectRepo.png",
  },
  {
    id: 3,
    title: "Edit your documentation",
    description: "Customize pages, update content, and preview live changes with our editor.",
    image: "/EditDoc.png",
  },
  {
    id: 4,
    title: "Deploy & Publish",
    description: "Publish your documentation instantly on yourproject.doksy.site or connect a custom domain.",
    image: "/Publish.png",
  },
]

const HowItWorks = () => {
  const [isActive, setIsActive] = useState(1)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto flex flex-col md:grid grid-cols-4 gap-6 px-4">
        {/* left side */}
        <motion.div
          className="h-[315px] col-span-2 rounded-md border border-dashed dark:border-[#d0d0d0] shadow"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full bg-[#F5F5F5] rounded-t-md flex px-4 items-center justify-between h-[40px] border-b border-dashed dark:border-[#d0d0d0]">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-primary rounded-full" />
              <div className="h-3 w-3 bg-primary/75 rounded-full" />
              <div className="h-3 w-3 bg-primary/50 rounded-full" />
            </div>
          </div>
          <div className="relative w-full h-[275px] flex justify-center items-center">
            <div
              className="absolute inset-0 z-0 opacity-40 w-full h-full"
              style={{
                backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
                backgroundSize: "10px 10px",
              }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={isActive}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="relative z-20 w-full h-full p-4"
              >
                <div className="relative w-full h-full rounded-xl">
                  <Image
                    src={Content.find((item) => item.id === isActive)?.image || Content[0].image}
                    alt=""
                    fill
                    className="object-contain bg-[#333333] p-2 rounded-xl"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
        {/* right side */}
        <motion.div
          className="w-full col-span-2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.h1
            className="text-3xl font-bold text-[#333333]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            How it works
          </motion.h1>
          <div>
            {Content.map((item, index) => (
              <motion.div
                key={item.id}
                onClick={() => setIsActive(item.id)}
                className="w-full border-b border-dashed dark:border-[#d0d0d0] space-y-2 py-4 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                whileHover={{ x: 4 }}
              >
                <div className="w-full flex justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      className={`w-10 h-10 rounded-md flex items-center justify-center ${isActive === item.id ? "bg-black text-white" : "bg-card"}`}
                      animate={{
                        backgroundColor: isActive === item.id ? "#000000" : "#f8f9fa",
                        color: isActive === item.id ? "#ffffff" : "#000000",
                      }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.id}
                    </motion.div>
                    <h1 className="text-lg font-semibold text-[#333333]">{item.title}</h1>
                  </div>
                  <Button variant={"ghost"}>
                    <motion.div animate={{ rotate: isActive === item.id ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      {isActive === item.id ? <Minus className="text-[#333333]" /> : <Plus className="text-[#333333]" />}
                    </motion.div>
                  </Button>
                </div>
                <AnimatePresence>
                  {isActive === item.id && (
                    <motion.p
                      className="text-sm text-muted-foreground"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.description}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default HowItWorks
