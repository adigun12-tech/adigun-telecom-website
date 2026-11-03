"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export type MediaSlideshowImage = {
  id: string;
  file_url: string;
  file_name?: string;
  alt_text?: string;
};

type MediaSlideshowProps = {
  slides: MediaSlideshowImage[];
  enabled?: boolean;
  interval?: number;
  transition?: "fade" | "slide";
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
  imageClassName?: string;
};

export default function MediaSlideshow({
  slides,
  enabled = true,
  interval = 5,
  transition = "fade",
  showArrows = true,
  showDots = true,
  className = "",
  imageClassName = "",
}: MediaSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasMultipleSlides = slides.length > 1;
  const shouldAutoplay = enabled && hasMultipleSlides;

  useEffect(() => {
    if (activeIndex >= slides.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, slides.length]);

  useEffect(() => {
    if (!shouldAutoplay) return;

    const safeInterval = Math.max(2, Math.min(interval, 60));

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, safeInterval * 1000);

    return () => window.clearInterval(timer);
  }, [shouldAutoplay, interval, slides.length]);

  if (!slides.length) {
    return null;
  }

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? slides.length - 1 : current - 1
    );
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const activeSlide = slides[activeIndex];

  return (
    <div
      className={`relative isolate h-full w-full overflow-hidden ${className}`}
      aria-roledescription="carousel"
      aria-label="Image slideshow"
    >
      {/* Slides */}
      <div className="relative h-full w-full overflow-hidden">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={slide.id}
              className={[
                "absolute inset-0 h-full w-full",
                "transition-all duration-700 ease-in-out",
                transition === "fade"
                  ? isActive
                    ? "z-10 translate-x-0 opacity-100"
                    : "z-0 translate-x-0 opacity-0"
                  : isActive
                    ? "z-10 translate-x-0 opacity-100"
                    : index < activeIndex
                      ? "z-0 -translate-x-full opacity-0"
                      : "z-0 translate-x-full opacity-0",
              ].join(" ")}
              aria-hidden={!isActive}
            >
              <img
                src={slide.file_url}
                alt={slide.alt_text || slide.file_name || "Website slideshow image"}
                className={`h-full w-full object-cover ${imageClassName}`}
                loading={index === 0 ? "eager" : "lazy"}
                draggable={false}
              />
            </div>
          );
        })}
      </div>

      {/* Previous and Next Arrows */}
      {hasMultipleSlides && showArrows && (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white sm:left-5 sm:h-12 sm:w-12"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white sm:right-5 sm:h-12 sm:w-12"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {hasMultipleSlides && showDots && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/25 px-3 py-2 backdrop-blur-sm">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-7 bg-white"
                  : "w-2.5 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}

      {/* Screen-reader status */}
      <span className="sr-only" aria-live="polite">
        Slide {activeIndex + 1} of {slides.length}
        {activeSlide?.alt_text ? `: ${activeSlide.alt_text}` : ""}
      </span>
    </div>
  );
      }
