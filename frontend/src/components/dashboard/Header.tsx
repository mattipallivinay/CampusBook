
import { useEffect, useState } from 'react'
import { ChevronDown, Settings, LogOut, UserCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, type UserProfile } from '../../services/settingsService'
import { logoutUser } from '../../services/authService'

function Header() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const profile = await getCurrentUser()
        setUser(profile)
      } catch (error) {
        console.error('Failed to load header profile:', error)
      }
    }

    void loadUser()
  }, [])

  const handleLogout = () => {
    logoutUser()
    navigate('/login', { replace: true })
  }

  const initials = user?.name
    ? user.name.charAt(0).toUpperCase()
    : '?'

  return (
    <header className="relative z-20 flex h-20 items-center justify-between border-b border-white/10 bg-slate-950 px-8">
      <div>
        <h2 className="text-xl font-semibold text-white">
          Dashboard
        </h2>
        <p className="text-sm text-slate-400">
          Welcome back! Here's your academic overview.
        </p>
      </div>

      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 font-semibold text-white">
            {initials}
          </div>

          <div className="text-left">
            <p className="text-sm font-medium text-white">
              {user?.name || 'Loading...'}
            </p>
            <p className="text-xs text-slate-400">
              {user?.role || 'Campus Member'}
            </p>
          </div>

          <ChevronDown
            size={16}
            className={`text-slate-400 transition ${
              dropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-xl">
            <div className="border-b border-slate-700 px-3 py-3">
              <p className="font-medium text-white">
                {user?.name}
              </p>
              <p className="truncate text-xs text-slate-400">
                {user?.email}
              </p>
            </div>

            <button
              onClick={() => navigate('/settings')}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <UserCircle size={18} />
              My Profile
            </button>

            <button
              onClick={() => navigate('/settings')}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Settings size={18} />
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-red-400 hover:bg-red-500/10"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
