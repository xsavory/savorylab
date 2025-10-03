import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import useAttendanceSubscription from 'src/hooks/use-attendance-subscription'

import headlineImg from 'src/assets/headline.png'
import background2Img from 'src/assets/background2.png'
import lightImg from 'src/assets/light.png'
import treeImg from 'src/assets/tree.png'
import womanGreetingsGif from 'src/assets/woman-greetings.gif'

export const Route = createFileRoute('/greetings')({
  component: GreetingsPage,
})

interface GreetingState {
  show: boolean
  participantName: string
  checkedInAt: string
}

function GreetingsPage() {
  const { latestCheckIn } = useAttendanceSubscription()
  const [greeting, setGreeting] = useState<GreetingState>({
    show: false,
    participantName: '',
    checkedInAt: '',
  })

  // Text-to-Speech function
  const speakGreeting = (participantName: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(
        `Selamat datang ${participantName}! Terima kasih telah bergabung bersama kami di Grand Launching BTN Private.`
      )

      // Configure voice settings for Indonesian
      utterance.lang = 'id-ID'
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 0.8

      // Try to use Indonesian voice if available
      const voices = window.speechSynthesis.getVoices()
      const indonesianVoice = voices.find(voice =>
        voice.lang === 'id-ID' || voice.lang.startsWith('id')
      )

      if (indonesianVoice) {
        utterance.voice = indonesianVoice
      }

      // Speak the greeting
      window.speechSynthesis.speak(utterance)
    }
  }

  // Handle new check-ins
  useEffect(() => {
    if (latestCheckIn?.participant) {
      setGreeting({
        show: true,
        participantName: latestCheckIn.participant.name,
        checkedInAt: latestCheckIn.participant.checkedInAt || new Date().toISOString(),
      })

      // Speak the greeting after a short delay
      const speakTimer = setTimeout(() => {
        speakGreeting(latestCheckIn.participant.name)
      }, 500)

      // Auto-hide after 10 seconds
      const hideTimer = setTimeout(() => {
        setGreeting((prev) => ({ ...prev, show: false }))
      }, 10000)

      return () => {
        clearTimeout(speakTimer)
        clearTimeout(hideTimer)
        // Cancel speech if component unmounts
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel()
        }
      }
    }
  }, [latestCheckIn])

  return (
    <div className="h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Background Elements */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${background2Img})` }}
      />

      {/* Light effects overlay */}
      <div
        className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-30 mix-blend-screen"
        style={{ backgroundImage: `url(${lightImg})` }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-slate-900/40 to-black/70"></div>

      {/* Decorative tree silhouette */}
      <div
        className="absolute bottom-0 right-0 w-96 h-full bg-contain bg-bottom bg-no-repeat opacity-15 pointer-events-none"
        style={{ backgroundImage: `url(${treeImg})` }}
      />

      {/* Golden accent elements */}
      <div className="absolute top-20 left-20 w-32 h-32 border border-amber-400/15 rounded-full"></div>
      <div className="absolute bottom-40 left-32 w-16 h-16 border border-amber-300/10 rounded-lg rotate-45"></div>
      <div className="absolute top-1/2 right-32 w-24 h-24 border border-amber-500/10 rounded-full"></div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center relative h-full">
        {/* Standby State */}
        {!greeting.show && (
          <div className="text-center animate-fade-in relative z-10">
            {/* Event Headline */}
            <div className="flex justify-center">
              <img
                src={headlineImg}
                alt="Grand Launching BTN Private - Elevate Your Legacy"
                className="max-w-2xl h-auto object-contain drop-shadow-2xl filter brightness-110"
              />
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-center gap-2">
                <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-16"></div>
                <span className="text-lg text-amber-200 italic font-medium px-4">
                  An Invitation to Excellence
                </span>
                <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-16"></div>
              </div>
              <p className="text-base text-gray-400">
                Crafted exclusively for distinguished guests
              </p>
            </div>

            {/* Standby Animation */}
            <div className="flex justify-center mt-12">
              <div className="relative">
                <div className="w-28 h-28 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-amber-400/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-amber-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                </div>
                {/* Pulsing ring effect */}
                <div className="absolute inset-0 rounded-full border-2 border-amber-400/20 animate-ping"></div>
              </div>
            </div>
          </div>
        )}

        {/* Greeting Display */}
        {greeting.show && (
          <div className="text-center animate-greeting-enter relative z-10">
            {/* Woman Greeting GIF with Circular Frame */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Luxurious Circular Golden Frame */}
                <div className="relative w-96 h-96 rounded-full bg-gradient-to-br from-amber-400/25 via-amber-300/20 to-amber-500/30 backdrop-blur-sm border-4 border-amber-400/40 shadow-2xl animate-frame-glow">
                  {/* Inner circular frame */}
                  <div className="relative w-full h-full rounded-full bg-gradient-to-t from-amber-100/15 to-transparent border-2 border-amber-300/25 p-3">
                    {/* Decorative accent dots around the circle */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-amber-400/60 rounded-full"></div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-amber-400/60 rounded-full"></div>
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-amber-400/60 rounded-full"></div>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-amber-400/60 rounded-full"></div>

                    {/* Diagonal accent dots */}
                    <div className="absolute top-6 left-6 w-2 h-2 bg-amber-300/50 rounded-full"></div>
                    <div className="absolute top-6 right-6 w-2 h-2 bg-amber-300/50 rounded-full"></div>
                    <div className="absolute bottom-6 left-6 w-2 h-2 bg-amber-300/50 rounded-full"></div>
                    <div className="absolute bottom-6 right-6 w-2 h-2 bg-amber-300/50 rounded-full"></div>

                    {/* Masked GIF */}
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                      <img
                        src={womanGreetingsGif}
                        alt="Welcome greeting"
                        className="w-full h-full object-cover drop-shadow-xl scale-110"
                        style={{
                          maskImage: 'radial-gradient(circle, black 85%, transparent 100%)',
                          WebkitMaskImage: 'radial-gradient(circle, black 85%, transparent 100%)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Elegant outer glow */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/15 to-amber-500/20 blur-xl"></div>
                </div>

                {/* Enhanced Ripple Effect behind frame */}
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                  <div className="w-[450px] h-[450px] rounded-full bg-emerald-400/15 animate-ping"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                  <div className="w-[400px] h-[400px] rounded-full bg-emerald-300/20 animate-ping animation-delay-100"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                  <div className="w-[350px] h-[350px] rounded-full bg-amber-400/25 animate-ping animation-delay-200"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                  <div className="w-[300px] h-[300px] rounded-full bg-amber-300/20 animate-ping animation-delay-300"></div>
                </div>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-20"></div>
                <span className="text-2xl text-amber-200 italic font-medium">
                  Welcome to Excellence
                </span>
                <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent w-20"></div>
              </div>
              <h3 className="text-7xl font-bold text-gray-100 mb-6 drop-shadow-2xl">
                {greeting.participantName}
              </h3>
              <p className="text-3xl font-bold text-amber-300 mb-2">
                BTN Private Grand Launching 2025
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes greeting-enter {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(30px);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05) translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes frame-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.3), 0 0 40px rgba(251, 191, 36, 0.1), 0 0 60px rgba(251, 191, 36, 0.05);
          }
          50% {
            box-shadow: 0 0 30px rgba(251, 191, 36, 0.4), 0 0 60px rgba(251, 191, 36, 0.2), 0 0 80px rgba(251, 191, 36, 0.1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-greeting-enter {
          animation: greeting-enter 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        .animate-frame-glow {
          animation: frame-glow 3s ease-in-out infinite;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  )
}
