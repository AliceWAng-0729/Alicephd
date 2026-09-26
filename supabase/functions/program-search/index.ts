import { corsHeaders } from '../_shared/cors.ts';
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS') return new Response('ok',{headers:corsHeaders});
 const base=Deno.env.get('SUPABASE_URL'), key=Deno.env.get('SUPABASE_ANON_KEY');
 if(!base||!key) return json({error:'Supabase env missing'},500);
 const u=new URL(req.url), q=(u.searchParams.get('q')||'').trim();
 let endpoint=base+'/rest/v1/programs?select=*&order=university.asc&limit=100';
 if(q) endpoint+='&or=(university.ilike.*'+encodeURIComponent(q)+'*,title.ilike.*'+encodeURIComponent(q)+'*,field.ilike.*'+encodeURIComponent(q)+'*)';
 const r=await fetch(endpoint,{headers:{apikey:key,Authorization:'Bearer '+key}});
 return new Response(await r.text(),{status:r.status,headers:{...corsHeaders,'Content-Type':'application/json'}});
});
function json(v:unknown,status=200){return new Response(JSON.stringify(v),{status,headers:{...corsHeaders,'Content-Type':'application/json'}})}
