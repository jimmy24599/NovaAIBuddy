import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://wxtbrdcgsrgkeymbfogf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4dGJyZGNnc3Jna2V5bWJmb2dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NzA0MTUsImV4cCI6MjA2MTE0NjQxNX0.kNwgacYpK3qFg40btj2ZkrXQ0aaqMcr15OpJnQgdSgk'
);
