import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { QrCode, Maximize, Minimize } from 'lucide-react'
import { Button } from '@repo/react-components/ui'

import QRScannerModal from 'src/components/booth-qr-scanner-modal'
import logoImg from 'src/assets/logo2.png'
import background2Img from 'src/assets/background2.png'
import lightImg from 'src/assets/light.png'

export const Route = createFileRoute('/booth')({
  component: BoothScanner,
})

function BoothScanner() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Primary background with dark elegant overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{ backgroundImage: `url(${background2Img})` }}
      />

      {/* Light effects overlay for golden accents */}
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-40 mix-blend-screen"
        style={{ backgroundImage: `url(${lightImg})` }}
      />

      {/* Dark elegant gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-slate-900/30 to-black/60"></div>

      {/* Subtle geometric accents with golden theme */}
      <div className="absolute top-20 left-16 w-24 h-24 border border-amber-400/20 rounded-full"></div>
      <div className="absolute bottom-32 left-20 w-16 h-16 border border-amber-300/15 rounded-lg rotate-45"></div>
      <div className="absolute top-1/3 left-10 w-8 h-8 bg-amber-400/10 rounded-full blur-sm"></div>

      {/* Additional atmospheric elements */}
      <div className="absolute top-40 right-20 w-32 h-32 border border-amber-500/10 rounded-full"></div>
      <div className="absolute bottom-20 left-1/4 w-6 h-6 bg-amber-300/20 rounded-full blur-md"></div>

      {/* Fullscreen Toggle Button */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
          className="bg-black/20 border-gray-600 text-gray-300 hover:bg-amber-400 hover:border-amber-400/30"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4" />
          ) : (
            <Maximize className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-4xl">

          {/* Logo image */}
          <div className="mb-12 flex justify-center">
            <img
              src={logoImg}
              alt="BTN Private Registration"
              className="max-w-full max-h-48 object-contain drop-shadow-2xl filter brightness-110"
            />
          </div>

          {/* Subtitle text */}
          <div className="mb-8">
            <p className="text-gray-300 text-xl font-medium">
              QR Scanner Booth
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Scan QR code to check-in participants
            </p>
          </div>

          <Button
            size="lg"
            onClick={() => setIsModalOpen(true)}
            className="text-lg px-12 py-6 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-black font-bold shadow-2xl shadow-amber-500/40 transform hover:scale-105 transition-all duration-300 border-0 rounded-full ring-2 ring-amber-400/30 hover:ring-amber-400/50"
          >
            <QrCode className="mr-3 h-5 w-5" />
            Open QR Scanner
          </Button>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  )
}
