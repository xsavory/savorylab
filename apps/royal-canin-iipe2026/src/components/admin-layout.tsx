import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { LogOut, Maximize, Minimize, User, Loader2 } from 'lucide-react'
import { Button, toast } from '@repo/react-components/ui'

import useAdminAuth from 'src/hooks/use-admin-auth'
import RoyalCaninLogo from 'src/assets/royal-canin-logo.png'

interface AdminLayoutProps {
  children: ReactNode
}

function AdminLayout({
  children,
}: AdminLayoutProps) {
  const navigate = useNavigate()
  const { user, logout } = useAdminAuth()

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

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
      setIsLoggingOut(true)
      const result = await logout();

      if (result?.success) {
        toast.success('Logged out successfully')
        navigate({ to: '/login' });
      } else {
        toast.error(result?.error || 'Failed to logout')
        setIsLoggingOut(false)
      }
    } catch (error) {
      console.error('❌ Logout error:', error)
      toast.error('An error occurred during logout')
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            {/* Left Side - Logo & Title */}
            <div className="flex items-center gap-4">
              <img
                src={RoyalCaninLogo}
                alt="Royal Canin"
                className="h-8 w-auto"
              />
              <div className="border-l border-gray-300 pl-4 h-8 hidden md:inline">
                <h1 className="text-lg font-bold text-foreground font-display">Admin Dashboard</h1>
              </div>
            </div>

            {/* Right Side - Actions & User */}
            <div className="flex items-center gap-4">
              {/* Fullscreen Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="hidden sm:flex"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
              </Button>

              {/* User Info */}
              <div className="flex items-center gap-3 px-4 border-l border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-medium text-foreground">
                      {user?.name || 'Admin'}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email || 'Authenticated'}</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Logging out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Logout</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-col md:flex-row text-xs text-gray-600">
            <div className="font-medium">
              Royal Canin IIPE 2026 - Admin Dashboard
            </div>
            <div className="flex items-center gap-2">
              <span>Powered by Aftertaste Creative</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default AdminLayout

