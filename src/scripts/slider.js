import { onScroll, animate, stagger } from "animejs";

document.addEventListener("alpine:init", () => {
  if (typeof window.Splide === "undefined") {
    console.error("Splide is not defined. Ensure vendors.js is loaded.");
    return;
  }

  window.Alpine.data("slider", () => ({
    sidebarOpen: false,
    activeSlide: 0,
    splide: null,

    isLastSlide() {
      return this.splide && this.splide.Components
        ? this.activeSlide === this.splide.Components.Controller.getEnd()
        : false;
    },

    init() {
      this.$nextTick(() => {
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

        // Configuración mejorada para scroll con confirmación
        let scrollTimeout;
        let isScrollProcessing = false;

        // Variables para acumular el "impulso" del scroll
        let scrollAccumulator = 0;
        const scrollThreshold = 1000; // Ajustar según necesidad

        window.addEventListener(
          "wheel",
          (e) => {
            if (isScrollProcessing) return;
            const scrollAccumulatorBar = document.getElementById("scroll-accumulator");
            const currentSlide =
              this.splide.Components.Elements.slides[this.activeSlide];
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
                this.activeSlide < this.splide.length - 1) ||
              (e.deltaY < 0 && isAtTop && this.activeSlide > 0)
            ) {
              e.preventDefault(); // Previene el scroll visual

              // Acumular el impulso (valor absoluto para que funcione en ambas direcciones)
              scrollAccumulator += Math.abs(e.deltaY);
              scrollAccumulatorBar.style.width = `${Math.min(
                (scrollAccumulator / scrollThreshold) * 100,100)}%`;
              if (isAtBottom) {
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
                  this.goToSlide(this.activeSlide + 1);
                } else {
                  this.goToSlide(this.activeSlide - 1);
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
          },
          { passive: false }
        );

        this.splide.on("mounted", () => {
          console.log(
            "Splide mounted, initial slide:",
            this.splide.index,
            "total slides:",
            this.splide.length
          );
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
