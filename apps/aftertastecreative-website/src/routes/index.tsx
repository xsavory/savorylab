import { createFileRoute } from '@tanstack/react-router'

import Logo from "src/assets/logo.svg";
import { RetroGrid } from "src/components/retro-grid";

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center px-4 rounded-lg border bg-background text-center">
      <div className="mb-24">
        <img
          src={Logo}
          alt="Aftertaste Creative Logo"
          className="w-72 h-auto mx-auto"
        />
      </div>

      <span
        className="relative z-10 bg-gradient-to-r from-[#71F79F] via-[#00F0FF] to-[#71F79F]
                   bg-[length:200%_200%] bg-clip-text 
                   text-6xl md:text-7xl lg:text-8xl 
                   font-bold leading-tight tracking-tighter 
                   text-transparent drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]"
        style={{
          animation: "shimmer 6s ease-in-out infinite",
        }}
      >
        Coming Soon
      </span>

      <p className="max-w-md sm:max-w-xl md:max-w-2xl mx-auto 
                    text-sm sm:text-base md:text-lg text-muted-foreground">
        Stay tuned for updates and exciting experiences ahead.
      </p>

      <RetroGrid />

      {/* Animasi shimmer */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
