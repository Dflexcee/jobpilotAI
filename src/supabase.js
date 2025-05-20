// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lgunvdruikggvvkcghpy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxndW52ZHJ1aWtnZ3Z2a2NnaHB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDIxOTQsImV4cCI6MjA2MzI3ODE5NH0.wR9R6TUGj4vYRo4JA_k3vhCAUUQEJDXgzLZW0u8eMv8';

export const supabase = createClient(supabaseUrl, supabaseKey);
