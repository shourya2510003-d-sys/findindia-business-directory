interface Business {
  id: number;
  name: string;
  category: string;
  rating: number;
  image: string;
  isSponsored: boolean;
  location: string;
}

export const businesses: Business[] = [
  {
    id: 1,
    name: "ABC Restaurant",
    category: "Restaurant",
    rating: 4.6,
    image: "/images/restaurant.jpg",
    isSponsored: true,
    location: "Delhi",
  },
];