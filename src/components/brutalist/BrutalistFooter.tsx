import { motion } from 'framer-motion';
import { Github, Mail, MessageCircle, Twitter } from 'lucide-react';
import React from 'react';

const BrutalistFooter: React.FC = () => {
  const socialLinks = [
    { icon: Github, label: "GITHUB", color: "lime-400" },
    { icon: Twitter, label: "TWITTER", color: "pink-500" },
    { icon: MessageCircle, label: "DISCORD", color: "orange-500" },
    { icon: Mail, label: "EMAIL", color: "lime-400" }
  ];

  const footerLinks = [
    {
      title: "PRODUCT",
      links: ["FEATURES", "PRICING", "TEMPLATES", "EXPORT"]
    },
    {
      title: "REBELLION",
      links: ["COMMUNITY", "BLOG", "TUTORIALS", "SUPPORT"]
    },
    {
      title: "LEGAL",
      links: ["PRIVACY", "TERMS", "COOKIES", "GDPR"]
    }
  ];

  return (
    <footer className="bg-black border-t-4 border-lime-400 relative overflow-hidden">
      {/* Chaotic background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-2 bg-lime-400 transform -rotate-1" />
        <div className="absolute top-1/4 right-0 w-2 h-full bg-pink-500 transform rotate-2" />
        <div className="absolute bottom-0 left-1/4 w-3/4 h-1 bg-orange-500 transform rotate-1" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Main footer content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand section */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="transform -rotate-1"
            >
              <div className="text-4xl font-black text-lime-400 mb-6">
                DEV<span className="text-pink-500">BUILDER</span>
              </div>
              <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-md">
                DIGITAL REBELLION STARTS HERE. BUILD WEBSITES THAT BREAK EVERY RULE AND MAKE YOUR MARK ON THE WEB.
              </p>

              {/* Chaotic social links */}
              <div className="flex space-x-6">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href="#"
                      whileHover={{ scale: 1.2, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-12 h-12 bg-${social.color} text-black flex items-center justify-center transform rotate-${index * 3 - 6} hover:bg-white transition-all duration-300`}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Links sections */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {footerLinks.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`transform rotate-${index % 2 === 0 ? 1 : -1}`}
                >
                  <h4 className="text-white font-black text-lg mb-6 uppercase tracking-wide">
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-lime-400 font-medium text-sm uppercase tracking-wide transition-colors duration-200 hover:transform hover:translate-x-2"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="border-t border-gray-800 pt-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="transform -rotate-1">
              <p className="text-gray-400 text-sm">
                © 2024 DEVBUILDER. ALL RIGHTS RESERVED. BUILT WITH DIGITAL REBELLION.
              </p>
            </div>

            <div className="lg:text-right transform rotate-1">
              <div className="inline-block bg-gradient-to-r from-lime-400 via-pink-500 to-orange-500 text-black px-4 py-2 font-black text-xs uppercase">
                MADE FOR REBELS
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chaotic floating elements */}
        <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-lime-400 transform rotate-45 animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-6 h-6 bg-pink-500 rounded-full animate-bounce" />
        <div className="absolute top-1/2 left-1/2 w-2 h-8 bg-orange-500 transform -rotate-45" />
      </div>
    </footer>
  );
};

export default BrutalistFooter;
