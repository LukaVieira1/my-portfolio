import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { FiSettings } from "react-icons/fi";
import { useState } from "react";

export function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const itemVariants = {
    closed: {
      opacity: 0,
      y: 0,
      x: 20,
      transition: {
        y: { stiffness: 1000 },
      },
    },
    open: (custom: number) => ({
      opacity: 1,
      y: -Math.sin(custom * (Math.PI / 2)) * 60,
      x: -Math.cos(custom * (Math.PI / 2)) * 60,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    }),
  };

  const teste = {
    closed: {
      opacity: 0,
      y: 0,
      x: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
    open: (custom: number) => ({
      opacity: 1,
      y: -Math.sin(custom * (Math.PI / 2)) * 60,
      x: -Math.cos(custom * (Math.PI / 2)) * 60,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    }),
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        className="relative"
      >
        <motion.div
          custom={0}
          variants={teste}
          className="absolute bottom-0 left-0"
        >
          <div className="bg-background-light rounded-full shadow-lg p-2">
            <ThemeToggle />
          </div>
        </motion.div>

        <motion.div
          custom={1}
          variants={itemVariants}
          className="absolute bottom-0 right-0"
        >
          <div className="bg-background-light rounded-full shadow-lg p-2">
            <LanguageSwitcher />
          </div>
        </motion.div>

        {/* Settings Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 rounded-full bg-background-light shadow-lg hover:bg-background-lighter transition-colors cursor-pointer relative z-10"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiSettings className="text-primary" size={24} />
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  );
}
