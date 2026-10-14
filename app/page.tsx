import Hero from "@/components/Hero";
import NewCollectionsRow from "@/components/NewCollectionsRow";
import TrustStrip from "@/components/TrustStrip";
import Proprietor from "@/components/Proprietor";
import ShopByCategory from "@/components/ShopByCategory";
import BestSellers from "@/components/BestSellers";
import BottomStrip from "@/components/BottomStrip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <NewCollectionsRow />
      <TrustStrip />
      <Proprietor />
      <ShopByCategory />
      <BestSellers />
      <BottomStrip />
    </>
  );
}
