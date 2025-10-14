import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cat, Dog, Clock, Calendar, Loader2 } from 'lucide-react'
import { ScheduleTabs } from './schedule-tabs'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast
} from '@repo/react-components/ui'
import useParticipantAuth from 'src/hooks/use-participant-auth'

interface Vet {
  name: string
}

interface ConsultationSlot {
  id: string
  time: string
  vets: Vet[]
}

interface DayConsultation {
  day: string
  date: string
  catConsultation: ConsultationSlot[]
  dogConsultation: ConsultationSlot[]
}

const consultationData: DayConsultation[] = [
  {
    day: "Jum'at",
    date: "24 Januari 2026",
    catConsultation: [
      {
        id: 'fri-cat-1',
        time: '09:00 - 15:00',
        vets: [
          { name: 'drh. Sinta Maryani' },
          { name: 'drh. Andi Citra Adha' }
        ]
      },
      {
        id: 'fri-cat-2',
        time: '15:00 - 21:00',
        vets: [
          { name: 'drh. Suannisa' },
          { name: 'drh. Siti Winda Kusumawardhani' }
        ]
      }
    ],
    dogConsultation: [
      {
        id: 'fri-dog-1',
        time: '09:00 - 15:00',
        vets: [
          { name: 'drh. Lala' },
          { name: 'drh. Architiani Niendria' }
        ]
      },
      {
        id: 'fri-dog-2',
        time: '15:00 - 21:00',
        vets: [
          { name: 'drh. Amelia Widodo' }
        ]
      }
    ]
  },
  {
    day: 'Sabtu',
    date: '25 Januari 2026',
    catConsultation: [
      {
        id: 'sat-cat-1',
        time: '09:00 - 15:00',
        vets: [
          { name: 'drh. Maya Kusuma' },
          { name: 'drh. Rizki Pratama' }
        ]
      },
      {
        id: 'sat-cat-2',
        time: '15:00 - 21:00',
        vets: [
          { name: 'drh. Linda Anggraini' },
          { name: 'drh. Bambang Santoso' }
        ]
      }
    ],
    dogConsultation: [
      {
        id: 'sat-dog-1',
        time: '09:00 - 15:00',
        vets: [
          { name: 'drh. Dewi Rahayu' },
          { name: 'drh. Ahmad Hidayat' }
        ]
      },
      {
        id: 'sat-dog-2',
        time: '15:00 - 21:00',
        vets: [
          { name: 'drh. Sari Wulandari' },
          { name: 'drh. Dimas Prakoso' }
        ]
      }
    ]
  },
  {
    day: 'Minggu',
    date: '26 Januari 2026',
    catConsultation: [
      {
        id: 'sun-cat-1',
        time: '09:00 - 15:00',
        vets: [
          { name: 'drh. Putri Maharani' },
          { name: 'drh. Fajar Nugroho' }
        ]
      },
      {
        id: 'sun-cat-2',
        time: '15:00 - 21:00',
        vets: [
          { name: 'drh. Rina Setiawan' }
        ]
      }
    ],
    dogConsultation: [
      {
        id: 'sun-dog-1',
        time: '09:00 - 15:00',
        vets: [
          { name: 'drh. Budi Kurniawan' },
          { name: 'drh. Anita Sari' }
        ]
      },
      {
        id: 'sun-dog-2',
        time: '15:00 - 21:00',
        vets: [
          { name: 'drh. Hendra Wijaya' }
        ]
      }
    ]
  }
]

const dogBreeds = ['Golden Retriever', 'Labrador Retriever', 'German Shepherd']
const catBreeds = ['Persian', 'Siamese', 'Maine Coon']

function VetConsultation() {
  const { user } = useParticipantAuth()

  const [activeDay, setActiveDay] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [petName, setPetName] = useState('')
  const [petType, setPetType] = useState<'dog' | 'cat' | ''>('')
  const [petBreed, setPetBreed] = useState('')

  const handleTabChange = (value: string | number) => {
    const newIndex = value as number
    setDirection(newIndex > activeDay ? 1 : -1)
    setActiveDay(newIndex)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)

    try {
      const { vetConsultationSchedule } = await import('src/lib/api')

      const response = await vetConsultationSchedule.create({
        participantId: user?.id as string,
        petName,
        petType,
        petBreed
      })

      if (response.error) {
        toast.error(response.error || 'Failed to register consultation')
        setIsLoading(false)
        return
      }

      setIsLoading(false)
      setIsFormOpen(false)
      toast.success('Consultation registered successfully!')

      // Reset form
      setPetName('')
      setPetType('')
      setPetBreed('')
    } catch (error) {
      setIsLoading(false)
      toast.error(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  const tabs = consultationData.map((schedule, index) => ({
    label: schedule.day,
    value: index
  }))

  const availableBreeds = petType === 'dog' ? dogBreeds : petType === 'cat' ? catBreeds : []

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <ScheduleTabs
        tabs={tabs}
        activeTab={activeDay}
        onTabChange={handleTabChange}
        layoutId="vetConsultationTab"
      />

      {/* Consultation Content */}
      <div className="relative overflow-x-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeDay}
            custom={direction}
            initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? '-100%' : '100%', opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="space-y-6"
          >
            {/* Cat Consultation Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1">Cat Consultation</h3>

              {consultationData[activeDay]?.catConsultation.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm relative"
                >
                  {/* Icon with candy effect - top right */}
                  <div
                    className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0"
                    style={{
                      boxShadow: '0 3px 0 0 rgba(234, 88, 12, 0.7)'
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.1) 100%)'
                      }}
                    />
                    <Cat className="w-5 h-5 text-white relative z-10" />
                  </div>

                  {/* Content */}
                  <div className="pr-12">
                    {/* Time */}
                    <div className="flex items-center gap-2 text-sm font-bold text-primary mb-3">
                      <Clock className="w-4 h-4" />
                      {slot.time}
                    </div>

                    {/* Vets as badges */}
                    <div className="flex flex-wrap gap-2">
                      {slot.vets.map((vet, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold relative overflow-hidden"
                          style={{
                            border: '2px solid #ffc107',
                            color: '#d97706',
                            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)',
                            boxShadow: '0 0 0 1px rgba(255, 193, 7, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                          }}
                        >
                          {vet.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dog Consultation Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1">Dog Consultation</h3>

              {consultationData[activeDay]?.dogConsultation.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm relative"
                >
                  {/* Icon with candy effect - top right */}
                  <div
                    className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0"
                    style={{
                      boxShadow: '0 3px 0 0 rgba(234, 88, 12, 0.7)'
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.1) 100%)'
                      }}
                    />
                    <Dog className="w-5 h-5 text-white relative z-10" />
                  </div>

                  {/* Content */}
                  <div className="pr-12">
                    {/* Time */}
                    <div className="flex items-center gap-2 text-sm font-bold text-primary mb-3">
                      <Clock className="w-4 h-4" />
                      {slot.time}
                    </div>

                    {/* Vets as badges */}
                    <div className="flex flex-wrap gap-2">
                      {slot.vets.map((vet, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold relative overflow-hidden"
                          style={{
                            border: '2px solid #ffc107',
                            color: '#d97706',
                            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)',
                            boxShadow: '0 0 0 1px rgba(255, 193, 7, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
                          }}
                        >
                          {vet.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA Button */}
      <div className="sticky bottom-0 -mx-6  p-4 bg-gradient-to-t from-white via-white to-transparent z-10">
        <Button
          onClick={() => setIsFormOpen(true)}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-7 rounded-xl shadow-lg text-base"
          style={{
            boxShadow: '0 4px 0 0 rgba(234, 88, 12, 0.7), 0 6px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          <Calendar className="w-5 h-5 mr-2" />
          Daftar Konsultasi Sekarang
        </Button>
      </div>

      {/* Registration Form Drawer */}
      <Drawer open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DrawerContent>
          <DrawerHeader className="border-b border-gray-200">
            <DrawerTitle className="text-xl font-bold text-left">Pendaftaran Konsultasi</DrawerTitle>
          </DrawerHeader>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Pet Name */}
            <div className="space-y-2">
              <Label htmlFor="petName">Nama Peliharaan</Label>
              <Input
                id="petName"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Masukkan nama peliharaan"
                required
                disabled={isLoading}
                className="h-12"
              />
            </div>

            {/* Pet Type */}
            <div className="space-y-2">
              <Label htmlFor="petType">Jenis Peliharaan</Label>
              <Select
                value={petType}
                onValueChange={(value: 'dog' | 'cat') => {
                  setPetType(value)
                  setPetBreed('') // Reset breed when type changes
                }}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full !h-12">
                  <SelectValue placeholder="Pilih jenis peliharaan" />
                </SelectTrigger>
                <SelectContent className="border-gray-200">
                  <SelectItem value="dog" className="!py-3 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary">Dog</SelectItem>
                  <SelectItem value="cat" className="!py-3 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary">Cat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pet Breed */}
            <div className="space-y-2">
              <Label htmlFor="petBreed">Ras Peliharaan</Label>
              <Select
                value={petBreed}
                onValueChange={setPetBreed}
                disabled={isLoading || !petType}
              >
                <SelectTrigger className="w-full !h-12">
                  <SelectValue placeholder={petType ? "Pilih ras peliharaan" : "Pilih jenis peliharaan terlebih dahulu"} />
                </SelectTrigger>
                <SelectContent className="border-gray-200">
                  {availableBreeds.map((breed) => (
                    <SelectItem key={breed} value={breed} className="!py-3 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary">
                      {breed}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                disabled={isLoading}
                className="flex-1 h-12 border-gray-300"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !petName || !petType || !petBreed}
                className="flex-1 bg-primary hover:bg-primary/90 h-12"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isLoading ? 'Mendaftar...' : 'Daftar'}
              </Button>
            </div>
          </form>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default VetConsultation
