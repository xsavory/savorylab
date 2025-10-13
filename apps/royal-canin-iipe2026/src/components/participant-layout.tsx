import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { Home, Trophy, History, BookOpen, Scan } from 'lucide-react'
import { motion } from 'framer-motion'

import QRScannerModal from './qr-scanner-modal'
import RoyalCaninLogo from 'src/assets/royal-canin-logo-white.png'

interface ParticipantLayoutProps {
  children: ReactNode
}

function ParticipantLayout({
  children,
}: ParticipantLayoutProps) {

  const location = useLocation()
  const [showScanner, setShowScanner] = useState(false)

  const navItems = [
    { icon: Home, label: 'Home', path: '/participant' },
    { icon: BookOpen, label: 'Pet Guide', path: '/participant/pet-guide' },
    { icon: History, label: 'History', path: '/participant/history' },
    { icon: Trophy, label: 'Leaderboard', path: '/participant/leaderboard' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50/30">
      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-screen">
        {/* Header */}
        <header className="relative">
          {/* Half circle background */}
          <div className="absolute inset-0 bg-primary" style={{
            clipPath: 'ellipse(100% 100% at 50% 0%)'
          }} />

          <div className="relative px-6 pt-5 pb-5 z-10">
            {/* Logo Only - Centered & Bigger */}
            <div className="flex justify-center">
              <img
                src={RoyalCaninLogo}
                alt="Royal Canin"
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-24">
          {children}
        </main>

        {/* Bottom Tab Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="relative px-4 py-3">
            <div className="flex items-center justify-between">
              {/* First 2 Nav Items */}
              {navItems.slice(0, 2).map((item) => {
                const isActive = item.path === '/participant'
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex-1"
                  >
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className={`p-2 rounded-xl transition-colors ${
                        isActive ? 'bg-primary/10' : 'bg-transparent'
                      }`}>
                        <item.icon className={`w-5 h-5 ${
                          isActive ? 'text-primary' : 'text-gray-400'
                        }`} />
                      </div>
                      <span className={`text-xs font-medium ${
                        isActive ? 'text-primary' : 'text-gray-500'
                      }`}>
                        {item.label}
                      </span>
                    </motion.div>
                  </Link>
                )
              })}

              {/* Center QR Scanner CTA */}
              <div className="flex-1 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowScanner(true)}
                  className="relative -mt-10"
                >
                  {/* 3D Effect - Bottom layer (darker) */}
                  <div className="absolute top-1 left-0 w-16 h-16 bg-primary/60 rounded-full" />

                  {/* Main button */}
                  <div className="relative w-16 h-16 bg-primary rounded-full flex items-center justify-center border-4 border-white">
                    <Scan className="w-8 h-8 text-white" />
                  </div>

                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-bold text-primary whitespace-nowrap">
                    Scan QR
                  </span>
                </motion.button>
              </div>

              {/* Last 2 Nav Items */}
              {navItems.slice(2, 4).map((item) => {
                const isActive = item.path === '/participant'
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex-1"
                  >
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className={`p-2 rounded-xl transition-colors ${
                        isActive ? 'bg-primary/10' : 'bg-transparent'
                      }`}>
                        <item.icon className={`w-5 h-5 ${
                          isActive ? 'text-primary' : 'text-gray-400'
                        }`} />
                      </div>
                      <span className={`text-xs font-medium ${
                        isActive ? 'text-primary' : 'text-gray-500'
                      }`}>
                        {item.label}
                      </span>
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex md:flex-col md:min-h-screen">
        {/* Desktop Header */}
        <header className="relative bg-primary">
          <div className="container mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div>
                <img
                  src={RoyalCaninLogo}
                  alt="Royal Canin"
                  className="h-12 w-auto object-contain"
                />
              </div>

              {/* Navigation */}
              <nav className="flex gap-4">
                {navItems.map((item) => {
                  const isActive = item.path === '/participant'
                    ? location.pathname === item.path
                    : location.pathname.startsWith(item.path)
                  return (
                    <Link key={item.path} to={item.path}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-colors ${
                          isActive
                            ? 'bg-white text-primary'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                      </motion.div>
                    </Link>
                  )
                })}
              </nav>

              {/* Scan QR Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowScanner(true)}
                className="relative"
              >
                {/* 3D Effect - Bottom layer */}
                <div className="absolute top-1 left-0 w-full h-full bg-white/40 rounded-xl" />

                <div className="relative bg-white rounded-xl px-6 py-2.5 flex items-center gap-2">
                  <Scan className="w-5 h-5 text-primary" />
                  <span className="text-primary font-bold text-sm">Scan QR</span>
                </div>
              </motion.button>
            </div>
          </div>
        </header>

        {/* Desktop Main Content */}
        <main className="flex-1 container mx-auto px-8 py-8 bg-gradient-to-br from-white via-gray-50 to-orange-50/30">
          {children}
        </main>
      </div>

      <QRScannerModal
        open={showScanner}
        onOpenChange={setShowScanner}
      />
    </div>
  )
}

export default ParticipantLayout