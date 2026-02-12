import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

interface ServiceCarouselProps {
  services: Service[];
}

interface Service {
  Name: string;
  Price: string | null;
  Duration: string | null;
  Description: string;
  Details: string;
}

export function ServiceCarousel({ services }: ServiceCarouselProps) {
  return (
    <Carousel
      opts = {{
        loop: true,
      }}
    >
      <CarouselContent>
        {services.map(({ Name, Description, Details }, i) => (
          <CarouselItem key={i} className="basis-full">
              <div className="fd-service-card">
                <div className="flex flex-col md:flex-row justify-between gap-4 h-full">
                  <div className="md:w-4/5">
                    <h4 className="fd-service-name">{Name}</h4>
                    <p className="fd-service-details">{Details}</p>
                    <p className="fd-service-desc">{Description}</p>
                  </div>
                  <div className="md:w-2/5 flex flex-row md:flex-col md:items-end justify-between">
                    <div className="flex flex-wrap gap-1">
                      <span className="fd-tag">in-person</span>
                      <span className="fd-tag">hybrid</span>
                      <span className="fd-tag">online</span>
                    </div>
                    <a href="#contact" className="fd-btn mb-2" style={{ width: "fit-content" }}>Book</a>
                  </div>
                </div>
              </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
