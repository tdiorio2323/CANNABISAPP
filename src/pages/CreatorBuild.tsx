import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Instagram, 
  Globe, 
  Plus, 
  Eye,
  Palette,
  Link as LinkIcon,
  Crown,
  Sparkles
} from 'lucide-react';

const GLASS_CARD = "backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300";
const GLASS_INPUT = "bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-purple-400";

interface LinkItem {
  id: number;
  title: string;
  url: string;
  enabled: boolean;
}

export default function CreatorBuild() {
  const [profile, setProfile] = useState({
    name: 'Your Name',
    bio: 'Your bio goes here...',
    avatar: ''
  });
  
  const [links, setLinks] = useState<LinkItem[]>([
    { id: 1, title: 'Instagram', url: 'https://instagram.com/yourusername', enabled: true },
    { id: 2, title: 'Website', url: 'https://yourwebsite.com', enabled: true },
  ]);

  const addLink = () => {
    const newId = Math.max(...links.map(l => l.id), 0) + 1;
    setLinks([...links, {
      id: newId,
      title: 'New Link',
      url: 'https://example.com',
      enabled: true
    }]);
  };

  const updateLink = (id: number, field: keyof LinkItem, value: string | boolean) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-5xl font-bold text-white mb-2">Creator Builder</h1>
          <p className="text-xl text-purple-200">Build your stunning link-in-bio page</p>
          <Badge className="mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <Crown className="w-4 h-4 mr-1" />
            Glass Morphism Design
          </Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Builder Panel */}
          <div className="space-y-6">
            {/* Profile Settings */}
            <Card className={GLASS_CARD}>
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Profile Settings
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Customize your profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Display Name</Label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className={GLASS_INPUT}
                  />
                </div>
                <div>
                  <Label className="text-white">Bio</Label>
                  <Input
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className={GLASS_INPUT}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Links Manager */}
            <Card className={GLASS_CARD}>
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <LinkIcon className="mr-2 h-5 w-5" />
                  Links Manager
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Add and organize your links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {links.map((link) => (
                  <div key={link.id} className="bg-black/20 border border-white/10 rounded-xl p-3 space-y-2">
                    <Input
                      value={link.title}
                      onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                      placeholder="Link Title"
                      className={GLASS_INPUT + " text-sm"}
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                      placeholder="https://example.com"
                      className={GLASS_INPUT + " text-sm"}
                    />
                  </div>
                ))}
                
                <Button
                  onClick={addLink}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Link
                </Button>
              </CardContent>
            </Card>

            {/* Style Options */}
            <Card className={GLASS_CARD}>
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  Style Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  <Button className="h-10 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-xs">
                    Purple
                  </Button>
                  <Button className="h-10 rounded-lg bg-gradient-to-r from-pink-600 to-red-600 text-xs">
                    Pink
                  </Button>
                  <Button className="h-10 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 text-xs">
                    Green
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="sticky top-8">
            <Card className={GLASS_CARD}>
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Eye className="mr-2 h-5 w-5" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Mobile Preview */}
                <div className="bg-black/30 rounded-3xl p-6 border border-white/10 max-w-sm mx-auto">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-lg">{profile.name}</h3>
                    <p className="text-purple-200 text-sm mt-1">{profile.bio}</p>
                  </div>
                  
                  <div className="space-y-3">
                    {links.filter(link => link.enabled).map((link) => (
                      <motion.div
                        key={link.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-4 text-center transition-all cursor-pointer backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          {link.title.toLowerCase().includes('instagram') && (
                            <Instagram className="w-4 h-4 text-pink-400" />
                          )}
                          {link.title.toLowerCase().includes('website') && (
                            <Globe className="w-4 h-4 text-blue-400" />
                          )}
                          <span className="text-white font-medium">{link.title}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="text-center mt-6 pt-4 border-t border-white/10">
                    <p className="text-white/50 text-xs flex items-center justify-center">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Built with Glass UI
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}