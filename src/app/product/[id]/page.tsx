"use client";

import { Products } from "@/src/assets/assets";
import Button from "@/src/components/Button";
import FeaturedProducts from "@/src/components/FeaturedProducts";
import Image from "next/image";
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
import { ApartmentDetails, FoodDetails, MarketplaceDetails, Product, ProductProps } from "@/src/types/types";
import { products } from "@/src/utils/data/generateProducts";

const ProductDetails = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);

  const [product, setProduct] = useState<ProductProps>();
  const [callRequest, setCallRequest] = useState(false);
  const [phone, setPhone] = useState(false);
  const [chatRoom, setChatRoom] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mainImage, setMainImage] = useState<string | null>(null);

  // useEffect(() => {
  //   const foundProduct = Products.find((product) => product.id === Number(id));
  //   console.log(foundProduct);
  //   setProduct(foundProduct);
  // }, [id]);

  useEffect(() => {
    const foundProduct = products.find((room) => room.id === id);

    if (!foundProduct) return;

    setProduct(foundProduct);
    setMainImage(foundProduct.images?.[0]);
  }, [id]);

  if (!product) {
    return <div className="pt-40 text-center">Loading product...</div>;
  }

  return (
    product && (
      <div className=" py-10 flex flex-col flex-1 items-center justify-center lg:justify-between bg-white pt-30">
        <div className="lg:flex lg:flex-row items-start justify-center px-4 md:px-16 lg:px-14 xl:px-22 gap-3">
          {/* main card items details */}
          <div className="lg:w-[80%]">
            <h1 className="lg:text-3xl font-semibold py-2 pb-6 capitalize">
              {product?.title ?? "Product image"}
            </h1>
            <div className="rounded items-center justify-center w-full">
              <Image
                src={mainImage || product?.images[0]}
                alt="room image"
                width={600}
                height={400}
                className="w-full rounded-xl shadow-lg object-cover"
              />
              <div className="flex flex-col lg:flex-row mt-6 gap-6">
                {/* <div className="lg:w-1/2 w-full">
                <Image
                  src={mainImage}
                  alt="room image"
                  className="w-full rounded-xl shadow-lg object-cover"
                />
              </div> */}
                <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
                  {product?.images?.length > 1 &&
                    product.images.map((image, index) => (
                      <Image
                        onClick={() => setMainImage(image)}
                        key={index}
                        src={image}
                        alt="room image"
                        width={200}
                        height={150}
                        className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                          mainImage === image && "outline-3 outline-orange-300"
                        }`}
                      />
                    ))}
                </div>
              </div>
              <Card />
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
                <p> {product?.category}</p>
                <p>{product?.subCategory}</p>
                <div>
                  {product.category === "apartment" && (
                    <div>
                      <p>{(product.details as ApartmentDetails)?.bedrooms} Rooms</p>
                      <p>{(product.details as ApartmentDetails)?.furnished}</p>
                      <p>{(product.details as ApartmentDetails)?.propertyType}</p>
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
                      <p>{(product.details as MarketplaceDetails)?.condition}</p>
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
          <aside className="">
            {/* price card */}
            <article className="bg-white shadow p-3 mb-4">
              <h1 className="font-semibold text-2xl py-2">GH 185,00.00</h1>
              <p className="shadow bg-white/10 w-fit px-2  rounded-full border border-gray-200">
                price history
              </p>
              <p className="py-2 shadow bg-white/10 w-fit px-2  rounded-full border border-gray-200 my-4 text-[16px]">
                Market Price <span>GH 280K ~ 220k</span>
              </p>
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

              <Link href={"/history"} className="flex gap-4">
                <Profile />
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
                {safetyTips.map((list) => (
                  <li key={list.length}>{list}</li>
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
