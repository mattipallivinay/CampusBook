
import { useEffect, useMemo, useState } from 'react'
import { getLibraryResources } from '../services/studyLibraryService'

interface Resource {
  id: string
  title: string
  description?: string
  type: string
  fileUrl: string
  fileName: string
  createdAt: string
  course?: {
    title: string
    code: string
  }
  uploader?: {
    name: string
    role: string
  }
}

function StudyLibrary() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('ALL')
  const [selectedCourse, setSelectedCourse] = useState('ALL')

  useEffect(() => {
    const loadResources = async () => {
      try {
        const response = await getLibraryResources()
        setResources(response.data || [])
      } catch (error) {
        console.error('Failed to load study library:', error)
      } finally {
        setLoading(false)
      }
    }

    void loadResources()
  }, [])

  const courses = useMemo(
    () => Array.from(
      new Map(
        resources
          .filter((resource) => resource.course)
          .map((resource) => [
            resource.course!.code,
            resource.course!,
          ])
      ).values()
    ),
    [resources]
  )

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = [
      resource.title,
      resource.description || '',
      resource.fileName,
      resource.course?.title || '',
      resource.course?.code || '',
    ].join(' ').toLowerCase().includes(search.toLowerCase())

    const matchesType =
      selectedType === 'ALL' || resource.type === selectedType

    const matchesCourse =
      selectedCourse === 'ALL' ||
      resource.course?.code === selectedCourse

    return matchesSearch && matchesType && matchesCourse
  })

  const resourceTypes = [
    'ALL',
    'PDF',
    'PPT',
    'NOTES',
    'ASSIGNMENT',
    'QUESTION_PAPER',
    'OTHER',
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Study Library</h1>
        <p className="mt-2 text-slate-400">
          Your academic resources, notes, assignments and study materials
          in one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Total Resources</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {resources.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Courses Covered</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {courses.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Filtered Results</p>
          <p className="mt-2 text-3xl font-bold text-indigo-400">
            {filteredResources.length}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Search notes, books, subjects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-white outline-none focus:border-indigo-500"
        />

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-white"
        >
          <option value="ALL">All Courses</option>
          {courses.map((course) => (
            <option key={course.code} value={course.code}>
              {course.title} ({course.code})
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {resourceTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`rounded-lg px-4 py-2 text-sm ${
              selectedType === type
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {type === 'ALL' ? 'All Materials' : type.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-400">Loading study library...</p>
      ) : filteredResources.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 p-12 text-center">
          <div className="text-5xl">📚</div>
          <h2 className="mt-4 text-xl font-semibold text-white">
            No resources found
          </h2>
          <p className="mt-2 text-slate-400">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="rounded-2xl border border-slate-700 bg-slate-900 p-5"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
                  {resource.type.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(resource.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-white">
                {resource.title}
              </h3>

              {resource.description && (
                <p className="mt-2 text-sm text-slate-400">
                  {resource.description}
                </p>
              )}

              <div className="mt-4 space-y-1 text-sm text-slate-400">
                <p>Course: {resource.course?.title || 'N/A'}</p>
                <p>Code: {resource.course?.code || 'N/A'}</p>
                <p>Uploaded by: {resource.uploader?.name || 'Faculty'}</p>
                <p className="truncate">File: {resource.fileName}</p>
              </div>

              <a
                href={resource.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 block rounded-lg bg-indigo-600 px-4 py-3 text-center font-semibold text-white hover:bg-indigo-500"
              >
                View / Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StudyLibrary
