import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import ProductGrid from "../components/ProductGrid";
import "../styles/globals.css"
import ReviewSlider from "@/components/ReviewSlider";

export default function Home() {
  return (
    <>
      <Hero />
      {/* <CategorySection /> */}
      <ProductGrid />
      <ReviewSlider />
    </>
  );
}
