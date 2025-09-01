import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Image, 
  Video, 
  Folder, 
  Settings, 
  Users, 
  Calendar,
  MessageSquare,
  BarChart3,
  Sparkles,
  Crown,
  Gem
} from "lucide-react";

const Portal = () => {
  const navigate = useNavigate();

  const projects = [
    { id: 'documents', name: 'Documents', icon: FileText, color: 'from-blue-500 to-purple-600' },
    { id: 'media', name: 'Media Gallery', icon: Image, color: 'from-pink-500 to-rose-500' },
    { id: 'videos', name: 'Video Library', icon: Video, color: 'from-green-500 to-emerald-600' },
    { id: 'projects', name: 'Projects', icon: Folder, color: 'from-orange-500 to-red-500' },
    { id: 'settings', name: 'Settings', icon: Settings, color: 'from-gray-500 to-slate-600' },
    { id: 'team', name: 'Team', icon: Users, color: 'from-indigo-500 to-blue-600' },
    { id: 'calendar', name: 'Calendar', icon: Calendar, color: 'from-teal-500 to-cyan-600' },
    { id: 'messages', name: 'Messages', icon: MessageSquare, color: 'from-violet-500 to-purple-600' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, color: 'from-amber-500 to-yellow-500' },
    { id: 'premium', name: 'Premium', icon: Crown, color: 'from-yellow-400 to-amber-500' },
    { id: 'ai-tools', name: 'AI Tools', icon: Sparkles, color: 'from-cyan-400 to-blue-500' },
    { id: 'luxury', name: 'Luxury Suite', icon: Gem, color: 'from-rose-400 to-pink-500' }
  ];

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url('/lovable-uploads/6884296d-7d53-4d5f-8169-0418ff1d5824.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Luxury overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-purple-900/30 backdrop-blur-[1px]" />
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Luxury Portal
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Your premium workspace for creativity, collaboration, and luxury experiences
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/10 border-white/20 backdrop-blur-md"
              onClick={() => handleProjectClick(project.id)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  <project.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-semibold text-sm group-hover:text-purple-200 transition-colors duration-300">
                  {project.name}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-center mt-12 space-x-4">
          <Button 
            variant="frost" 
            size="lg"
            onClick={() => navigate('/shop')}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Back to Shop
          </Button>
          <Button 
            variant="frost" 
            size="lg"
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-300/30 text-white hover:from-purple-500/30 hover:to-pink-500/30"
          >
            <Crown className="mr-2 h-5 w-5" />
            Upgrade to Premium
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Portal;