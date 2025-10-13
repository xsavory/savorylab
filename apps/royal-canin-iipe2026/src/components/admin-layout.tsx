import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { BarChart3, LogOut, Maximize, Minimize, User } from 'lucide-react'
import { Button } from '@repo/react-components/ui'

import useAdminAuth from 'src/hooks/use-admin-auth'

interface AdminLayoutProps {
  children: ReactNode
}

function AdminLayout({
  children,
}: AdminLayoutProps) {

  const { user, logout } = useAdminAuth()

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
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm shadow-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Left Side - Title */}
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
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
              <div className="flex items-center gap-3 px-4 border-l border-border">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-medium text-foreground">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">Authenticated</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
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
      <footer className="bg-card/50 border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="text-foreground font-medium">SavoryLab Appwrite Template</div>
            <div className="flex items-center gap-4">
              <span>Connected to Appwrite</span>
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                title="Connected"
              ></div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default AdminLayout

