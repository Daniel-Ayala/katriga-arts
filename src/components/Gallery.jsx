import React, { useState, useEffect, useRef } from "react";
import GalleryItem from "./GalleryItem";
import Masonry from "masonry-layout";
import { onScroll, animate, stagger } from "animejs";
import imagesLoaded from "imagesloaded";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.min.css";

// TypeScript interfaces for props
export const GalleryItemType = {
  id: String,
  src: String,
  thumbnail: String,
  alt: String,
  title: String,
  description: String,
  category: String,
  priority: Number,
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
  apiUrl,
  categories = [],
}) => {
  // State management
  const [items, setItems] = useState(initialItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(initialItems.length);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonState, setButtonState] = useState(buttonText);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showAddButton, setShowAddButton] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Create a ref for the masonry grid
  const masonryRef = useRef(null);
  const masonryInstanceRef = useRef(null);

  // Load initial items on component mount
  useEffect(() => {
    if (!initialLoadComplete) {
      fetchItems(1).then(() => {
        console.log("Initial items loaded");
        console.log("Initializing Masonry layout");
        console.log("Items length:", items.length);
        if (masonryRef.current && items.length > -1) {
          // Wait for images to load before initializing masonry
          imagesLoaded(masonryRef.current, () => {
            masonryInstanceRef.current = new Masonry(masonryRef.current, {
              itemSelector: ".gallery-item-wrapper",
              percentPosition: true,
              transitionDuration: 0,
            });
            animateItems();
          });
        }
      });
      setInitialLoadComplete(true);
    }
    console.log("Fetched initial items");
    return () => {
      if (masonryInstanceRef.current) {
        masonryInstanceRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      if (token) {
        console.log("Token found in cookies:", token);
        const tokenValue = token.split("=")[1];
        const response = await fetch("/api/verify-token", {
          method: "POST",
          body: JSON.stringify({ token: tokenValue }),
          headers: { "Content-Type": "application/json" },
        });
        const { isValid } = await response.json();
        setShowAddButton(isValid);
      } else {
        console.log("No token found in cookies.");
        setShowAddButton(false);
      }
    };

    checkToken();
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

    // Clean up when component unmounts or when items change
    return () => {
      if (lightbox && typeof lightbox.destroy === "function") {
        lightbox.destroy();
      }
    };
  }, [items]); // Re-initialize when items change

  // Update layout when items change
  useEffect(() => {
    if (masonryInstanceRef.current) {
      // Wait for new images to load before updating layout
      imagesLoaded(masonryRef.current, () => {
        masonryInstanceRef.current.reloadItems();
        masonryInstanceRef.current.layout();
        animateItems();
      });
    }
  }, [items]);

  // Load items with current filter when categories change
  useEffect(() => {
    // Only reload if we've made a selection change (not on initial load)
    if (
      selectedCategories.length > 0 ||
      (currentPage === 1 && items !== initialItems)
    ) {
      fetchItems(1);
    }
  }, [selectedCategories]);

  // Toggle a category selection
  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category);
      } else {
        return [...prev, category];
      }
    });
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  // Fetch items with filters
  const fetchItems = async (page = 1) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setButtonState("Loading...");

      // Create request payload
      let contents = JSON.stringify({
        pageSize: pageSize,
        page: page,
        categories:
          selectedCategories.length > 0 ? selectedCategories : undefined,
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
      if (data.items.length === 0 && page > 1) {
        setButtonState("No more items");
        setIsLoading(false);
        return;
      }

      // Replace items if it's page 1, otherwise append
      if (page === 1) {
        setItems(data.items);
      } else {
        setItems((prevItems) => [...prevItems, ...data.items]);
      }
      setCurrentPage(page);
      setButtonState(buttonText);
    } catch (error) {
      console.error("Error loading items:", error);
      setButtonState("Error loading items");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle loading more items
  const handleLoadMore = () => {
    fetchItems(currentPage + 1);
  };

  return (
    <div
      id="scrollContainer"
      className="section h-screen overflow-y-auto py-8 flex flex-col scrollable lg:px-16 xl:px-24"
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

        {/* Add more button */}
        {showAddButton && (
          <a href="/addPic">
            <button
              id="addMore"
              className="mt-6 text-white px-4 py-3 rounded-md transition-colors text-lg"
            >
              <i className="fas fa-square-plus mr-3"></i>Add New Item
            </button>
          </a>
        )}

        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mt-4 categories">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`category px-3 py-1 rounded-full text-md font-medium transition-all duration-300 ${
                  selectedCategories.includes(category)
                    ? "category-active"
                    : "category-inactive"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="container mx-auto px-4">
        {items.length === 0 && !isLoading ? (
          <div className="text-center py-8">
            <p className="text-neutral-300">
              No items match your selected filters.
            </p>
          </div>
        ) : (
          <div id="gallery-grid" ref={masonryRef} className="gallery-masonry">
            {items.map((item, index) => (
              <div
                key={`${item.src}-${index}`}
                className="gallery-item-wrapper w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
                data-priority={item.priority}
              >
                <GalleryItem {...item} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 text-center mt-12">
        <button
          onClick={handleLoadMore}
          disabled={isLoading || buttonState === "No more items"}
          className="relative bg-transparent border-2 border-white text-white px-8 py-3 mb-8 rounded-md text-lg font-medium hover:bg-white hover:text-black transition-all duration-300 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10">{buttonState}</span>
          <span className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
        </button>
      </div>
    </div>
  );
};

export default Gallery;
