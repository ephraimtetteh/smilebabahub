
  export const Regions =[
    {
      "name": "Greater Accra",
      "capital": "Accra",
      "majorCitiesOrSuburbs": ["Accra Metropolitan", "Tema", "Madina", "Weija", "Kasoa"]
    },
    {
      "name": "Ashanti",
      "capital": "Kumasi",
      "majorCitiesOrSuburbs": ["Kumasi Metropolitan", "Ejisu", "Obuasi", "Asokwa", "Konongo"]
    },
    {
      "name": "Central",
      "capital": "Cape Coast",
      "majorCitiesOrSuburbs": ["Cape Coast", "Elmina", "Swedru", "Kasoa"]
    },
    {
      "name": "Eastern",
      "capital": "Koforidua",
      "majorCitiesOrSuburbs": ["Koforidua", "Nkawkaw", "Akwatia", "Suhum"]
    },
    {
      "name": "Volta",
      "capital": "Ho",
      "majorCitiesOrSuburbs": ["Ho", "Kpando", "Hohoe", "Aflao"]
    },
    {
      "name": "Western",
      "capital": "Sekondi-Takoradi",
      "majorCitiesOrSuburbs": ["Sekondi-Takoradi", "Takoradi", "Takoradi Port", "Takoradi Harbour"]
    },
    {
      "name": "Western North",
      "capital": "Sefwi Wiawso",
      "majorCitiesOrSuburbs": ["Sefwi Wiawso", "Bibiani", "Essaman"]
    },
    {
      "name": "Bono",
      "capital": "Sunyani",
      "majorCitiesOrSuburbs": ["Sunyani", "Techiman", "Dormaa Ahenkro"]
    },
    {
      "name": "Bono East",
      "capital": "Techiman",
      "majorCitiesOrSuburbs": ["Techiman", "Yeji"]
    },
    {
      "name": "Ahafo",
      "capital": "Goaso",
      "majorCitiesOrSuburbs": ["Goaso", "Kukuom"]
    },
    {
      "name": "Oti",
      "capital": "Dambai",
      "majorCitiesOrSuburbs": ["Dambai", "Nkwanta"]
    },
    {
      "name": "Savannah",
      "capital": "Damongo",
      "majorCitiesOrSuburbs": ["Damongo", "Bole"]
    },
    {
      "name": "North East",
      "capital": "Nalerigu",
      "majorCitiesOrSuburbs": ["Nalerigu", "Gambaga"]
    },
    {
      "name": "Northern",
      "capital": "Tamale",
      "majorCitiesOrSuburbs": ["Tamale", "Yendi", "Savelugu"]
    },
    {
      "name": "Upper East",
      "capital": "Bolgatanga",
      "majorCitiesOrSuburbs": ["Bolgatanga", "Navrongo", "Paga"]
    },
    {
      "name": "Upper West",
      "capital": "Wa",
      "majorCitiesOrSuburbs": ["Wa", "Jirapa", "Lambussie"]
    }
  ]





  export const Categories = [
    {
      id: "food",
      name: "Food & Restaurants",
      icon: "food",
      subcategories: [
        {
          id: "rice-dishes",
          name: "Rice Dishes",
          children: [
            { id: "jollof-rice", name: "Jollof Rice" },
            { id: "fried-rice", name: "Fried Rice" },
            { id: "plain-rice", name: "Plain Rice" },
          ],
        },
        {
          id: "noodles",
          name: "Noodles",
          children: [
            { id: "chicken-noodles", name: "Chicken Noodles" },
            { id: "beef-noodles", name: "Beef Noodles" },
            { id: "vegetable-noodles", name: "Vegetable Noodles" },
          ],
        },
        {
          id: "fast-food",
          name: "Fast Food",
          children: [
            { id: "burger", name: "Burger" },
            { id: "pizza", name: "Pizza" },
            { id: "sandwich", name: "Sandwich" },
          ],
        },
        {
          id: "desserts",
          name: "Desserts",
          children: [
            { id: "cake", name: "Cake" },
            { id: "ice-cream", name: "Ice Cream" },
            { id: "pastries", name: "Pastries" },
          ],
        },
      ],
    },

    {
      id: "apartments",
      name: "Apartments & Short Stays",
      icon: "home",
      subcategories: [
        {
          id: "short-stay",
          name: "Short Stay",
          children: [
            { id: "studio", name: "Studio Apartment" },
            { id: "1-bedroom", name: "1 Bedroom Apartment" },
            { id: "2-bedroom", name: "2 Bedroom Apartment" },
          ],
        },
        {
          id: "vacation",
          name: "Vacation Homes",
          children: [
            { id: "villa", name: "Villa" },
            { id: "beach-house", name: "Beach House" },
            { id: "luxury-apartment", name: "Luxury Apartment" },
          ],
        },
        {
          id: "long-term",
          name: "Long Term Rentals",
          children: [
            { id: "flat", name: "Flat" },
            { id: "duplex", name: "Duplex" },
            { id: "townhouse", name: "Townhouse" },
          ],
        },
      ],
    },

    {
      id: "marketplace",
      name: "Marketplace",
      icon: "shop",
      subcategories: [
        {
          id: "vehicles",
          name: "Vehicles",
          children: [
            {
              id: "cars",
              name: "Cars",
              brands: [
                "Toyota",
                "Honda",
                "Hyundai",
                "Kia",
                "Ford",
                "BMW",
                "Mercedes-Benz",
                "Nissan",
              ],
            },
            {
              id: "motorcycles",
              name: "Motorcycles",
              brands: ["Honda", "Yamaha", "Suzuki", "Kawasaki"],
            },
          ],
        },

        {
          id: "phones",
          name: "Phones & Tablets",
          children: [
            {
              id: "smartphones",
              name: "Smartphones",
              brands: [
                "Apple",
                "Samsung",
                "Tecno",
                "Infinix",
                "Itel",
                "Xiaomi",
                "Huawei",
              ],
            },
            {
              id: "tablets",
              name: "Tablets",
              brands: ["Apple iPad", "Samsung", "Lenovo"],
            },
          ],
        },

        {
          id: "electronics",
          name: "Electronics",
          children: [
            { id: "laptops", name: "Laptops" },
            { id: "televisions", name: "Televisions" },
            { id: "speakers", name: "Speakers" },
            { id: "cameras", name: "Cameras" },
          ],
        },

        {
          id: "fashion",
          name: "Fashion",
          children: [
            { id: "men", name: "Men Fashion" },
            { id: "women", name: "Women Fashion" },
            { id: "kids", name: "Kids Fashion" },
          ],
        },

        {
          id: "services",
          name: "Services",
          children: [
            { id: "cleaning", name: "Cleaning Services" },
            { id: "plumbing", name: "Plumbing" },
            { id: "electrical", name: "Electrical Work" },
            { id: "event-services", name: "Event Services" },
          ],
        },
      ],
    },
  ];



  export const categoryFields = {
    cars: [
      "brand",
      "model",
      "year",
      "mileage",
      "fuel",
      "transmission",
      "price",
    ],

    smartphones: ["brand", "model", "storage", "ram", "condition", "price"],

    apartment: [
      "price_per_night",
      "bedrooms",
      "bathrooms",
      "guests",
      "amenities",
    ],

    food: ["food_name", "price", "portion", "ingredients", "delivery_time"],
  };

