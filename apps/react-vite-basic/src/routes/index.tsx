import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@repo/react-components/ui'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <h3 className="text-3xl font-bold">Welcome Home!</h3>
      <div className="mt-4">
        <Button>Click me</Button>
      </div>
    </div>
  )
}