import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/greetings')({
  component: GreetingsPage,
})

function GreetingsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome to the Greetings Page
      </h1>
    </div>
  )
}