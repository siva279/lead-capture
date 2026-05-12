import { supabaseAdmin } from '@/lib/supabase'

export const revalidate = 0

interface Lead {
  id: string
  full_name: string
  email: string
  company: string | null
  source: string | null
  created_at: string
}

export default async function LeadsPage() {
  const { data: leads, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <p className="p-8 text-red-500">Failed to load leads.</p>
  }

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Leads ({leads?.length ?? 0})</h1>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              {['Name','Email','Company','Source','Submitted'].map(h => (
                <th key={h} className="px-4 py-3 font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads?.map((lead: Lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{lead.full_name}</td>
                <td className="px-4 py-3 text-gray-600">{lead.email}</td>
                <td className="px-4 py-3 text-gray-500">{lead.company || '—'}</td>
                <td className="px-4 py-3 text-gray-500">{lead.source || '—'}</td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}