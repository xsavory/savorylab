// API abstraction layer for React Query
export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: string
}

// Mock data for users
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'Admin'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: 'User'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    role: 'User'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'Moderator'
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'User'
  }
]

// React Query keys
export const queryKeys = {
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
}

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// API functions
export const api = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    await delay(800) // Simulate network delay
    return mockUsers
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User | null> => {
    await delay(600)
    const user = mockUsers.find(user => user.id === id)
    return user || null
  },

  // Create a new user
  createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    await delay(1000)
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      ...userData
    }
    mockUsers.push(newUser)
    return newUser
  },

  // Update user
  updateUser: async (id: string, userData: Partial<Omit<User, 'id'>>): Promise<User | null> => {
    await delay(800)
    const userIndex = mockUsers.findIndex(user => user.id === id)
    if (userIndex === -1) return null

    const originalUser = mockUsers[userIndex]!
    const updatedUser: User = {
      id: originalUser.id,
      name: userData.name ?? originalUser.name,
      email: userData.email ?? originalUser.email,
      avatar: userData.avatar ?? originalUser.avatar,
      role: userData.role ?? originalUser.role,
    }
    mockUsers[userIndex] = updatedUser
    return updatedUser
  },

  // Delete user
  deleteUser: async (id: string): Promise<boolean> => {
    await delay(600)
    const userIndex = mockUsers.findIndex(user => user.id === id)
    if (userIndex === -1) return false

    mockUsers.splice(userIndex, 1)
    return true
  }
}