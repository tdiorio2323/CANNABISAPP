import type { VercelRequest,VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async (req:VercelRequest,res:VercelResponse)=>{
  const handle=String(req.query.handle||"");
  if(!handle) return res.status(400).json({ok:false,reason:"missing_handle"});
  
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL, anon=process.env.SUPABASE_ANON_KEY;
  if(!url||!anon) return res.status(500).json({ok:false,reason:"missing_env"});
  
  const db=createClient(url,anon);
  
  const {data,error}=await db.from("creators").select("*").eq("handle",handle).single();
  if(error||!data) return res.status(404).json({ok:false,reason:"not_found"});
  
  return res.json({ok:true,page:data});
};