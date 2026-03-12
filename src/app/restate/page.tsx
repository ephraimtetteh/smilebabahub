'use client'

import FeaturedCard from '@/src/components/FeaturedCard';
import NewLayout from '@/src/components/NewLayout';
import { products } from '@/src/utils/data/generateProducts';




const RealEstate = () => {

  const restate = products.filter((item) => item.category === "apartment");
return (
  <div className="w-full flex flex-col justify-center items-center mt-20">
    <div className="py-10">
      <NewLayout />
    </div>

    <div
      className="flex flex-1 flex-wrap items-center justify-center gap-4"
      style={{ maxWidth: "100%" }}
    >
      {restate.length > 0 &&
        restate.map((item, index) => (
          <FeaturedCard key={item.id} item={item} index={index} />
        ))}
    </div>
  </div>
);
    }
export default RealEstate


