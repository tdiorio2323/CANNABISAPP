import React from "react";

export default function GlassCard({children}:{children:React.ReactNode}) {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,.35)]">
      {children}
    </div>
  );
}