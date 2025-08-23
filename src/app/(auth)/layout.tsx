import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, MoveLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center">
            <Link href={'/'} className={buttonVariants({
                variant: "outline",
                className: 'absolute top-4 left-4'
            })}>
                <ArrowLeft />
                <span>Back</span>
            </Link>
            <div className="flex flex-col w-full gap-6">
                {children}
            </div>
        </div>
    )
}