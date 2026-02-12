import * as React from "react";

interface SocialLink {
  label: string;
  url: string;
}

interface SocialLinksProps {
  links: SocialLink[];
}

export function SocialLinks({ links }: SocialLinksProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [lineStyle, setLineStyle] = React.useState<React.CSSProperties>({
    opacity: 0,
  });

  const moveTo = (index: number) => {
    if (!containerRef.current) return;
    const spans = containerRef.current.querySelectorAll<HTMLSpanElement>("a > span");
    const span = spans[index];
    if (!span) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const spanRect = span.getBoundingClientRect();

    setLineStyle({
      opacity: 1,
      width: spanRect.width,
      transform: `translateX(${spanRect.left - containerRect.left}px)`,
      transition: "transform 0.15s ease, width 0.15s ease, opacity 0.15s ease",
    });
  };

  const handleMouseLeave = () => {
    setLineStyle((prev) => ({
      ...prev,
      opacity: 0,
      transition: "opacity 0.2s ease",
    }));
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-wrap"
      style={{ gap: "0.25rem 0.75rem" }}
      onMouseLeave={handleMouseLeave}
    >
      {/* Sliding underline */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0"
        style={{
          ...lineStyle,
          bottom: "-2px",
          height: "1.5px",
          backgroundColor: "var(--fd-accent)",
        }}
      />
      {links.map((link, i) => (
        <a
          key={link.url}
          href={link.url}
          className="fd-social-link"
          style={{ borderBottom: "none" }}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => moveTo(i)}
        >
          <span>{link.label}</span>
        </a>
      ))}
    </div>
  );
}
