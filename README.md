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



https://video2.getstreamhosting.com:2020/controller/Widgets/495

const Radios = ()  => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setPlaying(!playing);
  };

  return (
    <div className="p-6 bg-amber-950 rounded-xl text-white">
      <h2 className="text-xl mb-4">
        SmileBaba <span className="text-yellow-400">Radio</span>
      </h2>

      <button
        onClick={togglePlay}
        className="bg-yellow-500 text-black px-4 py-2 rounded-lg"
      >
        {playing ? "Stop Listening" : "Start Listening"}
      </button>

      <audio ref={audioRef} preload="none">
        <source
          src="https://video2.getstreamhosting.com:2020/stream"
          type="audio/mpeg"
        />
      </audio>
    </div>
  );
}

const RadioComponent = () => {
  const [error, setError] = useState()
  useEffect(() => {
    // If the widget needs manual initialization,
    // you can call it here after script loads.
  }, []);

  return (
    <div className="px-4 md:px-16 lg:px-14 xl:px-12">
      {/* Load GetStreamHosting widget */}
      <Script
        src="https://video2.getstreamhosting.com:2020/dist/widgets.js"
        strategy="afterInteractive"
      />

      <div className="bg-amber-950 border-2 border-[#d8a304] rounded-2xl p-4 text-white mt-4">
        <h3 className="text-center text-2xl font-semibold">
          SmileBaba <span className="text-[#ffc105]">Radio</span>
        </h3>

        {/* This div is IMPORTANT */}
        <div
          id="gshoutcast-widget"
          data-type="audio"
          data-public-url="https://video2.getstreamhosting.com:2020/AudioPlayer/8244?mount=/stream&"
        />
      </div>

      <div className="p-6 bg-amber-950 rounded-xl text-white">
        <h2 className="text-xl mb-4">
          SmileBaba <span className="text-yellow-400">Radio</span>
        </h2>

        <audio
          controls
          preload="none"
          className="w-full"
          onError={() => setError(true)}
        >
          <source
            src="https://video2.getstreamhosting.com:2020/AudioPlayer/8244?mount=/stream&"
            type="audio/mpeg"
          />
        </audio>

        {error && <p className="text-red-400 mt-2">Stream failed to load.</p>}
      </div>
    </div>
  );
}


  {/* <select
            name="category"
            required
            className="border-gray-300 w-full sm:w-125 border p-4 rounded mb-4 outline-none"
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select Category</option>

            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select> */}




          {/* <select
            name="categoryType"
            required
            disabled={!selectedCategory}
            className="border-gray-300 w-full sm:w-125 border px-4 py-3 rounded mb-4 outline-none"
          >
            <option value="">Select Category Type</option>

            {selectedCategory?.children?.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select> */}