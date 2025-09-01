import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Upload,
  Star,
  MoreHorizontal,
  File,
  Folder,
  Image,
  Video,
  Calendar,
  Users,
  Share,
  Download,
  Eye,
  Edit,
  Trash2,
  Crown,
  Sparkles
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real app this would come from API
  const files = [
    { id: 1, name: 'Brand Guidelines.pdf', type: 'file', size: '2.4 MB', modified: '2 hours ago', starred: true, icon: File },
    { id: 2, name: 'Product Photos', type: 'folder', items: 24, modified: '1 day ago', starred: false, icon: Folder },
    { id: 3, name: 'Campaign Video.mp4', type: 'video', size: '156 MB', modified: '3 days ago', starred: true, icon: Video },
    { id: 4, name: 'Logo Collection', type: 'folder', items: 12, modified: '1 week ago', starred: false, icon: Folder },
    { id: 5, name: 'Hero Banner.png', type: 'image', size: '8.2 MB', modified: '2 days ago', starred: false, icon: Image },
    { id: 6, name: 'Content Calendar', type: 'folder', items: 36, modified: '5 days ago', starred: true, icon: Calendar },
  ];

  const getProjectTitle = (projectId: string) => {
    const titles: { [key: string]: string } = {
      documents: 'Documents',
      media: 'Media Gallery',
      videos: 'Video Library',
      projects: 'Projects',
      settings: 'Settings',
      team: 'Team',
      calendar: 'Calendar',
      messages: 'Messages',
      analytics: 'Analytics',
      premium: 'Premium Suite',
      'ai-tools': 'AI Tools',
      luxury: 'Luxury Suite'
    };
    return titles[projectId] || 'Project';
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-purple-900/40 backdrop-blur-[1px]" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/20 bg-black/20 backdrop-blur-md">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="frost"
                  size="sm"
                  onClick={() => navigate('/portal')}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Portal
                </Button>
                <h1 className="text-2xl font-bold text-white">
                  {getProjectTitle(id || '')}
                </h1>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="frost" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="frost" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
                <Button variant="frost" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="border-b border-white/10 bg-black/10 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    placeholder="Search files and folders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 w-80"
                  />
                </div>
                <Button variant="frost" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'frost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'frost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-6">
          {/* Quick Actions */}
          <div className="mb-6">
            <div className="flex space-x-4">
              <Card className="bg-white/10 border-white/20 backdrop-blur-md">
                <CardContent className="p-4 text-center">
                  <Sparkles className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-white text-sm font-medium">AI Assistant</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 backdrop-blur-md">
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-white text-sm font-medium">Collaborate</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 backdrop-blur-md">
                <CardContent className="p-4 text-center">
                  <Crown className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-white text-sm font-medium">Premium Tools</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Files and Folders */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredFiles.map((file) => (
                <Card
                  key={file.id}
                  className="group cursor-pointer hover:scale-105 transition-all duration-300 bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/20"
                >
                  <CardContent className="p-4 text-center">
                    <div className="relative">
                      <file.icon className="h-12 w-12 text-white/80 mx-auto mb-2" />
                      {file.starred && (
                        <Star className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 fill-current" />
                      )}
                    </div>
                    <p className="text-white text-sm font-medium truncate">
                      {file.name}
                    </p>
                    <p className="text-white/60 text-xs">
                      {file.type === 'folder' ? `${file.items} items` : file.size}
                    </p>
                    <p className="text-white/40 text-xs">
                      {file.modified}
                    </p>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4 text-white" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <Separator />
                        <DropdownMenuItem className="text-red-500">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white">Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3">
                        <file.icon className="h-5 w-5 text-white/80" />
                        <div>
                          <p className="text-white font-medium">{file.name}</p>
                          <p className="text-white/60 text-sm">
                            {file.type === 'folder' ? `${file.items} items` : file.size} • {file.modified}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {file.starred && (
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4 text-white" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <Separator />
                            <DropdownMenuItem className="text-red-500">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;