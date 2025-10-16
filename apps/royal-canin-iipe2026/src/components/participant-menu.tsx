import { motion } from 'framer-motion'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@repo/react-components/ui'
import { Calendar, Stethoscope, Search, Gamepad2, X } from 'lucide-react'

import EventSchedule from './event-schedule'
import VetConsultation from './vet-consultation'
import FindPet from './find-pet'
import BoothQuiz from './booth-quiz'
import ARQuiz from './ar-quiz'

const menus = [
  { id: 'event-schedule', title: 'Event Schedule', icon: Calendar, color: 'from-orange-600 to-red-600' },
  { id: 'vet-consultation', title: 'Vet Consultation', icon: Stethoscope, color: 'from-orange-600 to-red-600' },
  { id: 'find-pet', title: 'Find The Right Pet', icon: Search, color: 'from-orange-600 to-red-600' },
  { id: 'ar-quiz', title: 'AR Quiz', icon: Gamepad2, color: 'from-orange-600 to-red-600' },
]

const boothQuizMenus = [
  { id: 'vet-edu-quiz', title: 'Vet Edu Quiz' },
  { id: 'sustainability-quiz', title: 'Sustainability Quiz' },
]

interface ParticipantMenuGridProps {
  onMenuOpen: (menuId: string) => void
}

export function ParticipantMenuGrid({ onMenuOpen }: ParticipantMenuGridProps) {
  const openMenu = (menuId: string) => {
    onMenuOpen(menuId)
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mb-6"
    >
      <h3 className="text-sm font-bold text-foreground mb-3 px-1">Explore Activities</h3>
      <div className="grid grid-cols-2 gap-4">
        {menus.map((menu, index) => (
          <motion.button
            key={menu.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openMenu(menu.id)}
            className="relative bg-white rounded-2xl p-5 border border-gray-200 shadow-sm overflow-hidden group"
          >
            {/* Gradient Background on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${menu.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

            {/* Content */}
            <div className="relative flex flex-col items-center gap-3">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${menu.color} flex items-center justify-center`}>
                <menu.icon className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-bold text-foreground text-center leading-tight">
                {menu.title}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

interface ParticipantMenuDrawerProps {
  isOpen: boolean
  activeMenuId: string | null
  onClose: () => void
}

export function ParticipantMenuDrawer({ isOpen, activeMenuId, onClose }: ParticipantMenuDrawerProps) {
  const menusWithBoothQuiz = [...menus, ...boothQuizMenus]
  const activeMenu = menusWithBoothQuiz.find(m => m.id === activeMenuId)

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="min-h-[90vh]" aria-describedby="drawer-description">
        <DrawerHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl font-bold text-foreground font-display">
              {activeMenu?.title}
            </DrawerTitle>
            <DrawerClose asChild>
              <div className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer">
                <X className="w-5 h-5 text-gray-600" />
              </div>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div id="drawer-description" className="p-4 flex-1 overflow-y-auto overflow-x-hidden">
          {/* Content based on active menu */}
          {activeMenuId === 'event-schedule' && (
            <EventSchedule />
          )}

          {activeMenuId === 'vet-consultation' && (
            <VetConsultation />
          )}

          {activeMenuId === 'find-pet' && (
            <FindPet />
          )}

          {activeMenuId === 'ar-quiz' && (
            <ARQuiz />
          )}

          {activeMenuId === 'vet-edu-quiz'&& (
            <BoothQuiz menuId={'vet-edu-quiz'} />
          )}

          {activeMenuId === 'sustainability-quiz' && (
            <BoothQuiz menuId={'sustainability-quiz'} />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
