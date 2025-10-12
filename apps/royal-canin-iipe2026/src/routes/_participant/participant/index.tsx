import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Carousel, CarouselContent, CarouselItem, CarouselAutoplay } from '@repo/react-components/ui'

import useParticipantAuth from 'src/hooks/use-participant-auth'
import { ParticipantMenuGrid, ParticipantMenuDrawer } from 'src/components/participant-menu'
import Banner1 from 'src/assets/banner-1.webp'
import Banner2 from 'src/assets/banner-2.webp'
import Banner3 from 'src/assets/banner-1.webp'

export const Route = createFileRoute('/_participant/participant/')({
  component: Participant,
})

// Global ref outside component to survive re-renders
let isInitialized = false

function Participant() {
  const { user } = useParticipantAuth()
  const navigate = useNavigate()
  const search = useSearch({ from: '/_participant/participant/' }) as { menu?: string }

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  // Initialize from URL only once using global flag
  useEffect(() => {
    if (search.menu && !isInitialized) {
      isInitialized = true
      setActiveMenuId(search.menu)
      setIsDrawerOpen(true)
    }

    // Cleanup on unmount
    return () => {
      isInitialized = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const banners = [
    { id: 1, image: Banner1, alt: 'Royal Canin Scan & Earn Promotion' },
    { id: 2, image: Banner2, alt: 'Royal Canin Voucher & Rewards' },
    { id: 3, image: Banner3, alt: 'Royal Canin x Samsung' },
  ]

  const handleMenuOpen = (menuId: string) => {
    setActiveMenuId(menuId)
    setIsDrawerOpen(true)
    navigate({ to: '.', search: { menu: menuId } })
  }

  const handleMenuClose = () => {
    setIsDrawerOpen(false)
    setActiveMenuId(null)
    navigate({ to: '.', search: {} })
  }

  return (
    <div className="p-4">
      {/* User Info Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="bg-white rounded-xl px-4 py-2 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            {/* User Info */}
            <div>
              <h2 className="text-lg font-bold text-foreground font-display">
                {user?.name || 'Guest'}
              </h2>
              <p className="text-sm text-gray-600">
                {user?.phone || '-'}
              </p>
            </div>

            {/* Points Display */}
            <div className="text-right flex gap-2 items-center">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Points
              </span>
              <span className="text-4xl font-black text-primary font-display">
                {user?.points || 0}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Promo Banner Carousel */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <h3 className="text-sm font-bold text-foreground mb-3 px-1">Promo & Campaign</h3>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            CarouselAutoplay({
              delay: 2000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner.id} className="md:basis-1/2 lg:basis-1/3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="relative rounded-2xl overflow-hidden border border-gray-200"
                >
                  <img
                    src={banner.image}
                    alt={banner.alt}
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </motion.div>

      {/* Menu Grid */}
      <ParticipantMenuGrid onMenuOpen={handleMenuOpen} />

      {/* Menu Drawer */}
      <ParticipantMenuDrawer
        isOpen={isDrawerOpen}
        activeMenuId={activeMenuId}
        onClose={handleMenuClose}
      />
    </div>
  )
}