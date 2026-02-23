"use client";

import { Products } from "@/assets/assets";
import Button from "@/components/Button";
import FeaturedProducts from "@/components/FeaturedProducts";
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
import AsideCard from "@/components/AsideCard";
import Card from "@/components/Card";
import { safetyTips } from "@/constants/safetyTips";
import Socials from "@/components/Socials";
import { MdOutlineLocalOffer } from "react-icons/md";
import RelatedAds from "@/components/FoodComponent";
import ChatRoom from "@/components/ChatRoom";
import Offer from "@/components/Offer";
import Profile from "@/components/Profile";
import { Product } from "@/types/types";

const page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);

  const [product, setProduct] = useState<Product>();
  const [callRequest, setCallRequest] = useState(false);
  const [phone, setPhone] = useState(false);
  const [chatRoom, setChatRoom] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const foundProduct = Products.find((product) => product.id === Number(id));
    console.log(foundProduct);
    setProduct(foundProduct);
  }, [id]);

  return (
    <div className=" py-10 flex flex-col flex-1 items-center justify-center lg:justify-between bg-white pt-30">
      <div className="lg:flex lg:flex-row items-start justify-center px-4 md:px-16 lg:px-14 xl:px-22 gap-3">
        {/* main card items details */}
        <div className="lg:w-[80%]">
          <h1 className="lg:text-2xl font-bold py-2 pb-6 capitalize">
            {product?.title ?? "Product image"}
          </h1>
          <div className="rounded items-center justify-center w-full">
            {product?.image && (
              <Image
                src={product.image}
                alt={product.title ?? "Product image"}
                width={400}
                height={400}
                className="w-full"
              />
            )}
            <Card />
          </div>
          {/* ====== product description */}
          <div className="grid gap-3 bg-white p-10 mb-4">
            <h4 className="text-2xl">Product Description</h4>
            <p className="py-1">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
              neque nobis molestiae, totam tempora, iure blanditiis, perferendis
              cumque distinctio atque vel nisi adipisci! Ipsa perspiciatis
              quibusdam dolorum rem obcaecati iste.
            </p>
            <p className="py-1">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero
              neque nobis molestiae, totam tempora, iure blanditiis, perferendis
              cumque distinctio atque vel nisi adipisci! Ipsa perspiciatis
              quibusdam dolorum rem obcaecati iste.
            </p>
          </div>
          {/* ====== store details */}
          <div className="grid gap-3 bg-white p-10">
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
              </div>
            </div>
            <small className="py-1">
              <p>Neat Honda civic,2018</p>
              <p> Edition Automatic</p>
              <p>transmission With cold Aircondition</p>
              <p>
                Sunroof open top In excellent condition with genuine documents
              </p>
              <p>attached Swap accepted</p>
            </small>

            <Socials />
            <div>
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
  );
};

export default page;
