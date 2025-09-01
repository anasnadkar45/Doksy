import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import Rocket from '../../../public/Icons/Rocket'
import { Button } from '../ui/button'

const PromotionCard = () => {
    return (
        <Card className="md:max-w-[250px] h-fit mx-4 md:mr-16 md:mt-16 md:ml-4 flex flex-col items-center justify-center border-dashed text-center">
            <CardHeader className="w-full">
                <Rocket className="size-14 mx-auto" />
                <CardTitle className="text-2xl text-center font-bold text-primary">
                    Supercharge Your Docs
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground text-sm">
                    Turn your README into a beautiful documentation site with <span className="font-semibold">Doksy</span>.
                    Fast, simple, and hosted.
                </p>

                <Button >
                    <a
                        href="https://doksy.site"
                        target="_blank"
                        rel="noopener noreferrer">
                        Try Doksy Free →
                    </a>
                </Button>
            </CardContent>
        </Card>
    )
}

export default PromotionCard