import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { LogOut, Maximize, Minimize, User } from 'lucide-react'
import { Button } from '@repo/react-components/ui'

import useAuth from 'src/hooks/use-auth'
import btnPrivateLogo from 'src/assets/btn-private-logo.png'

interface AdminLayoutProps {
  children: ReactNode
}

function AdminLayout({
  children,
}: AdminLayoutProps) {

  const { user, logout } = useAuth()

  const [isFullscreen, setIsFullscreen] = useState(false)

  // Handle fullscreen toggle
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      } catch (error) {
        console.error('Error entering fullscreen:', error)
      }
    } else {
      try {
        await document.exitFullscreen()
        setIsFullscreen(false)
      } catch (error) {
        console.error('Error exiting fullscreen:', error)
      }
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('❌ Logout error:', error)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm shadow-xl border-b border-amber-400/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Left Side - Title */}
            <div className="flex items-center">
              <div>
                <img 
                  src={btnPrivateLogo} 
                  alt="BTN Private Logo" 
                  className="max-w-full max-h-10"
                />
              </div>
            </div>

            {/* Right Side - Actions & User */}
            <div className="flex items-center gap-4">
              {/* Fullscreen Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="hidden sm:flex bg-black/20 border-gray-600 text-gray-300 hover:bg-amber-400 hover:border-amber-400/30"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
              </Button>

              {/* User Info */}
              <div className="flex items-center gap-3 px-4 border-l border-amber-400/20">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-400/30">
                    <User className="w-4 h-4 text-amber-300" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-medium text-gray-100">
                      {user?.name || 'Admin User'}
                    </p>
                    <p className="text-xs text-amber-200">Administrator</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500/10 border-red-400/30 text-red-300 hover:bg-red-400/30 hover:border-red-600/30 hover:text-gray-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm border-t border-amber-400/20 mt-auto fixed bottom-0 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="text-amber-200 font-medium">BTN Private - Grand Launching 2025</div>
            <div className="flex items-center gap-4">
              <span>Real-time Dashboard</span>
              <div
                className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
                title="Live Updates Active"
              ></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AdminLayout
