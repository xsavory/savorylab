import { motion } from 'framer-motion'

interface Tab {
  label: string
  value: string | number
}

interface ScheduleTabsProps {
  tabs: Tab[]
  activeTab: string | number
  onTabChange: (value: string | number) => void
  layoutId?: string
}

export function ScheduleTabs({ tabs, activeTab, onTabChange, layoutId = 'scheduleTab' }: ScheduleTabsProps) {
  return (
    <div className="flex gap-2 p-1.5 bg-gray-100 rounded-xl">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value

        return (
          <motion.button
            key={String(tab.value)}
            onClick={() => onTabChange(tab.value)}
            className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all relative ${
              isActive
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {isActive && (
              <>
                {/* Main 3D candy background */}
                <motion.div
                  layoutId={layoutId}
                  className="absolute inset-0 bg-primary rounded-lg shadow-lg"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{
                    boxShadow: '0 4px 0 0 rgba(234, 88, 12, 0.8), 0 6px 12px rgba(0, 0, 0, 0.15)'
                  }}
                />

                {/* Glossy overlay */}
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.1) 100%)'
                  }}
                />
              </>
            )}
            <span className="relative z-10">{tab.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
