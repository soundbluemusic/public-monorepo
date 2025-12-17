import { useI18n } from "@/i18n";

export default function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  const toggleLanguage = () => {
    setLocale(locale() === "en" ? "ko" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      class="px-2.5 py-1 text-xs font-medium rounded-md transition-colors"
      style={{
        "background-color": "var(--bg-tertiary)",
        color: "var(--text-secondary)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--border-primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
      }}
      aria-label="Toggle language"
    >
      {locale() === "en" ? "한국어" : "EN"}
    </button>
  );
}
