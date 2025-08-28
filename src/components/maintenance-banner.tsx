import { Alert, AlertDescription } from "@/components/ui/alert"
import Maintenance from "../../public/Icons/Maintenance"

export function MaintenanceBanner() {
    return (
        <Alert className="w-full border-amber-200 bg-amber-100 border-b border-x-0 border-t-0 border-dashed mb-0 rounded-none flex justify-center items-center">
            <Maintenance className="h-4 w-4 text-amber-600 " />
            <AlertDescription className="text-center w-fit">
                <div className="text-amber-800">
                    <span className="text-balance font-semibold">
                        Thanks for the amazing response! We're quickly upgrading our servers to handle the traffic. Doksy will be
                        back online shortly.
                    </span>
                </div>
            </AlertDescription>
            <Maintenance className="h-4 w-4 text-amber-600 " />
        </Alert>
    )
}
