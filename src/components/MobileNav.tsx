import * as React from "react";
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
  const showResume = !q || "resume".includes(q);
  const hasResults = showResume || showTutoring || showProjects || showBlog;

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
        <button
          className="fd-text-icon lg:hidden"
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
          }}
        >
          {open ? "\u00D7" : "MENU"}
          <span className="sr-only">Toggle menu</span>
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="fd-body w-3/4 pt-12 pb-8 overflow-y-auto !rounded-none"
        style={{
          borderRight: "3px solid var(--fd-fg)",
        }}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <VisuallyHidden.Root>
          <SheetTitle>Navigation</SheetTitle>
        </VisuallyHidden.Root>
        <nav className="flex flex-col gap-4">
          {/* Logo */}
          <a
            href="/"
            className="fd-logo transition-colors"
            onClick={() => setOpen(false)}
          >
            Saketh Thota
          </a>

          {/* Search input */}
          <div className="relative">
            <input
              placeholder="SEARCH..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            className="fd-label h-9 w-full pl-3 pr-8 uppercase outline-none"
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

          {/* Divider */}
          <div style={{ height: "2px", backgroundColor: "var(--fd-fg)" }} />

          {/* Tutoring -- collapsible with service cards */}
          {showTutoring && (
            <Collapsible open={tutoringOpen} onOpenChange={setTutoringOpen}>
              <CollapsibleTrigger className="flex w-full items-center justify-between group">
                <a
                  href="/tutoring"
                  onClick={() => setOpen(false)}
                  className="fd-nav"
                >
                  Tutoring
                </a>
                <span className="fd-toggle-indicator">
                  {tutoringOpen ? "\u2212" : "+"}
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col gap-0">
                {(q ? filteredServices : services).map((service) => (
                  <a
                    key={service.Name}
                    href="/tutoring#contact"
                    className="fd-result"
                    onClick={() => setOpen(false)}
                  >
                    <p className="fd-result-title">{service.Name}</p>
                    <p className="fd-result-meta">{service.Details}</p>
                    <p className="fd-result-desc line-clamp-2">{service.Description}</p>
                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                      <span className="fd-tag">in-person</span>
                      <span className="fd-tag">hybrid</span>
                      <span className="fd-tag">online</span>
                    </div>
                  </a>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Resume -- plain link (padded to match collapsible trigger height) */}
          {showResume && (
            <div className="flex w-full items-center">
              <a
                href="/resume"
                className="fd-nav"
                onClick={() => setOpen(false)}
              >
                Resume
              </a>
            </div>
          )}

          {/* Projects -- collapsible with project cards */}
          {showProjects && (
            <Collapsible open={projectsOpen} onOpenChange={setProjectsOpen}>
              <CollapsibleTrigger className="flex w-full items-center justify-between group">
                <a
                  href="/projects"
                  onClick={() => setOpen(false)}
                  className="fd-nav"
                >
                  Projects
                </a>
                <span className="fd-toggle-indicator">
                  {projectsOpen ? "\u2212" : "+"}
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col gap-0">
                {(q ? filteredProjects : projects).map((project) => (
                  <a
                    key={project.title}
                    href="/projects"
                    className="fd-result"
                    onClick={() => setOpen(false)}
                  >
                    <p className="fd-result-title">{project.title}</p>
                    <p className="fd-result-desc line-clamp-2">{project.description}</p>
                    <div className="fd-meta-links">
                      <span className="fd-text-icon">SRC</span>
                      <span className="fd-text-icon">LIVE</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {project.tags.map((tag) => (
                          <span key={tag} className="fd-tag">{tag}</span>
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
              <CollapsibleTrigger className="flex w-full items-center justify-between group">
                <a
                  href="/blog"
                  onClick={() => setOpen(false)}
                  className="fd-nav"
                >
                  Blog
                </a>
                <span className="fd-toggle-indicator">
                  {blogOpen ? "\u2212" : "+"}
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col gap-0">
                {(q ? filteredPosts : posts).map((post) => (
                  <a
                    key={post.url}
                    href={post.url}
                    className="fd-result"
                    onClick={() => setOpen(false)}
                  >
                    <p className="fd-result-title">{post.title}</p>
                    <p className="fd-result-desc line-clamp-2">{post.description}</p>
                    <div className="fd-meta-links">
                      <span className="fd-result-meta">
                        {new Date(post.publishedAt).toLocaleDateString("en-us", { month: "short", day: "numeric" })}
                      </span>
                      <div className="flex gap-1.5 flex-wrap">
                        {post.tags.map((tag) => (
                          <span key={tag} className="fd-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </a>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {!hasResults && (
            <p className="fd-result-meta py-4 text-center uppercase" style={{ letterSpacing: "0.1em" }}>
              No results
            </p>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
