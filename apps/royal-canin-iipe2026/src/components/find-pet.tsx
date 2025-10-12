import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import BreedDetail from './breed-detail'

// Import pet expert images
import petExpert1 from '../assets/pet-expert-1.png'
import petExpert2 from '../assets/pet-expert-2.png'
import petExpert3 from '../assets/pet-expert-3.png'
import petExpert4 from '../assets/pet-expert-4.png'
import petExpert5 from '../assets/pet-expert-5.png'
import petExpert6 from '../assets/pet-expert-6.png'

// Type definitions
type PetType = 'cat' | 'dog' | null

interface Answer {
  text: string
  value: number
  image: string
}

interface Question {
  id: number
  text: string
  answers: Answer[]
}

interface CatBreed {
  name: string
  grooming: number
  attention: number
  activity: number
  social: number
  vocal: number
}

interface DogBreed {
  name: string
  dogFriendly: number
  exercise: number
  apartment: number
  grooming: number
  stranger: number
  barking: number
  withCats: number
  withKids: number
  guard: number
}

// Cat breed data
const catBreeds: CatBreed[] = [
  { name: 'Bengal', grooming: 1, attention: 4.5, activity: 9, social: 3, vocal: 7.5 },
  { name: 'British Shorthair', grooming: 2, attention: 5, activity: 3, social: 6, vocal: 3 },
  { name: 'Mainecoon', grooming: 2, attention: 3, activity: 1, social: 3, vocal: 3 },
  { name: 'Persia', grooming: 3, attention: 4, activity: 2, social: 3, vocal: 2 },
  { name: 'Sphynx', grooming: 2, attention: 2, activity: 6, social: 2, vocal: 5 },
]

// Dog breed data
const dogBreeds: DogBreed[] = [
  { name: 'Beagle', dogFriendly: 5, exercise: 5, apartment: 2, grooming: 1, stranger: 4, barking: 5, withCats: 3, withKids: 5, guard: 1 },
  { name: 'Chihuahua', dogFriendly: 3, exercise: 1, apartment: 5, grooming: 1, stranger: 3, barking: 5, withCats: 5, withKids: 1, guard: 4 },
  { name: 'French Bulldog', dogFriendly: 2, exercise: 2, apartment: 5, grooming: 2, stranger: 5, barking: 2, withCats: 2, withKids: 2, guard: 3 },
  { name: 'German Shepherd', dogFriendly: 2, exercise: 3, apartment: 3, grooming: 3, stranger: 1, barking: 2, withCats: 3, withKids: 5, guard: 5 },
  { name: 'Golden Retriever', dogFriendly: 5, exercise: 5, apartment: 2, grooming: 3, stranger: 5, barking: 3, withCats: 4, withKids: 5, guard: 3 },
  { name: 'Maltese', dogFriendly: 5, exercise: 1, apartment: 5, grooming: 5, stranger: 5, barking: 5, withCats: 5, withKids: 1, guard: 4 },
  { name: 'Poodle', dogFriendly: 4, exercise: 4, apartment: 5, grooming: 5, stranger: 4, barking: 3, withCats: 4, withKids: 5, guard: 4 },
  { name: 'Rottweiler', dogFriendly: 1, exercise: 3, apartment: 2, grooming: 1, stranger: 1, barking: 2, withCats: 3, withKids: 2, guard: 5 },
  { name: 'Shih Tzu', dogFriendly: 5, exercise: 2, apartment: 5, grooming: 5, stranger: 3, barking: 5, withCats: 5, withKids: 2, guard: 4 },
  { name: 'Yorkshire', dogFriendly: 2, exercise: 1, apartment: 5, grooming: 5, stranger: 3, barking: 5, withCats: 4, withKids: 1, guard: 4 },
  { name: 'Pomeranian', dogFriendly: 4, exercise: 4, apartment: 5, grooming: 5, stranger: 3, barking: 5, withCats: 3, withKids: 2, guard: 4 },
]

// Cat questions
const catQuestions: Question[] = [
  {
    id: 1,
    text: 'Alokasi waktu/sumberdaya untuk merawat rambut/kulit kucing:',
    answers: [
      { text: 'Tidak ada', value: 1, image: petExpert1 },
      { text: 'Terbatas 1 jam/minggu', value: 1.5, image: petExpert2 },
      { text: 'Ada 2 jam/minggu', value: 2, image: petExpert3 },
      { text: 'Cukup banyak 3-4 jam/minggu', value: 2.5, image: petExpert4 },
      { text: 'Banyak >4 jam/minggu', value: 3, image: petExpert5 },
    ],
  },
  {
    id: 2,
    text: 'Anda lebih suka kucing yang:',
    answers: [
      { text: 'Independen, lebih suka sendiri', value: 5, image: petExpert1 },
      { text: 'Independen tapi senang dengan kehadiran pemilik', value: 4.25, image: petExpert2 },
      { text: 'Senang dengan kehadiran pemilik', value: 3.5, image: petExpert3 },
      { text: 'Senang bermain & bersama pemilik', value: 2.5, image: petExpert4 },
      { text: 'Perlu waktu banyak bersama pemiliknya', value: 2, image: petExpert5 },
    ],
  },
  {
    id: 3,
    text: 'Anda lebih suka kucing yang aktivitas sehari-harinya:',
    answers: [
      { text: 'Tenang', value: 1.5, image: petExpert1 },
      { text: 'Kadang suka bermain', value: 2, image: petExpert2 },
      { text: 'Suka bermain 1-2 jam/hari', value: 4.5, image: petExpert3 },
      { text: 'Cenderung aktif & sangat suka bermain', value: 7.5, image: petExpert4 },
      { text: 'Sangat aktif & perlu waktu bermain lebih banyak', value: 9, image: petExpert5 },
    ],
  },
  {
    id: 4,
    text: 'Anda lebih suka kucing yang:',
    answers: [
      { text: 'Lebih suka sendiri, kurang suka bersama kucing lain', value: 8, image: petExpert1 },
      { text: 'Senang sendiri tapi tidak keberatan bersama kucing lain', value: 4.5, image: petExpert2 },
      { text: 'Senang bersama kucing lain tapi perlu waktu untuk diri sendiri', value: 2.5, image: petExpert3 },
      { text: 'Senang bermain & bersama kucing lain', value: 2, image: petExpert4 },
      { text: 'Perlu teman & selalu ingin bersama kucing lain', value: 2, image: petExpert5 },
    ],
  },
  {
    id: 5,
    text: 'Anda lebih suka kucing yang:',
    answers: [
      { text: 'Pendiam', value: 2.5, image: petExpert1 },
      { text: 'Kadang suka mengeong', value: 2.5, image: petExpert2 },
      { text: 'Sering mengeong', value: 4, image: petExpert3 },
      { text: 'Aktif bersuara & mengeong', value: 6.5, image: petExpert4 },
      { text: 'Sangat aktif bersuara & mengeong', value: 8, image: petExpert5 },
    ],
  },
]

// Dog questions
const dogQuestions: Question[] = [
  {
    id: 1,
    text: 'Dimana anda tinggal?',
    answers: [
      { text: 'Apartemen', value: 5, image: petExpert1 },
      { text: 'Apartemen & ada akses ke taman', value: 4, image: petExpert2 },
      { text: 'Rumah tanpa pekarangan', value: 5, image: petExpert3 },
      { text: 'Rumah dengan pekarangan kecil', value: 4, image: petExpert4 },
      { text: 'Rumah dengan pekarangan luas', value: 3, image: petExpert5 },
    ],
  },
  {
    id: 2,
    text: 'Di rumah anda ada anjing lain?',
    answers: [
      { text: 'Tidak ada anjing lain', value: 3, image: petExpert1 },
      { text: 'Ada 1 ekor anjing ras kecil', value: 4, image: petExpert2 },
      { text: 'Ada >1 ekor anjing ras kecil', value: 4.5, image: petExpert3 },
      { text: 'Ada 1 ekor anjing ras besar', value: 4, image: petExpert4 },
      { text: 'Ada >1 ekor anjing ras besar', value: 4.5, image: petExpert5 },
    ],
  },
  {
    id: 3,
    text: 'Di rumah anda ada kucing?',
    answers: [
      { text: 'Tidak ada kucing sama sekali', value: 3, image: petExpert1 },
      { text: 'Tidak ada, tapi kadang ada kucing liar', value: 4, image: petExpert2 },
      { text: 'Ada 1 ekor kucing', value: 4.5, image: petExpert3 },
      { text: 'Ada >1 ekor kucing', value: 5, image: petExpert4 },
      { text: 'Ada tapi dikandangkan', value: 4.5, image: petExpert5 },
    ],
  },
  {
    id: 4,
    text: 'Di rumah ada anak kecil?',
    answers: [
      { text: 'Tidak ada sama sekali', value: 3, image: petExpert1 },
      { text: 'Tidak ada, tapi sering ada kunjungan keluarga dengan anak kecil', value: 4.5, image: petExpert2 },
      { text: 'Ada 1 anak', value: 4.5, image: petExpert3 },
      { text: 'Ada 2-3 anak', value: 4.5, image: petExpert4 },
      { text: 'Banyak anak kecil', value: 5, image: petExpert5 },
    ],
  },
  {
    id: 5,
    text: 'Anda suka anjing yang:',
    answers: [
      { text: 'Santai bila rumah dimasuki orang/hewan lain', value: 1, image: petExpert1 },
      { text: 'Menggonggong bila ada orang/hewan lain', value: 3, image: petExpert2 },
      { text: 'Menggonggong dan sedikit mengusir', value: 3, image: petExpert3 },
      { text: 'Menggonggong dan berusaha mengusir', value: 4.5, image: petExpert4 },
      { text: 'Menggonggong, mengusir & menyerang bila orang/hewan asing tidak pergi', value: 5, image: petExpert5 },
    ],
  },
  {
    id: 6,
    text: 'Anda suka anjing yang:',
    answers: [
      { text: 'Pendiam', value: 2, image: petExpert1 },
      { text: 'Kadang menggonggong', value: 3, image: petExpert2 },
      { text: 'Sering menggonggong bila ada orang/hewan lain', value: 4, image: petExpert3 },
      { text: 'Sering menggonggong ketika bosan', value: 5, image: petExpert4 },
      { text: 'Menggonggong terus menerus & cenderung berisik', value: 5, image: petExpert5 },
    ],
  },
  {
    id: 7,
    text: 'Alokasi waktu anda untuk jalan-jalan bersama anjing:',
    answers: [
      { text: 'Tidak ada', value: 1, image: petExpert1 },
      { text: 'Terbatas 1-2 jam/minggu', value: 2, image: petExpert2 },
      { text: 'Ada 3-4 jam/minggu', value: 2.5, image: petExpert3 },
      { text: 'Cukup banyak 5-7 jam/minggu', value: 2.5, image: petExpert4 },
      { text: 'Banyak >7 jam/minggu', value: 3, image: petExpert5 },
    ],
  },
  {
    id: 8,
    text: 'Anda suka anjing yang:',
    answers: [
      { text: 'Bersahabat dan akrab dengan siapa pun', value: 5, image: petExpert1 },
      { text: 'Waspada dengan orang asing tapi bersahabat bila sudah kenal', value: 4.5, image: petExpert2 },
      { text: 'Waspada & tidak mudah bersahabat dengan orang asing', value: 3.5, image: petExpert3 },
      { text: 'Perlu waktu lebih untuk adaptasi dengan orang lain', value: 2.5, image: petExpert4 },
      { text: 'Cenderung hanya bersahabat dengan pemiliknya', value: 1, image: petExpert5 },
    ],
  },
  {
    id: 9,
    text: 'Alokasi waktu & sumberdaya untuk perawatan kulit & rambut anjing:',
    answers: [
      { text: 'Tidak ada', value: 1, image: petExpert1 },
      { text: 'Terbatas 1-2 jam/minggu', value: 1.5, image: petExpert2 },
      { text: 'Ada 3-4 jam/minggu', value: 2, image: petExpert3 },
      { text: 'Cukup banyak 5-7 jam/minggu', value: 2, image: petExpert4 },
      { text: 'Banyak >7 jam/minggu', value: 3, image: petExpert5 },
    ],
  },
]

// Typewriter component
function Typewriter({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  // Reset when text changes
  useEffect(() => {
    setDisplayText('')
    setCurrentIndex(0)
  }, [text])

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 30)
      return () => clearTimeout(timeout)
    } else if (onComplete && currentIndex === text.length && currentIndex > 0) {
      onComplete()
    }
  }, [currentIndex, text, onComplete])

  return <span>{displayText}</span>
}

function FindPet() {
  const [petType, setPetType] = useState<PetType>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showAnswers, setShowAnswers] = useState(false)
  const [currentImage, setCurrentImage] = useState(petExpert6)
  const [recommendedBreeds, setRecommendedBreeds] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false)
  const [selectedBreed, setSelectedBreed] = useState<string>('')

  const questions = petType === 'cat' ? catQuestions : petType === 'dog' ? dogQuestions : []
  const currentQuestion = questions[currentQuestionIndex]
  // Progress based on answered questions, not current question
  // Calculate as rounded to nearest 10%
  const rawProgress = questions.length > 0 ? (answers.length / questions.length) * 100 : 0
  const progress = Math.round(rawProgress / 10) * 10

  const handlePetTypeSelect = (type: 'cat' | 'dog') => {
    setPetType(type)
    setCurrentImage(petExpert6)
    // Delay showing answers to allow typewriter to complete
    setTimeout(() => setShowAnswers(true), 2000)
  }

  const handleAnswerSelect = (value: number, image: string, index: number) => {
    if (isTransitioning) return // Prevent multiple clicks during transition

    setIsTransitioning(true)
    setSelectedAnswerIndex(index)
    setCurrentImage(image) // Change image immediately on click

    // Wait for standout effect (1000ms) then move to next question
    setTimeout(() => {
      setShowAnswers(false)
      setSelectedAnswerIndex(null)

      // Wait for animation to sync with pet expert transition
      setTimeout(() => {
        const newAnswers = [...answers, value]
        setAnswers(newAnswers)

        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1)
          setCurrentImage(petExpert6)
          setIsTransitioning(false)
          setTimeout(() => setShowAnswers(true), 1200)
        } else {
          // Calculate results
          const results = calculateRecommendation(newAnswers)
          setRecommendedBreeds(results)
          setIsComplete(true)

          // Send results (console log for now)
          submitResults({
            petType,
            answers: newAnswers,
            recommendedBreeds: results,
            timestamp: new Date().toISOString(),
          })
        }
      }, 300)
    }, 1000)
  }

  const calculateRecommendation = (userAnswers: number[]): string[] => {
    if (petType === 'cat') {
      const distances = catBreeds.map((breed) => {
        const diff1 = Math.abs(breed.grooming - (userAnswers[0] ?? 0))
        const diff2 = Math.abs(breed.attention - (userAnswers[1] ?? 0))
        const diff3 = Math.abs(breed.activity - (userAnswers[2] ?? 0))
        const diff4 = Math.abs(breed.social - (userAnswers[3] ?? 0))
        const diff5 = Math.abs(breed.vocal - (userAnswers[4] ?? 0))
        const totalDistance = diff1 + diff2 + diff3 + diff4 + diff5
        return { name: breed.name, distance: totalDistance }
      })

      distances.sort((a, b) => a.distance - b.distance)
      return distances.slice(0, 3).map((d) => d.name)
    } else {
      const distances = dogBreeds.map((breed) => {
        const diff1 = Math.abs(breed.apartment - (userAnswers[0] ?? 0))
        const diff2 = Math.abs(breed.dogFriendly - (userAnswers[1] ?? 0))
        const diff3 = Math.abs(breed.withCats - (userAnswers[2] ?? 0))
        const diff4 = Math.abs(breed.withKids - (userAnswers[3] ?? 0))
        const diff5 = Math.abs(breed.guard - (userAnswers[4] ?? 0))
        const diff6 = Math.abs(breed.barking - (userAnswers[5] ?? 0))
        const diff7 = Math.abs(breed.exercise - (userAnswers[6] ?? 0))
        const diff8 = Math.abs(breed.stranger - (userAnswers[7] ?? 0))
        const diff9 = Math.abs(breed.grooming - (userAnswers[8] ?? 0))
        const totalDistance = diff1 + diff2 + diff3 + diff4 + diff5 + diff6 + diff7 + diff8 + diff9
        return { name: breed.name, distance: totalDistance }
      })

      distances.sort((a, b) => a.distance - b.distance)
      return distances.slice(0, 3).map((d) => d.name)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitResults = (data: any) => {
    console.log('=== PET RECOMMENDATION RESULTS ===')
    console.log('Pet Type:', data.petType)
    console.log('User Answers:', data.answers)
    console.log('Recommended Breeds:', data.recommendedBreeds)
    console.log('Timestamp:', data.timestamp)
    console.log('================================')
  }

  const handleViewDetail = (breed: string) => {
    setSelectedBreed(breed)
    setIsDetailDrawerOpen(true)
  }

  // Initial pet type selection
  if (!petType) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-primary/5 flex items-start justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
          <div className="text-center">
            <motion.img
              src={petExpert6}
              alt="Pet Expert"
              className="w-48 h-48 mx-auto object-contain"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            <div className="bg-orange-100 rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
              <h2 className="text-lg font-bold text-foreground leading-snug">
                <Typewriter text="Apakah Anda ingin memelihara Anjing atau Kucing?" />
              </h2>
            </div>
          </div>

          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <motion.button
              onClick={() => handlePetTypeSelect('dog')}
              className="w-full bg-primary text-white font-semibold py-5 px-6 rounded-xl relative overflow-hidden active:translate-y-1 transition-transform"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                boxShadow: '0 4px 0 0 rgba(234, 88, 12, 0.7), 0 6px 12px rgba(0, 0, 0, 0.15)'
              }}
            >
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.1) 100%)'
                }}
              />
              <span className="relative z-10 block text-base">Anjing</span>
            </motion.button>
            <motion.button
              onClick={() => handlePetTypeSelect('cat')}
              className="w-full bg-primary text-white font-semibold py-5 px-6 rounded-xl relative overflow-hidden active:translate-y-1 transition-transform"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                boxShadow: '0 4px 0 0 rgba(234, 88, 12, 0.7), 0 6px 12px rgba(0, 0, 0, 0.15)'
              }}
            >
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.1) 100%)'
                }}
              />
              <span className="relative z-10 block text-base">Kucing</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // Results screen
  if (isComplete) {
    const getRankStyle = (index: number) => {
      if (index === 0) {
        return {
          containerClass: 'bg-gradient-to-br from-yellow-400 to-yellow-500 border-2 border-yellow-600',
          textColor: 'text-yellow-900',
        }
      } else if (index === 1) {
        return {
          containerClass: 'bg-gradient-to-br from-gray-300 to-gray-400 border-2 border-gray-500',
          textColor: 'text-gray-900',
        }
      } else {
        return {
          containerClass: 'bg-gradient-to-br from-orange-300 to-orange-400 border-2 border-orange-500',
          textColor: 'text-orange-900',
        }
      }
    }

    return (
      <div className="bg-gradient-to-b from-white to-red-600/5 flex items-start justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full text-center"
        >
          <motion.img
            src={petExpert6}
            alt="Pet Expert"
            className="w-48 h-48 mx-auto object-contain"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
          />

          <div className="bg-orange-100 rounded-2xl px-8 pb-4 border border-gray-200 shadow-lg">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div className="inline-block bg-primary px-4 py-2 rounded-full -mt-4">
                <span className="text-sm font-bold text-white">HASIL REKOMENDASI</span>
              </div>
            </motion.div>

            <div className="space-y-4">
              {recommendedBreeds.map((breed, index) => {
                const rankStyle = getRankStyle(index)
                const isFirst = index === 0

                return (
                  <motion.div
                    key={breed}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.5 + index * 0.15,
                      type: 'spring',
                      stiffness: 200,
                      damping: 15
                    }}
                    className={`relative ${isFirst ? 'mb-6' : ''}`}
                  >
                    <div
                      className={`bg-white rounded-xl ${isFirst ? 'p-5' : 'p-3'} border border-gray-200 shadow-md relative overflow-hidden ${
                        isFirst ? 'ring-2 ring-primary/30 scale-105' : ''
                      }`}
                      style={{
                        boxShadow: isFirst
                          ? '0 4px 0 0 rgba(234, 88, 12, 0.3), 0 8px 20px rgba(0, 0, 0, 0.1)'
                          : '0 2px 0 0 rgba(229, 231, 235, 0.8)'
                      }}
                    >
                      {isFirst && (
                        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                          BEST MATCH
                        </div>
                      )}

                      <div className="flex items-center gap-4 mb-4">
                        {/* Rank Badge */}
                        <motion.div
                          initial={{ rotate: -180, scale: 0 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{
                            delay: 0.6 + index * 0.15,
                            type: 'spring',
                            stiffness: 200
                          }}
                          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${rankStyle.containerClass} shadow-lg relative`}
                        >
                          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 to-transparent"></div>
                          <div className="relative text-center">
                            <div className={`text-2xl font-black ${rankStyle.textColor}`}>
                              {index + 1}
                            </div>
                          </div>
                        </motion.div>

                        {/* Breed Name */}
                        <div className="flex-1 text-left">
                          <h3 className={`font-display font-bold ${isFirst ? 'text-2xl text-primary' : 'text-xl text-gray-500'}`}>
                            {breed}
                          </h3>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <motion.button
                        onClick={() => handleViewDetail(breed)}
                        className="w-full bg-primary text-white font-semibold py-3 px-4 rounded-lg text-sm relative overflow-hidden group flex items-center justify-between"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 + index * 0.15 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          boxShadow: '0 3px 0 0 rgba(234, 88, 12, 0.7), 0 4px 8px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <div
                          className="absolute inset-0 rounded-lg"
                          style={{
                            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.1) 100%)'
                          }}
                        />
                        <span className="relative z-10">Lihat Detail Ras</span>
                        <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Breed Detail Drawer */}
        <BreedDetail
          isOpen={isDetailDrawerOpen}
          onOpenChange={setIsDetailDrawerOpen}
          breedName={selectedBreed}
          petType={petType}
        />
      </div>
    )
  }

  // Question flow
  if (!currentQuestion) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary/5 flex items-start justify-center">
      <div className="max-w-2xl w-full">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-foreground/60 mb-2 font-semibold">
            <span>Pertanyaan {currentQuestionIndex + 1} dari {questions.length}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Pet Expert Character */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="text-center"
          >
            <img
              src={currentImage}
              alt="Pet Expert"
              className="w-48 h-48 mx-auto object-contain"
            />
          </motion.div>
        </AnimatePresence>

        {/* Question card */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-orange-100 rounded-xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <p className="text-lg font-medium text-gray-600 leading-snug">
            <Typewriter
              text={currentQuestion.text}
              onComplete={() => !showAnswers && setShowAnswers(true)}
            />
          </p>
        </motion.div>

        {/* Answer options - candy button style */}
        <AnimatePresence>
          {showAnswers && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {currentQuestion.answers.map((answer, index) => {
                const isSelected = selectedAnswerIndex === index
                const isOther = selectedAnswerIndex !== null && selectedAnswerIndex !== index

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(answer.value, answer.image, index)}
                    disabled={isTransitioning}
                    className={`w-full bg-primary text-white font-semibold py-5 px-6 rounded-xl text-left relative overflow-hidden ${
                      isTransitioning ? 'cursor-not-allowed' : 'active:translate-y-1'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: isOther ? 0.5 : 1,
                      x: 0,
                      scale: isSelected ? 1.05 : 1,
                      filter: isOther ? 'grayscale(100%)' : 'grayscale(0%)'
                    }}
                    transition={{
                      delay: index * 0.1,
                      scale: { type: 'spring', stiffness: 300, damping: 20 },
                      opacity: { duration: 0.3 },
                      filter: { duration: 0.3 }
                    }}
                    whileHover={!isTransitioning ? { scale: 1.02 } : {}}
                    whileTap={!isTransitioning ? { scale: 0.98 } : {}}
                    style={{
                      boxShadow: isSelected
                        ? '0 6px 0 0 rgba(234, 88, 12, 0.9), 0 8px 16px rgba(0, 0, 0, 0.25)'
                        : '0 4px 0 0 rgba(234, 88, 12, 0.7), 0 6px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.1) 100%)'
                      }}
                    />
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 rounded-xl ring-4 ring-primary/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    <span className="relative z-10 block text-sm leading-relaxed">
                      {answer.text}
                    </span>
                  </motion.button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default FindPet
