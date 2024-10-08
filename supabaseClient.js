import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);


supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    console.log('Authenticated:', session.user);
  } else {
    console.log('User is signed out');
  }
  
});

  export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
  };