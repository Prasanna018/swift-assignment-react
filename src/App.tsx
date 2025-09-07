import React, { useEffect, useState, lazy, Suspense } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import Loading from './components/Loading'
import type { User } from './types/types'
import { fetchUsers } from './api/api'

// lazy load for the profile component
const Profile = lazy(() => import('./Pages/Profile'))

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers()
      .then(list => {
        if (list && list.length > 0) setUser(list[0])
      })
  }, [])

  return (
    <div className="body-bg min-h-screen p-4">
      {/* Header bar */}
      <div className="bg-slate-700 max-w-6xl mx-auto text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Link to={'/'}>
            <img className='text-white' src='/public/logo.svg' alt="Logo" />
          </Link>
        </div>
        <Link to={'/profile'}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm">
              {
                user?.name
                  ? user.name
                    .split(' ')
                    .map(word => word[0]?.toUpperCase())
                    .slice(0, 2) // take only first + last
                    .join('')
                  : ''
              }
            </div>
            <span className="text-sm">{user?.name}</span>
          </div>
        </Link>
      </div>

      <main className="max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/profile"
            element={
              <Suspense fallback={<Loading />}>
                <Profile />
              </Suspense>
            }
          />
        </Routes>
      </main>
    </div>
  )
}