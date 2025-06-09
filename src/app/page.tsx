import { redirect } from "next/navigation";
import LandingPageContent from "./components/landing-page-content";

export default function LandingPage() {
    if (!process.env.SHOW_LANDING_PAGE) redirect("/dashboard");

    return <LandingPageContent />
};

