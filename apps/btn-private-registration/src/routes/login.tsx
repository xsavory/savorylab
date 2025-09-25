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

import logo from 'src/assets/logo2.png'
import treeImg from 'src/assets/tree.png'
import lightImg from 'src/assets/light.png'
import background2Img from 'src/assets/background2.png'

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

export const Route = createFileRoute('/login')({
  component: LoginPage,
  pendingComponent: PageLoader,
  beforeLoad: async ({ context }) => {
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${background2Img})` }}
      />
      
      {/* Light effects overlay */}
      <div 
        className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-30 mix-blend-screen"
        style={{ backgroundImage: `url(${lightImg})` }}
      />
      
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-slate-900/40 to-black/70"></div>
      
      {/* Decorative tree silhouette */}
      <div 
        className="absolute bottom-0 right-0 w-96 h-full bg-contain bg-bottom bg-no-repeat opacity-15 pointer-events-none"
        style={{ backgroundImage: `url(${treeImg})` }}
      />
      
      {/* Golden accent elements */}
      <div className="absolute top-20 left-20 w-32 h-32 border border-amber-400/15 rounded-full"></div>
      <div className="absolute bottom-40 left-32 w-16 h-16 border border-amber-300/10 rounded-lg rotate-45"></div>
      <div className="absolute top-1/2 right-32 w-24 h-24 border border-amber-500/10 rounded-full"></div>

      <div className="max-w-md w-full space-y-4 relative z-10">
        {/* Header */}
        <div className="text-center">
          {/* Event Headline */}
          <div className="flex justify-center">
            <img 
              src={logo} 
              alt="Grand Launching BTN Private - Elevate Your Legacy" 
              className="max-w-full max-h-20 h-auto object-contain drop-shadow-2xl filter brightness-110"
            />
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-black/30 backdrop-blur-sm py-8 px-6 shadow-2xl rounded-2xl border border-amber-400/20">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Error Message */}
              {loginError && (
                <div className="bg-red-900/30 border border-red-400/40 rounded-lg p-4 backdrop-blur-sm">
                  <p className="text-sm text-red-300">{loginError}</p>
                </div>
              )}

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200 font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        disabled={isSubmitting}
                        className="bg-black/20 border-amber-400/30 text-gray-100 placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400/20 backdrop-blur-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200 font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          {...field}
                          disabled={isSubmitting}
                          className="bg-black/20 border-amber-400/30 text-gray-100 placeholder:text-gray-400 focus:border-amber-400 focus:ring-amber-400/20 backdrop-blur-sm pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isSubmitting}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-300 hover:text-amber-300 transition-colors" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-300 hover:text-amber-300 transition-colors" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-black font-bold shadow-xl shadow-amber-500/30 transform hover:scale-105 transition-all duration-300 border-0 rounded-full py-3" 
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
                    Access Executive Portal
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-amber-400/20">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent w-8"></div>
              <span className="text-xs text-amber-200 italic">Demo Access</span>
              <div className="h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent w-8"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
