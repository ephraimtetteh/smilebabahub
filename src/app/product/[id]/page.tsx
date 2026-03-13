"use client";

import Button from "@/src/components/Button";
import FeaturedProducts from "@/src/components/FeaturedProducts";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  IoCallOutline,
  IoChatboxEllipsesOutline,
  IoCloseOutline,
} from "react-icons/io5";
import {
  FaRegMessage,
  FaAngleRight,
  FaRegWindowRestore,
} from "react-icons/fa6";
import AsideCard from "@/src/components/AsideCard";
import Card from "@/src/components/Card";
import { safetyTips } from "@/src/constants/safetyTips";
import Socials from "@/src/components/Socials";
import { MdOutlineLocalOffer } from "react-icons/md";
import RelatedAds from "@/src/components/FoodComponent";
import ChatRoom from "@/src/components/ChatRoom";
import Offer from "@/src/components/Offer";
import Profile from "@/src/components/Profile";
import { ApartmentDetails, FoodDetails, MarketplaceDetails, ProductProps } from "@/src/types/types";
import { Products } from "@/src/constants/data";

const ProductDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);

  const [product, setProduct] = useState<ProductProps>();
  const [callRequest, setCallRequest] = useState(false);
  const [phone, setPhone] = useState(false);
  const [chatRoom, setChatRoom] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mainImage, setMainImage] = useState<string | StaticImageData | null>(null);

  // useEffect(() => {
  //   const foundProduct = Products.find((product) => product.id === Number(id));
  //   console.log(foundProduct);
  //   setProduct(foundProduct);
  // }, [id]);

  useEffect(() => {
    const foundProduct = Products.find((room) => room.id === id);

    if (!foundProduct) return;

    setProduct(foundProduct);
    setMainImage(foundProduct.images?.[0]);
  }, [id]);

  if (!product) {
    return <div className="pt-40 text-center">Loading product...</div>;
  }

  return (
    product && (
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
          {/* main card items details */}
          <div className="lg:w-[80%]">
            <h1 className="lg:text-3xl font-semibold py-2 pb-6 capitalize">
              {product?.title ?? "Product image"}
            </h1>
            <div className="flex flex-col lg:flex-row mt-6 gap-6">
              <div className="lg:w-1/2 w-full">
                <Image
                  src={mainImage || product.images[0]}
                  alt={product.title}
                  width={800}
                  height={600}
                  className="w-full rounded-xl shadow-lg object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
                {product.images?.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={product.title}
                    width={220}
                    height={200}
                    onClick={() => setMainImage(image)}
                    className={`cursor-pointer rounded-lg object-cover ${
                      mainImage === image ? "ring-2 ring-orange-400" : ""
                    }`}
                  />
                ))}
              </div>
            </div>
            {/* ====== product description */}
            <div className="grid gap-3 bg-white py-10 mb-4">
              <h4 className="text-2xl">Product Description</h4>
              <p className="py-1">{product.description}</p>
            </div>
            {/* ====== store details */}
            <div className="grid gap-3 bg-white py-10">
              <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <FaRegWindowRestore fill="#ffc105" />
                  <h4 className="text-2xl">Store Details</h4>
                </div>
                <div>
                  <Button
                    text="Show Contact"
                    icon={<IoCallOutline />}
                    className="w-full flex items-center gap-2"
                  />
                  <p>{product.location?.city}</p>
                  <p>{product.location?.state}</p>
                  <p>{product.seller?.name}</p>
                </div>
              </div>
              <small className="py-1">
                <p>{product?.title}</p>
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                  {product.category}
                </span>
                <p>{product?.subCategory}</p>
                <div>
                  {product.category === "apartment" && (
                    <div>
                      <p>
                        {(product.details as ApartmentDetails)?.bedrooms} Rooms
                      </p>
                      <p>{(product.details as ApartmentDetails)?.furnished}</p>
                      <p>
                        {(product.details as ApartmentDetails)?.propertyType}
                      </p>
                      <p>{(product.details as ApartmentDetails)?.size}</p>
                      <p>{(product.details as ApartmentDetails)?.parking}</p>
                    </div>
                  )}

                  {product.category === "food" && (
                    <div>
                      <p>{(product.details as FoodDetails)?.restaurantName}</p>
                      <p>{(product.details as FoodDetails)?.ingredients}</p>
                      <p>{(product.details as FoodDetails)?.isVegetarian}</p>
                      <p>{(product.details as FoodDetails)?.preparationTime}</p>
                    </div>
                  )}

                  {product.category === "marketplace" && (
                    <div>
                      <p>
                        {(product.details as MarketplaceDetails)?.condition}
                      </p>
                      <p>{(product.details as MarketplaceDetails)?.brand}</p>
                      <p>{(product.details as MarketplaceDetails)?.warranty}</p>
                      <p>{(product.details as MarketplaceDetails)?.warranty}</p>
                    </div>
                  )}
                </div>
                <p>{product?.rating}</p>
                <p>attached Swap accepted</p>
              </small>

              <Socials />
              <div className="flex items-center gap-4">
                {!isOpen ? (
                  <Button
                    text="Make an offer"
                    icon={<MdOutlineLocalOffer />}
                    className="w-full flex items-center gap-2"
                    onClick={() => setIsOpen((prev) => !prev)}
                  />
                ) : (
                  <Offer onClose={() => setIsOpen((prev) => !prev)} />
                )}

                <Button text="Buy" />
              </div>
            </div>
          </div>

          {/* side bar */}
          <aside className="lg:w-[360px] w-full">
            {/* price card */}
            <article className="bg-white shadow p-3 mb-4">
              <h1 className="font-semibold text-2xl py-2">
                GH {product.price?.toLocaleString()}
              </h1>
              <div>
                {!callRequest && (
                  <Button
                    text="Request a call back"
                    className="bg-transparent border border-[#ffc105] w-full"
                    onClick={() => setCallRequest((prev) => !prev)}
                  />
                )}

                {callRequest && (
                  <div className="flex flex-col  py-4">
                    <p className="py-2 text-gray-400">
                      Your name and Phone number
                    </p>
                    <div className="flex flex-col gap-4 w-full">
                      <input
                        type="text"
                        name="name"
                        placeholder="name"
                        className="p-3 border border-gray-300 rounded"
                      />
                      <input
                        type="text"
                        name="phone"
                        placeholder="phone number"
                        className="p-3 border border-gray-300 rounded"
                      />
                    </div>
                    <Button
                      text="Request a call back"
                      className="mt-2 bg-transparent border border-[#ffc105] w-full"
                      onClick={() => setCallRequest((prev) => !prev)}
                    />
                  </div>
                )}
              </div>
            </article>

            {/* price card */}
            <article className="bg-white shadow p-3 mb-4">
              <h1 className="font-semibold text-2xl py-2">Seller Details</h1>

              <Link href={`/seller/${product.seller.id}`}>
                <Profile item={product} />
              </Link>

              <div className="grid gap-2">
                {
                  <Button
                    text={phone ? "0987654321" : "Show Contact"}
                    icon={<IoCallOutline />}
                    className="w-full flex items-center gap-2"
                    onClick={() => setPhone((prev) => !prev)}
                  />
                }

                {!chatRoom ? (
                  <Button
                    text="Start a Chat"
                    icon={<IoChatboxEllipsesOutline />}
                    className="bg-transparent border border-[#ffc105] w-full flex items-center gap-2"
                    onClick={() => setChatRoom((prev) => !prev)}
                  />
                ) : (
                  <ChatRoom
                    icon={<IoCloseOutline />}
                    onClose={() => setChatRoom(false)}
                  />
                )}
              </div>
            </article>

            <article className="bg-white shadow p-3 mb-4">
              <AsideCard
                href={"/comments"}
                count={0}
                text={"Comments"}
                iconText="View"
                icon={<FaAngleRight />}
              />
            </article>

            <article className="bg-white shadow p-3 mb-4">
              <h4 className="text-center font-bold">Safety Tips</h4>
              <p className="px-3">
                {safetyTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </p>
            </article>
          </aside>
        </div>

        <div className="mt-4 w-full">
          <FeaturedProducts />
          <RelatedAds />
        </div>
      </div>
    )
  );
};

export default ProductDetails;
