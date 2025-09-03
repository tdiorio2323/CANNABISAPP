import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "@/components/GlassCard";

export default function CreatorSignup(){
  const [email,setEmail]=useState(""); 
  const [handle,setHandle]=useState("");
  const [busy,setBusy]=useState(false); 
  const [msg,setMsg]=useState<string|null>(null);
  const nav=useNavigate();
  
  async function reserve(){
    setBusy(true); 
    setMsg(null);
    const r=await fetch("/api/creator/reserve",{
      method:"POST",
      headers:{'content-type':'application/json'},
      body:JSON.stringify({email,handle:handle.replace(/^@/,'')})
    });
    const j=await r.json(); 
    setBusy(false);
    if(j.ok){ 
      localStorage.setItem("creator_email",email); 
      localStorage.setItem("creator_handle",j.handle); 
      nav("/creator/onboarding"); 
    }
    else setMsg(j.reason||"error");
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] to-[#0b1b3a] p-6 text-white">
      <div className="mx-auto max-w-sm">
        <GlassCard>
          <div className="p-6 space-y-3">
            <h2 className="text-center text-lg font-semibold">Claim your handle</h2>
            <input 
              className="w-full rounded-lg bg-black/30 px-3 py-2" 
              placeholder="Email" 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
            />
            <input 
              className="w-full rounded-lg bg-black/30 px-3 py-2" 
              placeholder="@handle" 
              value={handle} 
              onChange={e=>setHandle(e.target.value)} 
            />
            <button 
              disabled={busy} 
              onClick={reserve} 
              className="w-full rounded-xl bg-white/10 px-4 py-3 font-semibold hover:bg-white/15"
            >
              {busy?"Reserving...":"Reserve"}
            </button>
            {msg && <div className="text-center text-sm text-red-300">{msg}</div>}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}