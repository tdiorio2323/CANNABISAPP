import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlassCard from "@/components/GlassCard";

export default function CreatorPublic(){
  const { handle="" } = useParams();
  const [page,setPage]=useState<any>(null);
  
  useEffect(()=>{ 
    // Mock API for development
    if(window.location.hostname === 'localhost'){
      const storedProfile = localStorage.getItem("creator_profile");
      const storedHandle = localStorage.getItem("creator_handle");
      if(storedProfile && handle === storedHandle) {
        setPage(JSON.parse(storedProfile));
      } else {
        // Mock data for demo
        setPage({
          handle: handle,
          display_name: handle,
          bio: "This is a demo creator page",
          avatar_url: "",
          theme: { accent: "#8b5cf6" },
          links: [
            { label: "Demo Link", url: "https://example.com" }
          ]
        });
      }
      return;
    }
    
    // Production API call
    fetch(`/api/creator/page?handle=${handle}`)
      .then(r=>r.json())
      .then(j=>j.ok&&setPage(j.page))
      .catch(err => console.error("Failed to load page:", err)); 
  },[handle]);
  
  if(!page) return null;
  
  const accent = page.theme?.accent || "#8b5cf6";
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] to-[#0b1b3a] px-4 py-12 text-white">
      <div className="mx-auto max-w-sm">
        <GlassCard>
          <div className="p-6">
            <div className="text-center">
              {page.avatar_url ? (
                <img 
                  src={page.avatar_url} 
                  className="mx-auto h-24 w-24 rounded-full border border-white/20 object-cover" 
                />
              ) : (
                <div className="mx-auto h-24 w-24 rounded-full border border-white/20 bg-white/10" />
              )}
              <div className="mt-2 text-sm text-white/60">@{page.handle}</div>
              <h2 className="text-xl font-semibold">{page.display_name||page.handle}</h2>
              {page.bio && <p className="mt-1 text-sm text-white/70">{page.bio}</p>}
            </div>
            <div className="mt-6 space-y-3">
              {(page.links||[]).map((l:any,i:number)=>(
                <a 
                  key={i} 
                  href={l.url} 
                  className="block rounded-xl px-4 py-3 text-center font-medium bg-white/10 hover:bg-white/15"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}