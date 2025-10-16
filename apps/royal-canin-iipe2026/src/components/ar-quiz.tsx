import { Loader2 } from 'lucide-react'

function ARQuiz() {
  return (
      <div className="flex flex-col items-center justify-center mt-16 ">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className='mt-2'>Loading</p>
      </div>
  )
}

export default ARQuiz