import React from 'react'
import GlobePointer from "../../../public/Icons/Globe"
import Github from "../../../public/Icons/Github"
import FeatureImageCard, { FeatureProps } from './FeatureImageCard'
import { motion } from "framer-motion"

const Data = [
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

const Features = () => {
    return (
        <>
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
                        <FeatureImageCard key={Data[0].id} feature={Data[0] as FeatureProps} className="row-span-2" />
                        <FeatureImageCard key={Data[1].id} feature={Data[1] as FeatureProps} className="row-span-1" />
                        <FeatureImageCard key={Data[2].id} feature={Data[2] as FeatureProps} className="row-span-2" />
                        <FeatureImageCard key={Data[3].id} feature={Data[3] as FeatureProps} className="row-span-1" />
                    </div>
                </div>
            </motion.div>
        </>
    )
}

export default Features