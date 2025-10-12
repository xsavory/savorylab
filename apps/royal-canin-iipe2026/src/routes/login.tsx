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

export const Route = createFileRoute('/login')({
  component: LoginPage,
  pendingComponent: PageLoader,
})

function LoginPage() {

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
      </div>
    </div>
  )
}
