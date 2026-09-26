import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok',{headers:corsHeaders});
  try {
    const key=Deno.env.get('OPENAI_API_KEY'); if(!key) throw new Error('OPENAI_API_KEY is not configured');
    const {profile,program,faculty=[]}=await req.json();
    const schema={type:'object',additionalProperties:false,properties:{
      overall_score:{type:'number',minimum:0,maximum:100},
      components:{type:'object',additionalProperties:false,properties:{
        research_fit:{type:'number'},methods_fit:{type:'number'},faculty_fit:{type:'number'},academic_preparation:{type:'number'},research_experience:{type:'number'}
      },required:['research_fit','methods_fit','faculty_fit','academic_preparation','research_experience']},
      reasons:{type:'array',items:{type:'string'}},gaps:{type:'array',items:{type:'string'}},
      faculty_matches:{type:'array',items:{type:'object',additionalProperties:false,properties:{name:{type:'string'},fit:{type:'number'},reason:{type:'string'}},required:['name','fit','reason']}}
    },required:['overall_score','components','reasons','gaps','faculty_matches']};
    const body={model:'gpt-5.6',input:[{role:'system',content:'You are an evidence-grounded PhD fit analyst. Scores are comparative fit indicators, never admission probabilities. Use only supplied profile/program/faculty facts.'},{role:'user',content:JSON.stringify({profile,program,faculty})}],text:{format:{type:'json_schema',name:'program_match',strict:true,schema}}};
    const rr=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify(body)});
    if(!rr.ok) throw new Error(await rr.text()); const response=await rr.json();
    const txt=response.output?.flatMap((o:any)=>o.content||[]).find((c:any)=>c.type==='output_text')?.text;
    return json(JSON.parse(txt));
  } catch(e){return json({error:String(e?.message||e)},500)}
});
function json(v:unknown,status=200){return new Response(JSON.stringify(v),{status,headers:{...corsHeaders,'Content-Type':'application/json'}})}
