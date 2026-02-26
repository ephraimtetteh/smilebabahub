import { AiOutlineCustomerService } from "react-icons/ai";
import {
  MdOutlineDashboard,
  MdOutlineShoppingCart,
  MdOutlineAttachMoney,
  MdOutlineMessage,
} from "react-icons/md";
import { RiAlignItemLeftLine } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";


export const sideBarTabs = [
  { name: "Dashboard", icon: <MdOutlineDashboard />, link: "/vendor" },
  { name: "Products", icon: <RiAlignItemLeftLine />, link: "/vendor/products" },
  { name: "Orders", icon: <MdOutlineShoppingCart />, link: "/vendor/orders" },
  // { name: "Earnings", icon: <MdOutlineAttachMoney />, link: "/vendor/earnings" },
  {
    name: "Customers",
    icon: <AiOutlineCustomerService />,
    link: "/vendor/customers",
  },
  { name: "Settings", icon: <IoSettingsOutline />, link: "/vendor/settings" },
  {
    name: "Notification",
    icon: <MdOutlineMessage />,
    link: "/vendor/notifications",
  },
];