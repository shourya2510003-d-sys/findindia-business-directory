"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-grid">

          <div>
            <h2 className="footer-logo">
              Find<span>India</span>
            </h2>

            <p className="footer-text">
              India's trusted local business directory.
              Discover restaurants, hotels, doctors,
              education centers, services and much more.
            </p>
          </div>

          <div>
            <h3 className="footer-title">
              Quick Links
            </h3>

            <div className="footer-links">
              <Link href="/">Home</Link>
              <Link href="/businesses">Businesses</Link>
              <Link href="/register">
                List Business
              </Link>
              <Link href="/login">
                Owner Login
              </Link>
            </div>
          </div>

          <div>
            <h3 className="footer-title">
              Categories
            </h3>

            <div className="footer-links">
              <span>Restaurants</span>
              <span>Hotels</span>
              <span>Doctors</span>
              <span>Education</span>
              <span>Services</span>
            </div>
          </div>

          <div>
            <h3 className="footer-title">
              Contact
            </h3>

            <div className="footer-links">
              <span>📧 support@findindia.com</span>
              <span>📞 +91 9876543210</span>
              <span>📍 India</span>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          © 2026 FindIndia. By Shourya Innovations.
        </div>

      </div>
    </footer>
  );
}