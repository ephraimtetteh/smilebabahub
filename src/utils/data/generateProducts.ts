type Category = "marketplace" | "apartment" | "food";

const cities = [
  "Accra",
  "East Legon",
  "Tema",
  "Kumasi",
  "Tamale",
  "Takoradi",
  "Cape Coast",
  "Madina",
  "Osu",
  "Spintex",
];

const sellers = [
  "Kwame",
  "Ama",
  "Yaw",
  "Kofi",
  "Abena",
  "Tech Store",
  "Food Palace",
  "Mama Kitchen",
  "ElectroMart",
  "Fashion Hub",
];

const marketplaceItems = [
  "iPhone 13",
  "Samsung Smart TV",
  "Gaming Laptop",
  "Men Sneakers",
  "Office Chair",
  "Bluetooth Speaker",
  "Wireless Headphones",
  "Smart Watch",
  "Refrigerator",
  "Microwave Oven",
];

const foods = [
  "Jollof Rice",
  "Banku and Tilapia",
  "Fried Rice with Chicken",
  "Pizza Combo",
  "Waakye",
  "Chicken Burger",
  "Chocolate Cake",
  "Shawarma",
  "Grilled Chicken",
  "Pancake Breakfast",
];

const apartments = [
  "1 Bedroom Apartment",
  "2 Bedroom Apartment",
  "3 Bedroom Apartment",
  "Luxury Studio Apartment",
  "Short Stay Apartment",
  "Student Hostel Room",
  "Furnished Apartment",
  "Beachside Apartment",
  "Executive Apartment",
  "Penthouse Apartment",
];

function random(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPrice(category: Category) {
  if (category === "food") return Math.floor(Math.random() * 60) + 10;
  if (category === "marketplace") return Math.floor(Math.random() * 1500) + 50;
  return Math.floor(Math.random() * 3000) + 500;
}

function generateProducts(count = 150) {
  const products = [];

  for (let i = 1; i <= count; i++) {
    const category: Category =
      i % 3 === 0 ? "food" : i % 2 === 0 ? "marketplace" : "apartment";

    let title = "";
    let subCategory = "";
    let details: any = {};

    if (category === "food") {
      title = random(foods);
      subCategory = "restaurant";
      details = {
        restaurantName: random(sellers),
        preparationTime: Math.floor(Math.random() * 30) + 10,
        isVegetarian: Math.random() > 0.7,
      };
    }

    if (category === "marketplace") {
      title = random(marketplaceItems);
      subCategory = "electronics";
      details = {
        brand: "Generic",
        condition: Math.random() > 0.5 ? "new" : "used",
        stock: Math.floor(Math.random() * 20) + 1,
      };
    }

    if (category === "apartment") {
      title = random(apartments);
      subCategory = "rent";
      details = {
        bedrooms: Math.floor(Math.random() * 4) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        furnished: Math.random() > 0.5,
        parking: Math.random() > 0.4,
        propertyType: "apartment",
      };
    }

    products.push({
      id: `prod${String(i).padStart(3, "0")}`,
      title,
      description: `Quality ${title.toLowerCase()} available now.`,
      price: randomPrice(category),
      category,
      subCategory,

      images: [
        `https://picsum.photos/seed/${category}-${i}/600/400`,
        `https://picsum.photos/seed/${title.replace(/\s/g, "")}-${i}/600/400`,
      ],

      location: {
        country: "Ghana",
        state: "Greater Accra",
        city: random(cities),
      },

      seller: {
        id: `user${String(i).padStart(3, "0")}`,
        name: random(sellers),
        phone: `024000${String(i).padStart(4, "0")}`,
      },

      details,
      createdAt: new Date().toLocaleString(),
    });
  }

  return products;
}

export const products = generateProducts(150);

