export interface Product {
  id: number;
  name: string;
  price: number | null;
  tag: string;
  description: string;
  variations?: string[];
}

export const products: Product[] = [
  // ── Limited Time ──
  { id: 1,  name: "Pumpkin Spice Ice Chai",    price: 6,    tag: "Limited Time",               description: "A refreshing blend of spiced chai, pumpkin flavour, creamy milk, and a hint of fall spices. 🎃" },

  // ── Specialty Drinks ──
  { id: 2,  name: "Brown Sugar Iced Latte",    price: 6,    tag: "Specialty Drinks",           description: "Espresso and milk over ice, sweetened with rich brown sugar syrup." },
  { id: 3,  name: "Biscoff Latte",             price: 6,    tag: "Specialty Drinks",           description: "Smooth latte infused with the warm caramel-spice flavour of Biscoff." },
  { id: 4,  name: "Iced Caramel Macchiato",    price: 6,    tag: "Specialty Drinks",           description: "Vanilla, milk and espresso finished with a caramel drizzle over ice." },
  { id: 5,  name: "Iced Chai Latte",           price: 7,    tag: "Specialty Drinks",           description: "Spiced chai and creamy milk poured over ice.", variations: ["Vanilla", "Caramel", "Biscoff", "Brown Sugar"] },
  { id: 6,  name: "Iced Matcha",               price: 8,    tag: "Specialty Drinks",           description: "Stone-ground green tea whisked smooth — pick your favourite flavour.", variations: ["Strawberry Shortcake", "Banana Bread", "Regular", "Mango Modness", "Vanilla Vibez", "White Chocolate", "Bomb Biscoff"] },
  { id: 7,  name: "Spanish Latte",             price: 6,    tag: "Specialty Drinks",           description: "Espresso with sweetened condensed milk for a rich, silky finish." },
  { id: 8,  name: "Refreshers",                price: 5,    tag: "Specialty Drinks",           description: "Fruity, ice-cold pick-me-ups bursting with flavour.", variations: ["Blue Lagoon", "Tropical Twist", "Strawberry Watermelon", "Peach Mango"] },

  // ── Coffee ──
  { id: 9,  name: "Cappuccino",                price: 4.50, tag: "Coffee",                     description: "Espresso topped with steamed milk and a thick layer of velvety foam." },
  { id: 10, name: "Latte",                     price: 4.50, tag: "Coffee",                     description: "Double espresso with silky steamed milk — smooth and balanced." },
  { id: 11, name: "Espresso",                  price: 2.50, tag: "Coffee",                     description: "A bold, concentrated shot of perfectly extracted espresso." },

  // ── Tea ──
  { id: 12, name: "Somali Tea / Shaax",        price: 2,    tag: "Tea",                        description: "Aromatic spiced Somali tea brewed the traditional way.", variations: ["With milk", "Without milk", "Without sugar"] },

  // ── Frosted by Maida (Desserts) ──
  { id: 13, name: "Banana Pudding",            price: 8,    tag: "Frosted by Maida (Desserts)", description: "Creamy layered banana pudding made fresh by Maida." },
  { id: 14, name: "Biscoff Pudding",           price: 8.50, tag: "Frosted by Maida (Desserts)", description: "Silky pudding layered with crushed Biscoff cookies." },
  { id: 15, name: "Milk Cake",                 price: 7,    tag: "Frosted by Maida (Desserts)", description: "Soft, milk-soaked sponge cake in two indulgent flavours.", variations: ["Oreo", "Biscoff"] },
  { id: 16, name: "Croissant",                 price: 4.75, tag: "Frosted by Maida (Desserts)", description: "Flaky, buttery croissants baked golden.", variations: ["Biscoff", "Double Baked Almond", "Double Baked Pistachio", "Butter"] },
  { id: 17, name: "Cookies",                   price: 3.50, tag: "Frosted by Maida (Desserts)", description: "Freshly baked cookies in a range of flavours.", variations: ["Chocolate Chip", "Red Velvet", "Smores", "Oreo", "Double Chocolate"] },
  { id: 18, name: "Fresh Brownies",            price: 3.50, tag: "Frosted by Maida (Desserts)", description: "Rich, fudgy brownies baked fresh with a crackly top." },

  // ── Malawaax / Somali Crêpe ──
  { id: 19, name: "Malawaax / Somali Crêpe",   price: 2.50, tag: "Malawaax / Somali Crêpe",    description: "A traditional Somali crêpe — thin, lightly crisp, and warmly satisfying. Ask our team about today's fillings and accompaniments." },
];

export const categories = ["Limited Time", "Specialty Drinks", "Coffee", "Tea", "Frosted by Maida (Desserts)", "Malawaax / Somali Crêpe"] as const;
export type Category = typeof categories[number];
