"use client";

export default function Hero() {
  const stats = [
    {
      number: "50M+",
      label: "Monthly Users",
      icon: "👥",
    },
    {
      number: "10M+",
      label: "Businesses Listed",
      icon: "🏢",
    },
    {
      number: "250+",
      label: "Cities Covered",
      icon: "📍",
    },
    {
      number: "4.8★",
      label: "User Rating",
      icon: "⭐",
    },
  ];

  return (
    <section className="trustSection">
      <div className="trustContainer">

        <div className="trustHeading">
          <h2>India's Trusted Local Business Directory</h2>

          <p>
            Discover verified restaurants, hotels,
            doctors, services and local businesses
            across India.
          </p>
        </div>

        <div className="statsGrid">
          {stats.map((item) => (
            <div className="statCard" key={item.label}>
              <div className="statIcon">
                {item.icon}
              </div>

              <h3>{item.number}</h3>

              <p>{item.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}