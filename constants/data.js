import profileImg from "../assets/profile_icon.png";

import burgerOne from "@/assets/images/burger-one.png";
import burgerTwo from "@/assets/images/burger-two.png";
import buritto from "@/assets/images/buritto.png";
import pizzaOne from "@/assets/images/pizza-one.png";
import newYork from "@/assets/images/new-york.png";
import japan from "@/assets/images/japan.png";

import menu_1 from '@/assets/food/menu_1.png'
import menu_2 from '@/assets/food/menu_2.png'
import menu_3 from '@/assets/food/menu_3.png'
import menu_4 from '@/assets/food/menu_4.png'
import menu_5 from '@/assets/food/menu_5.png'
import menu_6 from '@/assets/food/menu_6.png'
import menu_7 from '@/assets/food/menu_7.png'
import menu_8 from '@/assets/food/menu_8.png'

import food_1 from '@/assets/food/food_1.png'
import food_2 from '@/assets/food/food_2.png'
import food_3 from '@/assets/food/food_3.png'
import food_4 from '@/assets/food/food_4.png'
import food_5 from '@/assets/food/food_5.png'
import food_6 from '@/assets/food/food_6.png'
import food_7 from '@/assets/food/food_7.png'
import food_8 from '@/assets/food/food_8.png'
import food_9 from '@/assets/food/food_9.png'
import food_10 from '@/assets/food/food_10.png'
import food_11 from '@/assets/food/food_11.png'
import food_12 from '@/assets/food/food_12.png'
import food_13 from '@/assets/food/food_13.png'
import food_14 from '@/assets/food/food_14.png'
import food_15 from '@/assets/food/food_15.png'
import food_16 from '@/assets/food/food_16.png'
import food_17 from '@/assets/food/food_17.png'
import food_18 from '@/assets/food/food_18.png'
import food_19 from '@/assets/food/food_19.png'
import food_20 from '@/assets/food/food_20.png'
import food_21 from '@/assets/food/food_21.png'
import food_22 from '@/assets/food/food_22.png'
import food_23 from '@/assets/food/food_23.png'
import food_24 from '@/assets/food/food_24.png'
import food_25 from '@/assets/food/food_25.png'
import food_26 from '@/assets/food/food_26.png'
import food_27 from '@/assets/food/food_27.png'
import food_28 from '@/assets/food/food_28.png'
import food_29 from '@/assets/food/food_29.png'
import food_30 from '@/assets/food/food_30.png'
import food_31 from '@/assets/food/food_31.png'
import food_32 from '@/assets/food/food_32.png'


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
    link: '/food'
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

export const menu_list = [
  {
      menu_name: "Salad",
      menu_image: menu_1
  },
  {
      menu_name: "Rolls",
      menu_image: menu_2
  },
  {
      menu_name: "Deserts",
      menu_image: menu_3
  },
  {
      menu_name: "Sandwich",
      menu_image: menu_4
  },
  {
      menu_name: "Cake",
      menu_image: menu_5
  },
  {
      menu_name: "Pure Veg",
      menu_image: menu_6
  },
  {
      menu_name: "Pasta",
      menu_image: menu_7
  },
  {
      menu_name: "Noodles",
      menu_image: menu_8
  }]

export const food_list = [
  {
      id: 1,
      name: "Greek salad",
      image: food_1,
      price: 12,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Salad"
  },
  {
      id: 2,
      name: "Veg salad",
      image: food_2,
      price: 18,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Salad"
  }, {
      id: 3,
      name: "Clover Salad",
      image: food_3,
      price: 16,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Salad"
  }, {
      id: 4,
      name: "Chicken Salad",
      image: food_4,
      price: 24,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Salad"
  }, {
      id: 5,
      name: "Lasagna Rolls",
      image: food_5,
      price: 14,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Rolls"
  }, {
      id: 6,
      name: "Peri Peri Rolls",
      image: food_6,
      price: 12,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Rolls"
  }, {
      id: 7,
      name: "Chicken Rolls",
      image: food_7,
      price: 20,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Rolls"
  }, {
      id: 8,
      name: "Veg Rolls",
      image: food_8,
      price: 15,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Rolls"
  }, {
      id: 9,
      name: "Ripple Ice Cream",
      image: food_9,
      price: 14,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Deserts"
  }, {
      id: 10,
      name: "Fruit Ice Cream",
      image: food_10,
      price: 22,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Deserts"
  }, {
      id: 11,
      name: "Jar Ice Cream",
      image: food_11,
      price: 10,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Deserts"
  }, {
      id: 12,
      name: "Vanilla Ice Cream",
      image: food_12,
      price: 12,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Deserts"
  },
  {
      id: 13,
      name: "Chicken Sandwich",
      image: food_13,
      price: 12,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Sandwich"
  },
  {
      id: 14,
      name: "Vegan Sandwich",
      image: food_14,
      price: 18,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Sandwich"
  }, {
      id: 15,
      name: "Grilled Sandwich",
      image: food_15,
      price: 16,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Sandwich"
  }, {
      id: 16,
      name: "Bread Sandwich",
      image: food_16,
      price: 24,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Sandwich"
  }, {
      id: 17,
      name: "Cup Cake",
      image: food_17,
      price: 14,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Cake"
  }, {
      id: 18,
      name: "Vegan Cake",
      image: food_18,
      price: 12,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Cake"
  }, {
      id: 19,
      name: "Butterscotch Cake",
      image: food_19,
      price: 20,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Cake"
  }, {
      id: 20,
      name: "Sliced Cake",
      image: food_20,
      price: 15,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Cake"
  }, {
      id: 21,
      name: "Garlic Mushroom ",
      image: food_21,
      price: 14,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Pure Veg"
  }, {
      id: 22,
      name: "Fried Cauliflower",
      image: food_22,
      price: 22,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Pure Veg"
  }, {
      id: 23,
      name: "Mix Veg Pulao",
      image: food_23,
      price: 10,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Pure Veg"
  }, {
      id: 24,
      name: "Rice Zucchini",
      image: food_24,
      price: 12,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Pure Veg"
  },
  {
      id: 25,
      name: "Cheese Pasta",
      image: food_25,
      price: 12,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Pasta"
  },
  {
      id: 26,
      name: "Tomato Pasta",
      image: food_26,
      price: 18,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Pasta"
  }, {
      id: 27,
      name: "Creamy Pasta",
      image: food_27,
      price: 16,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Pasta"
  }, {
      id: 28,
      name: "Chicken Pasta",
      image: food_28,
      price: 24,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Pasta"
  }, {
      id: 29,
      name: "Buttter Noodles",
      image: food_29,
      price: 14,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Noodles"
  }, {
      id: 30,
      name: "Veg Noodles",
      image: food_30,
      price: 12,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Noodles"
  }, {
      id: 31,
      name: "Somen Noodles",
      image: food_31,
      price: 20,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Noodles"
  }, {
      id: 32,
      name: "Cooked Noodles",
      image: food_32,
      price: 15,
      description: "Food provides essential nutrients for overall health and well-being",
      category: "Noodles"
  }
]

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



export const Foods = [
  {
    id: 15,
    title: "Exploring the Evolution of social networking in the Future",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the..",
    image: pizzaOne,
    date: Date.now(),
    category: "Technology",
    author: "Alex Bennett",
    author_img: profileImg,
    price: 48,
  },
  {
    id: 1,
    title: "A detailed step by step guide to manage your lifestyle",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the..",
    image: images.burgerOne,
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
    image: images.burgerTwo,
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
    image: images.buritto,
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
    image: images.burgerOne,
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
    image: images.burgerTwo,
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
    image: images.buritto,
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
    image: burgerOne,
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
    image: pizzaOne,
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
    image: images.buritto,
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
    image: images.burgerOne,
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
    image: pizzaOne,
    date: Date.now(),
    category: "Startup",
    author: "Alex Bennett",
    author_img: profileImg,
    price: 48,
  },

  {
    id: 13,
    title: "Tomorrow's Algorithms: Shaping the Landscape of Future AI",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the..",
    image: images.burgerTwo,
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
    image: buritto,
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
    image: images.burgerOne,
    date: Date.now(),
    category: "Startup",
    author: "Alex Bennett",
    author_img: profileImg,
    price: 48,
  },
  {
    id: 12,
    title: "How to design an online Learning Platform today",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the..",
    image: pizzaOne,
    date: Date.now(),
    category: "Technology",
    author: "Alex Bennett",
    author_img: profileImg,
    price: 48,
  },
];
