import { useI18n } from "@/i18n";

export default function LanguageToggle() {
  const { locale, setLocale } = useI18n();

  const toggleLanguage = () => {
    setLocale(locale() === "en" ? "ko" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      class="px-2 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      aria-label="Toggle language"
    >
      {locale() === "en" ? "한국어" : "EN"}
    </button>
  );
}
