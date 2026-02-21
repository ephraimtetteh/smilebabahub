import profileImg from "../assets/profile_icon.png";

import burgerOne from "@/assets/images/burger-one.png";
import burgerTwo from "@/assets/images/burger-two.png";
import buritto from "@/assets/images/buritto.png";
import pizzaOne from "@/assets/images/pizza-one.png";
import newYork from "@/assets/images/new-york.png";
import japan from "@/assets/images/japan.png";

export const customers = [
  {
    id: 1,
    image: profileImg,
    name: "ephraim ephraim",
    email: "ephraim@gmail.com",
    orders: 453,
    spend: "$56746",
    joined: new Date().toLocaleDateString(),
    location: "Ghana",
  },
  {
    id: 2,
    image: profileImg,
    name: "ephraim ephraim",
    email: "ephraim@gmail.com",
    orders: 453,
    spend: "$56746",
    joined: new Date().toLocaleDateString(),
    location: "Ghana",
  },
  {
    id: 3,
    image: profileImg,
    name: "ephraim ephraim",
    email: "ephraim@gmail.com",
    orders: 453,
    spend: "$56746",
    joined: new Date().toLocaleDateString(),
    location: "Ghana",
  },
  {
    id: 4,
    image: profileImg,
    name: "ephraim ephraim",
    email: "ephraim@gmail.com",
    orders: 453,
    spend: "$56746",
    joined: new Date().toLocaleDateString(),
    location: "Ghana",
  },
  {
    id: 5,
    image: profileImg,
    name: "ephraim ephraim",
    email: "ephraim@gmail.com",
    orders: 453,
    spend: "$56746",
    joined: new Date().toLocaleDateString(),
    location: "Ghana",
  },
  {
    id: 6,
    image: profileImg,
    name: "ephraim ephraim",
    email: "ephraim@gmail.com",
    orders: 453,
    spend: "$56746",
    joined: new Date().toLocaleDateString(),
    location: "Ghana",
  },
  {
    id: 7,
    image: profileImg,
    name: "ephraim ephraim",
    email: "ephraim@gmail.com",
    orders: 453,
    spend: "$56746",
    joined: new Date().toLocaleDateString(),
    location: "Ghana",
  },
  {
    id: 8,
    image: profileImg,
    name: "ephraim ephraim",
    email: "ephraim@gmail.com",
    orders: 453,
    spend: "$56746",
    joined: new Date().toLocaleDateString(),
    location: "Ghana",
  },
];

export const images = {
  burgerOne,
  burgerTwo,
  buritto,
  newYork,
  japan,
  pizzaOne,
};

export const cards = [
  {
    title: "Card 1",
    location: "Location 1",
    price: "$100",
    rating: 4.8,
    category: "house",
    image: images.newYork,
  },
  {
    title: "Card 2",
    location: "Location 2",
    price: "$200",
    rating: 3,
    category: "house",
    image: images.japan,
  },
  {
    title: "Card 3",
    location: "Location 3",
    price: "$300",
    rating: 2,
    category: "flat",
    image: images.newYork,
  },
  {
    title: "Card 4",
    location: "Location 4",
    price: "$400",
    rating: 5,
    category: "villa",
    image: images.japan,
  },
];

export const hubs = [
  {
    id: 1,
    title: "All",
    image: images.burgerOne,
    color: "#D33B0D",
    link: '/'
  },
  {
    id: 2,
    title: "Food",
    image: images.burgerTwo,
    color: "#DF5A0C",
    link: '/'
  },
  {
    id: 3,
    title: "Real Estate",
    image: images.japan,
    color: "#084137",
    link:'/restate'
  },
  {
    id: 4,
    title: "Market Place",
    image: images.buritto,
    color: "#EB920C",
    link:'/marketPlace'
  },
];

export const propertiesImages = [
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
 


  "https://images.unsplash.com/photo-1561753757-d8880c5a3551?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

  

  "https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  
  
 
  
  "https://images.unsplash.com/photo-1720432972486-2d53db5badf0?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export const galleryImages = [

  "https://unsplash.com/photos/comfort-room-with-white-bathtub-and-brown-wooden-cabinets-CMejBwGAdGk",


  "https://images.unsplash.com/photo-1641910532059-ad684fd3049c?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
 

 ,
  ,
  "https://images.unsplash.com/photo-1635108198979-9806fdf275c6?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export const realEstate = [
  {
    id: 1,
    title: "A detailed step by step guide to manage your lifestyle",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the..",
    image:
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: Date.now(),
    category: "Lifestyle",
    author: "Alex Bennett",
    author_img: profileImg,
    price: 48,
  },
  {
    id: 2,
    title: "How to create an effective startup roadmap or ideas",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the..",
    image:
      "https://images.unsplash.com/photo-1600435335786-d74d2bb6de37?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: Date.now(),
    category: "Startup",
    author: "Alex Bennett",
    author_img: profileImg,
    price: 48,
  },
  {
    id: 3,
    title: "Learning new technology to boost your career in software",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the..",
    image:
      "https://images.unsplash.com/photo-1604328702728-d26d2062c20b?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: Date.now(),
    category: "Technology",
    author: "Alex Bennett",
    author_img: profileImg,
    price: 48,
  },
  {
    id: 4,
    title: "Tips for getting the most out of apps and software",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the..",
    image:
      "https://images.unsplash.com/photo-1719299225324-301bad5c333c?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: Date.now(),
    category: "Technology",
    author: "Alex Bennett",
    author_img: profileImg,
    price: 48,
  },
  {
    id: 5,
    title: "Enhancing your skills and capturing memorable moments",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the..",
    image:
      "https://images.unsplash.com/photo-1600585153490-76fb20a32601?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: Date.now(),
    category: "Lifestyle",
    author: "Alex Bennett",
    author_img: profileImg,
    price: 48,
  },
  {
    id: 6,
    title: "Maximizing returns by minimizing resources in your startup",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the..",
    image:
      "https://images.unsplash.com/photo-1551241090-67de81d3541c?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: Date.now(),
    category: "Startup",
    author: "Alex Bennett",
    author_img: profileImg,
    price: 48,
  },
  {
    id: 7,
    title: "Technology for Career advancement in development",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the..",
    image:
      "https://images.unsplash.com/photo-1621293954908-907159247fc8?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: Date.now(),
    category: "Technology",
    author: "Alex Bennett",
    author_img: profileImg,
    price: 48,
  },
  {
    id: 8,
    title: "A comprehensive roadmap for effective lifestyle management",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the..",
    image:
      "https://images.unsplash.com/photo-1605146768851-eda79da39897?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: Date.now(),
    category: "Lifestyle",
    author: "Alex Bennett",
    author_img: profileImg,
    price: 48,
  },
  {
    id: 9,
    title: "Achieving maximum returns with minimal resources",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the..",
    image:
      "https://images.unsplash.com/photo-1605276373954-0c4a0dac5b12?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: Date.now(),
    category: "Startup",
    author: "Alex Bennett",
    author_img: profileImg,
    price: 48,
  },
  {
    id: 10,
    title: "Beyond the Ordinary: Crafting Your Exceptional Lifestyle",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the..",
    image:
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: Date.now(),
    category: "Lifestyle",
    author: "Alex Bennett",
    author_img: profileImg,
    price: 48,
  },
  {
    id: 11,
    title: "Unveiling the Secrets of Successful Startups in Technolgy",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the..",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: Date.now(),
    category: "Startup",
    author: "Alex Bennett",
    author_img: profileImg,
    price: 48,
  },
  {
    id: 15,
    title: "Exploring the Evolution of social networking in the Future",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the..",
    image:
      "https://images.unsplash.com/photo-1697299262049-e9b5fa1e9761?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: Date.now(),
    category: "Technology",
    author: "Alex Bennett",
    author_img: profileImg,
    price: 48,
  },
  {
    id: 12,
    title: "How to design an online Learning Platform today",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the..",
    image:
      "https://images.unsplash.com/photo-1560185009-dddeb820c7b7?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: Date.now(),
    category: "Technology",
    author: "Alex Bennett",
    author_img: profileImg,
    price: 48,
  },
  {
    id: 13,
    title: "Tomorrow's Algorithms: Shaping the Landscape of Future AI",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the..",
    image:
      "https://images.unsplash.com/photo-1638799869566-b17fa794c4de?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: Date.now(),
    category: "Startup",
    author: "Alex Bennett",
    author_img: profileImg,
    price: 48,
  },
  {
    id: 14,
    title: "Balance & Bliss: Navigating Life's Journey with Style",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the..",
    image:
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: Date.now(),
    category: "Lifestyle",
    author: "Alex Bennett",
    author_img: profileImg,
    price: 48,
  },
  {
    id: 111,
    title: "Unveiling the Secrets of Successful Startups in Technolgy",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the..",
    image:
      "https://images.unsplash.com/photo-1516095901529-0ef7be431a4f?q=60&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: Date.now(),
    category: "Startup",
    author: "Alex Bennett",
    author_img: profileImg,
    price: 48,
  },
];