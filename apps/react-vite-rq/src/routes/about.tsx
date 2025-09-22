import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="p-2">
      <h3 className="text-3xl font-bold">About</h3>
      <p className="mt-2">This is a Vite + React + TypeScript app with TanStack Router, Tailwind CSS, and Shadcn UI!</p>
    </div>
  )
}