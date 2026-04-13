import { supabaseAdmin } from './lib/db';

async function checkCols() {
  const { data, error } = await supabaseAdmin.from('productos').select('*').limit(1);
  console.log("Data:", data, "Error:", error);
}

checkCols();
