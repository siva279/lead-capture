'use client'
import { useState } from 'react'

const SOURCES = ['Google', 'Referral', 'Social', 'Other']

export default function Home() {
  const [form, setForm] = useState({
    full_name: '', email: '', company: '', source: '', message: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [serverError, setServerError] = useState('')

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.full_name.trim()) e.full_name = 'Full name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setStatus('loading')
    setServerError('')

    try {
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error || 'Something went wrong.')
        setStatus('error')
        return
      }
      setStatus('success')
    } catch {
      setServerError('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow p-10 text-center max-w-md">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">You're in!</h2>
          <p className="text-gray-500 mb-6">We'll be in touch soon.</p>
          <button
            onClick={() => { setStatus('idle'); setForm({ full_name:'', email:'', company:'', source:'', message:'' }) }}
            className="text-blue-600 underline text-sm"
          >Submit another</button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-1">Get in touch</h1>
        <p className="text-gray-500 text-sm mb-6">Fill out the form and we'll reach out.</p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input
              type="text"
              value={form.full_name}
              onChange={e => setForm({...form, full_name: e.target.value})}
              className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.full_name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Jane Doe"
            />
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="jane@company.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium mb-1">Company</label>
            <input
              type="text"
              value={form.company}
              onChange={e => setForm({...form, company: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Acme Inc. (optional)"
            />
          </div>

          {/* Source */}
          <div>
            <label className="block text-sm font-medium mb-1">How did you hear about us?</label>
            <select
              value={form.source}
              onChange={e => setForm({...form, source: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Select...</option>
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              value={form.message}
              onChange={e => setForm({...form, message: e.target.value})}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Anything you'd like us to know... (optional)"
            />
          </div>

          {serverError && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg py-2.5 text-sm transition"
          >
            {status === 'loading' ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </main>
  )
}