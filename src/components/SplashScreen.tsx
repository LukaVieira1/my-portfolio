import { motion } from "framer-motion";

export function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 bg-background z-50 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{
        opacity: [1, 1, 0],
        clipPath: [
          "inset(0%)",
          "inset(45% 20% 45% 20%)",
          "inset(50% 50% 50% 50%)",
        ],
        transition: {
          duration: 1,
          times: [0, 0.5, 1],
          ease: "easeInOut",
        },
      }}
    >
      <div className="relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: "100%",
            transition: {
              duration: 1,
              ease: "easeInOut",
            },
          }}
          className="h-[2px] bg-primary absolute -bottom-2 left-0"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.5,
          }}
          className="flex items-center gap-3"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              transition: {
                type: "spring",
                stiffness: 100,
                delay: 0.8,
              },
            }}
            className="text-primary font-mono"
          >
            {"<"}
          </motion.span>
          <motion.h1 className="text-4xl md:text-6xl font-mono font-bold text-primary">
            {"lukavieira.tech"}
          </motion.h1>
          <motion.span
            initial={{ opacity: 0, scale: 0, rotate: 180 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              transition: {
                type: "spring",
                stiffness: 100,
                delay: 0.8,
              },
            }}
            className="text-primary font-mono"
          >
            {"/>"}
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}
