import { createClient } from './utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: cases } = await supabase.from('cases').select();

  return (
    <div className="p-6 font-sans">
      <h1 className="text-xl font-bold mb-4">INCORRUPTA — Supabase Cases Stream</h1>
      <ul className="space-y-2">
        {cases?.map((c: any) => (
          <li key={c.id} className="p-3 bg-white border border-slate-200 rounded">
            <strong>{c.cr_number}</strong> — {c.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
