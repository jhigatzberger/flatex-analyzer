import { redirect } from "next/navigation";
import LandingPageContent from "./components/landing-page-content";

export default function LandingPage() {
    const showLandingPage = process.env.NEXT_PUBLIC_SHOW_LANDING_PAGE === "true";
    if (!showLandingPage) redirect("/dashboard");

    return <LandingPageContent />
};

