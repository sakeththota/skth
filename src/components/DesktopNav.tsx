import * as React from "react";

interface NavItem {
  title: string;
  path: string;
}

interface DesktopNavProps {
  items: NavItem[];
  pathname: string;
}

export function DesktopNav({ items, pathname }: DesktopNavProps) {
  const containerRef = React.useRef<HTMLUListElement>(null);
  const mountedRef = React.useRef(false);
  const [lineStyle, setLineStyle] = React.useState<React.CSSProperties>({
    opacity: 0,
  });

  const getActiveIndex = () =>
    items.findIndex(
      (item) =>
        pathname === item.path || pathname.startsWith(item.path + "/"),
    );

  const moveTo = (index: number, fast?: boolean) => {
    if (!containerRef.current) return;
    const spans = containerRef.current.querySelectorAll<HTMLSpanElement>("a > span");
    const span = spans[index];
    if (!span) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const spanRect = span.getBoundingClientRect();

    const style: React.CSSProperties = {
      opacity: 1,
      width: spanRect.width,
      transform: `translateX(${spanRect.left - containerRect.left}px)`,
    };

    if (mountedRef.current) {
      style.transition = fast
        ? "transform 0.15s ease, width 0.15s ease"
        : "transform 0.3s ease, width 0.3s ease, opacity 0.2s ease";
    }

    setLineStyle(style);
  };

  // Position underline on active link on mount (no animation on first render)
  React.useEffect(() => {
    const activeIndex = getActiveIndex();
    if (activeIndex === -1) {
      setLineStyle({ opacity: 0 });
      return;
    }

    if (!containerRef.current) return;
    const spans = containerRef.current.querySelectorAll<HTMLSpanElement>("a > span");
    const span = spans[activeIndex];
    if (!span) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const spanRect = span.getBoundingClientRect();

    // No transition on mount — just snap into place
    setLineStyle({
      opacity: 1,
      width: spanRect.width,
      transform: `translateX(${spanRect.left - containerRect.left}px)`,
    });

    // Enable transitions after mount
    requestAnimationFrame(() => {
      mountedRef.current = true;
    });
  }, [pathname]);

  const handleMouseLeave = () => {
    const activeIndex = getActiveIndex();
    if (activeIndex === -1) {
      setLineStyle((prev) => ({
        ...prev,
        opacity: 0,
        transition: "opacity 0.2s ease",
      }));
      return;
    }
    moveTo(activeIndex);
  };

  return (
    <ul ref={containerRef} className="relative flex items-center"
      onMouseLeave={handleMouseLeave}
    >
      {/* Sliding underline */}
      <li
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-px bg-muted-foreground"
        style={lineStyle}
      />
      {items.map((item, i) => {
        const isActive =
          pathname === item.path || pathname.startsWith(item.path + "/");
        return (
          <li key={item.path}>
            <a
              href={item.path}
              className={`relative text-base inline-flex items-center h-9 px-3 transition-colors text-muted-foreground ${
                !isActive ? "hover:text-foreground" : ""
              }`}
              onMouseEnter={() => moveTo(i, true)}
            >
              <span>{item.title}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
