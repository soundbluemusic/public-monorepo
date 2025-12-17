import { createSignal, onMount } from "solid-js";
import { isServer } from "solid-js/web";

// Type guard for valid theme values
function isValidTheme(value: string | null): value is "light" | "dark" {
  return value === "light" || value === "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = createSignal<"light" | "dark">("light");

  onMount(() => {
    if (isServer) return;

    const stored = localStorage.getItem("theme");
    if (isValidTheme(stored)) {
      setTheme(stored);
      if (stored === "dark") {
        document.documentElement.classList.add("dark");
      }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  });

  const toggleTheme = () => {
    if (isServer) return;

    // Add transition class for smooth theme change
    document.documentElement.classList.add("theme-transition");

    const newTheme = theme() === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Remove transition class after animation
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 300);
  };

  return (
    <button
      onClick={toggleTheme}
      class="p-2 rounded-lg transition-colors"
      style={{ color: "var(--text-secondary)" }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
      aria-label="Toggle theme"
    >
      {theme() === "light" ? (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg class="w-5 h-5" style={{ color: "var(--accent-primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  );
}
