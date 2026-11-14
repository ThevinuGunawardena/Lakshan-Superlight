import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from environment variables or browser storage
export function getStoredSupabaseConfig() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = localStorage.getItem('lsl_supabase_url') || '';
  const localKey = localStorage.getItem('lsl_supabase_key') || '';

  const url = localUrl || envUrl;
  const key = localKey || envKey;

  const isConfigured = Boolean(
    url && 
    key && 
    !url.includes('your-project') && 
    !key.includes('your-anon')
  );

  return { url, key, isConfigured };
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const { url, key, isConfigured } = getStoredSupabaseConfig();
  if (!isConfigured) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return supabaseInstance;
}

export function resetSupabaseClient(newUrl: string, newKey: string) {
  localStorage.setItem('lsl_supabase_url', newUrl.trim());
  localStorage.setItem('lsl_supabase_key', newKey.trim());
  supabaseInstance = null;
  return getSupabase();
}

export async function testSupabaseConnection(testUrl?: string, testKey?: string): Promise<{ success: boolean; message: string }> {
  try {
    const config = getStoredSupabaseConfig();
    const url = (testUrl || config.url).trim();
    const key = (testKey || config.key).trim();

    if (!url || !key) {
      return { success: false, message: 'Please provide both Supabase Project URL and Anon Public Key.' };
    }

    const testClient = createClient(url, key);
    // Ping a table or perform an unauthenticated health check query
    const { error } = await testClient.from('lsl_company_info').select('count', { count: 'exact', head: true });
    
    if (error) {
      // If table doesn't exist yet, but connection was made to the instance
      if (error.code === '42P01') {
        return { 
          success: true, 
          message: 'Connected to Supabase project! (Tables not created yet — run the schema script in the SQL editor).' 
        };
      }
      return { success: false, message: `Connection error: ${error.message} (Code: ${error.code})` };
    }

    return { success: true, message: 'Connected successfully to Supabase cloud database!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to connect to Supabase.' };
  }
}
