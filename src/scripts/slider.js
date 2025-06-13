import { onScroll, animate, stagger } from "animejs";

window.navigateToSlide = null;
window.activeSlide = 0;

document.addEventListener("alpine:init", () => {
  if (typeof window.Splide === "undefined") {
    console.error("Splide is not defined. Ensure vendors.js is loaded.");
    return;
  }

  // Create a global store for the active slide
  Alpine.store("slider", {
    activeSlide: 0,
    setActiveSlide(index) {
      this.activeSlide = index;
      window.activeSlide = index; // Keep backward compatibility
    },
  });

  window.Alpine.data("slider", () => ({
    sidebarOpen: false,
    get activeSlide() {
      return this.$store.slider.activeSlide;
    },
    set activeSlide(value) {
      this.$store.slider.setActiveSlide(value);
    },

    isLastSlide() {
      return this.splide && this.splide.Components
        ? this.activeSlide === this.splide.Components.Controller.getEnd()
        : false;
    },

    init() {
      // Expose the goToSlide function globally
      window.navigateToSlide = (index) => this.goToSlide(index);

      // Update global active slide when it changes
      this.$watch("activeSlide", (value) => {
        window.activeSlide = value;
      });

      this.$nextTick(() => {
        const self = this;
        console.log("Initializing Splide slider");
        const sliderEl = document.querySelector("#main-slider");
        if (!sliderEl) {
          console.error("Main slider element (#main-slider) not found in DOM");
          return;
        }

        this.splide = new window.Splide(sliderEl, {
          type: "slide",
          height: "100vh",
          speed: 2000,
          pagination: false,
          arrows: false,
          drag: false,
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
          start: 0,
          // Desactivamos wheel integrado para tener control total
          wheel: false,
        });

        // Variables para acumular el "impulso" del scroll/swipe
        let scrollAccumulator = 0;
        let touchStartY = 0;
        let touchStartX = 0;
        let isScrollProcessing = false;
        let scrollTimeout;
        const scrollThreshold = 1000;
        const swipeThreshold = 500; // Umbral para swipes (más bajo que scroll)

        // Mantener la detección de eventos de rueda para escritorio
        window.addEventListener("wheel", handleScrollEvent, { passive: false });
        document.addEventListener("touchstart", handleTouchStart, {
          passive: false,
        });
        document.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });

        // Función para manejar evento de inicio de toque
        function handleTouchStart(e) {
          touchStartY = e.touches[0].clientY;
          touchStartX = e.touches[0].clientX;
        }

        // Función para manejar movimiento táctil
        function handleTouchMove(e) {
          if (isScrollProcessing) return;

          const currentSlide =
            self.splide.Components.Elements.slides[self.activeSlide];
          const slideContent =
            currentSlide.querySelector(".scrollable") || currentSlide;
          const scrollAccumulatorBar =
            document.getElementById("scroll-accumulator");

          // Calcular distancia del deslizamiento
          const touchY = e.touches[0].clientY;
          const touchX = e.touches[0].clientX;
          const deltaY = touchStartY - touchY;
          const deltaX = touchStartX - touchX;

          // Verificar si es un deslizamiento más vertical que horizontal
          if (Math.abs(deltaY) > Math.abs(deltaX)) {
            // Mismas comprobaciones de límites que en el wheel
            const isAtBottom =
              slideContent.scrollHeight - slideContent.scrollTop <=
              slideContent.clientHeight + 5;
            const isAtTop = slideContent.scrollTop <= 5;

            // Si estamos en un límite, procesamos el swipe
            if (
              (deltaY > 0 &&
                isAtBottom &&
                self.activeSlide < self.splide.length - 1) ||
              (deltaY < 0 && isAtTop && self.activeSlide > 0)
            ) {
              e.preventDefault(); // Prevenir scroll natural

              // Acumular el impulso del swipe
              scrollAccumulator += Math.abs(deltaY);
              scrollAccumulatorBar.style.width = `${Math.min(
                (scrollAccumulator / swipeThreshold) * 100,
                100
              )}%`;

              // Indicador visual según la dirección
              if (deltaY > 0) {
                // Swipe hacia arriba
                scrollAccumulatorBar.style.bottom = "0";
                scrollAccumulatorBar.style.top = "auto";
              } else {
                // Swipe hacia abajo
                scrollAccumulatorBar.style.top = "0";
                scrollAccumulatorBar.style.bottom = "auto";
              }

              // Si alcanzamos el umbral, cambiamos de sección
              if (scrollAccumulator >= swipeThreshold) {
                scrollAccumulatorBar.style.width = "100%";
                isScrollProcessing = true;

                // Navegar según la dirección del swipe
                if (deltaY > 0) {
                  self.goToSlide(self.activeSlide + 1);
                } else {
                  self.goToSlide(self.activeSlide - 1);
                }

                // Reseteo
                scrollAccumulator = 0;
                scrollAccumulatorBar.style.width = "0%";

                // Tiempo de espera antes de permitir otra navegación
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                  isScrollProcessing = false;
                }, 1000);
              }
            } else {
              // Si no estamos en un límite, permitir el scroll normal
              scrollAccumulator = 0;
              scrollAccumulatorBar.style.width = "0%";
            }

            // Actualizar posición inicial para el próximo movimiento
            touchStartY = touchY;
            touchStartX = touchX;
          }
        }

        function handleScrollEvent(e) {
          if (isScrollProcessing) return;
          const scrollAccumulatorBar =
            document.getElementById("scroll-accumulator");
          const currentSlide =
            self.splide.Components.Elements.slides[self.activeSlide];
          const slideContent =
            currentSlide.querySelector(".scrollable") || currentSlide;

          // Detectamos si estamos en el fondo de la sección actual (scrolling down)
          const isAtBottom =
            slideContent.scrollHeight - slideContent.scrollTop <=
            slideContent.clientHeight + 5;

          // Detectamos si estamos en la parte superior (scrolling up)
          const isAtTop = slideContent.scrollTop <= 5;

          // Si estamos en un límite, acumulamos el impulso del scroll
          if (
            (e.deltaY > 0 &&
              isAtBottom &&
              self.activeSlide < self.splide.length - 1) ||
            (e.deltaY < 0 && isAtTop && self.activeSlide > 0)
          ) {
            e.preventDefault(); // Previene el scroll visual

            // Acumular el impulso (valor absoluto para que funcione en ambas direcciones)
            scrollAccumulator += Math.abs(e.deltaY);
            scrollAccumulatorBar.style.width = `${Math.min(
              (scrollAccumulator / scrollThreshold) * 100,
              100
            )}%`;
            if (e.deltaY > 0) {
              scrollAccumulatorBar.style.bottom = "0";
              scrollAccumulatorBar.style.top = "auto";
            } else {
              scrollAccumulatorBar.style.top = "0";
              scrollAccumulatorBar.style.bottom = "auto";
            }

            // Si alcanzamos el umbral, cambiamos de sección
            if (scrollAccumulator >= scrollThreshold) {
              scrollAccumulatorBar.style.width = "100%";
              isScrollProcessing = true;

              // Determinar dirección y navegar
              if (e.deltaY > 0) {
                self.goToSlide(self.activeSlide + 1);
              } else {
                self.goToSlide(self.activeSlide - 1);
              }

              // Resetear acumulador
              scrollAccumulator = 0;
              scrollAccumulatorBar.style.width = "0%";

              // Configurar timeout para permitir otro cambio
              clearTimeout(scrollTimeout);
              scrollTimeout = setTimeout(() => {
                isScrollProcessing = false;
              }, 1000);
            }
          } else {
            // Si no estamos en un límite, resetear el acumulador
            scrollAccumulator = 0;
            scrollAccumulatorBar.style.width = "0%";
          }

          // Resetear también el acumulador si el usuario deja de hacer scroll
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            scrollAccumulator = 0;
            scrollAccumulatorBar.style.width = "0%";
            isScrollProcessing = false;
          }, 500); // Tiempo corto para detectar pausa en el scroll
        }

        this.splide.on("mounted", () => {
        console.log("Splide mounted, initial slide:", this.splide.index, "total slides:", this.splide.length);
        this.activeSlide = this.splide.index;
      });

        this.splide.on("move", (newIndex) => {
        console.log("Slide moved to:", newIndex);
        this.activeSlide = newIndex;
      });

        this.splide.on("active", (slide) => {
          console.log("Active slide index:", slide.index);
        });

        try {
          this.splide.mount();
        } catch (error) {
          console.error("Failed to mount Splide:", error);
        }
      });
    },

    goToSlide(index) {
      const indexToHashMap = {
        0: "",
        1: "#gallery",
        2: "#profile",
        3: "#services",
        4: "#contact",
      };

      console.log("goToSlide called with index:", index);
      if (!this.splide) {
        console.error("Splide instance not initialized");
        return;
      }
      if (
        typeof index !== "number" ||
        index < 0 ||
        index > this.splide.Components.Controller.getEnd()
      ) {
        console.error(
          `Invalid slide index: ${index}. Valid range: 0 to ${this.splide.Components.Controller.getEnd()}`
        );
        return;
      }
      this.splide.go(index);
      this.activeSlide = index;
      // Update the URL hash
      window.location.hash = indexToHashMap[index] || "";

      console.log(
        "Navigated to slide:",
        index,
        "activeSlide set to:",
        this.activeSlide
      );

      // Trigger animation of the categories in the gallery slide
      if (index === 1) {
        animate(".category", {
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 500,
          delay: stagger(100),
          ease: "in",
        });
      }
    },
  }));
});
