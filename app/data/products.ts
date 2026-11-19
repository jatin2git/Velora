export type Product = {
  id: number;
  name: string;
  category: "bedsheet" | "comforter";
  image: string;
  price: number;
  fabric: string;
  size: string;
  color: string;
  description: string;
  stock: number;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Classic Floral Bedsheet",
    category: "bedsheet",
    image: "/products/bedsheet-01.jpg",
    price: 0,
    fabric: "Cotton",
    size: "King Size",
    color: "Beige",
    description: "Elegant floral design crafted for everyday comfort.",
    stock: 10,
  },
  {
    id: 2,
    name: "Soft Leaf Bedsheet",
    category: "bedsheet",
    image: "/products/bedsheet-02.jpg",
    price: 0,
    fabric: "Cotton",
    size: "King Size",
    color: "Ivory",
    description: "Soft and refined textile with a timeless leaf pattern.",
    stock: 10,
  },
  {
    id: 3,
    name: "Elegant Pattern Bedsheet",
    category: "bedsheet",
    image: "/products/bedsheet-03.jpg",
    price: 0,
    fabric: "Cotton",
    size: "Queen Size",
    color: "Taupe",
    description: "A subtle pattern designed for modern bedrooms.",
    stock: 10,
  },
  {
    id: 4,
    name: "Classic Comforter",
    category: "comforter",
    image: "/products/comforter-01.jpg",
    price: 0,
    fabric: "Microfiber",
    size: "King Size",
    color: "Cream",
    description: "Soft and comfortable layer for a restful night.",
    stock: 10,
  },
  {
    id: 5,
    name: "Soft Textured Comforter",
    category: "comforter",
    image: "/products/comforter-02.jpg",
    price: 0,
    fabric: "Microfiber",
    size: "King Size",
    color: "Beige",
    description: "A refined textured finish with everyday comfort.",
    stock: 10,
  },
  {
    id: 6,
    name: "Premium Winter Comforter",
    category: "comforter",
    image: "/products/comforter-03.jpg",
    price: 0,
    fabric: "Polyester",
    size: "King Size",
    color: "Grey",
    description: "Warm and cozy comforter designed for colder nights.",
    stock: 10,
  },
];