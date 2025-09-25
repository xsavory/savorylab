import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/booth')({
  component: BoothScanner,
})

function BoothScanner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome to the Booth Scanner Page
      </h1>
    </div>
  )
}