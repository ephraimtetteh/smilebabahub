'use client'

import FeaturedCard from '@/src/components/FeaturedCard';
import NewLayout from '@/src/components/NewLayout';
import { Products } from '@/src/constants/data';




const RealEstate = () => {

  const restate = Products.filter((item) => item.category === "apartment");
return (
  <div className="w-full flex flex-col items-center mt-20 px-4">
    <div className="py-10 w-full max-w-7xl">
      <NewLayout />
    </div>

    <div className="w-full max-w-7xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {restate.length === 0 ? (
        <p className="text-gray-500 col-span-full text-center">
          No products found
        </p>
      ) : (
        restate.map((item, index) => (
          <FeaturedCard key={item.id} item={item} index={index} />
        ))
      )}
    </div>
  </div>
);
    }
export default RealEstate


