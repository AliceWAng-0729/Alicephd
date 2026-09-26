import { corsHeaders } from '../_shared/cors.ts';
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS') return new Response('ok',{headers:corsHeaders});
 const u=new URL(req.url), id=u.searchParams.get('openalex_id');
 if(!id) return json({error:'openalex_id required'},400);
 const r=await fetch('https://api.openalex.org/works?filter=author.id:'+encodeURIComponent(id)+'&sort=publication_date:desc&per-page=10');
 const x=await r.json();
 return json({works:(x.results||[]).map((w:any)=>({title:w.title,year:w.publication_year,doi:w.doi,openalex_id:w.id,cited_by_count:w.cited_by_count}))});
});
function json(v:unknown,status=200){return new Response(JSON.stringify(v),{status,headers:{...corsHeaders,'Content-Type':'application/json'}})}
