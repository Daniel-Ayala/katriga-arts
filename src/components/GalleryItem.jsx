import React, { useEffect, useRef } from "react";
import { onScroll, animate } from "animejs";

// React functional component
export default function GalleryItem({
  id,
  src,
  alt,
  title,
  description,
  category,
}) {
  const itemRef = useRef(null);

  return (
    <a
      id={id}
      href={src}
      data-gallery="portfolio"
      data-title={title}
      data-description={description}
      className={`glightbox gallery-item relative block overflow-hidden rounded-xl shadow-xl group animate-reveal`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 parallax"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
        <h3 className="text-white text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm font-medium">{category}</p>
        <i className="fas fa-search absolute top-4 end-4 text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
      </div>
    </a>
  );
}
