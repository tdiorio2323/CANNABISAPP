import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreatorSignup from "./pages/CreatorSignup";
import CreatorOnboarding from "./pages/CreatorOnboarding";
import CreatorPublic from "./pages/CreatorPublic";

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index/>}/>
        <Route path="/creator/signup" element={<CreatorSignup/>}/>
        <Route path="/creator/onboarding" element={<CreatorOnboarding/>}/>
        <Route path="/c/:handle" element={<CreatorPublic/>}/>
      </Routes>
    </BrowserRouter>
  );
}
