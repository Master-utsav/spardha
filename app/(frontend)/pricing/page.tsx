"use client";

import Navbar from "@/components/Navbar";
import PricingPage from "@/components/PricingPageComponent";

export default function PricingSelectionPage(){
    return (
        <>
        <Navbar/>
        <div className="max-w-7xl mx-auto py-24 rounded-lg">
            <PricingPage/>
        </div>
        </>
    )
}