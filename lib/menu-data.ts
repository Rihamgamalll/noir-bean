export type MenuCategory =
  | "Strong"
  | "Milk based"
  | "Sweet"
  | "Iced"
  | "Croissants";

export type MenuItem = {
  id: string;
  name: string;
  category: MenuCategory;
  note: string;
  basePrice: number;
  options: ("Hot" | "Iced")[];
  image: string;
  type: "drink" | "pastry";
};

export type Drink = MenuItem;

export const drinks: MenuItem[] = [
  {
    id: "espresso",
    name: "Espresso",
    category: "Strong",
    note: "Dense · cocoa · caramel",
    basePrice: 80,
    options: ["Hot"],
    image: "/drinks/Espresso.png",
    type: "drink",
  },
  {
    id: "americano",
    name: "Americano",
    category: "Strong",
    note: "Clean · long · aromatic",
    basePrice: 95,
    options: ["Hot", "Iced"],
    image: "/drinks/Americano.png",
    type: "drink",
  },
  {
    id: "latte",
    name: "Latte",
    category: "Milk based",
    note: "Silky · gentle · balanced",
    basePrice: 120,
    options: ["Hot", "Iced"],
    image: "/drinks/Latte.png",
    type: "drink",
  },
  {
    id: "spanish-latte",
    name: "Spanish Latte",
    category: "Sweet",
    note: "Creamy · condensed · rich",
    basePrice: 145,
    options: ["Hot"],
    image: "/drinks/spanish latte hot.png",
    type: "drink",
  },
  {
    id: "vanilla-latte",
    name: "Vanilla Latte",
    category: "Sweet",
    note: "Vanilla bean · velvet milk",
    basePrice: 140,
    options: ["Hot", "Iced"],
    image: "/drinks/Vanilla Latte.png",
    type: "drink",
  },
  {
    id: "caramel-macchiato",
    name: "Caramel Macchiato",
    category: "Sweet",
    note: "Caramel · espresso · creamy milk",
    basePrice: 145,
    options: ["Hot", "Iced"],
    image: "/drinks/Caramel Macchiato.png",
    type: "drink",
  },
  {
    id: "flat-white",
    name: "Flat White",
    category: "Milk based",
    note: "Microfoam · strong finish",
    basePrice: 125,
    options: ["Hot"],
    image: "/drinks/Flat White.png",
    type: "drink",
  },
  {
    id: "cappuccino",
    name: "Cappuccino",
    category: "Milk based",
    note: "Airy · cocoa dust · classic",
    basePrice: 120,
    options: ["Hot"],
    image: "/drinks/Cappuccino.png",
    type: "drink",
  },
  {
    id: "mocha",
    name: "Mocha",
    category: "Sweet",
    note: "Dark chocolate · espresso",
    basePrice: 145,
    options: ["Hot", "Iced"],
    image: "/drinks/Mocha.png",
    type: "drink",
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    category: "Iced",
    note: "18-hour steep · smooth",
    basePrice: 135,
    options: ["Iced"],
    image: "/drinks/Cold Brew.png",
    type: "drink",
  },
  {
    id: "affogato",
    name: "Affogato",
    category: "Sweet",
    note: "Vanilla gelato · hot espresso",
    basePrice: 155,
    options: ["Hot"],
    image: "/drinks/Affogato.png",
    type: "drink",
  },
  {
    id: "white-mocha",
    name: "White Mocha",
    category: "Sweet",
    note: "White chocolate · espresso · velvet milk",
    basePrice: 155,
    options: ["Hot", "Iced"],
    image: "/drinks/White Mocha.png",
    type: "drink",
  },
];

export const pastries: MenuItem[] = [
  {
    id: "plain-croissant",
    name: "Plain Croissant",
    category: "Croissants",
    note: "Buttery · flaky · freshly baked",
    basePrice: 60,
    options: [],
    image: "/pastries/plain-croissant.png",
    type: "pastry",
  },
  {
    id: "chocolate-croissant",
    name: "Chocolate Croissant",
    category: "Croissants",
    note: "Dark chocolate · crisp golden layers",
    basePrice: 85,
    options: [],
    image: "/pastries/chocolate-croissant.png",
    type: "pastry",
  },
  {
    id: "almond-croissant",
    name: "Almond Croissant",
    category: "Croissants",
    note: "Almond cream · toasted almond flakes",
    basePrice: 95,
    options: [],
    image: "/pastries/almond-croissant.png",
    type: "pastry",
  },
  {
    id: "pistachio-croissant",
    name: "Pistachio Croissant",
    category: "Croissants",
    note: "Pistachio cream · roasted pistachios",
    basePrice: 110,
    options: [],
    image: "/pastries/pistachio-croissant.png",
    type: "pastry",
  },
  {
    id: "cheese-croissant",
    name: "Cheese Croissant",
    category: "Croissants",
    note: "Warm cheese · buttery pastry",
    basePrice: 80,
    options: [],
    image: "/pastries/cheese-croissant.png",
    type: "pastry",
  },
  {
    id: "turkey-cheese-croissant",
    name: "Turkey & Cheese Croissant",
    category: "Croissants",
    note: "Turkey · melted cheese · flaky crust",
    basePrice: 120,
    options: [],
    image: "/pastries/turkey-cheese-croissant.png",
    type: "pastry",
  },
];

export const menuItems: MenuItem[] = [...drinks, ...pastries];

export const categories = [
  "All",
  "Strong",
  "Milk based",
  "Sweet",
  "Iced",
  "Croissants",
] as const;