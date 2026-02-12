import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";

interface Testimonial {
  name: string;
  title: string;
  url: string;
  quote: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      {/* Carousel viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {testimonials.map(({ name, title, quote }, i) => (
            <div key={i} className="min-w-0 shrink-0 grow-0 basis-full pl-0">
              <div className="fd-testimonial">
                <div className="flex-1">
                  <p className="fd-testimonial-quote">&ldquo;{quote}&rdquo;</p>
                </div>
                <div style={{ height: "1px", backgroundColor: "var(--fd-border-light)" }} />
                <div>
                  <p className="fd-testimonial-name">{name}</p>
                  <p className="fd-testimonial-title mt-1">{title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation row: arrows + counter */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className="fd-carousel-arrow fd-carousel-arrow--external"
            aria-label="Previous testimonial"
          >
            &#x2190;
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            className="fd-carousel-arrow fd-carousel-arrow--external"
            aria-label="Next testimonial"
          >
            &#x2192;
          </button>
        </div>
        <span className="fd-label">
          {selectedIndex + 1} / {testimonials.length}
        </span>
      </div>
    </div>
  );
}
