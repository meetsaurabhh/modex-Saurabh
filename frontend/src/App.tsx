import { useEffect, useMemo, useState  } from "react";
import axios from "axios";
import "./index.css";

type Med = { id: number; name: string; common_use?: string; notes?: string };
type Interaction = {
  med_a: string;
  med_b: string;
  severity_level: number;
  severity_text: string;
  explanation?: string;
  alternatives?: string;
};

const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:4000";

function severityClass(level:number|null){
  if(level === 3) return "badge high";
  if(level === 2) return "badge mid";
  if(level === 1) return "badge low";
  return "badge";
}

export default function App(){
  const [meds, setMeds] = useState<Med[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [message, setMessage] = useState<string|null>(null);

  useEffect(()=>{
    axios.get(apiBase + "/meds")
      .then(res => setMeds(res.data.meds || []))
      .catch(()=> setMessage("Failed to load medications list."));
  },[]);

  const filtered = useMemo(()=>{
    if(!filter) return meds;
    const q = filter.toLowerCase();
    return meds.filter(m => m.name.toLowerCase().includes(q) || (m.common_use||"").toLowerCase().includes(q));
  },[meds,filter]);

  function toggle(name:string){
    setSelected(s => s.includes(name) ? s.filter(x=>x!==name) : [...s,name]);
  }

  async function check(){
    setMessage(null);
    setResult(null);
    if(selected.length < 2){
      setMessage("Select at least two medications.");
      return;
    }
    setLoading(true);
    try{
      const res = await axios.post(apiBase + "/check-interactions", { meds: selected });
      setResult(res.data);
    }catch(err:any){
      setMessage(err?.response?.data?.error || "Error checking interactions");
    }finally{ setLoading(false); }
  }

  function resetAll(){
    setSelected([]); setFilter(""); setResult(null); setMessage(null);
  }

  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <div className="logo">M</div>
          <div className="title">
            <h1>Medication Interaction Checker</h1>
            <p className="small-muted">Demo only — not medical advice</p>
          </div>
        </div>

        <div style={{display:"flex", gap:8}}>
          <button className="btn alt" onClick={resetAll}>Reset</button>
        </div>
      </div>

      <div className="main-grid">
        <div className="panel">
          <div className="search">
            <input placeholder="Search meds..." value={filter} onChange={e=>setFilter(e.target.value)} />
          </div>

          <div className="med-list">
            {filtered.map(m => (
              <div key={m.id} className="med-item" onClick={() => toggle(m.name)}>
                <input type="checkbox" checked={selected.includes(m.name)} readOnly />
                <div className="med-meta">
                  <strong>{m.name}</strong>
                  <small>{m.common_use}</small>
                </div>
              </div>
            ))}
          </div>

          <div className="controls">
            <button className="btn" onClick={check} disabled={loading}>{loading ? "Checking…" : "Check Interactions"}</button>
            <button className="btn alt" onClick={()=>setSelected([...selected])}>Selected: {selected.length}</button>
          </div>

          {message && <div style={{marginTop:12, color:"#b91c1c"}}>{message}</div>}
        </div>

        <div className="result-card">
          <div className="result-header">
            <div><strong>Results</strong></div>
            <div className="small-muted">Pairwise interactions & recommended actions</div>
          </div>

          {!result ? (
            <div className="small-muted">Select at least two meds and click "Check Interactions".</div>
          ) : (
            <>
              {result.missing?.length > 0 && <div style={{color:"#b45309"}}>Missing: {result.missing.join(", ")}</div>}

              <div style={{display:"flex", alignItems:"center", gap:12, margin:"14px 0"}}>
                <div style={{fontWeight:700}}>Overall severity</div>
                <div className={severityClass(result.overall_severity?.level || null)}>
                  {result.overall_severity?.text || "None"}
                </div>
              </div>

              <div>
                {result.interactions?.length === 0 ? (
                  <div style={{color:"#15803d"}}>No known interactions.</div>
                ) : result.interactions.map((it:Interaction, idx:number) => (
                  <div key={idx} className="interaction">
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                      <div><strong>{it.med_a}</strong> ↔ <strong>{it.med_b}</strong></div>
                      <div className={severityClass(it.severity_level)}>{it.severity_text}</div>
                    </div>
                    <div style={{marginTop:8}}>{it.explanation}</div>
                    {it.alternatives && <div className="small-muted" style={{marginTop:8}}><em>Alternatives:</em> {it.alternatives}</div>}
                  </div>
                ))}
              </div>

              <div className="footer-note">Tip: fix missing names or consult clinician for severe combinations.</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
