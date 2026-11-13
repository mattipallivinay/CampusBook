
import { useEffect, useState } from 'react'
import { getMyProfile } from '../services/settingsService'
import { logoutUser } from '../services/authService'
import { useNavigate } from 'react-router-dom'

interface UserProfile {
  id: string
  name: string
  email: string
  role: 'STUDENT' | 'FACULTY' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

function Settings() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getMyProfile()
        setProfile(response.data)
      } catch (error) {
        console.error('Failed to load profile:', error)
        setError('Unable to load your profile. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    void loadProfile()
  }, [])

  const handleLogout = () => {
    logoutUser()
    navigate('/login', { replace: true })
  }

  if (loading) {
    return <p className="text-slate-400">Loading account settings...</p>
  }

  if (error || !profile) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-red-400">
        {error || 'Profile not found.'}
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Account Settings</h1>
        <p className="mt-2 text-slate-400">
          Manage your CampusBook account and profile information.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white">
            {profile.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              {profile.name}
            </h2>
            <p className="text-sm text-slate-400">{profile.email}</p>
            <span className="mt-2 inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
              {profile.role}
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <h2 className="text-xl font-bold text-white">Profile Information</h2>

        <div>
          <p className="text-sm text-slate-400">Full Name</p>
          <p className="mt-1 font-medium text-white">{profile.name}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400">Email Address</p>
          <p className="mt-1 font-medium text-white">{profile.email}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400">Account Role</p>
          <p className="mt-1 font-medium text-white">{profile.role}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400">Account Created</p>
          <p className="mt-1 font-medium text-white">
            {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-red-500/20 bg-slate-900 p-6">
        <h2 className="text-xl font-bold text-white">Account Actions</h2>
        <p className="mt-2 text-sm text-slate-400">
          Sign out of your CampusBook account on this device.
        </p>

        <button
          onClick={handleLogout}
          className="mt-5 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-500"
        >
          Log Out
        </button>
      </section>
    </div>
  )
}

export default Settings
