import { createFileRoute, Outlet } from '@tanstack/react-router'

import Navbar from 'src/components/navbar'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  )
}