
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

const BrutalistTestimonials: React.FC = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "ALEX CHAOS",
      role: "DIGITAL REBEL",
      company: "STARTUP ANARCHY",
      content: "FINALLY! A TOOL THAT DOESN'T FORCE ME INTO BORING TEMPLATES. MY SITES LOOK LIKE PURE DIGITAL ANARCHY.",
      rating: 5,
      color: "lime-400",
      rotation: -3,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      metrics: { conversion: "+340%", traffic: "+890%" }
    },
    {
      name: "SARA DESTROY",
      role: "CREATIVE DIRECTOR",
      company: "REBEL AGENCY",
      content: "DEVBUILDER BROKE ALL MY PRECONCEPTIONS. NOW I BUILD WEBSITES THAT MAKE PEOPLE STOP AND STARE.",
      rating: 5,
      color: "pink-500",
      rotation: 2,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      metrics: { conversion: "+280%", traffic: "+650%" }
    },
    {
      name: "MIKE BRUTAL",
      role: "STARTUP FOUNDER",
      company: "CHAOS CORP",
      content: "CONVENTIONAL BUILDERS ARE DEAD. THIS IS THE FUTURE. BRUTAL, FAST, PERFECT.",
      rating: 5,
      color: "orange-500",
      rotation: -1,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      metrics: { conversion: "+520%", traffic: "+1200%" }
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-40 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Chaos */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{
            backgroundImage: [
              "radial-gradient(circle at 20% 80%, rgba(163, 230, 53, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 40%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <h2 className="text-6xl md:text-7xl lg:text-[6rem] font-black leading-none mb-8">
            <span className="block text-white">DIGITAL</span>
            <span className="block text-lime-400">REBELS</span>
            <span className="block text-pink-500">SPEAK</span>
          </h2>
          <p className="text-xl text-gray-300">
            REAL STORIES FROM THE FRONT LINES OF WEB REBELLION
          </p>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 100, rotate: testimonials[activeTestimonial].rotation * 2 }}
              animate={{ opacity: 1, y: 0, rotate: testimonials[activeTestimonial].rotation }}
              exit={{ opacity: 0, y: -100, rotate: testimonials[activeTestimonial].rotation * -2 }}
              transition={{ duration: 0.8 }}
              className="relative max-w-4xl mx-auto"
            >
              <div className={`bg-black border-4 border-${testimonials[activeTestimonial].color} p-12 relative overflow-hidden`}>
                {/* Background Pattern */}
                <motion.div
                  className={`absolute top-0 right-0 w-32 h-32 bg-${testimonials[activeTestimonial].color} opacity-10`}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />

                <div className="relative z-10">
                  {/* Quote */}
                  <motion.blockquote
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-3xl md:text-4xl font-black text-white leading-tight mb-8 text-center"
                  >
                    "{testimonials[activeTestimonial].content}"
                  </motion.blockquote>

                  {/* Author Info */}
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="relative"
                    >
                      <img
                        src={testimonials[activeTestimonial].image}
                        alt={testimonials[activeTestimonial].name}
                        className="w-24 h-24 object-cover border-4 border-white"
                      />
                      <motion.div
                        className={`absolute -bottom-2 -right-2 w-8 h-8 bg-${testimonials[activeTestimonial].color}`}
                        animate={{ rotate: [0, 45, 90, 45, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>

                    <div className="text-center md:text-left">
                      <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-2xl font-black text-white mb-2"
                      >
                        {testimonials[activeTestimonial].name}
                      </motion.div>
                      <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        className="text-gray-400 uppercase tracking-wide font-bold mb-2"
                      >
                        {testimonials[activeTestimonial].role}
                      </motion.div>
                      <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className={`text-${testimonials[activeTestimonial].color} text-sm font-black uppercase`}
                      >
                        {testimonials[activeTestimonial].company}
                      </motion.div>
                    </div>

                    {/* Metrics */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                      className="flex gap-6"
                    >
                      <div className="text-center">
                        <div className={`text-2xl font-black text-${testimonials[activeTestimonial].color}`}>
                          {testimonials[activeTestimonial].metrics.conversion}
                        </div>
                        <div className="text-xs text-gray-400 uppercase">CONVERSION</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-black text-${testimonials[activeTestimonial].color}`}>
                          {testimonials[activeTestimonial].metrics.traffic}
                        </div>
                        <div className="text-xs text-gray-400 uppercase">TRAFFIC</div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Testimonial Navigation */}
          <div className="flex justify-center gap-4 mt-12">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-4 h-4 ${activeTestimonial === index
                  ? `bg-${testimonials[index].color}`
                  : 'bg-gray-600'
                  } transition-all duration-300`}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrutalistTestimonials;
