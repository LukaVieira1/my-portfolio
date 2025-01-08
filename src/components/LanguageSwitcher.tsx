import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => i18n.changeLanguage("en")}
        className={`px-2 py-1 rounded ${
          i18n.language === "en"
            ? "text-[#64ffda] border border-[#64ffda]"
            : "text-[#8892b0]"
        }`}
      >
        EN
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => i18n.changeLanguage("pt")}
        className={`px-2 py-1 rounded ${
          i18n.language === "pt"
            ? "text-[#64ffda] border border-[#64ffda]"
            : "text-[#8892b0]"
        }`}
      >
        PT
      </motion.button>
    </div>
  );
}
