import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose
} from '@repo/react-components/ui'
import { X } from 'lucide-react'

import germanShepherdImg from '../assets/german-shepherd.webp'
import royalCaninLogo from 'src/assets/royal-canin-logo.png'

interface BreedDetailProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  breedName: string
  petType: 'cat' | 'dog' | null
}

// Static data for German Shepherd
const breedData = {
  'German Shepherd': {
    name: 'German Shepherd',
    type: 'dog',
    image: germanShepherdImg,
    description: 'Anjing yang cerdas, setia, dan serbaguna. German Shepherd dikenal sebagai anjing pekerja yang sangat baik dengan kemampuan belajar yang luar biasa.',
    physicalTraits: {
      size: 'Besar',
      height: '55-65 cm',
      weight: '22-40 kg',
      lifespan: '9-13 tahun',
      coatType: 'Sedang hingga Panjang',
      muzzleShape: 'Panjang dan Kuat',
    },
    stats: {
      tendencyToGainWeight: 70,
      boneJointSensitivity: 80,
      digestiveSensitivity: 60,
      dentalSensitivity: 50,
      coatLength: 75,
      eatingSpeed: 85,
      adaptivenessToNewFood: 65,
    }
  }
}

interface StatBarProps {
  label: string
  value: number
}

function StatBar({ label, value }: StatBarProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-primary">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function BreedDetail({ isOpen, onOpenChange, breedName, petType }: BreedDetailProps) {
  // Get breed data or use default
  // const breed = breedData[breedName as keyof typeof breedData]
  const breed = breedData['German Shepherd']

  if (!breed) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="border-b border-gray-200">
            <DrawerTitle className="text-xl font-bold text-left">Detail Ras</DrawerTitle>
          </DrawerHeader>
          <div className="p-6">
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold text-primary mb-2">{breedName}</h3>
              <p className="text-gray-500 mb-4">
                {petType === 'cat' ? 'Kucing' : 'Anjing'}
              </p>
              <p className="text-gray-500">Data untuk ras ini belum tersedia</p>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl font-bold text-left font-display">Detail Ras</DrawerTitle>
            <DrawerClose asChild>
              <div className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer">
                <X className="w-5 h-5 text-gray-600" />
              </div>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="overflow-y-auto p-4 md:p-6">
          {/* Hero Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-48 h-48 md:w-64 md:h-64 relative">
              <img
                src={breed.image}
                alt={breed.name}
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-primary mb-2">{breed.name}</h2>
            <p className="text-gray-600 text-center text-sm md:text-base max-w-lg">
              {breed.description}
            </p>
          </div>

          {/* Physical Traits */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Karakteristik Fisik</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(breed.physicalTraits).map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">
                    {key === 'size' ? 'Ukuran' :
                     key === 'height' ? 'Tinggi' :
                     key === 'weight' ? 'Berat' :
                     key === 'lifespan' ? 'Usia' :
                     key === 'coatType' ? 'Tipe Bulu' :
                     'Bentuk Moncong'}
                  </p>
                  <p className="font-semibold text-gray-800 text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Karakteristik Kesehatan & Perilaku</h3>
            <div className="space-y-2">
              <StatBar
                label="Kecenderungan Berat Badan Naik"
                value={breed.stats.tendencyToGainWeight}
              />
              <StatBar
                label="Sensitivitas Tulang & Sendi"
                value={breed.stats.boneJointSensitivity}
              />
              <StatBar
                label="Sensitivitas Pencernaan"
                value={breed.stats.digestiveSensitivity}
              />
              <StatBar
                label="Sensitivitas Gigi"
                value={breed.stats.dentalSensitivity}
              />
              <StatBar
                label="Panjang Bulu"
                value={breed.stats.coatLength}
              />
              <StatBar
                label="Kecepatan Makan"
                value={breed.stats.eatingSpeed}
              />
              <StatBar
                label="Adaptasi terhadap Makanan Baru"
                value={breed.stats.adaptivenessToNewFood}
              />
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <img
              src={royalCaninLogo}
              alt="Royal Canin"
              className="h-6 w-auto "
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default BreedDetail
