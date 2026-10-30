import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TopLoadingBarProps {
  isLoading: boolean
}

export const TopLoadingBar: React.FC<TopLoadingBarProps> = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent overflow-hidden pointer-events-none"
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: 'easeInOut',
            }}
            className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#E3432B] to-transparent shadow-[0_0_10px_#E3432B]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

