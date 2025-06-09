import { redirect } from "next/navigation";
import LandingPageContent from "./components/landing-page-content";

function getShowLandingPage() { return process.env.SHOW_LANDING_PAGE === "true"; }

export default function LandingPage() {
    if (!getShowLandingPage()) redirect("/dashboard");

    return <LandingPageContent />
};

