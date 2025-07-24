import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ServiceCarouselProps {
  services: Service[];
}

interface Service {
  Name: string;
  Price: string | null;
  Duration: string | null;
  Description: string;
}

export function ServiceCarousel({ services }: ServiceCarouselProps) {
  return (
    <Carousel>
      <CarouselContent>
        {services.map(({ Name }, i) => (
          <CarouselItem key={i} className="basis-full">
              <div className="flex flex-col justify-start py-4 px-6 border-[1px] rounded-md">
                <div className="flex flex-col md:flex-row justify-between gap-4 h-full">
                  <div className="md:w-4/5">
                    <h4 className="scroll-m-20 text-xl md:text-2xl font-semibold tracking-tight">
                      {Name}
                    </h4>
                    <h3 className="scroll-m-20 text-lg md:text-xl font-semibold tracking-tight pb-4">
                      Subheading
                    </h3>
                    <p className="text-base md:text-lg">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam pulvinar turpis ex, varius dapibus erat placerat
                      non. Nullam ante purus, posuere sit amet mattis vitae,
                      ultrices nec lorem. Vivamus eget lacinia quam.
                    </p>
                  </div>
                  <div className="md:w-2/5 flex flex-row md:flex-col md:items-end justify-between">
                    <div>
                      <Badge variant="outline" >in-person</Badge>
                      <Badge variant="outline" >hybrid</Badge>
                      <Badge variant="outline" >online</Badge>
                    </div>
                    <Button className="mb-2 w-1/2">Book</Button>
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
