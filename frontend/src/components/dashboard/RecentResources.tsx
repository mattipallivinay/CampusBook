import { FileText, Download, Clock } from 'lucide-react'

const resources = [
  {
    title: 'Data Structures and Algorithms',
    subject: 'Computer Science',
    type: 'PDF Notes',
    date: '2 hours ago',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    title: 'Database Management Systems',
    subject: 'DBMS',
    type: 'Study Material',
    date: 'Yesterday',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    title: 'Operating Systems – Unit 3',
    subject: 'Operating Systems',
    type: 'Lecture Notes',
    date: '2 days ago',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
]

function RecentResources() {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Recent Resources
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Your recently accessed academic materials
          </p>
        </div>

        <button className="text-sm font-medium text-violet-400 hover:text-violet-300">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {resources.map((resource) => (
          <div
            key={resource.title}
            className="flex items-center justify-between rounded-xl border border-white/5 p-4 transition hover:border-violet-500/30 hover:bg-white/[0.02]"
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-xl p-3 ${resource.bg}`}>
                <FileText size={22} className={resource.color} />
              </div>

              <div>
                <h4 className="text-sm font-medium text-white">
                  {resource.title}
                </h4>

                <p className="mt-1 text-xs text-slate-400">
                  {resource.subject} · {resource.type}
                </p>

                <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                  <Clock size={12} />
                  {resource.date}
                </p>
              </div>
            </div>

            <button
              aria-label={`Download ${resource.title}`}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-violet-500/10 hover:text-violet-400"
            >
              <Download size={19} />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RecentResources