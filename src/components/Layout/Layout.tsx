import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { TopLoadingBar } from '../Common/TopLoadingBar'

export const Layout: React.FC = () => {
  const location = useLocation()
  const [isNavigating, setIsNavigating] = useState(false)

  // Brief top progress bar on route change
  useEffect(() => {
    setIsNavigating(true)
    const timer = setTimeout(() => setIsNavigating(false), 240)
    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#1A1E24] flex flex-col font-sans">
      <TopLoadingBar isLoading={isNavigating} />
      <Navbar />
      <div className="flex-1 flex flex-row">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8 bg-[#F8F7F2]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
