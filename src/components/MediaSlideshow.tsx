
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

  const safeIndex =
    slides.length > 0 ? activeIndex % slides.length : 0;

  const activeSlide = slides[safeIndex];

  useEffect(() => {
    if (!shouldAutoplay) return;

    const safeInterval = Math.max(2, Math.min(interval, 60));

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, safeInterval * 1000);

    return () => window.clearInterval(timer);
  }, [shouldAutoplay, interval, slides.length]);

  if (!slides.length) return null;

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? slides.length - 1 : current - 1
    );
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <div
      className={`relative isolate h-full w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-950 shadow-2xl ${className}`}
      aria-roledescription="carousel"
      aria-label="Image slideshow"
    >
      <div className="relative h-full w-full overflow-hidden">
        {slides.map((slide, index) => {
          const isActive = index === safeIndex;

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
                    : index < safeIndex
                      ? "z-0 -translate-x-full opacity-0"
                      : "z-0 translate-x-full opacity-0",
              ].join(" ")}
              aria-hidden={!isActive}
            >
              <img
                src={slide.file_url}
                alt={
                  slide.alt_text ||
                  slide.file_name ||
                  "Adigun Telecom slideshow image"
                }
                className={`h-full w-full object-cover ${imageClassName}`}
                loading={index === 0 ? "eager" : "lazy"}
                draggable={false}
              />
            </div>
          );
        })}
      </div>

      {hasMultipleSlides && showArrows && (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-slate-950/65 text-white shadow-xl backdrop-blur-md transition duration-300 hover:scale-110 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-white sm:left-5 sm:h-12 sm:w-12"
          >
            <ChevronLeft size={25} />
          </button>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-slate-950/65 text-white shadow-xl backdrop-blur-md transition duration-300 hover:scale-110 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-white sm:right-5 sm:h-12 sm:w-12"
          >
            <ChevronRight size={25} />
          </button>
        </>
      )}

      {hasMultipleSlides && showDots && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-slate-950/60 px-3 py-2 backdrop-blur-md">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === safeIndex ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === safeIndex
                  ? "w-7 bg-blue-400"
                  : "w-2.5 bg-white/65 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}

      <span className="sr-only" aria-live="polite">
        Slide {safeIndex + 1} of {slides.length}
        {activeSlide?.alt_text ? `: ${activeSlide.alt_text}` : ""}
      </span>
    </div>
  );
}
