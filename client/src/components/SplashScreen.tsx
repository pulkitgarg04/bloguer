import { motion } from 'framer-motion';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={() => {
            }}
        >
            <div className="relative px-8 py-4">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        duration: 0.8,
                        ease: [0.6, -0.05, 0.01, 0.99],
                    }}
                    className="text-4xl md:text-6xl font-bold text-gray-800 tracking-wider z-10 relative"
                >
                    BLOG
                    <motion.span
                        initial={{ color: '#1f2937' }} // gray-800
                        animate={{ color: '#ef4444' }} // red-500
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="text-red-500"
                    >
                        UER
                    </motion.span>
                </motion.div>
                
                <svg className="absolute inset-0 w-full h-full">
                    <motion.rect
                        className="w-full h-full text-red-500"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ 
                            delay: 0.5, 
                            duration: 1.5, 
                            ease: "easeInOut" 
                        }}
                        onAnimationComplete={onComplete}
                    />
                </svg>
            </div>
        </motion.div>
    );
}
