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
  toast,
} from '@repo/react-components/ui'

import useAdminAuth from 'src/hooks/use-admin-auth'
import PageLoader from 'src/components/page-loader'

import logo from 'src/assets/royal-canin-logo.png'

// Login form validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export const Route = createFileRoute('/login')({
  pendingMs: 100,
  component: LoginPage,
  pendingComponent: PageLoader,
  beforeLoad: async ({ context }) => {
    const user = await context.adminAuth?.getUser()
    if (user) {
      throw redirect({ to: '/admin' })
    } else {
      return
    }
  }
})

function LoginPage() {
  const { login, isLoading } = useAdminAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await login(values.email, values.password)

      if (result.success) {
        toast.success('Login successful!')
        // Navigate to admin page after successful login
        navigate({ to: '/admin' })
      } else {
        toast.error(result.error || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An unexpected error occurred')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-md w-full space-y-4">
        {/* Header */}
        <div className="text-center">
          <img
            src={logo}
            alt="SavoryLab Logo"
            className="h-16 mx-auto mb-6"
          />
          <h2 className="text-3xl font-bold text-foreground font-display">
            Admin Login
          </h2>
          <p className="text-sm text-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          disabled={isLoading}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
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
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500">
          Protected by Aftertaste Creative
        </p>
      </div>
    </div>
  )
}
