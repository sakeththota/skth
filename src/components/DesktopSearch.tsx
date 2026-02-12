import * as React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  const [tutoringOpen, setTutoringOpen] = React.useState(false);
  const [projectsOpen, setProjectsOpen] = React.useState(false);
  const [blogOpen, setBlogOpen] = React.useState(false);
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
  const showResume = q && "resume".includes(q);
  const hasResults = showTutoring || showProjects || showBlog || showResume;

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
    <div ref={containerRef} className="relative flex items-baseline">
      {/* Animated input container -- expands to the left */}
      <div
        className="overflow-hidden transition-[width,opacity] duration-200 ease-out"
        style={{
          width: expanded ? 240 : 0,
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="relative">
          <input
            ref={inputRef}
            placeholder="SEARCH..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="fd-label h-9 w-60 pl-3 pr-8 uppercase outline-none"
            style={{
              backgroundColor: "var(--fd-surface)",
              color: "var(--fd-fg)",
              border: "2px solid var(--fd-border)",
              borderRadius: 0,
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 fd-text-icon"
              style={{ fontSize: "0.625rem", letterSpacing: "0" }}
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Search trigger */}
      {!expanded && (
        <button
          onClick={open}
          className="fd-text-icon shrink-0"
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: "0.25rem 0",
            fontSize: "0.875rem",
          }}
        >
          &#x2317;
          <span className="sr-only">Search</span>
        </button>
      )}

      {/* Dropdown results */}
      {expanded && q && (
        <div
          className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto z-50 fd-body"
          style={{
            border: "2px solid var(--fd-border)",
            borderRadius: 0,
          }}
        >
          <div className="flex flex-col gap-3 p-3">
            {!hasResults && (
              <p className="fd-result-meta py-4 text-center uppercase" style={{ letterSpacing: "0.1em" }}>
                No results found
              </p>
            )}

            {/* Tutoring results */}
            {showTutoring && (
              <Collapsible open={tutoringOpen} onOpenChange={setTutoringOpen}>
                <CollapsibleTrigger className="flex w-full items-center justify-between group">
                  <span className="fd-nav">Tutoring</span>
                  <span className="fd-toggle-indicator">
                    {tutoringOpen ? "\u2212" : "+"}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent className="flex flex-col gap-0">
                  {filteredServices.map((service) => (
                    <a key={service.Name} href="/tutoring#contact" className="fd-result">
                      <p className="fd-result-title">{service.Name}</p>
                      <p className="fd-result-meta">{service.Details}</p>
                      <p className="fd-result-desc line-clamp-1">{service.Description}</p>
                    </a>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Resume result (wrapped to match collapsible trigger height) */}
            {showResume && (
              <div className="flex w-full items-center">
                <a href="/resume" className="fd-nav">Resume</a>
              </div>
            )}

            {/* Project results */}
            {showProjects && (
              <Collapsible open={projectsOpen} onOpenChange={setProjectsOpen}>
                <CollapsibleTrigger className="flex w-full items-center justify-between group">
                  <span className="fd-nav">Projects</span>
                  <span className="fd-toggle-indicator">
                    {projectsOpen ? "\u2212" : "+"}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent className="flex flex-col gap-0">
                  {filteredProjects.map((project) => (
                    <a key={project.title} href="/projects" className="fd-result">
                      <p className="fd-result-title">{project.title}</p>
                      <p className="fd-result-desc line-clamp-1">{project.description}</p>
                      <div className="fd-meta-links">
                        <a href={project.source} className="fd-text-icon" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>SRC</a>
                        <a href={project.live} className="fd-text-icon" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>LIVE</a>
                        <div className="flex gap-1 flex-wrap">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="fd-tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </a>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Blog results */}
            {showBlog && (
              <Collapsible open={blogOpen} onOpenChange={setBlogOpen}>
                <CollapsibleTrigger className="flex w-full items-center justify-between group">
                  <span className="fd-nav">Blog</span>
                  <span className="fd-toggle-indicator">
                    {blogOpen ? "\u2212" : "+"}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent className="flex flex-col gap-0">
                  {filteredPosts.map((post) => (
                    <a key={post.url} href={post.url} className="fd-result">
                      <p className="fd-result-title">{post.title}</p>
                      <p className="fd-result-desc line-clamp-1">{post.description}</p>
                      <div className="fd-meta-links">
                        <span className="fd-result-meta">
                          {new Date(post.publishedAt).toLocaleDateString("en-us", { month: "short", day: "numeric" })}
                        </span>
                        <div className="flex gap-1 flex-wrap">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="fd-tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </a>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
