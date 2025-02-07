import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-1">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => i18n.changeLanguage("en")}
        className={`px-2 py-1 rounded text-sm cursor-pointer ${
          i18n.language === "en"
            ? "text-primary border border-primary"
            : "text-text-secondary hover:text-primary transition-colors"
        }`}
      >
        EN
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => i18n.changeLanguage("pt")}
        className={`px-2 py-1 rounded text-sm cursor-pointer ${
          i18n.language === "pt"
            ? "text-primary border border-primary"
            : "text-text-secondary hover:text-primary transition-colors"
        }`}
      >
        PT
      </motion.button>
    </div>
  );
}
