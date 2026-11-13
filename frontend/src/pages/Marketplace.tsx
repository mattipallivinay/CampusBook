
import { useEffect, useState } from 'react'
import {
  getAllListings,
  getMyListings,
  createListing,
  updateListingStatus,
} from '../services/marketplaceService'

interface Listing {
  id: string
  title: string
  author: string
  description?: string
  price: number
  condition: string
  imageUrl?: string
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD'
  seller?: {
    id: string
    name: string
  }
}

function Marketplace() {
  const [listings, setListings] = useState<Listing[]>([])
  const [myListings, setMyListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'browse' | 'mine'>('browse')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    condition: 'GOOD',
    imageUrl: '',
  })

  const loadListings = async () => {
    try {
      setLoading(true)
      const [all, mine] = await Promise.all([
        getAllListings(),
        getMyListings(),
      ])
      setListings(all.data)
      setMyListings(mine.data)
    } catch (error) {
      console.error('Failed to load marketplace:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadListings()
  }, [])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await createListing({
        ...form,
        price: Number(form.price),
      })
      setForm({
        title: '',
        author: '',
        description: '',
        price: '',
        condition: 'GOOD',
        imageUrl: '',
      })
      setShowForm(false)
      setActiveTab('mine')
      await loadListings()
    } catch (error) {
      console.error('Failed to create listing:', error)
      alert('Could not create listing. Please try again.')
    }
  }

  const handleStatusChange = async (
    id: string,
    status: 'AVAILABLE' | 'RESERVED' | 'SOLD'
  ) => {
    try {
      await updateListingStatus(id, status)
      await loadListings()
    } catch (error) {
      console.error('Failed to update listing:', error)
      alert('Could not update listing status.')
    }
  }

  const visibleListings = (
    activeTab === 'browse' ? listings : myListings
  ).filter((item) =>
    `${item.title} ${item.author} ${item.condition}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Book Marketplace</h1>
          <p className="mt-2 text-slate-400">
            Buy and sell academic books within your campus.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-500"
        >
          {showForm ? 'Close Form' : '+ Sell a Book'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="grid gap-4 rounded-2xl border border-slate-700 bg-slate-900 p-6 md:grid-cols-2"
        >
          <h2 className="text-xl font-semibold text-white md:col-span-2">
            Create Book Listing
          </h2>

          <input
            required
            placeholder="Book title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
          />

          <input
            required
            placeholder="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
          />

          <input
            required
            type="number"
            min="0"
            step="0.01"
            placeholder="Price (₹)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
          />

          <select
            value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value })}
            className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
          >
            <option value="NEW">New</option>
            <option value="LIKE_NEW">Like New</option>
            <option value="GOOD">Good</option>
            <option value="ACCEPTABLE">Acceptable</option>
          </select>

          <input
            placeholder="Image URL (optional)"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-white md:col-span-2"
          />

          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-white md:col-span-2"
            rows={3}
          />

          <button
            type="submit"
            className="rounded-lg bg-indigo-600 p-3 font-semibold text-white hover:bg-indigo-500 md:col-span-2"
          >
            Publish Listing
          </button>
        </form>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setActiveTab('browse')}
          className={`rounded-lg px-5 py-2 ${
            activeTab === 'browse'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800 text-slate-300'
          }`}
        >
          Browse Books
        </button>

        <button
          onClick={() => setActiveTab('mine')}
          className={`rounded-lg px-5 py-2 ${
            activeTab === 'mine'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800 text-slate-300'
          }`}
        >
          My Listings
        </button>
      </div>

      <input
        placeholder="Search books or authors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-white outline-none focus:border-indigo-500"
      />

      {loading ? (
        <p className="text-slate-400">Loading marketplace...</p>
      ) : visibleListings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 p-12 text-center">
          <h3 className="text-xl font-semibold text-white">
            No books found
          </h3>
          <p className="mt-2 text-slate-400">
            Be the first to add a book to the marketplace.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visibleListings.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900"
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-slate-800 text-5xl">
                  📚
                </div>
              )}

              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                    {item.status}
                  </span>
                </div>

                <p className="text-sm text-slate-400">
                  By {item.author}
                </p>

                <p className="text-sm text-slate-400">
                  Condition: {item.condition}
                </p>

                {item.description && (
                  <p className="text-sm text-slate-300">
                    {item.description}
                  </p>
                )}

                <p className="text-2xl font-bold text-indigo-400">
                  ₹{item.price.toLocaleString('en-IN')}
                </p>

                {activeTab === 'mine' && (
                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(
                        item.id,
                        e.target.value as Listing['status']
                      )
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2 text-white"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="RESERVED">Reserved</option>
                    <option value="SOLD">Sold</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Marketplace
