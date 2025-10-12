import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_participant/participant/pet-guide')({
  component: ParticipantPetGuide,
})

function ParticipantPetGuide() {
  return (
    <div className='h-full w-full tex-center flex items-center justify-center text-gray-400 text-xl'>
      Pet Guide
    </div>
  )
}