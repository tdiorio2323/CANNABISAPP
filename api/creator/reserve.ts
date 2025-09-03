import type { VercelRequest,VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async (req:VercelRequest,res:VercelResponse)=>{
  if(req.method!=="POST") return res.status(405).end();
  
  const {email,handle}=req.body??{}; 
  if(!email||!handle) return res.status(400).json({ok:false,reason:"missing"});
  
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL, service=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!service) return res.status(500).json({ok:false,reason:"missing_env"});
  
  const db=createClient(url,service);
  
  const {data:exists}=await db.from("creators").select("id").eq("handle",String(handle)).maybeSingle();
  if(exists) return res.status(409).json({ok:false,reason:"handle_taken"});
  
  const {data,error}=await db.from("creators").upsert({email,handle:String(handle)},{onConflict:"email"}).select("handle").single();
  if(error) return res.status(500).json({ok:false,reason:"db_error",detail:error.message});
  
  return res.json({ok:true,handle:data!.handle});
};