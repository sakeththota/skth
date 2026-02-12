import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  GitHubLogoIcon,
  OpenInNewWindowIcon,
} from "@radix-ui/react-icons";

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

interface DesktopSearchProps {
  projects: ProjectItem[];
  posts: PostItem[];
  services: ServiceItem[];
}

export function DesktopSearch({
  projects,
  posts,
  services,
}: DesktopSearchProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const q = query.toLowerCase();

  const filteredServices = services.filter(
    (s) =>
      s.Name.toLowerCase().includes(q) ||
      s.Description.toLowerCase().includes(q) ||
      s.Details.toLowerCase().includes(q),
  );

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)),
  );

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)),
  );

  const showTutoring = q && filteredServices.length > 0;
  const showProjects = q && filteredProjects.length > 0;
  const showBlog = q && filteredPosts.length > 0;
  const showCv = q && "cv".includes(q);
  const hasResults = showTutoring || showProjects || showBlog || showCv;

  // Close on click outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }
    if (expanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded]);

  // Close on Escape
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && expanded) {
        close();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [expanded]);

  function open() {
    setExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  }

  function close() {
    setExpanded(false);
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative flex items-center">
      {/* Animated input container — expands to the left */}
      <div
        className="overflow-hidden transition-[width,opacity] duration-200 ease-out"
        style={{
          width: expanded ? 224 : 0,
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-56 pl-8 pr-8 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Search/close icon — on the right */}
      <button
        onClick={expanded ? close : open}
        className="inline-flex items-center justify-center h-9 w-9 text-muted-foreground hover:text-foreground transition-colors shrink-0"
      >
        {expanded ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
        <span className="sr-only">{expanded ? "Close search" : "Search"}</span>
      </button>

      {/* Dropdown results */}
      {expanded && q && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-md border bg-popover p-2 shadow-md z-50">
          {!hasResults && (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No results found
            </p>
          )}

          {/* Tutoring results */}
          {showTutoring && (
            <div className="mb-2">
              <p className="text-xs font-medium text-muted-foreground px-2 py-1.5 uppercase tracking-wider">
                Tutoring
              </p>
              {filteredServices.map((service) => (
                <a
                  key={service.Name}
                  href="/tutoring#contact"
                  className="block rounded-md px-2 py-2 hover:bg-accent transition-colors"
                >
                  <p className="text-sm font-medium">{service.Name}</p>
                  <p className="text-xs text-muted-foreground">
                    {service.Details}
                  </p>
                  <p className="text-xs mt-0.5 line-clamp-1">
                    {service.Description}
                  </p>
                </a>
              ))}
            </div>
          )}

          {/* CV result */}
          {showCv && (
            <div className="mb-2">
              <p className="text-xs font-medium text-muted-foreground px-2 py-1.5 uppercase tracking-wider">
                Pages
              </p>
              <a
                href="/cv"
                className="block rounded-md px-2 py-2 hover:bg-accent transition-colors"
              >
                <p className="text-sm font-medium">CV</p>
                <p className="text-xs text-muted-foreground">
                  View resume and experience
                </p>
              </a>
            </div>
          )}

          {/* Project results */}
          {showProjects && (
            <div className="mb-2">
              <p className="text-xs font-medium text-muted-foreground px-2 py-1.5 uppercase tracking-wider">
                Projects
              </p>
              {filteredProjects.map((project) => (
                <a
                  key={project.title}
                  href="/projects"
                  className="block rounded-md px-2 py-2 hover:bg-accent transition-colors"
                >
                  <p className="text-sm font-medium">{project.title}</p>
                  <p className="text-xs mt-0.5 line-clamp-1">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <GitHubLogoIcon className="h-3 w-3 opacity-60" />
                    <OpenInNewWindowIcon className="h-3 w-3 opacity-60" />
                    <div className="flex gap-1 flex-wrap">
                      {project.tags.slice(0, 3).map((tag) => (
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
            </div>
          )}

          {/* Blog results */}
          {showBlog && (
            <div>
              <p className="text-xs font-medium text-muted-foreground px-2 py-1.5 uppercase tracking-wider">
                Blog
              </p>
              {filteredPosts.map((post) => (
                <a
                  key={post.url}
                  href={post.url}
                  className="block rounded-md px-2 py-2 hover:bg-accent transition-colors"
                >
                  <p className="text-sm font-medium">{post.title}</p>
                  <p className="text-xs mt-0.5 line-clamp-1">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <CalendarIcon className="h-3 w-3 opacity-60" />
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString("en-us")}
                    </span>
                    <div className="flex gap-1 flex-wrap">
                      {post.tags.slice(0, 3).map((tag) => (
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
