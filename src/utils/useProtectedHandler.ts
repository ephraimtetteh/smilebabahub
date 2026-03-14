"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "../app/redux";


export const useProtectedAction = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const protect = (callback?: () => void) => {
    if (!user) {
      const currentPath = window.location.pathname;

      localStorage.setItem("redirectAfterLogin", currentPath);

      router.push("/login");
      return;
    }

    if (callback) callback();
  };

  return protect;
};

// const protect = useProtectedAction();

// <button
//   onClick={() =>
//     protect(() => {
//       dispatch(addToCart(product));
//     })
//   }
// >
//   Add to Cart
// </button>


// <button
//   onClick={() =>
//     protect(() => {
//       router.push(`/booking/${apartment.id}`);
//     })
//   }
// >
//   Book Now
// </button>