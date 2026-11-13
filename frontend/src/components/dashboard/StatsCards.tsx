
import { useEffect, useState } from 'react'
import {
  BookOpen,
  FileText,
  BrainCircuit,
  ShoppingBag,
  Users,
  GraduationCap,
} from 'lucide-react'

import {
  getStudentStats,
  getFacultyStats,
  getAdminStats,
} from '../../services/dashboardService'

interface StatsCardsProps {
  role?: 'STUDENT' | 'FACULTY' | 'ADMIN'
}

type Stat = {
  title: string
  value: number
  icon: typeof BookOpen
}

function StatsCards({ role = 'STUDENT' }: StatsCardsProps) {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)

        let data
        let cards: Stat[] = []

        if (role === 'ADMIN') {
          data = await getAdminStats()
          cards = [
            { title: 'Total Students', value: data.totalStudents, icon: GraduationCap },
            { title: 'Faculty Members', value: data.totalFaculty, icon: Users },
            { title: 'Total Resources', value: data.totalResources, icon: FileText },
            { title: 'Marketplace Listings', value: data.totalListings, icon: ShoppingBag },
          ]
        } else if (role === 'FACULTY') {
          data = await getFacultyStats()
          cards = [
            { title: 'Uploaded Resources', value: data.uploadedResources, icon: FileText },
            { title: 'My Marketplace Listings', value: data.totalListings, icon: ShoppingBag },
          ]
        } else {
          data = await getStudentStats()
          cards = [
            { title: 'Enrolled Courses', value: data.enrolledCourses, icon: BookOpen },
            { title: 'Study Resources', value: data.studyResources, icon: FileText },
            { title: 'AI Interactions', value: data.aiInteractions, icon: BrainCircuit },
            { title: 'Marketplace Listings', value: data.marketplaceListings, icon: ShoppingBag },
          ]
        }

        setStats(cards)
      } catch (error) {
        console.error('Failed to load dashboard statistics:', error)
      } finally {
        setLoading(false)
      }
    }

    void loadStats()
  }, [role])

  if (loading) {
    return <p className="text-slate-400">Loading statistics...</p>
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-white/10 bg-slate-900 p-5 transition hover:-translate-y-1"
          >
            <div className="w-fit rounded-xl bg-indigo-500/10 p-3">
              <Icon size={23} className="text-indigo-400" />
            </div>

            <p className="mt-5 text-sm text-slate-400">
              {stat.title}
            </p>

            <h3 className="mt-1 text-3xl font-bold text-white">
              {stat.value.toLocaleString('en-IN')}
            </h3>
          </div>
        )
      })}
    </div>
  )
}

export default StatsCards
