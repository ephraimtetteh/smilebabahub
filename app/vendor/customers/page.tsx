import { assets, Products } from '@/assets/assets'
import InputSearch from '@/components/InputSearch'
import CustomersComponent from '@/components/VendorComponents/CustomersComponent'
import Limit from '@/components/VendorComponents/Limit'
import React from 'react'
import {customers} from '@/constants/data'
import Button from '@/components/Button'

const page = () => {
  return (
    <article className="bg-gray-50 flex flex-col gap-4 py-8 px-8 border-gray-200 border">
      <div className="flex flex-1 items-center justify-between pb-2">
        <div>
          <InputSearch text="Search" />
        </div>
      </div>
      {/* ====== add product component */}
      {customers.map((item) => (
        <CustomersComponent
          key={item.id}
          image={item.image}
          name={item.name}
          email={item.email}
          joined={item.joined}
          spend={item.spend}
          orders={item.orders}
          location={item.location}
          action={<Button text='View' className='text-[8px] px-2' />}
        />
      ))}

      <Limit />
    </article>
  );
}

export default page