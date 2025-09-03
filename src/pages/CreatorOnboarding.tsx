import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "@/components/GlassCard";

type Link = { label:string; url:string };

export default function CreatorOnboarding(){
  const email = localStorage.getItem("creator_email")||"";
  const handle = localStorage.getItem("creator_handle")||"";
  const nav=useNavigate();
  
  useEffect(()=>{ 
    if(!email||!handle) nav("/creator/signup"); 
  },[email,handle,nav]);

  const [form,setForm]=useState<any>({
    handle, 
    display_name:"", 
    bio:"", 
    avatar_url:"",
    theme:{ preset:"glass", accent:"#8b5cf6", font:"system", bg:"default" },
    links:[{label:"Instagram",url:""} as Link],
    video_url:"", 
    products:[], 
    tipjar_title:"Buy me a coffee", 
    tipjar_url:""
  });

  function setField(k:string,v:any){ 
    setForm((f:any)=>({...f,[k]:v})); 
  }

  async function save(){
    const r=await fetch("/api/creator/save",{
      method:"POST",
      headers:{'content-type':'application/json'},
      body:JSON.stringify({email,profile:form})
    });
    const j=await r.json(); 
    if(j.ok) nav(`/c/${handle}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] to-[#0b1b3a] p-6 text-white">
      <div className="mx-auto max-w-sm">
        <GlassCard>
          <div className="p-6 space-y-3">
            <div className="text-center text-sm text-white/70">@{handle}</div>
            <input 
              className="w-full rounded-lg bg-black/30 px-3 py-2" 
              placeholder="Display Name" 
              value={form.display_name} 
              onChange={e=>setField("display_name",e.target.value)} 
            />
            <input 
              className="w-full rounded-lg bg-black/30 px-3 py-2" 
              placeholder="Avatar URL" 
              value={form.avatar_url} 
              onChange={e=>setField("avatar_url",e.target.value)} 
            />
            <textarea 
              className="w-full rounded-lg bg-black/30 px-3 py-2" 
              rows={3} 
              placeholder="Bio" 
              value={form.bio} 
              onChange={e=>setField("bio",e.target.value)} 
            />
            <div className="flex items-center justify-between">
              <label className="text-sm">Accent</label>
              <input 
                type="color" 
                value={form.theme.accent} 
                onChange={e=>setForm({...form,theme:{...form.theme,accent:e.target.value}})} 
              />
            </div>
            <div className="space-y-2">
              {(form.links as Link[]).map((l,i)=>(
                <div key={i} className="flex gap-2">
                  <input 
                    className="flex-1 rounded-lg bg-black/30 px-3 py-2" 
                    placeholder="Label" 
                    value={l.label} 
                    onChange={e=>{const a=[...form.links]; a[i].label=e.target.value; setField("links",a);}} 
                  />
                  <input 
                    className="flex-[2] rounded-lg bg-black/30 px-3 py-2" 
                    placeholder="https://..." 
                    value={l.url} 
                    onChange={e=>{const a=[...form.links]; a[i].url=e.target.value; setField("links",a);}} 
                  />
                </div>
              ))}
              <button 
                className="rounded-lg bg-white/10 px-3 py-2" 
                onClick={()=>setField("links",[...form.links,{label:"",url:""}])}
              >
                + Add link
              </button>
            </div>
            <button 
              onClick={save} 
              className="w-full rounded-xl px-4 py-3 font-semibold" 
              style={{background:form.theme.accent}}
            >
              Save & Publish
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}