export type Vendor = {
  name: string;
  category: string;
  badge: string;
  rating: number;
  reviews: number;
  number: number;
  description: string;
  image: string;
  email: string;
  services: {
    name: string;
    price: number;
    image: string;
  }[];
};
