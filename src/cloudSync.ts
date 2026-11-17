import type { WidgetConfig } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const CONFIG_ID = 'default';
const TABLE = 'widget_config';

export function isCloudSyncConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

function headers(): HeadersInit {
  return {
    apikey: SUPABASE_ANON_KEY!,
    Authorization: `Bearer ${SUPABASE_ANON_KEY!}`,
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  };
}

export async function loadCloudConfig(): Promise<Partial<WidgetConfig> | null> {
  if (!isCloudSyncConfigured()) return null;
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${TABLE}?id=eq.${CONFIG_ID}&select=config&limit=1`,
    { headers: headers(), cache: 'no-store' },
  );
  if (!response.ok) throw new Error(`Cloud config read failed: ${response.status}`);
  const rows = await response.json() as Array<{ config: Partial<WidgetConfig> }>;
  return rows[0]?.config ?? null;
}

export async function saveCloudConfig(config: WidgetConfig): Promise<void> {
  if (!isCloudSyncConfigured()) return;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?on_conflict=id`, {
    method: 'POST',
    headers: { ...headers(), Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ id: CONFIG_ID, config, updated_at: new Date().toISOString() }),
  });
  if (!response.ok) throw new Error(`Cloud config save failed: ${response.status}`);
}
