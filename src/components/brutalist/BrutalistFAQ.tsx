import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const BrutalistFAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "WHAT THE HELL IS BRUTALIST WEB DESIGN?",
            answer: "IT'S THE ANTI-DESIGN REVOLUTION. RAW, BOLD, UNAPOLOGETIC. WE BREAK EVERY CONVENTIONAL RULE TO CREATE WEBSITES THAT DEMAND ATTENTION.",
            color: "lime-400"
        },
        {
            question: "CAN I REALLY BUILD WITHOUT CODING?",
            answer: "ABSOLUTELY. OUR VISUAL CHAOS EDITOR LETS YOU DRAG, DROP, AND DESTROY DESIGN CONVENTIONS WITHOUT WRITING A SINGLE LINE OF CODE.",
            color: "pink-500"
        },
        {
            question: "HOW FAST CAN I DEPLOY MY REBELLION?",
            answer: "SECONDS. NOT MINUTES. NOT HOURS. SECONDS. YOUR DIGITAL ANARCHY GOES LIVE FASTER THAN YOU CAN SAY 'CONVENTIONAL DESIGN IS DEAD'.",
            color: "orange-500"
        },
        {
            question: "WILL MY CHAOS WORK ON MOBILE?",
            answer: "YOUR REBELLION ADAPTS TO EVERY SCREEN. DESKTOP, MOBILE, TABLET - YOUR ANARCHY LOOKS PERFECT EVERYWHERE.",
            color: "lime-400"
        },
        {
            question: "WHAT IF I NEED HELP WITH MY REBELLION?",
            answer: "OUR SUPPORT REBELS ARE STANDING BY 24/7. EMAIL, CHAT, CARRIER PIGEON - WE'LL HELP YOU PERFECT YOUR DIGITAL CHAOS.",
            color: "pink-500"
        },
        {
            question: "CAN I EXPORT MY CHAOTIC CREATION?",
            answer: "YOUR CODE, YOUR RULES. EXPORT CLEAN REACTJS/TAILWINDCSS TO HOST ANYWHERE. NO VENDOR LOCK-IN, NO CORPORATE CHAINS.",
            color: "orange-500"
        }
    ];

    return (
        <section className="py-40 bg-black relative overflow-hidden">
            <div className="absolute inset-0">
                {/* Chaotic background elements */}
                <motion.div
                    className="absolute top-1/4 right-1/4 w-32 h-32 bg-lime-400/10"
                    animate={{
                        rotate: [0, 90, 180, 270, 360],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-1/3 left-1/3 w-24 h-96 bg-pink-500/5"
                    animate={{
                        skewX: [0, 15, -15, 0],
                        skewY: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-6xl md:text-7xl lg:text-[6rem] font-black leading-none mb-8">
                        <span className="block text-white transform -rotate-1">REBEL</span>
                        <span className="block text-lime-400 transform rotate-2">QUESTIONS</span>
                    </h2>
                    <p className="text-xl text-gray-300 transform rotate-1">
                        ANSWERS FOR THE DIGITALLY CURIOUS
                    </p>
                </motion.div>

                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={`transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
                        >
                            <div className={`bg-gray-900 border-4 border-${faq.color} relative overflow-hidden`}>
                                <motion.button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full p-8 text-left flex items-center justify-between group"
                                    whileHover={{ backgroundColor: "rgba(17, 24, 39, 0.8)" }}
                                >
                                    <h3 className="text-xl md:text-2xl font-black text-white leading-tight pr-4">
                                        {faq.question}
                                    </h3>
                                    <motion.div
                                        animate={{ rotate: openIndex === index ? 45 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {openIndex === index ? (
                                            <Minus className={`w-8 h-8 text-${faq.color} flex-shrink-0`} />
                                        ) : (
                                            <Plus className={`w-8 h-8 text-${faq.color} flex-shrink-0`} />
                                        )}
                                    </motion.div>
                                </motion.button>

                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className={`px-8 pb-8 border-t-2 border-${faq.color}/30`}>
                                                <motion.p
                                                    initial={{ y: -20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ duration: 0.3, delay: 0.1 }}
                                                    className="text-gray-300 text-lg leading-relaxed pt-6"
                                                >
                                                    {faq.answer}
                                                </motion.p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Animated corner accent */}
                                <motion.div
                                    className={`absolute top-0 right-0 w-0 h-0 bg-${faq.color} opacity-20`}
                                    whileHover={{ width: 40, height: 40 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrutalistFAQ;
