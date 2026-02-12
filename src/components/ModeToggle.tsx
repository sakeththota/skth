import * as React from "react";

export function ModeToggle() {
  const [theme, setThemeState] = React.useState<"light" | "dark">(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
    }
    return "light";
  });

  React.useEffect(() => {
    document.documentElement.classList[theme === "dark" ? "add" : "remove"](
      "dark",
    );
  }, [theme]);

  return (
    <button
      onClick={() => setThemeState(theme === "dark" ? "light" : "dark")}
      className="fd-text-icon"
      style={{ cursor: "pointer", background: "none", border: "none", padding: 0, fontSize: "0.875rem" }}
    >
      &#x25d0;
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
