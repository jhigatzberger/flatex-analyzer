import { redirect } from "next/navigation";
import LandingPageContent from "./components/landing-page-content";

const SHOW_LANDING_PAGE = process.env.SHOW_LANDING_PAGE === "true";

export default function LandingPage() {
    if (!SHOW_LANDING_PAGE) redirect("/dashboard");

    return <LandingPageContent />
};

