import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@repo/react-components/ui'

import useAuth from 'src/hooks/use-auth'

import logoImg from 'src/assets/logo2.png'
import background2Img from 'src/assets/background2.png'
import lightImg from 'src/assets/light.png'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleCTAClick = () => {
    if (isAuthenticated) {
      navigate({ to: '/admin' })
    } else {
      navigate({ to: '/login' })
    }
  }

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
      
      {/* Main content container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-4xl">
          
          {/* Headline image */}
          <div className="mb-12 flex justify-center">
            <img
              src={logoImg}
              alt="Grand Launching BTN Private - Elevate Your Legacy"
              className="max-w-full max-h-48 object-contain drop-shadow-2xl filter brightness-110"
            />
          </div>

          {/* Subtitle text */}
          <div className="mb-8">
            <p className="text-gray-300 text-xl font-medium">
              Grand Launching Event System
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Event registration and management platform
            </p>
          </div>
          
          {/* CTA Button */}
          <Button 
            onClick={handleCTAClick}
            size="lg"
            className="text-lg px-12 py-6 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-black font-bold shadow-2xl shadow-amber-500/40 transform hover:scale-105 transition-all duration-300 border-0 rounded-full ring-2 ring-amber-400/30 hover:ring-amber-400/50"
          >
            {isAuthenticated ? (
              <>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9z" />
                </svg>
                Buka Dashboard
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Masuk ke Admin
              </>
            )}
          </Button>
        </div>
      </div>
      {/* Footer note */}
      <div className="absolute bottom-12 flex justify-center w-full">
        <p className="text-sm text-muted-foreground italic text-center">
          Dirancang khusus untuk pengalaman premium BTN Private
        </p>
      </div>
    </div>
  )
}
