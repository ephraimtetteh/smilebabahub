
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
      id: "foods",
      name: "foods",
      children: [
        {
          id: "rice",
          name: "rice",
          children: ["plain rice ", "fried rice", "jollof rice"],
        },
        {
          id: "noodles",
          name: "rice",
          children: ["plain rice ", "fried rice", "jollof rice"],
        },
      ],
    },
    {
      id: "appartments",
      name: "appartments",
      children: [
        {
          id: "suits",
          name: "rice",
          children: ["plain rice ", "fried rice", "jollof rice"],
        },
        {
          id: "condos",
          name: "rice",
          children: ["plain rice ", "fried rice", "jollof rice"],
        },
      ],
    },
    {
      id: "market",
      name: "market",
      children: [
        {
          id: "vehicles",
          name: "Vehicles",
          children: [
            {
              id: "cars",
              name: "Cars",
              children: [
                "Toyota",
                "Hyundai",
                "Nissan",
                "Honda",
                "Kia",
                "Ford",
                "Mercedes-Benz",
                "BMW",
                "Mazda",
                "Mitsubishi",
                "Other",
              ],
            },
            {
              id: "motorcycles",
              name: "Motorcycles & Scooters",
              children: ["Motorbikes", "Scooters", "Tricycles"],
            },
            {
              id: "trucks",
              name: "Trucks & Trailers",
              children: ["Dump Trucks", "Box Trucks", "Tankers", "Trailers"],
            },
            {
              id: "buses",
              name: "Buses & Microbuses",
              children: ["Mini Bus", "Coaster Bus", "School Bus"],
            },
            {
              id: "vehicle-parts",
              name: "Vehicle Parts & Accessories",
              children: [
                "Engines",
                "Tyres & Rims",
                "Batteries",
                "Interior Accessories",
                "Exterior Accessories",
                "Oils & Fluids",
              ],
            },
            {
              id: "watercraft",
              name: "Watercraft & Boats",
              children: ["Boats", "Jet Skis", "Boat Engines"],
            },
          ],
        },

        {
          id: "property",
          name: "Property",
          children: [
            {
              id: "houses-apartments",
              name: "Houses & Apartments",
              children: ["For Sale", "For Rent", "Short Stay"],
            },
            {
              id: "commercial-property",
              name: "Commercial Property",
              children: ["Shops", "Offices", "Warehouses", "Hotels"],
            },
            {
              id: "land",
              name: "Land & Plots",
              children: ["Residential Land", "Commercial Land", "Farm Land"],
            },
          ],
        },

        {
          id: "phones-tablets",
          name: "Mobile Phones & Tablets",
          children: [
            {
              id: "mobile-phones",
              name: "Mobile Phones",
              children: [
                "Apple iPhone",
                "Samsung",
                "Tecno",
                "Infinix",
                "Itel",
                "Xiaomi",
                "Huawei",
                "Other",
              ],
            },
            {
              id: "tablets",
              name: "Tablets",
              children: ["iPad", "Samsung Tablets", "Lenovo Tablets"],
            },
            {
              id: "phone-accessories",
              name: "Accessories",
              children: [
                "Chargers",
                "Power Banks",
                "Earphones",
                "Phone Cases",
                "Screen Protectors",
              ],
            },
          ],
        },

        {
          id: "electronics",
          name: "Electronics",
          children: [
            {
              id: "computers",
              name: "Computers & Laptops",
              children: [
                "Laptops",
                "Desktops",
                "Monitors",
                "Computer Accessories",
              ],
            },
            {
              id: "tv-audio",
              name: "TV & Audio",
              children: [
                "Televisions",
                "Home Theatre Systems",
                "Speakers",
                "Radios",
              ],
            },
            {
              id: "cameras",
              name: "Cameras & Accessories",
              children: ["Digital Cameras", "CCTV Cameras", "Camera Lenses"],
            },
          ],
        },

        {
          id: "home-furniture",
          name: "Home, Furniture & Appliances",
          children: [
            {
              id: "furniture",
              name: "Furniture",
              children: ["Sofas", "Beds", "Wardrobes", "Tables", "Chairs"],
            },
            {
              id: "appliances",
              name: "Home Appliances",
              children: [
                "Fridges",
                "Washing Machines",
                "Microwaves",
                "Air Conditioners",
              ],
            },
            {
              id: "kitchen",
              name: "Kitchen Appliances",
              children: ["Cookers", "Blenders", "Rice Cookers"],
            },
          ],
        },

        {
          id: "fashion",
          name: "Fashion",
          children: [
            {
              id: "men-fashion",
              name: "Men",
              children: ["Clothing", "Shoes", "Watches", "Bags"],
            },
            {
              id: "women-fashion",
              name: "Women",
              children: ["Dresses", "Shoes", "Handbags", "Jewelry"],
            },
            {
              id: "kids-fashion",
              name: "Kids",
              children: ["Clothing", "Shoes", "Accessories"],
            },
          ],
        },

        {
          id: "services",
          name: "Services",
          children: [
            {
              id: "professional-services",
              name: "Professional Services",
              children: ["Legal Services", "Accounting", "Consulting"],
            },
            {
              id: "home-services",
              name: "Home Services",
              children: ["Cleaning", "Plumbing", "Electrical"],
            },
            {
              id: "events-services",
              name: "Events & Entertainment",
              children: ["MCs", "DJs", "Event Decor"],
            },
          ],
        },

        {
          id: "jobs",
          name: "Jobs",
          children: [
            {
              id: "full-time",
              name: "Full-Time Jobs",
              children: ["Office Jobs", "IT Jobs", "Sales Jobs"],
            },
            {
              id: "part-time",
              name: "Part-Time Jobs",
              children: ["Delivery", "Customer Service"],
            },
            {
              id: "internships",
              name: "Internships",
              children: ["Industrial Training", "Graduate Internship"],
            },
          ],
        },
      ],
    },
  ];

