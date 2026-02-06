import React, { useState } from 'react'
import InputCompontent from '../InputCompontent'
import Button from '../Button'

const EditProduct = () => {
  const [close, setClose] = useState(false)
  return (
   <div>
      <div className="flex flex-col items-center justify-center absolute w-150 z-50 bg-white shadow-2xl shadow-neutral-400 left-100 top-50 p-10 rounded-2xl">
        <div className='text-center'>
          <h1 className="text-2xl text-amber-300">
            Please Edit Your Product
          </h1>
          <p className="text-gray-600">
            Edit products with new updates 
          </p>
        </div>

        <div className="mt-5 flex flex-1 flex-col gap-3 w-full">
          <div className="flex flex-1 items-center gap-3 ">
           
            <InputCompontent type='text' placeholder='Product Name' value='' onChange={()=> ('')} />
            <input
              type="text"
              placeholder="Price"
              value={""}
              className="border border-gray-400 p-2 rounded w-full"
            />
          </div>
    </div>

        <div className='mt-5 flex gap-3'>
          <Button text='Edit' className='bg-green-500 cursor-pointer' />
          <Button text='close' className='bg-red-500 text-white cursor-pointer' onClick={() => setClose(!close)} />
        </div>
  </div>
  </div>
  )
}

export default EditProduct