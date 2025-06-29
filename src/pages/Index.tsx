import BrutalistFAQ from '@/components/brutalist/BrutalistFAQ';
import BrutalistFeatures from '@/components/brutalist/BrutalistFeatures';
import BrutalistFooter from '@/components/brutalist/BrutalistFooter';
import BrutalistHero from '@/components/brutalist/BrutalistHero';
import BrutalistPricing from '@/components/brutalist/BrutalistPricing';
import BrutalistTestimonials from '@/components/brutalist/BrutalistTestimonials';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleGetStarted = () => {
        navigate('/auth');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const menuItems = ['FEATURES', 'PRICING', 'TEMPLATES', 'SUPPORT'];

    return (
        <div className="bg-black text-white overflow-x-hidden">
            {/* Enhanced Animated Background */}
            <motion.div
                className="fixed inset-0 opacity-20 pointer-events-none"
                style={{ y: backgroundY }}
            >
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        background: [
                            "radial-gradient(circle at 20% 80%, rgba(163, 230, 53, 0.3) 0%, transparent 50%)",
                            "radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)",
                            "radial-gradient(circle at 40% 40%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)",
                            "radial-gradient(circle at 60% 60%, rgba(163, 230, 53, 0.3) 0%, transparent 50%)"
                        ]
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                />
            </motion.div>

            {/* Enhanced Responsive Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-lime-400/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20">
                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center"
                        >
                            <motion.div
                                className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight cursor-pointer"
                                whileHover={{ scale: 1.05, rotate: 1 }}
                            >
                                <span className="text-lime-400">DEV</span>
                                <span className="text-pink-500">BUILDER</span>
                            </motion.div>
                        </motion.div>

                        {/* Desktop Navigation Menu */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hidden md:flex items-center space-x-6 lg:space-x-8"
                        >
                            {menuItems.map((item, index) => (
                                <motion.a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className="text-gray-300 hover:text-lime-400 font-bold text-xs lg:text-sm uppercase tracking-wide transition-colors duration-200"
                                    whileHover={{ y: -2 }}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    {item}
                                </motion.a>
                            ))}
                        </motion.div>

                        {/* Desktop CTA Button */}
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={handleGetStarted}
                            className="hidden md:block bg-lime-400 text-black px-4 py-2 lg:px-8 lg:py-3 font-black uppercase tracking-wide text-xs lg:text-sm hover:bg-pink-500 hover:text-white transition-all duration-300 transform hover:scale-105 hover:rotate-1 relative overflow-hidden group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="relative z-10">GET STARTED</span>
                            <motion.div
                                className="absolute inset-0 bg-pink-500"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.button>

                        {/* Mobile Menu Button */}
                        <motion.button
                            className="md:hidden flex flex-col justify-center items-center w-8 h-8 relative"
                            onClick={toggleMobileMenu}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.span
                                className="block w-6 h-0.5 bg-lime-400 mb-1"
                                animate={isMobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                            <motion.span
                                className="block w-6 h-0.5 bg-lime-400 mb-1"
                                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                            <motion.span
                                className="block w-6 h-0.5 bg-lime-400"
                                animate={isMobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.button>
                    </div>

                    {/* Mobile Menu */}
                    <motion.div
                        className="md:hidden overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                            height: isMobileMenuOpen ? 'auto' : 0,
                            opacity: isMobileMenuOpen ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-2 pt-2 pb-6 space-y-4 bg-black/95 border-t border-lime-400/20">
                            {menuItems.map((item, index) => (
                                <motion.a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className="block text-gray-300 hover:text-lime-400 font-bold text-sm uppercase tracking-wide transition-colors duration-200 py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{
                                        opacity: isMobileMenuOpen ? 1 : 0,
                                        x: isMobileMenuOpen ? 0 : -20
                                    }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    {item}
                                </motion.a>
                            ))}
                            <motion.button
                                onClick={() => {
                                    handleGetStarted();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full bg-lime-400 text-black px-6 py-3 font-black uppercase tracking-wide text-sm hover:bg-pink-500 hover:text-white transition-all duration-300 mt-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: isMobileMenuOpen ? 1 : 0,
                                    y: isMobileMenuOpen ? 0 : 20
                                }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                GET STARTED
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </nav>

            {/* Main Content - Add top padding to account for fixed nav */}
            <div className="pt-16 sm:pt-20">
                <BrutalistHero onGetStarted={navigate} />
                <BrutalistFeatures />
                <BrutalistTestimonials />
                <BrutalistFAQ />
                <BrutalistPricing onGetStarted={navigate} />
                <BrutalistFooter />
            </div>

            {/* Scroll Progress Indicator */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-lime-400 via-pink-500 to-orange-500 z-50 origin-left"
                style={{ scaleX: scrollYProgress }}
            />

            {/* Responsive Floating Action Button */}
            <motion.button
                className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-16 sm:h-16 bg-lime-400 text-black rounded-full shadow-lg z-40 flex items-center justify-center font-black text-lg sm:text-xl"
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                    y: [0, -10, 0],
                    boxShadow: [
                        "0 4px 20px rgba(163, 230, 53, 0.3)",
                        "0 8px 40px rgba(163, 230, 53, 0.6)",
                        "0 4px 20px rgba(163, 230, 53, 0.3)"
                    ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                onClick={handleGetStarted}
            >
                ↑
            </motion.button>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
};

export default Index;