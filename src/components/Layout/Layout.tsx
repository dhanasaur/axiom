import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#1A1E24] flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex flex-row">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8 bg-[#F8F7F2]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
