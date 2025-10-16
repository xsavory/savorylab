import { createFileRoute, useNavigate } from '@tanstack/react-router'

import ARQuizExperience from 'src/components/ar/ar-quiz-experience'

export const Route = createFileRoute('/_participant/participant/ar')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  return <ARQuizExperience onClose={() => { navigate({ to: '/participant' }) }} />
}