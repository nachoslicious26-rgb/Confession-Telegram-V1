import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(req) {
  try {
    const { id, content, action } = await req.json();

    if (action === 'approve') {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const channelId = process.env.TELEGRAM_CHANNEL_ID;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: channelId,
          text: `📢 #Confession\n\n${content}`
        })
      });

      await supabase.from('confessions').update({ status: 'approved' }).eq('id', id);
    } else {
      await supabase.from('confessions').update({ status: 'rejected' }).eq('id', id);
    }

    return new Response('Success', { status: 200 });
  } catch (error) {
    return new Response('Error', { status: 500 });
  }
}
