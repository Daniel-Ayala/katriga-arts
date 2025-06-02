import React, { useState, useEffect, useRef } from "react";
import GalleryItem from "./GalleryItem";
import Masonry from "masonry-layout";
import { onScroll, animate } from "animejs";
import imagesLoaded from "imagesloaded";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";

// TypeScript interfaces for props
export const GalleryItemType = {
  src: String,
  alt: String,
  title: String,
  description: String,
  category: String,
};

function animateItems() {
  let galleryItems = document.querySelectorAll(".gallery-item");
  galleryItems.forEach((item) => {
    animate(item, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      autoplay: onScroll({
        container: "#scrollContainer",
        enter: "80% top",
        leave: "80% bottom",
        sync: true,
      }),
    });
  });
}

const Gallery = ({
  title,
  subtitle,
  buttonText = "Load More",
  initialItems = [],
  pageSize = 5,
  apiUrl
}) => {
  // State management
  const [items, setItems] = useState(initialItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(initialItems.length);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonState, setButtonState] = useState(buttonText);

  // Create a ref for the masonry grid
  const masonryRef = useRef(null);
  const masonryInstanceRef = useRef(null);

  useEffect(() => {
    if (masonryRef.current && items.length > 0) {
      // Wait for images to load before initializing masonry
      imagesLoaded(masonryRef.current, () => {
        masonryInstanceRef.current = new Masonry(masonryRef.current, {
          itemSelector: ".gallery-item-wrapper",
          percentPosition: true,
          transitionDuration: 0,
        });
      });
    }

    return () => {
      if (masonryInstanceRef.current) {
        masonryInstanceRef.current.destroy();
      }
    };
  }, []);

  // Initialize GLightbox
  useEffect(() => {
    // Initialize GLightbox
    const lightbox = GLightbox({
      selector: ".glightbox", // This should match the class on your gallery items
      touchNavigation: true,
      loop: true,
      autoplayVideos: true,
      openEffect: "zoom",
      closeEffect: "fade",
    });

    // wait 100ms before animating to ensure position is set properly
    setTimeout(() => {
      animateItems();
    }, 1000);

    // Clean up when component unmounts or when items change
    return () => {
      if (lightbox && typeof lightbox.destroy === "function") {
        lightbox.destroy();
      }
    };
  }, [items]); // Re-initialize when items change

  // Update layout when items change
  useEffect(() => {
    if (masonryInstanceRef.current && items.length > initialItems.length) {
      // Wait for new images to load before updating layout

      imagesLoaded(masonryRef.current, () => {
        masonryInstanceRef.current.reloadItems();
        masonryInstanceRef.current.layout();
      });
    }
  }, [items, initialItems.length]);

  // Handle loading more items
  const handleLoadMore = async () => {
    console.log("Loading more items...");
    if (isLoading) return;

    try {
      setIsLoading(true);
      setButtonState("Loading...");

      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      let contents = JSON.stringify({
        pageSize: pageSize,
        page: nextPage,
      });
      // Make API request
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: contents,
      });
      const data = await response.json();

      // If no more items, disable the button
      if (data.items.length === 0) {
        setButtonState("No more items");
        return;
      }
      console.log("Loaded items:", data.items);
      // Add new items to the gallery
      setItems((prevItems) => [...prevItems, ...data.items]);

      // Restore button text
      setButtonState(buttonText);
    } catch (error) {
      console.error("Error loading more items:", error);
      setButtonState("Error loading items");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="scrollContainer"
      className="section h-screen overflow-y-auto py-24 flex flex-col scrollable lg:px-16 xl:px-24"
    >
      <div className="container mx-auto px-4 text-center mb-12">
        <h2 className="relative text-4xl md:text-5xl lg:text-6xl font-bold text-white z-10 animate-reveal mb-3">
          <span id="galleryTitle" className="bg-clip-text text-transparent">
            {title}
          </span>
        </h2>
        <p className="text-lg text-neutral-200 max-w-2xl mx-auto font-light">
          {subtitle}
        </p>
      </div>

      <div className="container mx-auto px-4">
        <div id="gallery-grid" ref={masonryRef} className="gallery-masonry">
          {items.map((item, index) => (
            <div
              key={`${item.src}-${index}`}
              className="gallery-item-wrapper w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
            >
              <GalleryItem {...item} />
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 text-center mt-12">
        <button
          onClick={handleLoadMore}
          disabled={isLoading || buttonState === "No more items"}
          className="relative bg-transparent border-2 border-white text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-white hover:text-black transition-all duration-300 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10">{buttonState}</span>
          <span className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
        </button>
      </div>

      {/* Footer copyright section can be added separately */}
    </div>
  );
};

export default Gallery;
