"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const reviews = [
  {
    rating: 5,
    name: "Ahmed Malik",
    review: "Amazing quality and fast delivery! Highly recommend this store.",
  },
  {
    rating: 4,
    name: "Sarah Khan",
    review: "Best experience! Shoes were exactly as shown in pictures.",
  },
  {
    rating: 5,
    name: "Ali Raza",
    review: "Super comfortable sandals, loved the packaging!",
  },
  {
    rating: 4,
    name: "Bilal Sheikh",
    review: "Great customer support and premium quality products.",
  },
];

export default function ReviewSlider() {
  return (
    <section className="reviews-section">
      <h2 className="reviews-title">What Our Customers Say</h2>

      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={30}
        autoplay={{ delay: 2500 }}
        pagination={{ clickable: true }}
        breakpoints={{
          1024: { slidesPerView: 3 },
          768: { slidesPerView: 2 },
          0: { slidesPerView: 2 }, // 👈 mobile ke liye force 2 kar diya
        }}
      >
        {reviews.map((r, i) => (
          <SwiperSlide key={i}>
            <div className="review-card">
              <div className="stars">{"⭐".repeat(r.rating)}</div>
              <p className="review-text">"{r.review}"</p>
              <h4 className="review-name">- {r.name}</h4>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
