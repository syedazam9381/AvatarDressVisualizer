
import { Dress } from "./types";

export const dresses: Dress[] = [
  {
    id: "1",
    name: "Floral Summer Dress",
    description: "A beautiful floral dress perfect for summer occasions.",
    price: 79.99,
    image: "/dress1.png",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Pink", "Blue", "Yellow"],
    category: "Summer",
    featured: true
  },
  {
    id: "2",
    name: "Evening Gown",
    description: "An elegant evening gown for formal events.",
    price: 159.99,
    image: "/dress2.png",
    sizes: ["S", "M", "L"],
    colors: ["Black", "Red", "Navy"],
    category: "Formal",
    featured: true
  },
  {
    id: "3",
    name: "Casual Maxi Dress",
    description: "A comfortable maxi dress for everyday wear.",
    price: 49.99,
    image: "/dress3.png",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Green", "Blue", "Brown"],
    category: "Casual",
    featured: true
  },
  {
    id: "4",
    name: "Cocktail Dress",
    description: "A stylish cocktail dress for parties and events.",
    price: 89.99,
    image: "/dress4.png",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Purple", "Black", "Silver"],
    category: "Cocktail",
    featured: false
  },
  {
    id: "5",
    name: "Business Dress",
    description: "A professional dress for office and business meetings.",
    price: 119.99,
    image: "/dress5.png",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Gray", "Black"],
    category: "Business",
    featured: false
  },
  {
    id: "6",
    name: "Beach Dress",
    description: "A light and airy dress perfect for beach vacations.",
    price: 59.99,
    image: "/dress6.png",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Turquoise", "Peach"],
    category: "Summer",
    featured: false
  },
  {
    id: "7",
    name: "Vintage Style Dress",
    description: "A retro-inspired dress with vintage styling.",
    price: 99.99,
    image: "/dress7.png",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Red", "Black", "Polka Dot"],
    category: "Vintage",
    featured: true
  },
  {
    id: "8",
    name: "Wedding Guest Dress",
    description: "A sophisticated dress perfect for wedding attendees.",
    price: 129.99,
    image: "/dress8.png",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Champagne", "Rose Gold", "Silver"],
    category: "Formal",
    featured: false
  }
];

export const generatePlaceholderImage = (id: string): string => {
  return `https://via.placeholder.com/600x800?text=Dress${id}`;
};
