import * as React from "react";
import { Menu, Search, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  GitHubLogoIcon,
  OpenInNewWindowIcon,
} from "@radix-ui/react-icons";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface ProjectItem {
  title: string;
  description: string;
  tags: string[];
  source: string;
  live: string;
}

interface PostItem {
  title: string;
  description: string;
  tags: string[];
  publishedAt: string;
  url: string;
}

interface ServiceItem {
  Name: string;
  Description: string;
  Details: string;
}

interface MobileNavProps {
  projects: ProjectItem[];
  posts: PostItem[];
  services: ServiceItem[];
}

export function MobileNav({ projects, posts, services }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [tutoringOpen, setTutoringOpen] = React.useState(false);
  const [projectsOpen, setProjectsOpen] = React.useState(false);
  const [blogOpen, setBlogOpen] = React.useState(false);

  const q = query.toLowerCase();

  const filteredServices = services.filter(
    (s) =>
      s.Name.toLowerCase().includes(q) ||
      s.Description.toLowerCase().includes(q) ||
      s.Details.toLowerCase().includes(q)
  );

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );

  const showTutoring = !q || filteredServices.length > 0;
  const showProjects = !q || filteredProjects.length > 0;
  const showBlog = !q || filteredPosts.length > 0;
  const showCv = !q || "cv".includes(q);
  const hasResults = showCv || showTutoring || showProjects || showBlog;

  // Reactively open/close collapsibles based on search query
  React.useEffect(() => {
    if (q) {
      setTutoringOpen(filteredServices.length > 0);
      setProjectsOpen(filteredProjects.length > 0);
      setBlogOpen(filteredPosts.length > 0);
    } else {
      setTutoringOpen(false);
      setProjectsOpen(false);
      setBlogOpen(false);
    }
  }, [q, filteredServices.length, filteredProjects.length, filteredPosts.length]);

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
      <SheetContent side="left" className="w-3/4 pt-12 pb-8 overflow-y-auto" onOpenAutoFocus={(e) => e.preventDefault()}>
        <VisuallyHidden.Root>
          <SheetTitle>Navigation</SheetTitle>
        </VisuallyHidden.Root>
        <nav className="flex flex-col gap-3">
          <a
            href="/"
            className="text-xl font-semibold hover:text-accent-foreground transition-colors"
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

          {/* Tutoring -- collapsible with service cards */}
          {showTutoring && (
            <Collapsible open={tutoringOpen} onOpenChange={setTutoringOpen}>
              <CollapsibleTrigger className="flex w-full items-center justify-between text-base font-medium hover:text-accent-foreground transition-colors group">
                <a
                  href="/tutoring"
                  onClick={() => setOpen(false)}
                  className="hover:text-accent-foreground"
                >
                  tutoring
                </a>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 flex flex-col gap-2">
                {(q ? filteredServices : services).map((service) => (
                  <a
                    key={service.Name}
                    href="/tutoring#contact"
                    className="block py-2 px-3 border-[1px] rounded-md hover:bg-accent transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <h4 className="scroll-m-20 text-sm font-semibold tracking-tight">
                      {service.Name}
                    </h4>
                    <h3 className="scroll-m-20 text-xs font-semibold tracking-tight text-muted-foreground">
                      {service.Details}
                    </h3>
                    <p className="text-xs mt-1 line-clamp-2">
                      {service.Description}
                    </p>
                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        in-person
                      </Badge>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        hybrid
                      </Badge>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        online
                      </Badge>
                    </div>
                  </a>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* CV -- plain link */}
          {showCv && (
            <a
              href="/cv"
              className="text-base font-medium hover:text-accent-foreground transition-colors"
              onClick={() => setOpen(false)}
            >
              cv
            </a>
          )}

          {/* Projects -- collapsible with project cards */}
          {showProjects && (
            <Collapsible open={projectsOpen} onOpenChange={setProjectsOpen}>
              <CollapsibleTrigger className="flex w-full items-center justify-between text-base font-medium hover:text-accent-foreground transition-colors group">
                <a
                  href="/projects"
                  onClick={() => setOpen(false)}
                  className="hover:text-accent-foreground"
                >
                  projects
                </a>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 flex flex-col gap-2">
                {(q ? filteredProjects : projects).map((project) => (
                  <a
                    key={project.title}
                    href="/projects"
                    className="block py-2 px-3 border-[1px] rounded-md hover:bg-accent transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <h4 className="scroll-m-20 text-sm font-semibold tracking-tight">
                      {project.title}
                    </h4>
                    <p className="text-xs font-medium mt-0.5 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center pt-1.5 gap-2">
                      <GitHubLogoIcon className="h-4 w-4 opacity-70" />
                      <OpenInNewWindowIcon className="h-4 w-4 opacity-70" />
                      <div className="flex gap-1.5 flex-wrap">
                        {project.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-[10px] px-1.5 py-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </a>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Blog -- collapsible with post cards */}
          {showBlog && (
            <Collapsible open={blogOpen} onOpenChange={setBlogOpen}>
              <CollapsibleTrigger className="flex w-full items-center justify-between text-base font-medium hover:text-accent-foreground transition-colors group">
                <a
                  href="/blog"
                  onClick={() => setOpen(false)}
                  className="hover:text-accent-foreground"
                >
                  blog
                </a>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 flex flex-col gap-2">
                {(q ? filteredPosts : posts).map((post) => (
                  <a
                    key={post.url}
                    href={post.url}
                    className="block rounded-md border-[1px] py-2 px-3 hover:bg-accent transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <h4 className="scroll-m-20 text-sm font-semibold tracking-tight">
                      {post.title}
                    </h4>
                    <p className="text-xs font-medium mt-0.5 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex items-center pt-1.5 gap-2">
                      <CalendarIcon className="h-3 w-3 opacity-70" />
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(post.publishedAt).toLocaleDateString("en-us")}
                      </span>
                      <div className="flex gap-1.5 flex-wrap">
                        {post.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-[10px] px-1.5 py-0"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </a>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {!hasResults && (
            <p className="text-muted-foreground text-sm">No results</p>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
