import { motion } from "framer-motion";
import RoyalCaninLogo from "src/assets/royal-canin-logo.png";

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="text-center">
        {/* Logo with animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeOut"
          }}
          className="mb-8"
        >
          <img
            src={RoyalCaninLogo}
            alt="Royal Canin"
            className="w-64 h-auto mx-auto"
          />
        </motion.div>

        {/* Animated loading dots */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ y: 0 }}
              animate={{ y: [-10, 0, -10] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.15
              }}
              className="w-3 h-3 rounded-full bg-[#E31837]"
            />
          ))}
        </div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-600 mt-6"
        >
          Memuat...
        </motion.p>
      </div>
    </div>
  );
}

export default PageLoader;

