
import { useEffect, useState } from 'react'
import {
  getFacultyResources,
  getFacultyCourses,
  uploadFacultyResource,
} from '../services/facultyResourceService'

interface Course {
  id: string
  title: string
  code: string
}

interface Resource {
  id: string
  title: string
  description?: string
  type: string
  fileUrl: string
  fileName: string
  createdAt: string
  course?: Course
}

function FacultyResources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'PDF',
    courseId: '',
  })

  const [file, setFile] = useState<File | null>(null)

  // Load resources and courses after an upload or refresh.
  const loadData = async () => {
    try {
      setLoading(true)

      const [resourceResponse, courseResponse] = await Promise.all([
        getFacultyResources(),
        getFacultyCourses(),
      ])

      setResources(resourceResponse.data || [])
      setCourses(courseResponse.data || [])
    } catch (error) {
      console.error('Failed to load faculty resources:', error)
      setError('Unable to load resources. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Initial data loading with effect cleanup.
  useEffect(() => {
    let active = true

    Promise.all([
      getFacultyResources(),
      getFacultyCourses(),
    ])
      .then(([resourceResponse, courseResponse]) => {
        if (!active) return

        setResources(resourceResponse.data || [])
        setCourses(courseResponse.data || [])
      })
      .catch((error: unknown) => {
        if (!active) return

        console.error('Failed to load faculty resources:', error)
        setError('Unable to load resources. Please try again.')
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const handleUpload = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (!file) {
      setError('Please select a file.')
      return
    }

    if (!form.courseId) {
      setError('Please select a course.')
      return
    }

    try {
      setUploading(true)
      setError('')

      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('type', form.type)
      formData.append('courseId', form.courseId)
      formData.append('file', file)

      await uploadFacultyResource(formData)

      setForm({
        title: '',
        description: '',
        type: 'PDF',
        courseId: '',
      })

      setFile(null)
      setShowForm(false)

      await loadData()
    } catch (error) {
      console.error('Resource upload failed:', error)
      setError('Upload failed. Please check the file and try again.')
    } finally {
      setUploading(false)
    }
  }

  const myResources = resources

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Faculty Resources
          </h1>
          <p className="mt-2 text-slate-400">
            Upload and manage your academic materials.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-500"
        >
          {showForm ? 'Close Form' : '+ Upload Resource'}
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Resources Loaded</p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            {resources.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Available Courses</p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            {courses.length}
          </h2>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleUpload}
          className="grid gap-4 rounded-2xl border border-slate-700 bg-slate-900 p-6"
        >
          <h2 className="text-xl font-semibold text-white">
            Upload Academic Resource
          </h2>

          <input
            required
            placeholder="Resource title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
          />

          <select
            required
            value={form.courseId}
            onChange={(e) =>
              setForm({ ...form, courseId: e.target.value })
            }
            className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
          >
            <option value="">Select course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title} ({course.code})
              </option>
            ))}
          </select>

          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
            className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
          >
            <option value="PDF">PDF</option>
            <option value="PPT">PPT</option>
            <option value="NOTES">Notes</option>
            <option value="ASSIGNMENT">Assignment</option>
            <option value="QUESTION_PAPER">Question Paper</option>
            <option value="OTHER">Other</option>
          </select>

          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
            rows={3}
          />

          <input
            required
            type="file"
            accept=".pdf,.ppt,.pptx,.doc,.docx,.txt"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
            className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
          />

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="rounded-lg bg-indigo-600 p-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Resource'}
          </button>
        </form>
      )}

      {error && !showForm && (
        <p className="text-red-400">{error}</p>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">
          Uploaded Resources
        </h2>

        {loading ? (
          <p className="text-slate-400">Loading resources...</p>
        ) : myResources.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center">
            <p className="text-slate-400">
              No resources available yet. Upload your first resource.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {myResources.map((resource) => (
              <div
                key={resource.id}
                className="rounded-2xl border border-slate-700 bg-slate-900 p-5"
              >
                <span className="rounded-lg bg-indigo-500/10 px-3 py-1 text-xs text-indigo-400">
                  {resource.type}
                </span>

                <h3 className="mt-4 font-bold text-white">
                  {resource.title}
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  {resource.course?.title || 'Course'}
                </p>

                <p className="mt-2 truncate text-xs text-slate-500">
                  {resource.fileName}
                </p>

                <a
                  href={resource.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 block rounded-lg bg-indigo-600 p-3 text-center font-semibold text-white hover:bg-indigo-500"
                >
                  View Resource
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default FacultyResources
