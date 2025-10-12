import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Stethoscope, Gamepad2, Gift, Users, Clock } from 'lucide-react'
import { ScheduleTabs } from './schedule-tabs'

type EventType = 'talk' | 'consultation' | 'game' | 'flash-sale' | 'workshop'

interface Speaker {
  name: string
  color: string
}

interface Event {
  id: string
  time: string
  title: string
  type: EventType
  speakers?: Speaker[]
}

interface DaySchedule {
  day: string
  date: string
  events: Event[]
}

const scheduleData: DaySchedule[] = [
  {
    day: "Jum'at",
    date: "24 Januari 2026",
    events: [
      {
        id: 'fri-1',
        time: '10:00 - 11:00',
        title: 'Opening Ceremony & Welcoming Speech',
        type: 'talk',
        speakers: [
          { name: 'Dr. Sarah Johnson', color: 'bg-rose-100 text-rose-700' },
          { name: 'John Smith, CEO Royal Canin', color: 'bg-rose-100 text-rose-700' }
        ]
      },
      {
        id: 'fri-2',
        time: '11:30 - 12:30',
        title: 'Nutrisi Optimal untuk Kesehatan Anjing: Panduan Lengkap',
        type: 'talk',
        speakers: [
          { name: 'Dr. Michael Chen, DVM', color: 'bg-rose-100 text-rose-700' }
        ]
      },
      {
        id: 'fri-3',
        time: '13:00 - 14:00',
        title: 'Flash Sale 1 - Diskon hingga 40%',
        type: 'flash-sale'
      },
      {
        id: 'fri-4',
        time: '14:30 - 15:30',
        title: 'Konsultasi Gratis dengan Veterinarian',
        type: 'consultation',
        speakers: [
          { name: 'drh. Amanda Putri', color: 'bg-blue-100 text-blue-700' },
          { name: 'drh. Budi Santoso, MSc', color: 'bg-blue-100 text-blue-700' }
        ]
      },
      {
        id: 'fri-5',
        time: '16:00 - 17:00',
        title: 'Interactive Game: Find Your Perfect Pet Match',
        type: 'game'
      },
      {
        id: 'fri-6',
        time: '17:30 - 18:30',
        title: 'Workshop: Grooming Dasar untuk Pemula',
        type: 'workshop',
        speakers: [
          { name: 'Lisa Tan, Pet Groomer', color: 'bg-purple-100 text-purple-700' }
        ]
      }
    ]
  },
  {
    day: 'Sabtu',
    date: '25 Januari 2026',
    events: [
      {
        id: 'sat-1',
        time: '10:00 - 11:00',
        title: 'Perawatan Kucing Senior: Tips dan Trik',
        type: 'talk',
        speakers: [
          { name: 'Dr. Emma Williams', color: 'bg-rose-100 text-rose-700' }
        ]
      },
      {
        id: 'sat-2',
        time: '11:30 - 12:30',
        title: 'Memahami Bahasa Tubuh Hewan Peliharaan Anda',
        type: 'talk',
        speakers: [
          { name: 'Prof. David Lee, Animal Behaviorist', color: 'bg-rose-100 text-rose-700' }
        ]
      },
      {
        id: 'sat-3',
        time: '13:00 - 14:00',
        title: 'Flash Sale 2 - Bundle Package Special',
        type: 'flash-sale'
      },
      {
        id: 'sat-4',
        time: '14:30 - 15:30',
        title: 'Breed Selection: Menemukan Ras yang Tepat untuk Gaya Hidup Anda',
        type: 'workshop',
        speakers: [
          { name: 'drh. Siti Nurhaliza', color: 'bg-purple-100 text-purple-700' },
          { name: 'James Wong, Breeder Expert', color: 'bg-purple-100 text-purple-700' }
        ]
      },
      {
        id: 'sat-5',
        time: '16:00 - 17:00',
        title: 'AR Quiz Challenge - Menangkan Hadiah Menarik!',
        type: 'game'
      },
      {
        id: 'sat-6',
        time: '17:30 - 18:30',
        title: 'Konsultasi Nutrisi: Diet Khusus untuk Kondisi Medis',
        type: 'consultation',
        speakers: [
          { name: 'Dr. Rachel Green, DVM', color: 'bg-blue-100 text-blue-700' }
        ]
      },
      {
        id: 'sat-7',
        time: '19:00 - 20:00',
        title: 'Evening Social: Meet Fellow Pet Lovers',
        type: 'workshop'
      }
    ]
  },
  {
    day: 'Minggu',
    date: '26 Januari 2026',
    events: [
      {
        id: 'sun-1',
        time: '10:00 - 11:00',
        title: 'Mitos dan Fakta Seputar Makanan Hewan Peliharaan',
        type: 'talk',
        speakers: [
          { name: 'Dr. Kevin Tan, Nutritionist', color: 'bg-rose-100 text-rose-700' }
        ]
      },
      {
        id: 'sun-2',
        time: '11:30 - 12:30',
        title: 'Pertolongan Pertama untuk Hewan Peliharaan',
        type: 'workshop',
        speakers: [
          { name: 'drh. Diana Putri, Emergency Vet', color: 'bg-purple-100 text-purple-700' }
        ]
      },
      {
        id: 'sun-3',
        time: '13:00 - 14:00',
        title: 'Flash Sale 3 - Last Day Mega Deals!',
        type: 'flash-sale'
      },
      {
        id: 'sun-4',
        time: '14:30 - 15:30',
        title: 'Training Tips: Mengajarkan Trik Baru pada Anjing Anda',
        type: 'workshop',
        speakers: [
          { name: 'Mark Johnson, Dog Trainer', color: 'bg-purple-100 text-purple-700' }
        ]
      },
      {
        id: 'sun-5',
        time: '16:00 - 17:00',
        title: 'Grand Prize Draw & Closing Ceremony',
        type: 'game'
      }
    ]
  }
]

const eventIcons = {
  talk: Calendar,
  consultation: Stethoscope,
  game: Gamepad2,
  'flash-sale': Gift,
  workshop: Users
}

const eventColors = {
  talk: 'from-rose-500 to-red-500',
  consultation: 'from-blue-500 to-cyan-500',
  game: 'from-purple-500 to-pink-500',
  'flash-sale': 'from-amber-500 to-orange-500',
  workshop: 'from-emerald-500 to-green-500'
}

function EventSchedule() {
  const [activeDay, setActiveDay] = useState(0)
  const [direction, setDirection] = useState(0)

  const handleTabChange = (value: string | number) => {
    const newIndex = value as number
    setDirection(newIndex > activeDay ? 1 : -1)
    setActiveDay(newIndex)
  }

  const tabs = scheduleData.map((schedule, index) => ({
    label: schedule.day,
    value: index
  }))

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <ScheduleTabs
        tabs={tabs}
        activeTab={activeDay}
        onTabChange={handleTabChange}
        layoutId="eventScheduleTab"
      />

      {/* Event Cards */}
      <div className="relative overflow-x-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeDay}
            custom={direction}
            initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? '-100%' : '100%', opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="space-y-4"
          >
          {scheduleData[activeDay]?.events.map((event) => {
            const Icon = eventIcons[event.type]
            const colorClass = eventColors[event.type]

            return (
              <div
                key={event.id}
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Time */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      {event.time}
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-foreground text-sm leading-snug mb-3">
                      {event.title}
                    </h4>

                    {/* Speakers */}
                    {event.speakers && event.speakers.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {event.speakers.map((speaker, idx) => (
                          <div
                            key={idx}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${speaker.color}`}
                          >
                            {speaker.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default EventSchedule