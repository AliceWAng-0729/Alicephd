import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const key = Deno.env.get('OPENAI_API_KEY');
    if (!key) throw new Error('OPENAI_API_KEY is not configured');
    const form = await req.formData();
    const file = form.get('cv');
    if (!(file instanceof File)) return json({error:'cv file required'},400);
    if (file.size > 10_000_000) return json({error:'file too large'},413);

    const upload = new FormData();
    upload.append('purpose','user_data');
    upload.append('file',file,file.name);
    const uf = await fetch('https://api.openai.com/v1/files',{method:'POST',headers:{Authorization:'Bearer '+key},body:upload});
    if(!uf.ok) throw new Error('OpenAI file upload failed: '+await uf.text());
    const uploaded = await uf.json();

    const schema = {
      type:'object', additionalProperties:false,
      properties:{
        education:{type:'array',items:{type:'object',additionalProperties:false,properties:{degree:{type:['string','null']},university:{type:['string','null']},gpa:{type:['string','null']},graduation_year:{type:['string','null']}},required:['degree','university','gpa','graduation_year']}},
        research_experience:{type:'array',items:{type:'string'}},
        publications:{type:'array',items:{type:'string'}},
        methods:{type:'array',items:{type:'string'}},
        skills:{type:'array',items:{type:'string'}},
        awards:{type:'array',items:{type:'string'}},
        research_interests:{type:'array',items:{type:'string'}}
      }, required:['education','research_experience','publications','methods','skills','awards','research_interests']
    };

    const body = {
      model:'gpt-5.6',
      input:[{role:'user',content:[
        {type:'input_file',file_id:uploaded.id},
        {type:'input_text',text:'Extract the applicant academic profile from this CV. Do not invent missing facts. Infer broad research-interest keywords only when clearly supported by projects/publications.'}
      ]}],
      text:{format:{type:'json_schema',name:'cv_profile',strict:true,schema}}
    };
    const rr = await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify(body)});
    if(!rr.ok) throw new Error('OpenAI response failed: '+await rr.text());
    const response = await rr.json();
    const txt = response.output?.flatMap((o:any)=>o.content||[]).find((c:any)=>c.type==='output_text')?.text;
    if(!txt) throw new Error('No structured profile returned');
    return json({profile:JSON.parse(txt),source_file:file.name});
  } catch(e) { return json({error:String(e?.message||e)},500); }
});
function json(v:unknown,status=200){return new Response(JSON.stringify(v),{status,headers:{...corsHeaders,'Content-Type':'application/json'}})}
