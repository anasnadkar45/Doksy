import arcjet, {
    shield,
    detectBot,
    fixedWindow,
    protectSignup,
    sensitiveInfo,
    slidingWindow,
} from "@arcjet/next";
import { env } from "./env";

export {
    shield,
    detectBot,
    fixedWindow,
    protectSignup,
    sensitiveInfo,
    slidingWindow,
};

export default arcjet({
    key: env.ARCJET_KEY!,
    characteristics: ["fingerprint"],
    rules: [
        // Protect against common attacks with Arcjet Shield
        shield({
            mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
        }),
    ],
})