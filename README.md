This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



color tokens 
primary colors: #ffc107
deep black: #0b0b0b
pure white: #fffff
gray text: #8a8a8a
input bg light: #f5f5f5
input bg dark: #1c1c1c


cta 
background: 121212
radius: 16


https://www.ghanapostgps.com/regions-and-district-codes/


  // const fetachProduct = async () => {
  //   for(let i=0; i < Products.length; i++){
  //     if (id === Products.[i].id){
  //       setProduct(Products[i])
  //     }
  //   }
  // }






  "use client";

import { Products } from "@/assets/assets";
import Image from "next/image";
import { useEffect, useState } from "react";

type ProductProps = {
  params: {
    id: string;
  };
};

type Product = {
  id: number;
  title: string;
  description: string;
  image: StaticImageData;
  date: number;
  category: string;
  author: string;
  author_img: StaticImageData;
  price: number;
};

const Page = ({ params }: ProductProps) => {
  const { id } = params;

  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    const foundProduct = Products.find((item) => item.id === Number(id));
    console.log(foundProduct);
  
    
    if (foundProduct) {
      setProduct(foundProduct ?? null);
      setMainImage(foundProduct.image );
    }
  }, [id]);

  if (!product) return null;

  return (
    <div>
      <div className="text-center my-24">
        <h1 className="text-2xl sm:text-5xl font-semibold max-w-175 mx-auto">
          {product.title}
        </h1>
        <Image
          src={product.author_img}
          width={60}
          height={60}
          alt=""
          className="mx-auto mt-6 border border-white rounded-full"
        />
        <p className="mt-1 pb-2 text-lg max-w-185 mx-auto">{product.author}</p>
      </div>

      {mainImage && <Image src={mainImage} alt="product" className="w-64" />}
    </div>
  );
};

export default Page;


## colors
===== ffc10529
# smilebabaMarketPlace
smileBabaMarketPlace



dispatch(addToCart(product));
dispatch(calculateTotals());


dispatch(increaseCartItem(productId));
dispatch(decreaseCartItem(productId));
dispatch(calculateTotals());


dispatch(setLogoutState());
dispatch(clearCart());


export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;

export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartAmount = (state) => state.cart.amount;
