import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@repo/react-components/ui'

import LandingBanner from 'src/components/landing-banner'
import useAuth from 'src/hooks/use-auth'

export const Route = createFileRoute('/_public/')({
  component: Index,
})

function Index() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleCTAClick = () => {
    if (isAuthenticated) {
      navigate({ to: '/admin' })
    } else {
      navigate({ to: '/login' })
    }
  }

  return (
    <div>
      <LandingBanner />

      <section className="py-8 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Tech Stack with Appwrite
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>⚡ Vite</CardTitle>
                <CardDescription>
                  Fast build tool with HMR
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Lightning fast development server
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🛣️ TanStack Router</CardTitle>
                <CardDescription>
                  Type-safe routing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Modern React routing solution
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔐 Appwrite</CardTitle>
                <CardDescription>
                  Backend-as-a-Service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Authentication & database ready
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button onClick={handleCTAClick} size="lg">
              {isAuthenticated ? 'Open Dashboard' : 'Try Authentication'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
