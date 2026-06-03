import type { Metadata } from "next";
import dynamic from "next/dynamic";

import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SearchSection from "@/components/home/SearchSection";

const PromoSlider = dynamic(
  () => import("@/components/home/PromoSlider")
);

const CategoryGrid = dynamic(
  () => import("@/components/home/CategoryGrid")
);

const FeaturedBusinesses = dynamic(
  () => import("@/components/home/FeaturedBusinesses")
);

export const metadata: Metadata = {
  title: "FindIndia - Discover Trusted Local Businesses",
  description:
    "Find verified businesses, shops, restaurants and local services across India.",
};

export default function HomePage() {
  return (
    <>
      <TopBar />
      <Navbar />

      <main>
        <SearchSection />
        <PromoSlider />
        <CategoryGrid />
        <FeaturedBusinesses />
      </main>

      <Footer />
    </>
  );
}