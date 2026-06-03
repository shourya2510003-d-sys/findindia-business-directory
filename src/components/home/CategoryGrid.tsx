"use client";

const categories = [
  {
    name: "Restaurants",
    icon: "🍽️",
    count: "12k+",
  },
  {
    name: "Hotels",
    icon: "🏨",
    count: "8k+",
  },
  {
    name: "Doctors",
    icon: "👨‍⚕️",
    count: "15k+",
  },
  {
    name: "Hospitals",
    icon: "🏥",
    count: "4k+",
  },
  {
    name: "Education",
    icon: "🎓",
    count: "10k+",
  },
  {
    name: "Beauty",
    icon: "💄",
    count: "7k+",
  },
  {
    name: "Gym",
    icon: "🏋️",
    count: "3k+",
  },
  {
    name: "Loans",
    icon: "💰",
    count: "5k+",
  },
  {
    name: "Contractors",
    icon: "🛠️",
    count: "6k+",
  },
  {
    name: "Packers & Movers",
    icon: "🚚",
    count: "2k+",
  },
  {
    name: "Real Estate",
    icon: "🏠",
    count: "9k+",
  },
  {
    name: "Services",
    icon: "⚙️",
    count: "11k+",
  },
];

export default function CategoryGrid() {
  return (
    <section className="categorySection">
      <div className="container">

        <div className="sectionHeader">
          <h2>Popular Categories</h2>
          <p>Explore businesses by category</p>
        </div>

        <div className="categoryGrid">

          {categories.map((category) => (
            <div className="categoryCard" key={category.name}>

              <div className="categoryIcon">
                {category.icon}
              </div>

              <h3>{category.name}</h3>

              <span>{category.count} Businesses</span>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}