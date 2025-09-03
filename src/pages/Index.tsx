import { useNavigate } from "react-router-dom";
import GlassCard from "@/components/GlassCard";

export default function Index(){
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1020] to-[#0b1b3a] p-6 text-white">
      <div className="mx-auto max-w-sm">
        <GlassCard>
          <div className="p-6 space-y-4 text-center">
            <h1 className="text-lg font-semibold">Cabana</h1>
            <p className="text-sm text-white/70">Creators build a sleek link+bio page in minutes.</p>
            <button
              onClick={()=>nav("/creator/signup")}
              className="w-full rounded-xl bg-white/10 px-4 py-3 font-semibold hover:bg-white/15 active:scale-95 transition"
            >
              Apply as Creator
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
