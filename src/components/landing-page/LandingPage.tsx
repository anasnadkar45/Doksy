"use client"
import FeatureImageCard, { type FeatureProps } from "@/components/landing-page/FeatureImageCard"
import HowItWorks from "@/components/landing-page/HowItWorks"
import { motion } from "framer-motion"
import Footer from "@/components/landing-page/Footer"
import Hero from "./Hero"
import Header from "./Header"
import { MaintenanceBanner } from "../maintenance-banner"

const LandingPage = () => {
    return (
        <motion.div
            className="min-h-screen bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-5xl min-h-screen h-full space-y-10 border-x border-dashed dark:border-[#d0d0d0] mx-auto">
                <MaintenanceBanner />
                <Header />
                <Hero />
                <HowItWorks />
                <Footer />
            </div>
        </motion.div>
    )
}

export default LandingPage