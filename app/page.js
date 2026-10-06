'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminDashboard() {
  const [list, setList] = useState([]);

  const fetchPending = async () => {
    const { data } = await supabase
      .from('confessions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    setList(data || []);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id, content, action) => {
    await fetch('/api/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, content, action })
    });
    fetchPending();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2>📋 Confession Pending Admin</h2>
      {list.length === 0 ? <p>Tiada confession baru.</p> : list.map((item) => (
        <div key={item.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
          <p>{item.content}</p>
          <button onClick={() => handleAction(item.id, item.content, 'approve')} style={{ background: 'green', color: 'white', padding: '8px 12px', marginRight: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            ✅ Approve
          </button>
          <button onClick={() => handleAction(item.id, item.content, 'reject')} style={{ background: 'red', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            ❌ Reject
          </button>
        </div>
      ))}
    </div>
  );
}
