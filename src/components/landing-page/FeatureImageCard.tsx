"use client"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"
import Image from "next/image"
import { motion } from "framer-motion"

export interface FeatureProps {
    id: number
    title: string
    description: string
    image?: string
    icon?: any
}

const FeatureImageCard = ({
    feature,
    className,
    index = 0,
}: { feature: FeatureProps; className?: string; index?: number }) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.25, 0.25, 0, 1],
            }}
            whileHover={{
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" },
            }}
        >
            <Card
                className={`bg-transparent cursor-pointer p-4 dark:border-[#d0d0d0] transition-all duration-300 hover:shadow-lg`}
            >
                {feature.image ? (
                    <motion.div
                        className="relative w-full mx-auto h-[180px] rounded-lg overflow-hidden border dark:border-[#d0d0d0]"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div
                            className="absolute inset-0 z-0"
                            style={{
                                backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px),
            radial-gradient(circle, rgba(51,65,85,0.4) 1px, transparent 1px)
          `,
                                backgroundSize: "20px 20px, 20px 20px, 20px 20px",
                                backgroundPosition: "0 0, 0 0, 0 0",
                            }}
                        />
                        {/* <h1 className="font-bold flex justify-center items-center">Upcomming</h1> */}
                        <Image
                            src={feature.image || "/placeholder.svg"}
                            alt={feature.title}
                            width={400}
                            height={180}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            loading="lazy"
                            className="h-full w-full object-cover opacity-60"
                        />
                    </motion.div>
                ) : (
                    feature.icon && (
                        <motion.div whileHover={{ scale: 1.05, rotate: 5 }} transition={{ duration: 0.3 }}>
                            <feature.icon className="w-10 h-10" />
                        </motion.div>
                    )
                )}
                <CardHeader className="p-0">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 + index * 0.1 }}>
                        <CardTitle className="font-bold text-base text-[#333333]">{feature.title}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">{feature.description}</CardDescription>
                    </motion.div>
                </CardHeader>
            </Card>
        </motion.div>
    )
}

export default FeatureImageCard
