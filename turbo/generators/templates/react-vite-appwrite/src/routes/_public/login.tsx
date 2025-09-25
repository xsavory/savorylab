import { useState } from 'react'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'
import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  zodResolver,
} from '@repo/react-components/ui'

import useAuth from 'src/hooks/use-auth'
import PageLoader from 'src/components/page-loader'

import logo from 'src/assets/logo.png'

// Login form validation schema
const loginSchema = z.object({
  email: z
    .email()
    .min(1, 'Email is required')
    .min(3, 'Email must be at least 3 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const Route = createFileRoute('/_public/login')({
  component: LoginPage,
  pendingComponent: PageLoader,
  beforeLoad: async ({ context }) => {
    if (!context.auth || context?.auth?.isLoading) {
      return;
    }

    if (context.auth?.isAuthenticated) {
      throw redirect({ to: '/admin' })
    }
  },
})

function LoginPage() {
  const navigate = useNavigate()
  const { isLoading: authLoading, login, error: loginError } = useAuth()

  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data.email, data.password)
      if (result.success) {
        console.log('✅ Login successful, redirecting to admin...')
        navigate({ to: '/admin' })
      }
    } catch (error) {
      console.error('❌ Login error:', error)
    }
  }

  if (authLoading) {
    return <PageLoader />
  }

  return (
    <div className="flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <img
            src={logo}
            alt="SavoryLab Logo"
            className="h-12 w-12 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Sign In
          </h2>
        </div>

        {/* Login Form */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Error Message */}
              {loginError && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="text-sm text-destructive">{loginError}</p>
                </div>
              )}

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        disabled={isSubmitting}
                        className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          {...field}
                          disabled={isSubmitting}
                          className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isSubmitting}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                          ) : (
                            <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Demo Info */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Demo authentication with Appwrite
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
