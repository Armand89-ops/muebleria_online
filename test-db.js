const url = "https://magiqjdbnjtibibihgpb.supabase.co/rest/v1/productos?select=*&limit=1";
const key = "sb_publishable_dFMdWP-Vu659d8cmhsGL1Q_HHSLJZ9u";

fetch(url, { headers: { apikey: key, Authorization: `Bearer ${key}` } })
.then(r => r.json())
.then(console.log)
.catch(console.error);
