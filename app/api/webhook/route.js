import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const BAD_WORDS_REGEX = /\b(ds|darkside|bogel|seks|sex|tetek|puki|kote|lancap|sanguin)\b/i;
const LINK_REGEX = /(t\.me|wa\.me|instagram\.com|twitter\.com|x\.com)\/[a-zA-Z0-9_]+/i;

export async function POST(req) {
  try {
    // Dipindahkan ke dalam fungsi POST
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const body = await req.json();
    const text = body?.message?.text;

    if (!text || text.startsWith('/')) {
      return new Response('OK', { status: 200 });
    }

    let initialStatus = 'pending';
    if (BAD_WORDS_REGEX.test(text) || LINK_REGEX.test(text)) {
      initialStatus = 'rejected';
    }

    await supabase.from('confessions').insert([
      { content: text, status: initialStatus }
    ]);

    return new Response('OK', { status: 200 });
  } catch (error) {
    return new Response('Error', { status: 500 });
  }
}
