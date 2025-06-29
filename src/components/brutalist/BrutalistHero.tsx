
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Grid3X3
} from 'lucide-react';

const BrutalistHero = ({ onGetStarted }) => {
  const { scrollYProgress } = useScroll();
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-100%']);
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const floatingElements = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 20 + 10,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
    color: ['lime-400', 'pink-500', 'orange-500'][Math.floor(Math.random() * 3)]
  }));

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Dynamic Floating Elements */}
      {floatingElements.map((element) => (
        <motion.div
          key={element.id}
          className={`absolute w-${Math.floor(element.size / 4)} h-${Math.floor(element.size / 4)} bg-${element.color} opacity-20`}
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            transform: `rotate(${element.rotation}deg)`
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [element.rotation, element.rotation + 180, element.rotation + 360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
        />
      ))}

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="grid grid-cols-20 gap-1 h-full w-full"
          animate={{ rotate: [0, 1, -1, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        >
          {Array.from({ length: 400 }).map((_, i) => (
            <motion.div
              key={i}
              className="border border-lime-400/30"
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.01
              }}
            />
          ))}
        </motion.div>
      </div>

      <div className="relative z-10 max-w-[84rem] mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            style={{ y: textY, scale: textScale }}
            className="space-y-12"
          >
            {/* Staggered Typography Animation */}
            <div className="relative">
              <motion.h1
                className="text-6xl md:text-7xl lg:text-[6rem] font-black leading-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {['BUILD', 'BREAK', 'REBEL'].map((word, index) => (
                  <motion.span
                    key={word}
                    className={`block ${index === 0 ? 'text-white' :
                      index === 1 ? 'text-lime-400' : 'text-pink-500'
                      }`}
                    initial={{ x: index % 2 === 0 ? -200 : 200, rotate: index * 5 }}
                    animate={{ x: 0, rotate: index * 2 - 2 }}
                    transition={{
                      duration: 1.2,
                      delay: index * 0.3,
                      type: "spring",
                      damping: 15
                    }}
                    whileHover={{
                      scale: 1.05,
                      rotate: index * -3,
                      transition: { duration: 0.3 }
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>

              {/* Animated accent elements */}
              <motion.div
                className="absolute -top-8 -right-8 w-24 h-24 bg-orange-500 opacity-60"
                animate={{
                  rotate: [0, 180, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
            </div>

            {/* Enhanced Description */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="grid grid-cols-4 gap-6"
            >
              <div className="col-span-5">
                <motion.p
                  className="text-2xl text-gray-300 leading-relaxed font-bold"
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(163, 230, 53, 0.5)",
                      "0 0 20px rgba(163, 230, 53, 0.5)",
                      "0 0 0px rgba(163, 230, 53, 0.5)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  ESCAPE THE ORDINARY. CREATE WEBSITES THAT SCREAM DIGITAL REBELLION.
                  NO RULES. NO LIMITS. PURE CREATIVE CHAOS.
                </motion.p>
              </div>
            </motion.div>

            {/* Enhanced CTA Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="flex flex-col sm:flex-row gap-8 items-start"
            >
              <motion.button
                onClick={onGetStarted}
                className="group relative bg-lime-400 text-black px-16 py-8 text-3xl font-black uppercase tracking-wide overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="relative z-10 flex items-center gap-4"
                  whileHover={{ x: 5 }}
                >
                  START BUILDING
                  <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform duration-300" />
                </motion.span>

                {/* Animated background layers */}
                <motion.div
                  className="absolute inset-0 bg-pink-500"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute inset-0 bg-orange-500"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Side - Interactive Preview */}
          <motion.div
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative"
          >
            <motion.div
              animate={{
                rotate: [0, 2, -2, 0],
                scale: [1, 1.02, 1]
              }}
              transition={{ duration: 6, repeat: Infinity }}
              className="relative"
            >
              {/* Main Preview Window */}
              <div className="relative bg-gray-900 p-8 border-4 border-lime-400 overflow-hidden">
                <motion.div
                  className="bg-black p-8 border-2 border-pink-500"
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Animated Grid Inside Preview */}
                  <div className="grid grid-cols-6 gap-2 mb-6">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className={`h-8 ${i % 3 === 0 ? 'bg-lime-400' :
                          i % 3 === 1 ? 'bg-pink-500' : 'bg-orange-500'
                          }`}
                        animate={{
                          opacity: [0.5, 1, 0.5],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.1
                        }}
                      />
                    ))}
                  </div>

                  {/* Animated Content Lines */}
                  <div className="space-y-3">
                    {[3 / 4, 1 / 2, 2 / 3].map((width, i) => (
                      <motion.div
                        key={i}
                        className="h-4 bg-gray-700"
                        style={{ width: `${width * 100}%` }}
                        animate={{
                          width: [`${width * 100}%`, `${width * 120}%`, `${width * 100}%`]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 0.5
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Floating UI Elements */}
              <motion.div
                className="absolute -top-6 -right-6 bg-pink-500 p-4 border-2 border-white"
                animate={{
                  y: [0, -10, 0],
                  rotate: [12, 20, 12]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Grid3X3 className="w-8 h-8 text-white" />
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -left-6 bg-orange-500 p-4 border-2 border-white"
                animate={{
                  y: [0, 10, 0],
                  rotate: [-12, -20, -12]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <span className="text-white font-black text-sm">BRUTAL</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

    </section>
  );
};

export default BrutalistHero;