
import { useEffect, useState } from 'react'
import StatsCards from '../components/dashboard/StatsCards'
import RecentResources from '../components/dashboard/RecentResources'
import AIAssistantCard from '../components/dashboard/AIAssistantCard'
import { getCurrentUser, type UserProfile } from '../services/settingsService'

function Dashboard() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const profile = await getCurrentUser()
        setUser(profile)
      } catch (error) {
        console.error('Failed to load dashboard user:', error)
      } finally {
        setLoading(false)
      }
    }

    void loadUser()
  }, [])

  if (loading) {
    return <p className="text-slate-400">Loading dashboard...</p>
  }

  const role = user?.role

  const welcomeMessage = {
    STUDENT: 'Your academic journey, organized in one place.',
    FACULTY: 'Manage your courses and support your students.',
    ADMIN: 'Monitor and manage your CampusBook platform.',
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-white">
          Welcome{user ? `, ${user.name}` : ''} 👋
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          {role ? welcomeMessage[role] : 'Welcome to CampusBook.'}
        </p>

        {role && (
          <span className="mt-3 inline-block rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
            {role}
          </span>
        )}
      </section>

      <StatsCards role={user?.role} />

      {role === 'STUDENT' && (
  <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
    <div className="xl:col-span-2">
      <RecentResources />
    </div>

    <div>
      <AIAssistantCard />
    </div>
  </div>
)}
    </div>
  )
}

export default Dashboard
