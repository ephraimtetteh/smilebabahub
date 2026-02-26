import Cards from '@/src/components/VendorComponents/Cards'
import SalesOverview from '@/src/components/VendorComponents/SalesOverview'
import TopSellingProduct from '@/src/components/VendorComponents/TopSellingProduct'
import React from 'react'

const page = () => {
  return (
    <div className="px-6">
      <Cards />
      <div className="flex flex-1 flex-row items-center gap-4">
        <SalesOverview />
      </div>
      <div className="flex flex-1 flex-row items-center gap-4">
        <TopSellingProduct />
      </div>
    </div>
  );
}

export default page