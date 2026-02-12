import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";

interface ProjectCardProps {
  title: string;
  description: string;
  source: string;
  live: string;
  src: string;
  images?: string[];
  tags: string[];
  index?: number;
  reverse?: boolean;
}

export function ProjectCard({
  title,
  description,
  source,
  live,
  src,
  images,
  tags,
  index,
  reverse = false,
}: ProjectCardProps) {
  const allImages = images && images.length > 0 ? images : [src];
  const hasMultiple = allImages.length > 1;
  const displayIndex = index !== undefined ? String(index).padStart(2, "0") : undefined;

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

  const imageBlock = (
    <div className={`lg:col-span-2 relative p-4 ${reverse ? "lg:order-2" : ""}`}>
      <div ref={hasMultiple ? emblaRef : undefined} className="overflow-hidden h-full border border-[var(--fd-border-light)] rounded-sm">
        <div className="flex h-full">
          {allImages.map((imgSrc, i) => (
            <div
              key={i}
              className="min-w-0 shrink-0 grow-0 basis-full"
            >
              <img
                src={imgSrc}
                alt={`${title} screenshot ${i + 1}`}
                className="w-full h-full object-cover aspect-video lg:aspect-auto"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows — only shown when multiple images */}
      {hasMultiple && (
        <>
          <button
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 fd-carousel-arrow fd-carousel-arrow--overlay"
            aria-label="Previous image"
          >
            &#x2190;
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 fd-carousel-arrow fd-carousel-arrow--overlay"
            aria-label="Next image"
          >
            &#x2192;
          </button>
          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className="fd-carousel-dot"
                style={{
                  backgroundColor:
                    i === selectedIndex
                      ? "var(--fd-accent)"
                      : "rgba(255,255,255,0.5)",
                }}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );

  const contentBlock = (
    <div className={`lg:col-span-3 p-5 lg:p-8 flex flex-col justify-between min-w-0 ${reverse ? "lg:order-1" : ""}`}>
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="fd-project-title">{title}</h3>
          {displayIndex && <span className="fd-project-index">{displayIndex}</span>}
        </div>
        <p className="fd-body-text mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <span key={tag} className="fd-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <a
          href={source}
          className="fd-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          SOURCE
        </a>
        <a
          href={live}
          className="fd-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          LIVE
        </a>
      </div>
    </div>
  );

  return (
    <div className={`fd-project-stripe overflow-hidden ${reverse ? "fd-project-stripe--left" : "fd-project-stripe--right"}`}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
        {imageBlock}
        {contentBlock}
      </div>
    </div>
  );
}
