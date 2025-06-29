import { motion } from 'framer-motion';
import { Check, Download, Minus, Plus, Star } from 'lucide-react';
import { useState } from 'react';

interface BrutalistPricingProps {
  onGetStarted: () => void;
}

const BrutalistPricing = ({ onGetStarted }) => {
  const [selectedCredits, setSelectedCredits] = useState(5);
  const [isCustomInput, setIsCustomInput] = useState(false);

  const creditPrice = 3; // $3 per credit
  const totalPrice = selectedCredits * creditPrice;

  // Quick select options
  const quickOptions = [1, 5, 10, 20, 50];

  const handleCreditChange = (credits) => {
    setSelectedCredits(credits);
    setIsCustomInput(false);
  };

  const handleCustomInput = (value) => {
    const credits = Math.max(1, parseInt(value) || 1);
    setSelectedCredits(credits);
  };

  const incrementCredits = () => {
    setSelectedCredits(prev => prev + 1);
  };

  const decrementCredits = () => {
    setSelectedCredits(prev => Math.max(1, prev - 1));
  };

  const getBulkDiscount = (credits) => {
    if (credits >= 50) return 20; // 20% off for 50+
    if (credits >= 20) return 15; // 15% off for 20+
    if (credits >= 10) return 10; // 10% off for 10+
    return 0;
  };

  const discount = getBulkDiscount(selectedCredits);
  const discountedPrice = totalPrice * (1 - discount / 100);

  return (
    <section className="py-20 sm:py-32 lg:py-40 bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(163, 230, 53, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 40%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)",
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-6xl md:text-7xl lg:text-[6rem] font-black leading-none mb-6">
            <span className="block text-white">BUY</span>
            <span className="block text-lime-400">EXPORT</span>
            <span className="block text-pink-500">CREDITS</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Start with 3 FREE credits. Buy more anytime. $3 per credit.
            <br className="hidden sm:block" />
            Each export costs 1 credit.
          </p>

          {/* Free Credits Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-lime-400/20 to-pink-500/20 border border-lime-400 px-6 py-3 rounded-lg"
          >
            <Star className="w-5 h-5 text-lime-400" />
            <span className="text-lime-400 font-bold">GET 3 FREE CREDITS ON SIGNUP</span>
            <Star className="w-5 h-5 text-lime-400" />
          </motion.div>
        </motion.div>

        {/* Main Credit Selector */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-black border-4 border-lime-400 p-6 sm:p-8 lg:p-12 relative overflow-hidden">
            {/* Background Animation */}
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 bg-lime-400 opacity-10 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 20, 0],
                y: [0, -20, 0],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative z-10">
              {/* Quick Select Options */}
              <div className="mb-8">
                <h3 className="text-xl sm:text-2xl font-black text-white mb-6 text-center">
                  QUICK SELECT
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
                  {quickOptions.map((credits) => (
                    <motion.button
                      key={credits}
                      onClick={() => handleCreditChange(credits)}
                      className={`p-3 sm:p-4 font-black text-center transition-all duration-300 ${selectedCredits === credits && !isCustomInput
                        ? 'bg-lime-400 text-black border-2 border-lime-400'
                        : 'bg-gray-800 text-white border-2 border-gray-600 hover:border-lime-400'
                        }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-lg sm:text-xl">{credits}</div>
                      <div className="text-xs sm:text-sm opacity-80">
                        {credits === 1 ? 'CREDIT' : 'CREDITS'}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Custom Credit Selector */}
              <div className="mb-8">
                <h3 className="text-xl sm:text-2xl font-black text-white mb-6 text-center">
                  OR CHOOSE CUSTOM AMOUNT
                </h3>

                <div className="flex items-center justify-center gap-4 mb-6">
                  <motion.button
                    onClick={decrementCredits}
                    className="w-12 h-12 bg-gray-800 hover:bg-lime-400 hover:text-black text-white border-2 border-gray-600 hover:border-lime-400 flex items-center justify-center font-black transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Minus className="w-5 h-5" />
                  </motion.button>

                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      min="1"
                      value={selectedCredits}
                      onChange={(e) => {
                        setIsCustomInput(true);
                        handleCustomInput(e.target.value);
                      }}
                      className="w-24 sm:w-32 h-16 bg-black border-4 border-lime-400 text-center text-2xl sm:text-3xl font-black text-lime-400 focus:outline-none focus:border-pink-500"
                    />
                    <span className="text-gray-400 text-sm mt-2">CREDITS</span>
                  </div>

                  <motion.button
                    onClick={incrementCredits}
                    className="w-12 h-12 bg-gray-800 hover:bg-lime-400 hover:text-black text-white border-2 border-gray-600 hover:border-lime-400 flex items-center justify-center font-black transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Pricing Display */}
              <div className="text-center mb-8">
                <div className="bg-gray-900 border-2 border-gray-700 p-6 sm:p-8 mx-auto max-w-md">
                  <div className="mb-4">
                    <div className="text-3xl sm:text-4xl font-black text-white mb-2">
                      {selectedCredits} {selectedCredits === 1 ? 'CREDIT' : 'CREDITS'}
                    </div>
                    <div className="text-sm text-gray-400">
                      ${creditPrice} per credit
                    </div>
                  </div>

                  {discount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-4"
                    >
                      <div className="text-lg text-gray-500 line-through">
                        ${totalPrice.toFixed(2)}
                      </div>
                      <div className="text-sm text-lime-400 font-bold">
                        {discount}% BULK DISCOUNT
                      </div>
                    </motion.div>
                  )}

                  <div className="text-4xl sm:text-5xl font-black text-lime-400">
                    ${discount > 0 ? discountedPrice.toFixed(2) : totalPrice.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Bulk Discount Info */}
              {selectedCredits < 10 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mb-8 p-4 bg-gray-900/50 border border-gray-700"
                >
                  <div className="text-gray-300 text-sm">
                    💡 <span className="font-bold">Bulk Discounts Available:</span>
                    <br />
                    10+ credits: 10% off • 20+ credits: 15% off • 50+ credits: 20% off
                  </div>
                </motion.div>
              )}

              {/* Purchase Button */}
              <motion.button
                onClick={onGetStarted}
                className="w-full bg-lime-400 hover:bg-pink-500 text-black hover:text-white py-4 sm:py-6 font-black text-lg sm:text-xl uppercase tracking-wide transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <Download className="w-6 h-6" />
                  BUY {selectedCredits} {selectedCredits === 1 ? 'CREDIT' : 'CREDITS'} FOR ${discount > 0 ? discountedPrice.toFixed(2) : totalPrice.toFixed(2)}
                </span>
                <motion.div
                  className="absolute inset-0 bg-pink-500"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              {/* Features List */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Unlimited Website Creation",
                  "All Brutal Templates",
                  "Mobile Responsive Exports",
                  "Clean ReactJs/TailwindCss Code",
                  "SSL Certificates Included",
                  "Community Support"
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <Check className="w-5 h-5 text-lime-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-8">
            HOW IT WORKS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {[
              { step: "1", title: "CREATE", desc: "Build unlimited websites with our brutal templates" },
              { step: "2", title: "EXPORT", desc: "Download your site (costs 1 credit per export)" },
              { step: "3", title: "DEPLOY", desc: "Upload to any hosting platform and go live" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`p-6 bg-gray-900/50 border ${index === 1 ? 'border-lime-400' : 'border-orange-400'} border-gray-700 rounded-lg`}
              >
                <div className="text-4xl font-black text-lime-400 mb-4">{item.step}</div>
                <div className="text-xl font-bold text-white mb-2">{item.title}</div>
                <div className="text-gray-400 text-sm">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BrutalistPricing;