import * as React from "react";
import { Menu, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

const menuItems = [
  { title: "tutoring", path: "/tutoring" },
  { title: "cv", path: "/cv" },
  { title: "projects", path: "/projects" },
  { title: "blog", path: "/blog" },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const filtered = menuItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu
            className={`h-6 w-6 transition-transform duration-200 ${open ? "rotate-90" : "rotate-0"}`}
          />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-3/4 pt-12 pb-8">
        <VisuallyHidden.Root>
          <SheetTitle>Navigation</SheetTitle>
        </VisuallyHidden.Root>
        <nav className="flex flex-col gap-4">
          <a
            href="/"
            className="text-2xl font-semibold hover:text-accent-foreground transition-colors"
            onClick={() => setOpen(false)}
          >
            Saketh Thota
          </a>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <ul className="flex flex-col gap-4 text-xl font-medium">
            {filtered.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  className="hover:text-accent-foreground transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {item.title}
                </a>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="text-muted-foreground text-base">No results</li>
            )}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
