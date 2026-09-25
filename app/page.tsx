'use client';
import {useMemo,useState} from 'react';
import {Search,Upload,BookOpen,Users,ClipboardCheck,Heart,Clock3,ShieldCheck,ExternalLink} from 'lucide-react';

type Program={id:string;university:string;title:string;location:string;field:string;funding:string;deadline:string;match:number;areas:string[];faculty:{name:string;fit:number;topics:string[]}[];source:string};
const programs:Program[]=[
{id:'nus-comm',university:'National University of Singapore',title:'PhD / Doctoral Research in Communications & New Media',location:'Singapore',field:'Communication / Digital Media',funding:'Funding varies by scheme',deadline:'See official admissions cycle',match:88,areas:['Digital media','AI & communication','Computational social science'],faculty:[{name:'Faculty match example',fit:91,topics:['AI-mediated communication','digital platforms']}],source:'Official programme pages'},
{id:'cuhk-comm',university:'The Chinese University of Hong Kong',title:'PhD in Communication',location:'Hong Kong',field:'Communication',funding:'Funding available via university / external schemes',deadline:'See official admissions cycle',match:86,areas:['Media psychology','Digital media','Computational methods'],faculty:[{name:'Faculty match example',fit:92,topics:['digital media','social influence']}],source:'Official programme pages'},
{id:'ntu-biz',university:'Nanyang Technological University',title:'PhD / Doctoral Research in Business',location:'Singapore',field:'Marketing / Consumer Behaviour',funding:'Funding varies by scheme',deadline:'See official admissions cycle',match:84,areas:['Consumer behavior','Marketing analytics','Digital platforms'],faculty:[{name:'Faculty match example',fit:87,topics:['consumer behavior','analytics']}],source:'Official programme pages'},
{id:'hku-msoc',university:'The University of Hong Kong',title:'Research Postgraduate in Media / Social Sciences',location:'Hong Kong',field:'Media / Social Science',funding:'Funding varies by scheme',deadline:'See official admissions cycle',match:82,areas:['Digital society','Media studies','Methods'],faculty:[{name:'Faculty match example',fit:85,topics:['digital society']}],source:'Official programme pages'}
];

export default function Home(){
 const [tab,setTab]=useState('Discover'); const [q,setQ]=useState(''); const [selected,setSelected]=useState<Program|null>(programs[0]);
 const filtered=useMemo(()=>programs.filter(p=>(p.title+p.university+p.field+p.areas.join(' ')).toLowerCase().includes(q.toLowerCase())),[q]);
 return <main className="shell">
  <aside className="sidebar"><div className="brand"><div className="logo">PN</div><div><strong>PhD Navigator</strong><span>Research & Application OS</span></div></div>
   <nav>{['Dashboard','My Profile','Discover','Shortlist','Applications'].map(x=><button key={x} className={tab===x?'nav active':'nav'} onClick={()=>setTab(x)}>{x}</button>)}</nav>
   <div className="sideCard"><ShieldCheck size={18}/><div><b>Evidence first</b><span>Official sources are kept separate from AI interpretation.</span></div></div>
  </aside>
  <section className="content"><header><div><p className="eyebrow">PH.D. APPLICATION INTELLIGENCE</p><h1>{tab==='Discover'?'Find programs that fit your research.':tab}</h1><p className="muted">Compare research fit, faculty overlap, funding information and application requirements in one workspace.</p></div><button className="upload"><Upload size={17}/> Upload CV</button></header>
   <div className="metrics"><Metric icon={<BookOpen/>} n="4" l="Programs indexed"/><Metric icon={<Users/>} n="12" l="Faculty profiles"/><Metric icon={<ClipboardCheck/>} n="7" l="Tracked requirements"/><Metric icon={<Heart/>} n="2" l="Shortlisted"/></div>
   <div className="workspace">
    <div className="leftPane"><div className="search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search university, field, research topic..."/></div>
     <div className="filters"><span>Singapore</span><span>Hong Kong</span><span>Funding</span><span>Research fit</span></div>
     <div className="list">{filtered.map(p=><button className={'programCard '+(selected?.id===p.id?'selected':'')} onClick={()=>setSelected(p)} key={p.id}><div className="row"><div><small>{p.location} · {p.field}</small><h3>{p.title}</h3><p>{p.university}</p></div><div className="score"><b>{p.match}</b><span>match</span></div></div><div className="chips">{p.areas.map(a=><span key={a}>{a}</span>)}</div><div className="cardFooter"><span><Clock3 size={14}/> {p.deadline}</span><span>Verified source <ShieldCheck size={14}/></span></div></button>)}</div>
    </div>
    {selected && <ProgramDetail p={selected}/>} 
   </div>
  </section>
 </main>
}
function Metric({icon,n,l}:{icon:React.ReactNode;n:string;l:string}){return <div className="metric"><div className="metricIcon">{icon}</div><div><b>{n}</b><span>{l}</span></div></div>}
function ProgramDetail({p}:{p:Program}){return <div className="detail"><div className="detailTop"><div><p className="eyebrow">PROGRAM DETAIL</p><h2>{p.title}</h2><p>{p.university} · {p.location}</p></div><button className="iconBtn"><Heart size={18}/></button></div><div className="heroScore"><div className="ring"><b>{p.match}</b><span>match</span></div><div><h3>Strong alignment</h3><p>Research themes overlap with your profile. Use this as an evidence-based comparison, not an admission prediction.</p></div></div><section className="section"><h4>What this program covers</h4><div className="chips">{p.areas.map(a=><span key={a}>{a}</span>)}</div></section><section className="grid2"><Info title="Funding" value={p.funding}/><Info title="Application deadline" value={p.deadline}/></section><section className="section"><div className="sectionHead"><h4>Faculty match</h4><span>Recent research evidence</span></div>{p.faculty.map(f=><div className="faculty" key={f.name}><div><b>{f.name}</b><p>{f.topics.join(' · ')}</p></div><strong>{f.fit}%</strong></div>)}</section><section className="section"><h4>Personalized checklist</h4>{['CV','Transcript','Research proposal / statement','Writing sample','Recommendation letters'].map((x,i)=><div className="check" key={x}><span className={i<2?'done':''}>{i<2?'✓':''}</span><div><b>{x}</b><small>{i<2?'Ready / detected from profile':'Needs preparation or review'}</small></div></div>)}</section><div className="source"><ShieldCheck size={16}/><div><b>Source provenance</b><span>{p.source} · last verified timestamp shown when live connectors are enabled.</span></div><ExternalLink size={16}/></div></div>}
function Info({title,value}:{title:string;value:string}){return <div className="info"><span>{title}</span><b>{value}</b></div>}
